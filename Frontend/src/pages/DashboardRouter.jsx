import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import all our completed dashboards
import HrDashboard from '../components/dashboards/HrDashboard';
import ManagerDashboard from '../components/dashboards/ManagerDashboard';
import EmployeeDashboard from '../components/dashboards/EmployeeDashboard';

export default function DashboardRouter() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if a user is logged in (we will set this up properly with the backend later)
    const storedUser = localStorage.getItem('user');
    
    if (!storedUser) {
      // If no user is found, kick them back to the login page
      navigate('/login'); 
      return;
    }
    
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Show a loading state while checking credentials
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-medium">Loading workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Global Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-3">
          <span className="font-bold text-xl tracking-tight text-blue-600">Aura</span>
          <div className="h-4 w-px bg-slate-300"></div>
          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider rounded-md">
            {user.companyName || 'Company Workspace'}
          </span>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user.role.replace('_', ' ').toLowerCase()}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="text-sm px-4 py-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 font-medium rounded-lg transition-colors"
          >
            Log Out
          </button>
        </div>
      </nav>

      {/* Dynamic Role-Based Rendering */}
      <main className="flex-1 p-6">
        {user.role === 'HR_ADMIN' && <HrDashboard />}
        
        {/* Founders and Managers both evaluate direct reports */}
        {(user.role === 'MANAGER' || user.role === 'FOUNDER') && <ManagerDashboard />}
        
        {/* Employees view their performance charts */}
        {user.role === 'EMPLOYEE' && <EmployeeDashboard />}
      </main>
    </div>
  );
}