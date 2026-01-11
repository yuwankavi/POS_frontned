const Modal = ({ children, size = 'md', showClose = true, disableClose = false }) => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector(state => state.ui);

  const sizeClasses = {
    sm: 'w-96',
    md: 'w-[450px]',
    lg: 'w-[800px]',
    xl: 'w-[95vw] h-[95vh]'
  };

  const handleClose = () => {
    if (!disableClose) {
      dispatch(closeModal());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4">
      <div
        className={`${sizeClasses[size]} rounded-2xl p-5 relative max-h-[85vh] overflow-y-auto ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border shadow-2xl backdrop-blur-sm`}
      >
        {showClose && (
          <button
            onClick={handleClose}
            disabled={disableClose}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all z-10 
              ${disableClose ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 text-white hover:rotate-90 hover:shadow-lg'}
            `}
          >
            <i className="fas fa-times"></i>
          </button>
        )}
        {children}
      </div>
    </div>
  );
};
