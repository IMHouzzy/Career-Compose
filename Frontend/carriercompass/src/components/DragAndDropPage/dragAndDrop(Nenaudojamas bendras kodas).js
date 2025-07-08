import React, { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import "../styles/DragAndDrop.css"; // Import CSS
import axios from "axios";

const DragAndDrop = () => {
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [file, setFile] = useState(null);
  const [activeButton, setActiveButton] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const dropdownRef = useRef(null);
  const [analysis, setAnalysis] = useState(null);

  const jobOptions = [
    { value: "Developer", label: "Software Developer" },
    { value: "Designer", label: "UI/UX Designer" },
    { value: "Data-scientist", label: "Data Scientist" },
    { value: "Devops", label: "DevOps Engineer" }
  ];

  const handleJobSelection = (job) => {
    setSelectedJobs((prev) =>
      prev.includes(job) ? prev.filter((j) => j !== job) : [...prev, job]
    );
  };


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Dropzone configuration
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]); // Store only the first file
      } else {
        alert("Only PDF and Word documents are allowed.");
      }
    },
  });

  // Remove file
  const removeFile = () => {
    setFile(null);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!file) {
      alert("No file selected!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setIsLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/analyze-cv/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAnalysis(response.data.analysis);
    } catch (error) {
      console.error("Error analyzing CV:", error);
      alert("Failed to analyze CV.");
    } finally {
      setIsLoading(false);
    }

    setShowResults(true);
  };

  return (
    <div className="container">
      {/* Loading Screen */}
      {isLoading && (
        <div className="loading-screen">
          <h2 className="loading-text">Processing...</h2>
          <div className="spinner"></div>
        </div>
      )}

      {/* Show Results Section */}
      {!isLoading && showResults && (
        <div className="results-section">
          <h2>Results</h2>
          <p>Your CV has been successfully processed!</p>

          {analysis && (
            <textarea className="result-textarea">{analysis}</textarea>)}
          
          <button className="go-back-button" onClick={() => setShowResults(false)}>
            Go Back
          </button>
        </div>
      )}

      {/* Drag and Drop Section */}
      {!isLoading && !showResults && (
        <>
          <div className="button-group">
            <div className={`toggle-background ${activeButton === "it-job" ? "slide-right" : "slide-left"}`}></div>
            <button
              onClick={() => {
                setShowDropdown(true);
                setActiveButton("it-job");
              }}
              className={`toggle-button ${activeButton === "it-job" ? "active" : ""}`}
            >
              Select IT Job
            </button>
            <button
              onClick={() => {
                setShowDropdown(false);
                setActiveButton("general");
              }}
              className={`toggle-button ${activeButton === "general" ? "active" : ""}`}
            >
              General
            </button>
          </div>

          {showDropdown && (
            <div className="custom-dropdown" ref={dropdownRef}>
              <button className="dropdown-toggle" onClick={() => setDropdownOpen(!dropdownOpen)}>
                {selectedJobs.length > 0 ? selectedJobs.join(", ") : "Select IT Job"}
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  {jobOptions.map((job) => (
                    <label key={job.value} className="dropdown-item">
                      <input
                        type="checkbox"
                        value={job.value}
                        checked={selectedJobs.includes(job.value)}
                        onChange={(e) => handleJobSelection(e.target.value)}
                      />
                      {job.label}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Drag and Drop Area */}
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <img src="https://placehold.co/120x120" alt="Upload Icon" className="upload-icon"></img>
            <h2>Drag and Drop Your CV here</h2>
            <p>or</p>
            <button className="select-file">Select file</button>
          </div>

          {/* Uploaded File Display */}
          {file && (
            <div className="file-list">
              <h3>Uploaded file:</h3>
              <div className="file-item">
                <span>{file.name}</span>
                <button onClick={removeFile} className="remove-file">✖</button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button className="submit-button" onClick={handleSubmit} disabled={!file}>
            Submit
          </button>
        </>
      )}
    </div>
  );
};

export default DragAndDrop;
