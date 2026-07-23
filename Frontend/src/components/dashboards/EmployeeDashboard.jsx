import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, MessageSquare, Loader2 } from 'lucide-react';

export default function EmployeeDashboard() {
  const [performanceHistory, setPerformanceHistory] = useState([]);
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [latestCycle, setLatestCycle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Helper dictionary to map raw parameter IDs to clean chart labels
  const paramLabels = {
    'ownership': 'Ownership',
    'communication': 'Communication',
    'quality_of_work': 'Quality',
    'teamwork': 'Teamwork',
    'problem_solving': 'ProblemSolving'
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/employee/my-history`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (data.success && data.history.length > 0) {
          // 1. Format data for the Recharts graph
          const formattedChartData = data.history.map(item => {
            const dataPoint = { month: item.cycleTitle.split(' ')[0] }; // e.g., Extract "July" from "July 2026"

            item.ratings.forEach(r => {
              const label = paramLabels[r.parameterId];
              if (label) dataPoint[label] = r.score;
            });
            return dataPoint;
          });

          setPerformanceHistory(formattedChartData);

          // 2. Format details for the latest month's feedback breakdown
          const latest = data.history[data.history.length - 1];
          setLatestCycle(latest.cycleTitle);

          const formattedRecent = latest.ratings.map(r => ({
            param: paramLabels[r.parameterId] || r.parameterId,
            score: r.score,
            comment: r.reason
          }));
          setRecentFeedback(formattedRecent);
        }
      } catch (error) {
        console.error('Error fetching employee history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading performance data...
      </div>
    );
  }

  if (performanceHistory.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500">
        No historical feedback data found.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">

      {/* Header section */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">My Performance Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Review your historical feedback and parameter trends</p>
      </div>

      {/* Analytics Chart Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-slate-800">Score Trends</h2>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceHistory} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />

              <Line type="monotone" dataKey="Ownership" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="Communication" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Quality" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Teamwork" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="ProblemSolving" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Latest Detailed Feedback Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-slate-600" />
            <h2 className="font-semibold text-slate-800">Latest Feedback Details</h2>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 bg-white px-3 py-1 rounded-md border border-slate-200">
            <Calendar className="w-4 h-4" /> {latestCycle}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {recentFeedback.map((item, idx) => (
            <div key={idx} className="p-5 hover:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-slate-900">{item.param}</h3>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-slate-500 mr-2">Score:</span>
                  <div className="w-7 h-7 rounded bg-slate-900 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                    {item.score}
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                "{item.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}