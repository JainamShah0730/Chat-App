import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, status = 'info', duration = 5000, position = 'bottom' }) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    setToasts((prev) => [...prev, { id, title, description, status, position }]);

    if (duration !== null) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getPositionClasses = (position) => {
    if (position.includes('top')) return 'top-4';
    return 'bottom-4';
  };
  
  const getAlignmentClasses = (position) => {
    if (position.includes('left')) return 'left-4';
    if (position.includes('right')) return 'right-4';
    return 'left-1/2 -translate-x-1/2';
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case 'success': return 'bg-emerald-600 text-white';
      case 'error': return 'bg-red-600 text-white';
      case 'warning': return 'bg-yellow-500 text-white';
      case 'info':
      default: return 'bg-blue-600 text-white';
    }
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed inset-0 pointer-events-none z-[100] flex flex-col">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`fixed ${getPositionClasses(t.position)} ${getAlignmentClasses(t.position)} flex flex-col gap-1 px-4 py-3 rounded-lg shadow-lg min-w-[300px] max-w-sm pointer-events-auto transition-all animate-fade-in ${getStatusClasses(t.status)}`}
            onClick={() => removeToast(t.id)}
          >
            {t.title && <h3 className="font-semibold text-sm">{t.title}</h3>}
            {t.description && <p className="text-xs opacity-90">{t.description}</p>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
