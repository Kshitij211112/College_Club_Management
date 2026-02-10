import React, { useState } from "react";
import TemplateUploader from "../components/TemplateUploader";
import { useNavigate } from "react-router-dom";

export default function CertificateDesigner() {
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  // This is passed to TemplateUploader's onPreview prop to show local preview
  const handleFilePreview = (localURL) => {
    setPreviewImage(localURL);
  };

  // Note: TemplateUploader handles the navigation to /design-editor internally on success
  // We just need to pass the preview handler

  return (
    <div className="max-w-[1550px] mx-auto p-8 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* PAGE TITLE */}
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Certificate Designer
        </span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* LEFT CARD: UPLOAD */}
        <div className="flex-1 bg-white p-8 rounded-2xl shadow-xl border border-blue-200 flex flex-col">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">
              Upload Template
            </h2>
            {/* Reset preview button */}
            {previewImage && (
              <button
                onClick={() => setPreviewImage(null)}
                className="text-sm text-red-600 hover:text-red-700 underline"
              >
                Clear Preview
              </button>
            )}
          </div>

          <div className="space-y-6">
            <label className="text-sm font-semibold text-gray-700">
              Upload Certificate Template
            </label>

            {/* PREVIEW AREA */}
            {!previewImage ? (
              <div className="w-full h-[20vh] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-10 text-center text-gray-400">
                Preview will appear here
              </div>
            ) : (
              <div className="w-full border rounded-xl p-4 bg-gray-100 shadow">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full max-h-[240px] object-contain rounded-lg mx-auto"
                />
              </div>
            )}

            {/* Upload Component */}
            {/* 
                We don't need `onUpload` here because TemplateUploader redirects itself.
                We only need `onPreview` to show the image here before potential redirect.
            */}
            <TemplateUploader onPreview={handleFilePreview} />
          </div>
        </div>

        {/* RIGHT CARD: INSTRUCTIONS */}
        <div className="flex-1 bg-white p-8 rounded-2xl shadow-xl border border-blue-200 flex flex-col">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">
            How to Design
          </h2>

          <div className="space-y-6 text-gray-700">
            <Instruction
              number="1"
              title="Upload Template"
              text="Choose a blank certificate (PNG/JPG)."
            />
            <Instruction
              number="2"
              title="Editor Redirect"
              text="You will be redirected to the design editor automatically."
            />
            <Instruction
              number="3"
              title="Position Name Field"
              text="Drag the placeholder to the correct spot in the editor."
            />
            <Instruction
              number="4"
              title="Save Layout"
              text="Save coordinates for bulk generation."
            />

            <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Use high-resolution templates (1920×1080
                recommended).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Instruction({ number, title, text }) {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 text-blue-800 font-bold">
        {number}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">{text}</p>
      </div>
    </div>
  );
}
