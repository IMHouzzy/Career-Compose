import React, { useState, useEffect, useContext } from "react";

import JobList from "../../components/ResultPage/RecommendedJobList";
import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";
import { useNavigate } from "react-router-dom";
import "../../styles/JobsPage/JobList.css";

const JobsPage = () => {
  const [isITUser, setIsITUser] = useState(true);
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const navigate = useNavigate();

  useEffect(() => {
    // Paprastas API iškvietimas patikrinti, ar vartotojas iš IT srities
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`http://localhost:8000/cv/analysis/${token}`)
        .then(response => response.json())
        .then(data => setIsITUser(data.is_IT))
        .catch(error => console.error("Error checking if user is from IT field:", error));
    }
  }, []);

  // Jei vartotojas ne iš IT srities, rodome specialų pranešimą
  if (!isITUser) {
    return (
      <div className="not-it-message">
        <div className="message-container">
          <h2 className="message-title">{t.jobNavTitle}</h2>
          <p className="message-text">{t.notITUserMessage}</p>
          <div className="message-button-container">
            <button 
              className="courses-button"
              onClick={() => navigate("/results/RecommendedCourses")}
            >
              {t.goToCoursesButton}
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  
  return (
    <div >
      <JobList />
    </div>
  );
};

export default JobsPage;
