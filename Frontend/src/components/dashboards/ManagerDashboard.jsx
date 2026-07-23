import React, { useState, useEffect } from 'react';
import { User, CheckCircle, Clock, ChevronRight, Loader2, AlertCircle } from 'lucide-react';

export default function ManagerDashboard() {
  const [team, setTeam] = useState([]);
  const [parameters, setParameters] = useState([]);
  const [cycleTitle, setCycleTitle] = useState('Loading...');
  const [selectedReport, setSelectedReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Store form inputs dynamically
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');

  // Fetch initial data on load
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/manager/team-status', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success) {
          setTeam(data.team);
          setParameters(data.parameters);
          setCycleTitle(data.cycleTitle);
        }
      } catch (error) {
        console.error('Error fetching team data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  const handleSelectReport = (report) => {
    setSelectedReport(report);
    setFormData({}); // Clear form when switching users
    setError('');
  };

  const handleFormChange = (paramId, field, value) => {
    setFormData(prev => ({
      ...prev,
      [paramId]: {
        ...prev[paramId],
        parameterId: paramId,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Convert object to array for API validation
    const ratingsArray = Object.values(formData);
    
    // Strict validation
    if (ratingsArray.length !== parameters.length) {
      setError('Please provide a score and reasoning for all 5 parameters.');
      return;
    }
    const missingFields = ratingsArray.some(r => !r.score || !r.reason || r.reason.trim().length < 5);
    if (missingFields) {
      setError('All parameters must have a score and a written reason (minimum 5 characters).');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/manager/submit-feedback', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          revieweeId: selectedReport.id,
          ratings: ratingsArray
        })
      });

      const data = await response.json();

      if (data.success) {
        // Update local state so UI immediately shows as submitted
        setTeam(prev => prev.map(member => 
          member.id === selectedReport.id ? { ...member, status: 'SUBMITTED' } : member
        ));
        setSelectedReport(prev => ({ ...prev, status: 'SUBMITTED' }));
      } else {
        setError(data.message || 'Error submitting feedback.');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading team data...
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-100px)] max-w-7xl mx-auto">
      
      {/* Left Sidebar: List of Direct Reports */}
      <div className="w-1/3 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="font-semibold text-slate-800">Your Team</h2>
          <p className="text-xs text-slate-500 mt-1">{cycleTitle} Feedback Cycle</p>
        </div>
        
        <div className="overflow-y-auto flex-1 p-2 space-y-2">
          {team.map((report) => (
            <button
              key={report.id}
              onClick={() => handleSelectReport(report)}
              className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-all ${
                selectedReport?.id === report.id 
                  ? 'bg-blue-50 border-blue-200 border' 
                  : 'hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <p className="font-medium text-sm text-slate-900">{report.name}</p>
                  <p className="text-xs text-slate-500">{report.designation}</p>
                </div>
              </div>
              {report.status === 'SUBMITTED' ? (
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              ) : (
                <Clock className="w-5 h-5 text-amber-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Right Side: The Feedback Form */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-y-auto">
        {selectedReport ? (
          <div>
            <div className="border-b border-slate-200 pb-4 mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Monthly Evaluation: {selectedReport.name}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Provide a score (1-5) and specific reasoning for each parameter.
              </p>
            </div>

            {selectedReport.status === 'SUBMITTED' ? (
              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-lg flex items-center gap-3 border border-emerald-100">
                <CheckCircle className="w-6 h-6" />
                <div>
                  <p className="font-medium">Feedback Submitted</p>
                  <p className="text-sm">You have already completed the evaluation for {selectedReport.name} this month.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {error && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center gap-2 text-sm font-medium border border-red-200">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </div>
                )}

                {parameters.map((param) => (
                  <div key={param.id} className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-800">{param.label}</h3>
                        <p className="text-xs text-slate-500">{param.description}</p>
                      </div>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((score) => (
                          <label key={score} className="cursor-pointer">
                            <input 
                              type="radio" 
                              name={param.id} 
                              value={score}
                              onChange={() => handleFormChange(param.id, 'score', score)}
                              checked={formData[param.id]?.score === score}
                              className="peer sr-only" 
                            />
                            <div className="w-10 h-10 rounded-md flex items-center justify-center text-sm font-medium border border-slate-200 bg-white text-slate-600 peer-checked:bg-slate-900 peer-checked:text-white peer-checked:border-slate-900 hover:border-slate-400 transition-all">
                              {score}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <textarea 
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                        rows="2"
                        placeholder={`Provide context for your ${param.label} rating...`}
                        value={formData[param.id]?.reason || ''}
                        onChange={(e) => handleFormChange(param.id, 'reason', e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                ))}
                
                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Feedback'} 
                    {!isSubmitting && <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <User className="w-16 h-16 mb-4 text-slate-200" />
            <p className="font-medium text-slate-600">Select a team member</p>
            <p className="text-sm">Choose a direct report from the list to begin their evaluation.</p>
          </div>
        )}
      </div>
      
    </div>
  );
}