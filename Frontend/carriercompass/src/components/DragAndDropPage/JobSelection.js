import React, { useRef, useEffect, useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";
import "../../styles/DragAndDrop/JobSelection.css";

const JobSelection = ({ selectedJobs, setSelectedJobs, handleJobSelection, showDropdown, setShowDropdown }) => {
  const { language } = useContext(LanguageContext);
  const t = translations[language] || translations["en"]; // Fallback to English

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const jobOptions = [
    { value: "Developer", label: "Software Developer" },
    { value: "Designer", label: "UI/UX Designer" },
    { value: "Data-scientist", label: "Data Scientist" },
    { value: "Devops", label: "DevOps Engineer" }
  ];

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <button className="dropdown-toggle" onClick={() => setShowDropdown(!showDropdown)}>
        {selectedJobs.length > 0 ? selectedJobs.join(", ") : t.selectITJob}
      </button>

      {showDropdown && (
        <div className="dropdown-menu">
          {jobOptions.map((job) => (
            <label key={job.value} className="dropdown-item">
              <input
                type="checkbox"
                value={job.value}
                checked={selectedJobs.includes(job.value)}
                onChange={() => handleJobSelection(job.value)}
              />
              {job.label} {/* Job options remain in English */}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobSelection;
