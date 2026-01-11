import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus, FiUsers, FiShield, FiUserCheck, FiUserX, FiX, FiSearch, FiCheckCircle, FiHome, FiChevronRight } from 'react-icons/fi';
import { fetchUsers, fetchUserTypes, createUser, changeUserStatus } from '../../actions/userActions';
import Breadcrumb from '../common/Breadcrumb'

const UserAccessPage = () => {
  const dispatch = useDispatch();
  const { loading, users, error } = useSelector(state => state.userList);
  const { types } = useSelector(state => state.userTypes);
  const { darkMode } = useSelector(state => state.ui);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({ User_Name: '', User_Pass: '', User_Type: '' });
  const [userToUpdate, setUserToUpdate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchUserTypes());
  }, [dispatch]);

  const showAlertMessage = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);


    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const openModal = (user = { User_Name: '', User_Pass: '', User_Type: types[0]?.User_Type || '' }) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const openStatusModal = (user) => {
    setUserToUpdate(user);
    setIsStatusModalOpen(true);
  };

  const closeStatusModal = () => setIsStatusModalOpen(false);

  const handleSave = async () => {
    if (!currentUser.User_Name || !currentUser.User_Pass || !currentUser.User_Type) {
      showAlertMessage('Please fill all fields before saving.', 'error');
      return;
    }

    try {
      await dispatch(createUser(currentUser.User_Name, currentUser.User_Pass, currentUser.User_Type));
      closeModal();
      dispatch(fetchUsers());


      showAlertMessage(`User "${currentUser.User_Name}" created successfully!`, 'success');
    } catch (error) {

      showAlertMessage('Failed to create user. Please try again.', 'error');
    }
  };

  const handleStatusChange = async () => {
    if (userToUpdate) {
      try {
        await dispatch(changeUserStatus(userToUpdate.User_Id));
        closeStatusModal();
        dispatch(fetchUsers());


        const action = userToUpdate.User_Status === 'A' ? 'deactivated' : 'activated';
        showAlertMessage(`User "${userToUpdate.User_Name}" ${action} successfully!`, 'success');
      } catch (error) {

        showAlertMessage('Failed to change user status. Please try again.', 'error');
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.User_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.User_Type.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'active') return matchesSearch && user.User_Status === 'A';
    if (activeFilter === 'inactive') return matchesSearch && user.User_Status !== 'A';

    return matchesSearch && user.User_Type === activeFilter;
  });

  const getUserTypeLabel = (type) => {
    switch (type) {
      case 'A': return 'Admin';
      case 'C': return 'Cashier';
      default: return type;
    }
  };

  const getUserTypeIcon = (type) => {
    switch (type) {
      case 'A': return <FiShield className="w-4 h-4" />;
      case 'C': return <FiUsers className="w-4 h-4" />;
      default: return <FiUsers className="w-4 h-4" />;
    }
  };

  const getUserTypeBadgeColor = (type) => {
    switch (type) {
      case 'A': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'C': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (status) => {
    return status === 'A'
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
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
      case 'warning': return <FiShield className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case 'info': return <FiUsers className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      default: return <FiUsers className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  return (
    <div className={`flex flex-col p-1 md:p-1 rounded-xl shadow-md h-full ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border`}>


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

      <Breadcrumb current="User Access" />

      {/* Header */}
      <div className="mt-2 mb-3 md:mb-5">
        <div className="flex items-center justify-between mb-1 md:mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow">
              <FiUsers className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                User Access Management
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">Manage user accounts</p>
            </div>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm"
          >
            <FiPlus className="w-4 h-4" /> Add User
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2 mb-1 md:mb-2">
          <div className={`rounded-lg p-2 shadow border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'
            }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Users</p>
                <p className="text-sm font-bold text-gray-800 dark:text-white">{users.length}</p>
              </div>
              <FiUsers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className={`rounded-lg p-2 shadow border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'
            }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
                <p className="text-sm font-bold text-green-600 dark:text-green-400">{users.filter(u => u.User_Status === 'A').length}</p>
              </div>
              <FiUserCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className={`rounded-lg p-2 shadow border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'
            }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Admins</p>
                <p className="text-sm font-bold text-purple-600 dark:text-purple-400">{users.filter(u => u.User_Type === 'A').length}</p>
              </div>
              <FiShield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className={`rounded-lg p-2 shadow border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'
            }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Cashiers</p>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{users.filter(u => u.User_Type === 'C').length}</p>
              </div>
              <FiUsers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-1 md:gap-2 mb-1 md:mb-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-8 pr-3 py-2 text-sm rounded-lg border ${darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
            />
          </div>

          <div className="flex flex-wrap gap-1">
            {['all', 'A', 'C'].map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-2 py-1.5 text-xs rounded-lg font-medium ${activeFilter === f
                    ? 'bg-blue-600 text-white'
                    : darkMode
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-100 text-gray-700'
                  }`}
              >
                {f === 'all' ? 'All' : f === 'A' ? 'Admins' : f === 'C' ? 'Cashiers' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto mb-1 md:mb-2">
        <div className={`rounded-lg p-1 md:p-2 h-full overflow-y-auto ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'
          }`}>
          {loading ? (
            <div className="flex items-center justify-center py-8 rounded-xl h-full">
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <div className={`w-8 h-8 border-4 rounded-full animate-spin ${darkMode ? 'border-blue-800' : 'border-blue-200'
                    }`}></div>
                  <div className="absolute inset-0 w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Loading users...</p>
              </div>
            </div>
          ) : error ? (
            <div className={`rounded-xl p-4 text-center h-full flex items-center justify-center border ${darkMode
                ? 'bg-red-900/20 border-red-800'
                : 'bg-red-50 border-red-200'
              }`}>
              <div>
                <div className={`font-medium text-sm ${darkMode ? 'text-red-400' : 'text-red-600'
                  }`}>⚠️ Error</div>
                <p className={`mt-1 text-xs ${darkMode ? 'text-red-400' : 'text-red-600'
                  }`}>{error}</p>
              </div>
            </div>
          ) : (
            <div className={`rounded-xl border overflow-hidden h-full ${darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
              {/* Table */}
              <div className="overflow-x-auto h-full">
                <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                  <table className="w-full">
                    <thead className={`sticky top-0 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                      <tr>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">
                          ID
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">
                          User
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider hidden sm:table-cell">
                          Role
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider">
                          Status
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'
                      }`}>
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.User_Id}
                          className={`transition-colors duration-150 ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'
                            }`}
                        >
                          <td className="px-2 py-2 whitespace-nowrap text-left hidden md:table-cell">
                            <span className="text-xs">
                              {user.User_Id}
                            </span>
                          </td>

                          {/* User column (left aligned) */}
                          <td className="px-2 py-2 whitespace-nowrap text-left">
                            <div className="flex items-center gap-2">
                              {/* <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-medium text-xs">
                                {user.User_Name.charAt(0).toUpperCase()}
                              </div> */}
                              <div>
                                <div className="text-xs font-medium">
                                  {user.User_Name}
                                </div>
                                {/* <div className="text-xs hidden sm:block">
                                  ID: {user.User_Id}
                                </div> */}
                              </div>
                            </div>
                          </td>

                          {/* Role column (centered) - Hidden on mobile */}
                          <td className="px-2 py-2 whitespace-nowrap text-center hidden sm:table-cell">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getUserTypeBadgeColor(
                                user.User_Type
                              )}`}
                            >
                              {getUserTypeIcon(user.User_Type)}
                              {getUserTypeLabel(user.User_Type)}
                            </span>
                          </td>

                          {/* Status column (centered) */}
                          <td className="px-2 py-2 whitespace-nowrap text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                user.User_Status
                              )}`}
                            >
                              {user.User_Status === "A" ? (
                                <>
                                  <FiUserCheck className="w-3 h-3" />
                                  <span className="hidden xs:inline">Active</span>
                                </>
                              ) : (
                                <>
                                  <FiUserX className="w-3 h-3" />
                                  <span className="hidden xs:inline">Inactive</span>
                                </>
                              )}
                            </span>
                          </td>

                          {/* Actions column (centered) */}
                          <td className="px-2 py-2 whitespace-nowrap text-center">
                            <button
                              onClick={() => openStatusModal(user)}
                              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${user.User_Status === "A"
                                  ? darkMode
                                    ? "bg-red-900/30 text-red-400 hover:bg-red-800/50"
                                    : "bg-red-100 text-red-700 hover:bg-red-200"
                                  : darkMode
                                    ? "bg-green-900/30 text-green-400 hover:bg-green-800/50"
                                    : "bg-green-100 text-green-700 hover:bg-green-200"
                                }`}
                            >
                              {user.User_Status === "A" ? "Deactivate" : "Activate"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-8 h-full flex items-center justify-center">
                    <div>
                      <FiUsers className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>No users found</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'
                        }`}>Try adjusting your search or filters</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2">
          <div className={`rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
            <div className="relative">
              {/* Modal Header */}
              <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
                    }`}>
                    <FiUserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-lg font-bold">Add New User</h2>
                </div>
                <button
                  onClick={closeModal}
                  className={`p-1 rounded-lg transition-colors duration-200 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                >
                  <FiX className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 space-y-3">
                <div className="space-y-1">
                  <label className="block text-xs font-medium">
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="Enter username"
                    value={currentUser.User_Name}
                    onChange={e => setCurrentUser({ ...currentUser, User_Name: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter secure password"
                    value={currentUser.User_Pass}
                    onChange={e => setCurrentUser({ ...currentUser, User_Pass: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium">
                    User Role
                  </label>
                  <select
                    value={currentUser.User_Type}
                    onChange={e => setCurrentUser({ ...currentUser, User_Type: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                  >
                    <option value="">Select User Role</option>
                    {types.map(t => (
                      <option key={t.User_Type} value={t.User_Type}>
                        {getUserTypeLabel(t.User_Type)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className={`flex justify-end gap-2 p-4 rounded-b-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'
                }`}>
                <button
                  onClick={closeModal}
                  className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${darkMode
                      ? 'bg-gray-700 text-gray-200 border-gray-600'
                      : 'bg-white text-gray-700 border-gray-300'
                    } border`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200 text-sm"
                >
                  Create User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Confirmation Modal */}
      {isStatusModalOpen && userToUpdate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2">
          <div className={`rounded-xl shadow-xl w-full max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
            <div className="p-4">
              <div className="text-center">
                <div className={`mx-auto flex items-center justify-center h-10 w-10 rounded-full ${userToUpdate.User_Status === 'A'
                    ? darkMode ? 'bg-red-900/30' : 'bg-red-100'
                    : darkMode ? 'bg-green-900/30' : 'bg-green-100'
                  }`}>
                  {userToUpdate.User_Status === 'A' ? (
                    <FiUserX className="h-5 w-5 text-red-600 dark:text-red-400" />
                  ) : (
                    <FiUserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <h3 className="mt-3 text-sm font-medium">
                  {userToUpdate.User_Status === 'A' ? 'Deactivate User' : 'Activate User'}
                </h3>
                <p className="mt-1 text-xs">
                  Are you sure you want to {userToUpdate.User_Status === 'A' ? 'deactivate' : 'activate'} user <strong>{userToUpdate.User_Name}</strong>?
                </p>
              </div>
              <div className="mt-4 flex justify-center gap-2">
                <button
                  onClick={closeStatusModal}
                  className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${darkMode
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-100 text-gray-700'
                    }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusChange}
                  className={`px-3 py-2 text-white rounded-lg hover:opacity-90 font-medium transition-all duration-200 text-sm ${userToUpdate.User_Status === 'A' ? 'bg-red-600' : 'bg-green-600'
                    }`}
                >
                  {userToUpdate.User_Status === 'A' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAccessPage;
