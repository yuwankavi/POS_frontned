import React from "react";
import { FiHome, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom"; 
 
const Breadcrumb = ({ current }) => {
  return (
    <div className="mb-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
     <a href="/dashboard" className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <FiHome className="w-4 h-4 mr-1" />
            Dashboard
          </a>


        
      <FiChevronRight className="w-4 h-4 mx-2" /> 
      <span className="text-blue-600 dark:text-blue-400 font-medium">
        {current}
      </span>
    </div>










  );
};

export default Breadcrumb;
