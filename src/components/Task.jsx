import React, { useState, useEffect } from "react";
import Modal from "./Modal";

export default function Task({ task, onDelete, onEdit, onAddFile }) {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    // Clean up previous URL when task.file changes
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }
    if (task.file) {
      setFileUrl(URL.createObjectURL(task.file));
    }
    // Cleanup on component unmount
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [task.file]);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Create preview URL for image files
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    }
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      onAddFile(selectedFile);
      setShowFileModal(false);
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  };

  return (
    <li className="bg-white p-3 rounded shadow text-sm space-y-2">
      <div className="flex justify-between items-start">
        <h4 className="break-all font-semibold text-base flex-1">{task.title}</h4>
        <button
          className="break-all text-lg px-2 hover:bg-gray-100 rounded"
          onClick={() => setShowTaskModal(true)}
          aria-label="Task options"
        >
          ...
        </button>
      </div>
      
      {task.description && (
        <p className="break-all text-xs text-gray-700">{task.description}</p>
      )}

      {task.file && (
        <div className="mt-2 border rounded-lg overflow-hidden">
          {task.file.type.startsWith("image/") ? (
            <img
              src={fileUrl}
              alt="Task attachment"
              className="w-full h-32 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "placeholder-image.png"; // Add a placeholder image
              }}
            />
          ) : (
            <div className="p-2 bg-gray-50 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <a
                href={fileUrl}
                download={task.file.name}
                className="text-xs text-blue-600 hover:underline"
              >
                {task.file.name}
              </a>
            </div>
          )}
        </div>
      )}

      <button
        className="mt-2 text-xs text-blue-600 hover:underline flex items-center gap-1"
        onClick={() => setShowFileModal(true)}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Insert File
      </button>

      {/* Task options modal */}
      <Modal open={showTaskModal} onClose={() => setShowTaskModal(false)}>
        <button
          className="block w-full text-left py-2 hover:bg-gray-100"
          onClick={() => {
            onEdit();
            setShowTaskModal(false);
          }}
        >
          Edit Task
        </button>
        <button
          className="block w-full text-left py-2 text-red-600 hover:bg-gray-100"
          onClick={() => {
            onDelete();
            setShowTaskModal(false);
          }}
        >
          Delete Task
        </button>
      </Modal>

      {/* File upload modal */}
      <Modal open={showFileModal} onClose={() => {
        setShowFileModal(false);
        setSelectedFile(null);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
      }}>
        <div className="p-4 space-y-4">
          <h3 className="font-medium mb-4">Upload File</h3>
          <input
            type="file"
            className="w-full"
            onChange={handleFileSelect}
            accept="image/*"
          />
          
          {/* Preview section */}
          {previewUrl && (
            <div className="mt-4">
              <p className="text-sm mb-2">Preview:</p>
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-32 object-cover rounded border"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => {
                setShowFileModal(false);
                setSelectedFile(null);
                if (previewUrl) {
                  URL.revokeObjectURL(previewUrl);
                  setPreviewUrl(null);
                }
              }}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              onClick={handleFileUpload}
              disabled={!selectedFile}
            >
              Upload
            </button>
          </div>
        </div>
      </Modal>
    </li>
  );
}