import React from 'react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className={`bg-white rounded-3xl shadow-2xl ${maxWidth} w-full max-h-[90vh] overflow-y-auto`}>
                {title && (
                    <div className="flex items-center justify-between p-6 pb-0">
                        <h2 className="text-2xl font-black text-slate-900">{title}</h2>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xl transition-all"
                        >
                            ✕
                        </button>
                    </div>
                )}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
