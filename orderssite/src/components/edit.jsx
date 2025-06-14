import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/VideoEditor.module.scss';



const ASPECT_RATIOS = [
  { label: '16:9', value: 16 / 9 },
  { label: '4:3', value: 4 / 3 },
  { label: '1:1', value: 1 },
  { label: '9:16 (Portrait)', value: 9 / 16 },
];

const CENTER_OPTIONS = [
  { label: 'Center', value: 'center' },
  { label: 'Top', value: 'top' },
  { label: 'Bottom', value: 'bottom' },
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' },
];

function VideoEditorOnlineUpload() {
	let  uploadUrl  = 'http://192.168.1.4:5000/upload_file'
  const [videoFile, setVideoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(16 / 9);
  const [center, setCenter] = useState('center');
  const [croppedBlob, setCroppedBlob] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [status, setStatus] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!videoFile) {
      setPreviewUrl(null);
      setCroppedBlob(null);
      setStatus(null);
      setUploadProgress(null);
      return;
    }
    const url = URL.createObjectURL(videoFile);
    setPreviewUrl(url);
    setCroppedBlob(null);
    setStatus(null);
    setUploadProgress(null);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [videoFile]);

  // Calculate cropping rectangle
  const getCropRect = (videoWidth, videoHeight) => {
    let cropWidth, cropHeight;
    if (videoWidth / videoHeight > aspectRatio) {
      cropHeight = videoHeight;
      cropWidth = cropHeight * aspectRatio;
    } else {
      cropWidth = videoWidth;
      cropHeight = cropWidth / aspectRatio;
    }

    let cropX = 0,
      cropY = 0;
    switch (center) {
      case 'center':
        cropX = (videoWidth - cropWidth) / 2;
        cropY = (videoHeight - cropHeight) / 2;
        break;
      case 'top':
        cropX = (videoWidth - cropWidth) / 2;
        cropY = 0;
        break;
      case 'bottom':
        cropX = (videoWidth - cropWidth) / 2;
        cropY = videoHeight - cropHeight;
        break;
      case 'left':
        cropX = 0;
        cropY = (videoHeight - cropHeight) / 2;
        break;
      case 'right':
        cropX = videoWidth - cropWidth;
        cropY = (videoHeight - cropHeight) / 2;
        break;
      default:
        cropX = (videoWidth - cropWidth) / 2;
        cropY = (videoHeight - cropHeight) / 2;
    }
    return { cropX, cropY, cropWidth, cropHeight };
  };

  // Capture and store cropped frame as canvas content (image only)
  // Note: to send actual cropped video in mp4 format requires transcoding,
  // which isn't possible with simple canvas. So here we send full original video file.
  // You can modify backend to handle cropping parameters if needed.
  
  // For demonstration, we send the original video file with cropping metadata

  const uploadVideo = () => {
    if (!videoFile) {
      setStatus('No video selected for upload.');
      return;
    }

    setStatus('Uploading...');
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', videoFile, videoFile.name);
    formData.append('aspectRatio', aspectRatio);
    formData.append('center', center);

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        setStatus('Upload successful!');
        setUploadProgress(null);
      } else {
        setStatus(`Upload failed: ${xhr.statusText || xhr.status}`);
        setUploadProgress(null);
      }
    };

    xhr.onerror = () => {
      setStatus('Upload error occurred.');
      setUploadProgress(null);
    };

    xhr.open('POST', uploadUrl);
    xhr.send(formData);
  };

  const getObjectPosition = () => {
    switch (center) {
      case 'top':
        return 'center top';
      case 'bottom':
        return 'center bottom';
      case 'left':
        return 'left center';
      case 'right':
        return 'right center';
      default:
        return 'center center';
    }
  };

  const containerStyle = {
    maxWidth: '640px',
    width: '100%',
    aspectRatio: aspectRatio,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '12px',
    backgroundColor: '#000',
    marginTop: '16px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
  };

  const videoStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: getObjectPosition(),
  };

  return (
    <div className={styles.videoEditorOnlineUpload}>
      <div className={styles.controls}>
        <input
          type="file"
          accept="video/mp4,video/*"
          onChange={e => setVideoFile(e.target.files[0] || null)}
          ref={fileInputRef}
          id="video-upload-input"
          className={styles.fileInput}
        />
        <label htmlFor="video-upload-input" className={styles.fileInputLabel}>
          Select Video (MP4)
        </label>

        <div className={styles.selectGroup}>
          <label htmlFor="aspectSelect">Aspect Ratio:</label>
          <select
            id="aspectSelect"
            value={aspectRatio}
            onChange={e => setAspectRatio(Number(e.target.value))}
            className={styles.select}
          >
            {ASPECT_RATIOS.map(({ label, value }) => (
              <option key={label} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className={styles.selectGroup}>
          <label htmlFor="centerSelect">Center Position:</label>
          <select
            id="centerSelect"
            value={center}
            onChange={e => setCenter(e.target.value)}
            className={styles.select}
          >
            {CENTER_OPTIONS.map(({ label, value }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className={styles.uploadButton}
          onClick={uploadVideo}
          disabled={!videoFile}
        >
          Upload Video
        </button>
      </div>

      {previewUrl && (
        <div style={containerStyle} aria-label="Video preview container">
          <video
            src={previewUrl}
            controls
            style={videoStyle}
            aria-label="Video preview with crop and center selection"
            muted
          />
        </div>
      )}

      {uploadProgress !== null && (
        <p className={styles.progress}>Uploading: {uploadProgress}%</p>
      )}
      {status && <p className={styles.status}>{status}</p>}
    </div>
  );
}

export default VideoEditorOnlineUpload;
