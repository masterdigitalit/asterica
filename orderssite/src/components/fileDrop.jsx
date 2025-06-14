import React, { useState, useCallback, useRef } from "react";
import styles from "../styles/DragDropFileUpload.module.scss";

function DragDropFileUpload({name}) {
  const uploadUrl = "http://192.168.1.4:5000/upload_file";

    const [dragging, setDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [status, setStatus] = useState(null);
    const [progress, setProgress] = useState(null);
    const [fileName, setFileName] = useState(''); // Added state variable for file name
    const fileInputRef = useRef(null);
  
    const preventDefaults = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
  
    const highlight = () => setDragging(true);
    const unhighlight = () => setDragging(false);
  
    const handleDrop = (e) => {
      preventDefaults(e);
  
      const dt = e.dataTransfer;
      if (!dt || !dt.files || dt.files.length === 0) {
        resetSelection();
        setStatus('No file detected in drop');
        return;
      }
      const file = dt.files[0];
      handleFileSelect(file);
      setDragging(false);
    };
  
    const handleFileSelect = (file) => {
      if (!file) return;
  
      if (!file.type.startsWith('video/')) {
        resetSelection();
        setStatus('Please select a valid video file.');
        return;
      }
  
      setSelectedFile(file);
      setFileName(file.name); // Set the fileName state variable here
      setStatus(null);
      setProgress(null);
  
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    };
  
    const handleInputChange = (e) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    };
  
    const resetSelection = () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setSelectedFile(null);
      setPreviewUrl(null);
      setProgress(null);
      setStatus(null);
      setFileName(''); // Reset the fileName too
    };
  
    const uploadFile = () => {
      if (!selectedFile) return;
  
      setStatus('Uploading...');
      setProgress(0);
  
      const formData = new FormData();
      formData.append('file', selectedFile, name); // Use the fileName variable here
  
      const xhr = new XMLHttpRequest();
  
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setProgress(percentComplete);
        }
      };
  
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const resp = JSON.parse(xhr.responseText);
            setStatus('Upload successful');
          } catch {
            setStatus('Upload complete');
          }
        } else {
          setStatus(`Upload failed with status ${xhr.status}`);
        }
        setProgress(null);
      };
  
      xhr.onerror = () => {
        setStatus('Upload error occurred.');
        setProgress(null);
      };
  
      xhr.open('POST', uploadUrl);
      xhr.send(formData);
    };
  
    return (
      <div>
        <div
          className={`${styles.dropzone} ${dragging ? styles.dragging : ''}`}
          onDragEnter={(e) => {
            preventDefaults(e);
            highlight();
          }}
          onDragOver={preventDefaults}
          onDragLeave={(e) => {
            preventDefaults(e);
            unhighlight();
          }}
          onDrop={handleDrop}
          tabIndex={0}
          role="button"
          aria-label="Video file drop zone"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          <div className={styles.inner}>
            {!previewUrl && (
              <>
                <svg
                  className={styles.icon}
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <p className={styles.message}>
                  Drag & drop a video file here, or click to select
                </p>
              </>
            )}
            {previewUrl && (
              <video
                className={styles.videoPreview}
                src={previewUrl}
                controls
                aria-label="Video preview"
              />
            )}
            {fileName && <p className={styles.fileName}>Selected: {fileName}</p>}
            {progress !== null && (
              <p className={styles.progress}>Progress: {progress}%</p>
            )}
            {status && <p className={styles.status}>{status}</p>}
          </div>
        </div>
        <input
          type="file"
          accept="video/*"
          ref={fileInputRef}
          onChange={handleInputChange}
          style={{ display: 'none' }}
          aria-hidden="true"
        />
        {previewUrl && (
          <button
            type="button"
            className={styles.uploadButton}
            onClick={uploadFile}
            aria-label="Confirm upload video"
          >
            Confirm Upload
          </button>
        )}
      </div>
    );
  }
  
  export default DragDropFileUpload;
  