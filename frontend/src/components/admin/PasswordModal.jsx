import React from 'react';

const PasswordModal = ({ credentials, onClose, onCopy }) => {
    if (!credentials) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">Success! 🎉</h3>
                    <p className="text-slate-500 mt-2 text-sm">
                        Share these credentials with the president of <strong>{credentials.clubName}</strong>
                    </p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 space-y-4 border border-slate-200">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">President Email</label>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-lg font-mono font-bold text-slate-800 flex-1 break-all">{credentials.presidentEmail}</p>
                            <button onClick={() => onCopy(credentials.presidentEmail)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all flex-shrink-0">📋</button>
                        </div>
                    </div>
                    <div className="border-t border-slate-200 pt-4">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Generated Password</label>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-2xl font-mono font-black text-blue-600 tracking-widest flex-1">{credentials.generatedPassword}</p>
                            <button onClick={() => onCopy(credentials.generatedPassword)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all flex-shrink-0">📋</button>
                        </div>
                    </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-4">
                    <p className="text-amber-800 text-xs font-semibold">⚠️ Save this password now! It won't be shown again.</p>
                </div>
                <button onClick={onClose} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all mt-6">Done</button>
            </div>
        </div>
    );
};

export default PasswordModal;
