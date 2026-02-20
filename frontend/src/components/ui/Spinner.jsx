import React from 'react';

const Spinner = ({ size = 'md', label = 'Loading...' }) => {
    const sizes = {
        sm: 'w-8 h-8 border-[3px]',
        md: 'w-12 h-12 border-4',
        lg: 'w-16 h-16 border-4',
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className={`${sizes[size]} border-blue-600 border-t-transparent rounded-full animate-spin mb-4`} />
            {label && (
                <p className="text-slate-400 font-black uppercase tracking-widest text-xs animate-pulse">
                    {label}
                </p>
            )}
        </div>
    );
};

export default Spinner;
