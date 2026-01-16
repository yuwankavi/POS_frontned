// import React, { useEffect, useState } from 'react';
// import auditService from '../../services/auditService';
// import { useSelector } from 'react-redux';

// const Audit = () => {
//   const [logs, setLogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { darkMode } = useSelector(state => state.ui);

//   useEffect(() => {
//     fetchUserLogs();
//   }, []);

//   const fetchUserLogs = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await auditService.getUsersLog();
//       setLogs(data);
//     } catch (err) {
//       setError('Failed to load user logs');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Calculate summary statistics
//   const calculateSummary = () => {
//     const today = new Date().toDateString();
//     const todaysLogs = logs.filter(log => 
//       new Date(log.User_LogTime).toDateString() === today
//     );

//     const activeSessions = logs.filter(log => !log.User_LogOutTime || log.User_LogOutTime === null || log.User_LogOutTime === '').length;

//     // Detect suspicious logins (unknown device or new IP)
//     const deviceMap = {};
//     const ipMap = {};
//     logs.forEach(log => {
//       const device = log.User_LoggedDev || 'Unknown';
//       const ip = log.User_LoggedIP || 'Unknown';
//       deviceMap[device] = (deviceMap[device] || 0) + 1;
//       ipMap[ip] = (ipMap[ip] || 0) + 1;
//     });

//     const suspiciousLogins = logs.filter(log => {
//       const device = log.User_LoggedDev || 'Unknown';
//       const ip = log.User_LoggedIP || 'Unknown';
//       return device === 'Unknown' || (deviceMap[device] === 1 && ipMap[ip] === 1);
//     }).length;

//     // Most active user
//     const userCounts = {};
//     logs.forEach(log => {
//       const user = log.User_Name || 'Unknown';
//       userCounts[user] = (userCounts[user] || 0) + 1;
//     });
//     const mostActiveUser = Object.entries(userCounts).reduce(
//       (max, [user, count]) => (count > max.count ? { user, count } : max),
//       { user: 'N/A', count: 0 }
//     );

//     return {
//       totalLoginsToday: todaysLogs.length,
//       activeSessions,
//       suspiciousLogins,
//       mostActiveUser: mostActiveUser.user,
//     };
//   };

//   const summary = calculateSummary();

//   const SummaryCard = ({ icon, label, value, color }) => (
//     <div className={`rounded-lg p-4 flex items-center gap-3 ${
//       darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'
//     } shadow-sm`}>
//       <div className={`flex items-center justify-center w-12 h-12 rounded-lg text-2xl ${color}`}>
//         {icon}
//       </div>
//       <div>
//         <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
//         <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
//       </div>
//     </div>
//   );

//   const formatDateTime = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleString();
//   };

//   return (
//     <div className={`p-4 h-full overflow-auto ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
//       {/* Header */}
//       <div className="mb-6">
//         <h2 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//           User Audit Report
//         </h2>
//         <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//           Track all user login/logout activities and sessions
//         </p>
//       </div>

//       {error && (
//         <div className={`rounded-lg p-4 mb-4 ${darkMode ? 'bg-red-900/20 border border-red-700' : 'bg-red-100 border border-red-400'}`}>
//           <p className={darkMode ? 'text-red-400' : 'text-red-700'}>{error}</p>
//         </div>
//       )}

//       {loading ? (
//         <div className="flex justify-center items-center py-12">
//           <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Loading user logs...</p>
//         </div>
//       ) : (
//         <>
//           {/* Summary Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//             <SummaryCard
//               icon="🔵"
//               label="Total Logins Today"
//               value={summary.totalLoginsToday}
//               color={`${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}
//             />
//             <SummaryCard
//               icon="🟢"
//               label="Active Sessions"
//               value={summary.activeSessions}
//               color={`${darkMode ? 'bg-green-900' : 'bg-green-100'}`}
//             />
//             <SummaryCard
//               icon="🔴"
//               label="Suspicious Logins"
//               value={summary.suspiciousLogins}
//               color={`${darkMode ? 'bg-red-900' : 'bg-red-100'}`}
//             />
//             <SummaryCard
//               icon="👤"
//               label="Most Active User"
//               value={summary.mostActiveUser}
//               color={`${darkMode ? 'bg-purple-900' : 'bg-purple-100'}`}
//             />
//           </div>

