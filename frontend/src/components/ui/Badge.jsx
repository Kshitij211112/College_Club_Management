import React from 'react';
import { CATEGORY_COLORS } from '../../constants/categories';

const Badge = ({ text, variant = 'default', className = '' }) => {
    // Use category color mapping if it matches, otherwise use variant
    const categoryClass = CATEGORY_COLORS[text];
    if (categoryClass) {
        return (
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${categoryClass} ${className}`}>
                {text}
            </span>
        );
    }

    const variants = {
        default: 'bg-slate-100 text-slate-600',
        primary: 'bg-blue-100 text-blue-700',
        success: 'bg-emerald-100 text-emerald-700',
        warning: 'bg-amber-100 text-amber-700',
        danger: 'bg-red-100 text-red-700',
    };

    return (
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${variants[variant] || variants.default} ${className}`}>
            {text}
        </span>
    );
};

export default Badge;
