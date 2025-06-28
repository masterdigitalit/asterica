import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/VideoEditor.module.scss";
import axios from "../axiosConfig"; // Import the Axios configuration

// const ASPECT_RATIOS = [
//   { label: '16:9', value: 16 / 9 },
//   { label: '4:3', value: 4 / 3 },
//   { label: '1:1', value: 1 },
//   { label: '9:16 (Portrait)', value: 9 / 16 },
// ];

const CENTER_OPTIONS = [
  { label: "Center", value: "center" },
  { label: "Top", value: "top" },
  { label: "Bottom", value: "bottom" },
  { label: "Left", value: "left" },
  { label: "Right", value: "right" },
];

function VideoEditorOnlineUpload({ link }) {
  const uploadUrl = "/upload_file"; // Use relative URL since baseURL is set in axiosConfig
  const [videoFile, setVideoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [center, setCenter] = useState("center");
  const [uploadProgress, setUploadProgress] = useState(null);
  const [status, setStatus] = useState(null);
  const [feedBack, setFeedBack] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!videoFile) {
      setPreviewUrl(null);
      setStatus(null);
      setUploadProgress(null);
      return;
    }
    const url = URL.createObjectURL(videoFile);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [videoFile]);

  const uploadVideo = async () => {
    if (!videoFile) {
      setStatus("No video selected for upload.");
      return;
    }

    // Check if the file size is less than 10 MB (10 * 1024 * 1024 bytes)
    if (videoFile.size > 10 * 1024 * 1024) {
      setStatus("File size exceeds 10 MB. Please select a smaller file.");
      return;
    }

    setStatus("Uploading...");
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", videoFile, link + ".mp4");
    formData.append("uuid", link);
    formData.append("aspectRatio", aspectRatio);
    formData.append("center", center);

    try {
      const response = await axios.post(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setUploadProgress(percent);
        },
      });

      if (response.status >= 200 && response.status < 300) {
        setFeedBack(response.data.feedback);
        setStatus("Upload successful!");
        setUploadProgress(null);
      } else {
        setStatus(`Upload failed: ${response.statusText || response.status}`);
        setUploadProgress(null);
      }
    } catch (error) {
      setStatus("Upload error occurred.");
      setUploadProgress(null);
      console.log(error);
    }
  };

  const getObjectPosition = () => {
    switch (center) {
      case "top":
        return "center top";
      case "bottom":
        return "center bottom";
      case "left":
        return "left center";
      case "right":
        return "right center";
      default:
        return "center center";
    }
  };

  const containerStyle = {
    maxWidth: "640px",
    width: "100%",
    aspectRatio: aspectRatio,
    position: "relative",
    overflow: "hidden",
    borderRadius: "12px",
    backgroundColor: "#000",
    marginTop: "16px",

    backgroundColor: "fff",
  };

  const videoStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: getObjectPosition(),
    borderRadius: "50%",
  };
  console.log(feedBack);

  return (
    <div className={styles.videoEditorOnlineUpload}>
      <div className={styles.controls}>
        <input
          type="file"
          accept="video/mp4,video/*"
          onChange={(e) => setVideoFile(e.target.files[0] || null)}
          ref={fileInputRef}
          id="video-upload-input"
          className={styles.fileInput}
        />
        <label htmlFor="video-upload-input" className={styles.fileInputLabel}>
          Select Video (MP4)
        </label>
        <div className={styles.selectGroup}>
          <label htmlFor="centerSelect">Center Position:</label>
          <select
            id="centerSelect"
            value={center}
            onChange={(e) => setCenter(e.target.value)}
            className={styles.select}
          >
            {CENTER_OPTIONS.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
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
            controls={false}
            autoPlay={true}
            style={videoStyle}
            aria-label="Video preview with crop and center selection"
            muted
          />
        </div>
      )}

      <div className={styles.progress}>
        {feedBack !== null && (
          <>
            <p className={styles.progress}>
              Получено: {feedBack.got ? "да" : "нет"}
            </p>
            <p className={styles.progress}>
              Сохранено: {feedBack.send ? "да" : "нет"}
            </p>
            <p className={styles.progress}>
              Отредактировано: {feedBack.send ? "да" : "нет"}
            </p>
            <p className={styles.progress}>
              Отправлено: {feedBack.send ? "да" : "нет"}
            </p>
            <p className={styles.progress}>
              Удалено: {feedBack.send ? "да" : "нет"}
            </p>
          </>
        )}
      </div>
      {status && <p className={styles.status}>{status}</p>}
    </div>
  );
}

export default VideoEditorOnlineUpload;
