import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TemplateUploader({ onPreview }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);

    const previewURL = URL.createObjectURL(selected);
    onPreview(previewURL);
  };

  const uploadHandler = async () => {
    if (!file) return alert("Please select a file first!");

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("template", file);

      const res = await fetch("http://localhost:5050/api/templates/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      // Redirect to DESIGN EDITOR PAGE
      navigate(`/design-editor?template=${encodeURIComponent(data.url)}`);

    } catch (error) {
      console.error(error);
      alert("Error uploading template.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/png,image/jpeg"
        onChange={handleSelect}
        className="block w-full text-sm text-gray-700 border px-3 py-2 rounded-lg cursor-pointer"
      />

      <button
        onClick={uploadHandler}
        disabled={!file || uploading}
        className={`w-full py-3 rounded-lg text-white font-semibold
          ${file && !uploading ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}
        `}
      >
        {uploading ? "Uploading..." : "Upload Template"}
      </button>
    </div>
  );
}
