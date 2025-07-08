import React, { useContext } from "react";

import { useDropzone } from "react-dropzone";
import "../../styles/JobsPage/UploadCV.css";
import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";
const DropIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg"
    width="80" height="80"
    viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    className="upload-icon">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8" />
    <path d="m8 12 4 4 4-4" />
  </svg>
);

const DragAndDropUpload = ({ file, setFile }) => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    },
  });

  return (
    <div className="fade-in">
      <div className="dnd-container">
        <div
          {...getRootProps()}
          className={`dnd-dropzone ${isDragActive ? "active" : ""}`}
        >
          <input {...getInputProps()} />
          <DropIcon />
          <div className="dnd-content">
            <p className="dnd-text">{t.UploadYourCV}</p>
            <p className="dnd-subtext">{t.dragDropOrClick}</p>
            <p className="dnd-format">{t.accptedFormats} PDF, DOCX</p>
            {file && <div className="dnd-file-info">📄 {file.name}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DragAndDropUpload;
