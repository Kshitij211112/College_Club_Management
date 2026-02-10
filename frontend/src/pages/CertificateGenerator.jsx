import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api";

export default function CertificateGenerator() {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false); // Specific for regenerate button state

  const [certificates, setCertificates] = useState([]);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message: '' }
  const navigate = useNavigate();

  // Initial Generation & Regeneration
  const handleGenerate = async () => {
    try {
      setLoading(true);
      setGenerating(true);
      
      const res = await API.post("/certificates/process");
      
      if (res.data.files && Array.isArray(res.data.files)) {
        // Backend now returns object array: { url, name, email, id }
        setCertificates(res.data.files);
        showToast("success", "Certificates Generated Successfully!");
      } else {
        showToast("error", "No certificates returned.");
      }
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to generate certificates.");
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  };

  // Send Emails - Navigate to Compose Page
  const handleSendEmails = () => {
    if (certificates.length === 0) return;
    navigate("/compose-email", { state: { certificates } });
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Certificate Generator
          </h1>
          <p className="mt-2 text-gray-500">
            Generate and distribute certificates from your CSV data.
          </p>
        </div>

        {/* LOADING STATE */}
        {loading ? (
             <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">Generating certificates...</p>
             </div>
        ) : (
            <>
                {/* INITIAL STATE: Action Card */}
                {certificates.length === 0 && (
                     <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-8 text-center animate-fade-in-up">
                        <div className="mb-6 flex justify-center">
                           <div className="p-4 bg-blue-50 rounded-full text-blue-600">
                               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                   <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                   <polyline points="14 2 14 8 20 8"></polyline>
                                   <line x1="12" y1="18" x2="12" y2="12"></line>
                                   <line x1="9" y1="15" x2="15" y2="15"></line>
                               </svg>
                           </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to Generate</h3>
                        <p className="text-gray-500 mb-6 text-sm">Use <strong>participants.csv</strong> from your uploads to accurate generation.</p>
                        
                        <div className="flex flex-col gap-3">
                            <button
                               onClick={handleGenerate}
                               className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                            >
                               <span>Generate Certificates</span>
                               <span>→</span>
                            </button>
                            <button
                                onClick={() => navigate("/")}
                                className="w-full py-3 bg-white text-gray-700 rounded-xl font-bold shadow-sm border border-gray-200 hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                     </div>
                )}

                {/* RESULTS STATE: Action Bar + Grid */}
                {certificates.length > 0 && (
                    <div className="animate-fade-in-up">
                         {/* ACTIONS BAR */}
                         <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 gap-4 sticky top-4 z-10 backdrop-blur-md bg-white/90">
                            {/* Left: Back */}
                            <button
                                onClick={() => navigate("/design-editor")}
                                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors border border-gray-200 flex items-center gap-2"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                                <span>Back to Design</span>
                            </button>
                            
                            {/* Center: Count */}
                            <div className="text-sm font-bold text-gray-500 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-200">
                                {certificates.length} generated
                            </div>
            
                            {/* Right: Send */}
                            <button
                                onClick={handleSendEmails}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                <span>Send Certificates to Participants</span>
                            </button>
                         </div>
            
                         {/* GRID */}
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {certificates.map((cert, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                                    {/* Image Thumbnail */}
                                    <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                                        {cert.url ? (
                                            <img 
                                                src={cert.url} 
                                                alt={cert.name} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-300">No Preview</div>
                                        )}
                                        {/* Overlay on hover */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <a 
                                                href={cert.url} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="bg-white/90 p-2 rounded-full shadow-lg text-gray-800 hover:text-blue-600"
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                            </a>
                                        </div>
                                    </div>
                                    
                                    {/* Card Body */}
                                    <div className="p-4 flex items-center justify-between">
                                        <div>
                                            <h4 className="font-bold text-gray-800">Certificate #{index + 1}</h4>
                                            <p className="text-sm text-gray-500 truncate max-w-[150px]">{cert.name}</p>
                                        </div>
                                        <a 
                                            href={cert.url} 
                                            download 
                                            className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                            title="Download"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                        </a>
                                    </div>
                                </div>
                            ))}
                         </div>
                    </div>
                )}
            </>
        )}
      </div>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-xl shadow-2xl text-white font-bold flex items-center gap-3 animate-slide-in-right z-50 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {toast.type === 'success' ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            )}
            {toast.message}
        </div>
      )}
    </div>
  );
}