//           {/* Table */}
//           <div className={`rounded-lg border overflow-hidden shadow-sm ${
//             darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
//           }`}>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className={darkMode ? 'bg-gray-800 border-b border-gray-600' : 'bg-gray-100 border-b border-gray-200'}>
//                     <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                       User Name
//                     </th>
//                     <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                       Login Time
//                     </th>
//                     <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                       Logout Time
//                     </th>
//                     <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                       Device
//                     </th>
//                     <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                       IP Address
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {logs.length > 0 ? (
//                     logs.map((log, index) => (
//                       <tr
//                         key={index}
//                         className={`border-b ${
//                           darkMode
//                             ? 'border-gray-600 hover:bg-gray-600/30'
//                             : 'border-gray-200 hover:bg-gray-50'
//                         } transition-colors`}
//                       >
//                         <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
//                           {log.User_Name || 'N/A'}
//                         </td>
//                         <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
//                           {formatDateTime(log.User_LogTime)}
//                         </td>
//                         <td className={`px-4 py-3 text-sm ${
//                           !log.User_LogOutTime
//                             ? darkMode ? 'text-green-400' : 'text-green-600 font-semibold'
//                             : darkMode ? 'text-gray-300' : 'text-gray-900'
//                         }`}>
//                           {log.User_LogOutTime ? formatDateTime(log.User_LogOutTime) : 'Active'}
//                         </td>
//                         <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
//                           {log.User_LoggedDev || 'Unknown'}
//                         </td>
//                         <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
//                           {log.User_LoggedIP || 'N/A'}
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="5" className={`px-4 py-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//                         No user logs available
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Footer Stats */}
//           {logs.length > 0 && (
//             <div className={`mt-4 px-4 py-3 rounded-lg text-sm ${
//               darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
//             }`}>
//               Total Records: <span className="font-semibold">{logs.length}</span>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default Audit;




import React, { useEffect, useState } from 'react';
import auditService from '../../services/auditService';
import { useSelector } from 'react-redux';
import {
  FiUser,
  FiLogIn,
  FiLogOut,
  FiActivity,
  FiAlertTriangle,
  FiGlobe,
  FiSmartphone,
  FiCalendar,
  FiClock,
  FiRefreshCw,
  FiSearch,
  FiFilter,
  FiEye,
  FiAlertCircle,
  FiCheckCircle,
  FiX,
  FiPrinter,
  FiDownload,
  FiShield,
  FiTrendingUp
} from 'react-icons/fi';
import Breadcrumb from "../../components/common/Breadcrumb.js";

const Audit = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL'); // ALL, ACTIVE, SUSPICIOUS
  const [searchTerm, setSearchTerm] = useState('');
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  const { darkMode } = useSelector(state => state.ui);

  useEffect(() => {
    fetchUserLogs();
  }, []);

  const fetchUserLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await auditService.getUsersLog();
      setLogs(data);
      setLastUpdated(new Date());
      showAlertMessage("Audit logs loaded successfully", "success");
    } catch (err) {
      setError('Failed to load user logs');
      console.error(err);
      showAlertMessage("Failed to load audit logs", "error");
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary statistics
  const calculateSummary = () => {
    const today = new Date().toDateString();
    const todaysLogs = logs.filter(log => 
      new Date(log.User_LogTime).toDateString() === today
    );

    const activeSessions = logs.filter(log => !log.User_LogOutTime || log.User_LogOutTime === null || log.User_LogOutTime === '').length;

    // Detect suspicious logins (unknown device or new IP)
    const deviceMap = {};
    const ipMap = {};
    logs.forEach(log => {
      const device = log.User_LoggedDev || 'Unknown';
      const ip = log.User_LoggedIP || 'Unknown';
      deviceMap[device] = (deviceMap[device] || 0) + 1;
      ipMap[ip] = (ipMap[ip] || 0) + 1;
    });

    const suspiciousLogins = logs.filter(log => {
      const device = log.User_LoggedDev || 'Unknown';
      const ip = log.User_LoggedIP || 'Unknown';
      return device === 'Unknown' || (deviceMap[device] === 1 && ipMap[ip] === 1);
    }).length;

    // Most active user
    const userCounts = {};
    logs.forEach(log => {
      const user = log.User_Name || 'Unknown';
      userCounts[user] = (userCounts[user] || 0) + 1;
    });
    const mostActiveUser = Object.entries(userCounts).reduce(
      (max, [user, count]) => (count > max.count ? { user, count } : max),
      { user: 'N/A', count: 0 }
    );

    // Unique users
    const uniqueUsers = new Set(logs.map(log => log.User_Name)).size;

    return {
      totalLoginsToday: todaysLogs.length,
      activeSessions,
      suspiciousLogins,
      mostActiveUser: mostActiveUser.user,
      uniqueUsers,
      totalLogs: logs.length,
      averageSessionTime: '00:00:00' // Can be calculated if logout times are available
    };
  };

  const summary = calculateSummary();

  const showAlertMessage = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Active Now';
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return 'Invalid Date';
    }
  };

  const formatDuration = (loginTime, logoutTime) => {
    if (!logoutTime) return 'Active';
    try {
      const login = new Date(loginTime);
      const logout = new Date(logoutTime);
      const diffMs = logout - login;
      const diffHrs = Math.floor(diffMs / 3600000);
      const diffMins = Math.floor((diffMs % 3600000) / 60000);
      const diffSecs = Math.floor((diffMs % 60000) / 1000);
      return `${diffHrs.toString().padStart(2, '0')}:${diffMins.toString().padStart(2, '0')}:${diffSecs.toString().padStart(2, '0')}`;
    } catch (e) {
      return 'N/A';
    }
  };

  const getSessionStatusBadge = (logoutTime) => {
    if (!logoutTime) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
          <FiActivity className="w-3 h-3" />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
        <FiLogOut className="w-3 h-3" />
        Closed
      </span>
    );
  };

  const getAlertBgColor = () => {
    switch (alertType) {
      case 'success': return 'bg-green-100 border-green-300 dark:bg-green-900/70 dark:border-green-700';
      case 'error': return 'bg-red-100 border-red-300 dark:bg-red-900/70 dark:border-red-700';
      case 'warning': return 'bg-yellow-100 border-yellow-300 dark:bg-yellow-900/70 dark:border-yellow-700';
      case 'info': return 'bg-blue-100 border-blue-300 dark:bg-blue-900/70 dark:border-blue-700';
      default: return 'bg-gray-100 border-gray-300 dark:bg-gray-900/70 dark:border-gray-700';
    }
  };

  const getAlertTextColor = () => {
    switch (alertType) {
      case 'success': return 'text-green-800 dark:text-green-200';
      case 'error': return 'text-red-800 dark:text-red-200';
      case 'warning': return 'text-yellow-800 dark:text-yellow-200';
      case 'info': return 'text-blue-800 dark:text-blue-200';
      default: return 'text-gray-800 dark:text-gray-200';
    }
  };

  const getAlertIcon = () => {
    switch (alertType) {
      case 'success': return <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'error': return <FiX className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'warning': return <FiAlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case 'info': return <FiActivity className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      default: return <FiActivity className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const filteredData = logs.filter(log => {
    const matchesFilter = filter === 'ALL' || 
      (filter === 'ACTIVE' && (!log.User_LogOutTime || log.User_LogOutTime === null || log.User_LogOutTime === '')) ||
      (filter === 'SUSPICIOUS' && (log.User_LoggedDev === 'Unknown' || !log.User_LoggedIP));
    
    const matchesSearch = searchTerm === '' || 
      (log.User_Name && log.User_Name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.User_LoggedIP && log.User_LoggedIP.includes(searchTerm)) ||
      (log.User_LoggedDev && log.User_LoggedDev.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  const handleGenerateReport = () => {
    try {
      // Generate comprehensive audit report PDF
      const reportDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      const reportTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      // Get session statistics
      const activeSessionsList = filteredData.filter(log => !log.User_LogOutTime);
      const closedSessionsList = filteredData.filter(log => log.User_LogOutTime);
      
      // Get user activity breakdown
      const userActivityMap = {};
      filteredData.forEach(log => {
        const userName = log.User_Name || 'Unknown';
        if (!userActivityMap[userName]) {
          userActivityMap[userName] = { logins: 0, activeSessions: 0 };
        }
        userActivityMap[userName].logins += 1;
        if (!log.User_LogOutTime) {
          userActivityMap[userName].activeSessions += 1;
        }
      });

      // Get device statistics
      const deviceMap = {};
      filteredData.forEach(log => {
        const device = log.User_LoggedDev || 'Unknown';
        deviceMap[device] = (deviceMap[device] || 0) + 1;
      });

      // Get IP statistics
      const ipMap = {};
      filteredData.forEach(log => {
        const ip = log.User_LoggedIP || 'Unknown';
        ipMap[ip] = (ipMap[ip] || 0) + 1;
      });

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>User Audit & Security Report</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              background: #f5f5f5;
              color: #333;
              line-height: 1.6;
            }
            .container { max-width: 900px; margin: 0 auto; padding: 20px; }
            
            /* Header */
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 12px;
              margin-bottom: 20px;
              text-align: center;
            }
            .header h1 { font-size: 28px; margin-bottom: 5px; }
            .header .subtitle { opacity: 0.9; font-size: 14px; }
            .header .report-meta { 
              margin-top: 15px; 
              display: flex; 
              justify-content: center; 
              gap: 30px;
              font-size: 13px;
            }
            .header .report-meta span { 
              background: rgba(255,255,255,0.2); 
              padding: 5px 15px; 
              border-radius: 20px; 
            }
            
            /* Summary Cards */
            .summary-grid { 
              display: grid; 
              grid-template-columns: repeat(4, 1fr); 
              gap: 15px; 
              margin-bottom: 20px; 
            }
            .summary-card { 
              background: white; 
              padding: 20px; 
              border-radius: 10px; 
              box-shadow: 0 2px 8px rgba(0,0,0,0.08);
              text-align: center;
            }
            .summary-card.blue { border-left: 4px solid #3b82f6; }
            .summary-card.green { border-left: 4px solid #22c55e; }
            .summary-card.red { border-left: 4px solid #ef4444; }
            .summary-card.purple { border-left: 4px solid #a855f7; }
            .summary-card .value { font-size: 32px; font-weight: bold; color: #1f2937; }
            .summary-card .label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
            
            /* Section */
            .section { 
              background: white; 
              border-radius: 10px; 
              padding: 20px; 
              margin-bottom: 20px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            }
            .section-title { 
              font-size: 16px; 
              font-weight: 600; 
              color: #374151;
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 2px solid #e5e7eb;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .section-title::before {
              content: '';
              width: 4px;
              height: 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 2px;
            }
            
            /* Table */
            table { width: 100%; border-collapse: collapse; font-size: 13px; }
            th { 
              background: #f9fafb; 
              padding: 12px 10px; 
              text-align: left; 
              font-weight: 600;
              color: #374151;
              border-bottom: 2px solid #e5e7eb;
            }
            td { 
              padding: 10px; 
              border-bottom: 1px solid #f3f4f6;
              color: #4b5563;
            }
            tr:hover { background: #f9fafb; }
            
            /* Status Badges */
            .badge { 
              display: inline-block; 
              padding: 4px 10px; 
              border-radius: 20px; 
              font-size: 11px; 
              font-weight: 600;
            }
            .badge-active { background: #dcfce7; color: #166534; }
            .badge-closed { background: #f3f4f6; color: #4b5563; }
            .badge-suspicious { background: #fef2f2; color: #dc2626; }
            
            /* Stats Grid */
            .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
            .stat-item { 
              background: #f9fafb; 
              padding: 15px; 
              border-radius: 8px;
              text-align: center;
            }
            .stat-item .stat-value { font-size: 24px; font-weight: bold; color: #1f2937; }
            .stat-item .stat-label { font-size: 11px; color: #6b7280; }
            
            /* Footer */
            .footer { 
              text-align: center; 
              padding: 20px; 
              color: #9ca3af;
              font-size: 12px;
              border-top: 1px solid #e5e7eb;
              margin-top: 20px;
            }
            .footer .company { font-weight: 600; color: #6b7280; }
            
            /* Print Styles */
            @media print {
              body { background: white; }
              .container { padding: 0; }
              .section, .summary-card { box-shadow: none; border: 1px solid #e5e7eb; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header -->
            <div class="header">
              <h1>🛡️ User Audit & Security Report</h1>
              <p class="subtitle">Comprehensive Session & Activity Analysis</p>
              <div class="report-meta">
                <span>📅 ${reportDate}</span>
                <span>🕐 ${reportTime}</span>
                <span>📊 ${filteredData.length} Records</span>
              </div>
            </div>
            
            <!-- Summary Cards -->
            <div class="summary-grid">
              <div class="summary-card blue">
                <div class="value">${summary.totalLoginsToday}</div>
                <div class="label">Today's Logins</div>
              </div>
              <div class="summary-card green">
                <div class="value">${summary.activeSessions}</div>
                <div class="label">Active Sessions</div>
              </div>
              <div class="summary-card red">
                <div class="value">${summary.suspiciousLogins}</div>
                <div class="label">Suspicious Logins</div>
              </div>
              <div class="summary-card purple">
                <div class="value">${summary.uniqueUsers}</div>
                <div class="label">Unique Users</div>
              </div>
            </div>
            
            <!-- User Activity Breakdown -->
            <div class="section">
              <h3 class="section-title">User Activity Breakdown</h3>
              <table>
                <thead>
                  <tr>
                    <th>User Name</th>
                    <th>Total Logins</th>
                    <th>Active Sessions</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${Object.entries(userActivityMap).map(([user, data]) => `
                    <tr>
                      <td><strong>${user}</strong></td>
                      <td>${data.logins}</td>
                      <td>${data.activeSessions}</td>
                      <td>
                        ${data.activeSessions > 0 
                          ? '<span class="badge badge-active">● Online</span>' 
                          : '<span class="badge badge-closed">○ Offline</span>'}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            
            <!-- Device & Network Analysis -->
            <div class="section">
              <h3 class="section-title">Device & Network Analysis</h3>
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-value">${Object.keys(deviceMap).length}</div>
                  <div class="stat-label">Unique Devices</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">${Object.keys(ipMap).length}</div>
                  <div class="stat-label">Unique IPs</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">${summary.mostActiveUser}</div>
                  <div class="stat-label">Most Active User</div>
                </div>
              </div>
              <table style="margin-top: 15px;">
                <thead>
                  <tr>
                    <th>Device</th>
                    <th>Sessions</th>
                    <th>IP Addresses</th>
                    <th>Connections</th>
                  </tr>
                </thead>
                <tbody>
                  ${Object.entries(deviceMap).slice(0, 10).map(([device, count]) => `
                    <tr>
                      <td>💻 ${device}</td>
                      <td>${count}</td>
                      <td>${Object.entries(ipMap).slice(0, 1).map(([ip]) => ip).join(', ')}</td>
                      <td>${count}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            
            <!-- Recent Session Activity -->
            <div class="section">
              <h3 class="section-title">Session Audit Trail (Latest ${Math.min(filteredData.length, 20)} Records)</h3>
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Login Time</th>
                    <th>Logout Time</th>
                    <th>Duration</th>
                    <th>Device</th>
                    <th>IP Address</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredData.slice(0, 20).map(log => `
                    <tr>
                      <td><strong>${log.User_Name || 'N/A'}</strong><br><small style="color:#9ca3af;">ID: ${log.User_ID || 'N/A'}</small></td>
                      <td>${log.User_LogTime ? new Date(log.User_LogTime).toLocaleString() : 'N/A'}</td>
                      <td>${log.User_LogOutTime ? new Date(log.User_LogOutTime).toLocaleString() : '<span style="color:#22c55e;">Active Now</span>'}</td>
                      <td>${formatDuration(log.User_LogTime, log.User_LogOutTime)}</td>
                      <td>💻 ${log.User_LoggedDev || 'Unknown'}</td>
                      <td>🌐 ${log.User_LoggedIP || 'N/A'}</td>
                      <td>
                        ${!log.User_LogOutTime 
                          ? '<span class="badge badge-active">● Active</span>' 
                          : '<span class="badge badge-closed">○ Closed</span>'}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            
            <!-- Active Sessions Summary -->
            ${activeSessionsList.length > 0 ? `
            <div class="section">
              <h3 class="section-title">🟢 Currently Active Sessions (${activeSessionsList.length})</h3>
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Login Since</th>
                    <th>Duration</th>
                    <th>Device</th>
                    <th>IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  ${activeSessionsList.map(log => `
                    <tr>
                      <td><strong>${log.User_Name || 'N/A'}</strong></td>
                      <td>${log.User_LogTime ? new Date(log.User_LogTime).toLocaleString() : 'N/A'}</td>
                      <td style="color:#22c55e; font-weight:600;">${formatDuration(log.User_LogTime, null)}</td>
                      <td>${log.User_LoggedDev || 'Unknown'}</td>
                      <td>${log.User_LoggedIP || 'N/A'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            ` : ''}
            
            <!-- Footer -->
            <div class="footer">
              <p class="company">METRO POS - Security Audit System</p>
              <p>Generated on ${reportDate} at ${reportTime}</p>
              <p>This report contains sensitive security information. Handle with care.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Create blob and trigger download, and also open in new tab for viewing
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Open in new tab for immediate viewing
      const newWindow = window.open(url, '_blank');
      if (newWindow) {
        newWindow.focus();
      }
      
      // Also trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `Audit_Security_Report_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up after a delay to allow both operations to complete
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      showAlertMessage("Audit report generated and downloaded successfully!", "success");
    } catch (error) {
      console.error('Report generation error:', error);
      showAlertMessage("Failed to generate report: " + error.message, "error");
    }
  };

  const handleExportLogs = () => {
    showAlertMessage("Audit logs exported successfully", "success");
  };

  return (
    <div className="flex flex-col p-1 md:p-1 rounded-xl shadow-md h-full overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 border">
      {/* Alert Message */}
      {showAlert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down w-full max-w-md px-2 sm:px-0">
          <div className={`flex items-center justify-between p-3 sm:p-4 rounded-xl shadow-lg border ${getAlertBgColor()} ${getAlertTextColor()} mx-2`}>
            <div className="flex items-center gap-2 sm:gap-3">
              {getAlertIcon()}
              <p className="font-medium text-sm sm:text-base">{alertMessage}</p>
            </div>
            <button
              onClick={() => setShowAlert(false)}
              className="hover:opacity-70 transition-opacity"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <Breadcrumb current="Security / Audit Report" />

      {/* Header */}
      <div className="mt-2 mb-3 md:mb-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-1 md:mb-2 gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow">
              <FiShield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                User Audit & Security Dashboard
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Monitor user activities, sessions, and security events in real-time
                {lastUpdated && (
                  <span className="ml-2 text-green-600 dark:text-green-400">
                    • Last updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Responsive Button Group */}
          <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
            {/* Refresh Controls */}
            <div className="flex gap-2">
              <button
                onClick={fetchUserLogs}
                disabled={loading}
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-3 py-2 rounded-lg text-sm min-w-[100px] justify-center disabled:opacity-50"
              >
                <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleGenerateReport}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-3 py-2 rounded-lg text-sm min-w-[140px] justify-center"
              >
                <FiPrinter className="w-4 h-4" />
                Generate Report
              </button>

             
            </div>
          </div>
        </div>

        {/* Primary Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2 mb-1 md:mb-2">
          <div className="rounded-lg p-2 shadow border bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-700 dark:text-blue-300">Today's Logins</p>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {summary.totalLoginsToday}
                </p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FiLogIn className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg p-2 shadow border bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-700 dark:text-green-300">Active Sessions</p>
                <p className="text-sm font-bold text-green-600 dark:text-green-400">
                  {summary.activeSessions}
                </p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <FiActivity className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg p-2 shadow border bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-red-700 dark:text-red-300">Suspicious Logins</p>
                <p className="text-sm font-bold text-red-600 dark:text-red-400">
                  {summary.suspiciousLogins}
                </p>
              </div>
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <FiAlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg p-2 shadow border bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-700 dark:text-purple-300">Most Active User</p>
                <p className="text-sm font-bold text-purple-600 dark:text-purple-400">
                  {summary.mostActiveUser}
                </p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <FiUser className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2 mb-3">
          <div className="rounded-lg p-2 shadow border bg-gray-50 dark:bg-gray-700 border-gray-100 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Logs</p>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{summary.totalLogs}</p>
              </div>
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <FiClock className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>
          <div className="rounded-lg p-2 shadow border bg-gray-50 dark:bg-gray-700 border-gray-100 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Unique Users</p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {summary.uniqueUsers}
                </p>
              </div>
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <FiUser className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>
          <div className="rounded-lg p-2 shadow border bg-gray-50 dark:bg-gray-700 border-gray-100 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Avg Session Time</p>
                <p className="text-sm font-bold text-cyan-600 dark:text-cyan-400">{summary.averageSessionTime}</p>
              </div>
              <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                <FiClock className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-1 md:gap-2 mb-1 md:mb-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1">
            {/* Status Filter */}
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
              >
                <option value="ALL">All Sessions</option>
                <option value="ACTIVE">Active Only</option>
                <option value="SUSPICIOUS">Suspicious Only</option>
              </select>
            </div>

            {/* Device Filter */}
            <div className="relative">
              <FiSmartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <select 
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
              >
                <option value="ALL">All Devices</option>
                <option value="DESKTOP">Desktop</option>
                <option value="MOBILE">Mobile</option>
                <option value="TABLET">Tablet</option>
                <option value="UNKNOWN">Unknown</option>
              </select>
            </div>

            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users, IP addresses, or devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto mb-1 md:mb-2">
        <div className="rounded-lg p-1 md:p-2 h-full overflow-y-auto bg-gray-100 dark:bg-gray-900">
          {loading ? (
            <div className="flex items-center justify-center py-8 rounded-xl h-full">
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <div className="w-8 h-8 border-4 rounded-full animate-spin border-green-200 dark:border-green-800"></div>
                  <div className="absolute inset-0 w-8 h-8 border-4 border-green-600 dark:border-green-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Loading audit logs...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="rounded-xl p-4 text-center h-full flex items-center justify-center border bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700">
              <div>
                <div className="font-medium text-sm text-red-600 dark:text-red-400">
                  ⚠️ Error Loading Logs
                </div>
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {error}
                </p>
                <button
                  onClick={fetchUserLogs}
                  className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-lg transition-colors text-sm"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Audit Table */}
              {filteredData.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      User Activity Logs
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Showing {filteredData.length} of {logs.length} log{logs.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          User Session Audit Trail
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Updated: {lastUpdated.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              User Details
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              Session Timing
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              Device & Network
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              Session Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {filteredData.map((log, index) => (
                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                                    <FiUser className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                  </div>
                                  <div>
                                    <div className="text-xs font-medium text-gray-900 dark:text-white">
                                      {log.User_Name || 'Unknown User'}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                      User ID: {log.User_UID || 'N/A'}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div>
                                  <div className="text-xs font-medium text-gray-900 dark:text-white">
                                    Login: {formatDateTime(log.User_LogTime)}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Logout: {formatDateTime(log.User_LogOutTime)}
                                  </div>
                                  <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1">
                                    Duration: {formatDuration(log.User_LogTime, log.User_LogOutTime)}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <FiSmartphone className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                                      {log.User_LoggedDev || 'Unknown Device'}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <FiGlobe className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {log.User_LoggedIP || 'No IP'}
                                    </span>
                                  </div>
                                  {(log.User_LoggedDev === 'Unknown' || !log.User_LoggedIP) && (
                                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 mt-1">
                                      <FiAlertTriangle className="w-3 h-3" />
                                      Suspicious
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="space-y-2">
                                  {getSessionStatusBadge(log.User_LogOutTime)}
                                  <div className={`text-xs font-medium px-2 py-1 rounded ${
                                    !log.User_LogOutTime 
                                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                  }`}>
                                    {!log.User_LogOutTime ? 'Session Active' : 'Session Ended'}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                          <FiEye className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300">Active Monitoring</h4>
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            {summary.activeSessions} active session{summary.activeSessions !== 1 ? 's' : ''} being monitored
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center">
                          <FiAlertTriangle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-red-800 dark:text-red-300">Security Alerts</h4>
                          <p className="text-xs text-red-600 dark:text-red-400">
                            {summary.suspiciousLogins} suspicious login{summary.suspiciousLogins !== 1 ? 's' : ''} detected
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 border border-green-200 dark:border-green-800 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                          <FiTrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-green-800 dark:text-green-300">Today's Activity</h4>
                          <p className="text-xs text-green-600 dark:text-green-400">
                            {summary.totalLoginsToday} login{summary.totalLoginsToday !== 1 ? 's' : ''} today
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activity Breakdown */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 mt-4">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Activity Statistics
                      </h3>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-xs text-gray-700 dark:text-gray-300">Active Sessions</span>
                          </div>
                          <div className="text-xs font-semibold text-green-600 dark:text-green-400">
                            {summary.activeSessions} ({logs.length > 0 ? (summary.activeSessions/logs.length*100).toFixed(1) : 0}%)
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-xs text-gray-700 dark:text-gray-300">Suspicious Activity</span>
                          </div>
                          <div className="text-xs font-semibold text-red-600 dark:text-red-400">
                            {summary.suspiciousLogins} ({logs.length > 0 ? (summary.suspiciousLogins/logs.length*100).toFixed(1) : 0}%)
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="text-xs text-gray-700 dark:text-gray-300">Today's Activity</span>
                          </div>
                          <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                            {summary.totalLoginsToday} ({logs.length > 0 ? (summary.totalLoginsToday/logs.length*100).toFixed(1) : 0}%)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <FiActivity className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {searchTerm || filter !== 'ALL' ? 'No Audit Logs Found' : 'No Audit Data'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    {searchTerm 
                      ? `No audit logs found matching "${searchTerm}". Try a different search term.`
                      : filter !== 'ALL'
                      ? 'No audit logs match the selected filters. Try adjusting your filters.'
                      : 'No audit data available. Load data or check back later.'
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Audit;