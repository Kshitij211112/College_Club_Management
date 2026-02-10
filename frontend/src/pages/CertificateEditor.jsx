import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import DragDropEditor from "../components/DragDropEditor";
import { API } from "../api";

export default function CertificateEditor() {
  const [searchParams] = useSearchParams();
  const templateURL = searchParams.get("template");
  const navigate = useNavigate();

  useEffect(() => {
    if (!templateURL) {
      alert("No template selected! Redirecting to home...");
      navigate("/");
    }
  }, [templateURL, navigate]);

  const saveCoordinates = async (settings) => {
    try {
      await API.post("/templates/save-coordinates", {
        ...settings,
        templateUrl: templateURL,
      });
      alert("Design saved successfully!");
      navigate("/generate");
    } catch (error) {
      console.error("Error saving coordinates:", error);
      alert("Failed to save design.");
    }
  };

  if (!templateURL) return null;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header Bar */}
      <div className="flex-none bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center z-10 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">
          Design Your Certificate
        </h1>
        <button
          onClick={() => navigate("/")}
          className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 transition-colors"
        >
          <span>&larr;</span> Back to Upload
        </button>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 overflow-hidden relative ">
        <DragDropEditor template={templateURL} onSave={saveCoordinates} />
      </div>
    </div>
  );
}
