import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { API } from "../api";

export default function ComposeEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { certificates } = location.state || { certificates: [] };

  const [subject, setSubject] = useState("Your Certificate is Ready!");
  const [body, setBody] = useState("<p>Dear {{name}},</p><p>Congratulations! Please find your certificate attached to this email.</p><p>Best regards,<br>Certificate Team</p>");
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);

  const modules = {
    toolbar: [
      [{header: [1, 2, false]}],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{list: "ordered"}, {list: "bullet"}],
      ["link", "color", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold", "italic", "underline", "strike", "blockquote",
    "list", "bullet",
    "link", "color", "image",
  ];

  const handleSendEmails = async () => {
    if (certificates.length === 0) {
        showToast("error", "No recipients to send to.");
        return;
    }

    setSending(true);
    try {
      // Prepare recipients list
      const recipients = certificates.map(cert => ({
        email: cert.email,
        name: cert.name,
        certificateUrl: cert.url 
      }));

      const res = await API.post("/emails/send-batch", {
        recipients,
        subject,
        body
      });

      showToast("success", `Emails sent! Success: ${res.data.success}, Failed: ${res.data.failed}`);
      
      // Optional: Navigate back after delay
      setTimeout(() => navigate("/generate"), 3000);

    } catch (err) {
      console.error(err);
      showToast("error", "Failed to send emails.");
    } finally {
      setSending(false);
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
            
            {/* LEFT COLUMN: COMPOSER */}
            <div className="flex-1 bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="mb-6">
                    <button 
                        onClick={() => navigate(-1)}
                        className="text-gray-500 hover:text-blue-600 flex items-center gap-2 mb-4 text-sm font-semibold transition-colors"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                        Back
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Compose Email</h1>
                    <p className="text-gray-500 text-sm">Customize the message sent to your participants.</p>
                </div>

                <div className="space-y-6">
                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Email Subject"
                        />
                    </div>

                    {/* Body */}
                    <div className="h-96 pb-12">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Message Body</label>
                        <ReactQuill 
                            theme="snow"
                            value={body}
                            onChange={setBody}
                            modules={modules}
                            formats={formats}
                            className="h-72"
                        />
                         <p className="text-xs text-gray-400 mt-14">Tip: Use <code>{"{{name}}"}</code> to dynamically insert the participant's name.</p>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: RECIPIENTS & ACTIONS */}
            <div className="w-full lg:w-96 flex flex-col gap-6">
                
                {/* Summary Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        Recipients
                    </h3>
                    <div className="text-4xl font-extrabold text-blue-600 mb-2">{certificates.length}</div>
                    <p className="text-gray-500 text-sm mb-6">Participants will receive this email.</p>
                    
                    <div className="max-h-60 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {certificates.map((cert, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                    {cert.name ? cert.name.charAt(0).toUpperCase() : "?"}
                                </div>
                                <div className="overflow-hidden">
                                     <p className="text-sm font-semibold text-gray-800 truncate">{cert.name}</p>
                                     <p className="text-xs text-gray-500 truncate">{cert.email || "No Email"}</p>
                                </div>
                            </div>
                        ))}
                         {certificates.length === 0 && (
                            <p className="text-sm text-gray-400 italic">No recipients found.</p>
                        )}
                    </div>
                </div>

                {/* Send Button */}
                <button
                    onClick={handleSendEmails}
                    disabled={sending || certificates.length === 0}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                    {sending ? (
                         <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    )}
                    <span>Send Emails</span>
                </button>

                 {/* Preview Panel (Miniature) */}
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 opacity-75 hover:opacity-100 transition-opacity">
                     <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Preview</h4>
                     <div className="border rounded-lg p-4 bg-gray-50 text-sm text-gray-600 space-y-2">
                         <p><strong>Subject:</strong> {subject}</p>
                         <div className="border-t border-gray-200 pt-2" dangerouslySetInnerHTML={{ __html: body.replace("{{name}}", "John Doe") }}></div>
                         <div className="mt-4 p-3 border border-dashed border-gray-300 rounded bg-white flex items-center gap-2">
                             <span className="text-red-400 text-xl">📄</span>
                             <span className="text-gray-500 italic">Certificate.pdf</span>
                         </div>
                     </div>
                 </div>

            </div>
        </div>
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
