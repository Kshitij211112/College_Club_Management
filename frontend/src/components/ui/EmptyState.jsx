import React from 'react';

const EmptyState = ({ icon = '📭', title, description, actionLabel, onAction }) => {
    return (
        <div className="bg-white rounded-[3rem] p-16 md:p-20 text-center border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">{icon}</span>
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">{title}</h3>
            {description && (
                <p className="text-slate-400 mb-8 max-w-sm mx-auto font-medium">{description}</p>
            )}
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
