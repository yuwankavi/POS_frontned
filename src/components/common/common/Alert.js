import React from 'react';
import { FiCheckCircle, FiAlertCircle, FiXCircle, FiInfo } from 'react-icons/fi';
import PropTypes from 'prop-types';

const Alert = ({ type, message, onClose, className = '' }) => {
  const getAlertConfig = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          border: 'border-green-300 dark:border-green-700',
          text: 'text-green-800 dark:text-green-200',
          icon: <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
        };
      case 'error':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          border: 'border-red-300 dark:border-red-700',
          text: 'text-red-800 dark:text-red-200',
          icon: <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
        };
      case 'warning':
        return {
          bg: 'bg-yellow-100 dark:bg-yellow-900/30',
          border: 'border-yellow-300 dark:border-yellow-700',
          text: 'text-yellow-800 dark:text-yellow-200',
          icon: <FiAlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        };
      case 'info':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          border: 'border-blue-300 dark:border-blue-700',
          text: 'text-blue-800 dark:text-blue-200',
          icon: <FiInfo className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-900/30',
          border: 'border-gray-300 dark:border-gray-700',
          text: 'text-gray-800 dark:text-gray-200',
          icon: <FiInfo className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        };
    }
  };

  const config = getAlertConfig();

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down w-full max-w-md px-2 sm:px-0 ${className}`}
    >
      <div
        className={`flex items-center justify-between p-3 sm:p-4 rounded-xl shadow-lg border ${config.bg} ${config.border} ${config.text} mx-2`}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          {config.icon}
          <p className="font-medium text-sm sm:text-base">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="hover:opacity-70 transition-opacity"
            aria-label="Close alert"
          >
            <FiXCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  className: PropTypes.string
};

export default Alert;