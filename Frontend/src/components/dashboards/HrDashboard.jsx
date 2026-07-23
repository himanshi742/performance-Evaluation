import React, { useState, useEffect } from 'react';
import { Users, Bell, AlertCircle, CheckCircle2, FileText, Search } from 'lucide-react';

export default function HrDashboard() {
  const [cycle, setCycle] = useState('Loading...');
  const [managers, setManagers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuditData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/hr/pending-track`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          setCycle(data.cycleTitle);
          setManagers(data.managers);
        }
      } catch (error) {
        console.error('Error fetching HR data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuditData();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading audit data...</div>;
  }

  // Aggregate metrics
  const totalManagers = managers.length;
  const managersCompleted = managers.filter(m => m.status === 'COMPLETE').length;
  const totalExpectedReviews = managers.reduce((acc, curr) => acc + curr.totalReports, 0);
  const totalCompletedReviews = managers.reduce((acc, curr) => acc + curr.completedReviews, 0);
  const completionPercentage = totalExpectedReviews === 0 ? 0 : Math.round((totalCompletedReviews / totalExpectedReviews) * 100);

  const filteredManagers = managers.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Header section */}
      <div className="flex justify-between items-end border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Feedback Compliance</h1>
          <p className="text-sm text-slate-500 mt-1">Tracking manager submissions for {cycle}</p>
        </div>
        
      </div>

      {/* Top Level Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-full">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Company Progress</p>
            <p className="text-2xl font-bold text-slate-900">{completionPercentage}%</p>
            <p className="text-xs text-slate-400">{totalCompletedReviews} of {totalExpectedReviews} reviews submitted</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-amber-50 p-3 rounded-full">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Managers Pending</p>
            <p className="text-2xl font-bold text-slate-900">{totalManagers - managersCompleted}</p>
            <p className="text-xs text-slate-400">Require follow-up</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-50 p-3 rounded-full">
            <Users className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Managers Completed</p>
            <p className="text-2xl font-bold text-slate-900">{managersCompleted}</p>
            <p className="text-xs text-slate-400">100% submission rate</p>
          </div>
        </div>
      </div>

      {/* Manager Audit Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h2 className="font-semibold text-slate-800">Manager Audit Report</h2>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search manager or dept..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-500">
                <th className="p-4 font-medium">Manager</th>
                <th className="p-4 font-medium">Department</th>
                <th className="p-4 font-medium">Completion Rate</th>
                <th className="p-4 font-medium">Missing Submissions</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredManagers.map((manager) => (
                <tr key={manager.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <p className="font-medium text-slate-900">{manager.name}</p>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{manager.department}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${manager.status === 'COMPLETE' ? 'bg-emerald-500' : 'bg-blue-500'}`}
                          style={{ width: `${(manager.completedReviews / manager.totalReports) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {manager.completedReviews} / {manager.totalReports}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    {manager.status === 'COMPLETE' ? (
                      <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4" /> All Done
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {manager.pendingReports.map((report, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-medium border border-amber-100 w-max">
                            <AlertCircle className="w-3 h-3" /> {report}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {manager.status !== 'COMPLETE' && (
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">
                        Nudge
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}