import React, { useContext, useState } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";
import "../../styles/JobsPage/Top5Jobs.css";
import { useOutletContext } from "react-router-dom";

const JobCard = ({ title, match_percentage, level, onClick, isSelected }) => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  return (
    <div
      className={`job-card-unique ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      <h2>{title}</h2>
      {/* {level && <p className="job-level-unique">{t.Level}: {level}</p>} */}
      <p className="match-unique">{t.Matching}: {match_percentage}%</p>
      <div className="progress-container-unique">
        <div className="progress-bar-unique">
          <div className="progress-unique" style={{ width: `${match_percentage}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default function JobMatch() {
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const { top5Jobs } = useOutletContext() || {};
  const [selectedJobIndex, setSelectedJobIndex] = useState(0);

  const handleCardClick = (index) => {
    setSelectedJobIndex(index);
  };

  return (
    <div className="container-unique">
      <h1 className="job-container-title">{t.top5JobsTitle}</h1>
      <div className="job-container-new">

        <div className="job-content-unique">
          <div className="job-list-unique">

            {top5Jobs && top5Jobs.length > 0 ? (
              top5Jobs.map((job, index) => (
                <JobCard
                  key={index}
                  {...job}
                  onClick={() => handleCardClick(index)}
                  isSelected={selectedJobIndex === index}
                />
              ))
            ) : (
              <p className="no-jobs-unique">{t.NoJobRecommendations || "No job recommendations available."}</p>
            )}
          </div>
          {selectedJobIndex !== null && top5Jobs[selectedJobIndex] && (
            <div className="job-details-unique">
              <div className="skills-section-header">
                <h2>{top5Jobs[selectedJobIndex].title}</h2>
                {top5Jobs[selectedJobIndex].level && <p className="job-level-unique">{t.Level}: <strong>{top5Jobs[selectedJobIndex].level }</strong></p>}
              </div>


              <p className="description-unique">{top5Jobs[selectedJobIndex].description}</p>
              <div className="skills-section-header">
                  <h3>{t.MatchedSkills}</h3>
                </div>
              <div className="skills-section-unique">
                


                {top5Jobs[selectedJobIndex].matched_skills && top5Jobs[selectedJobIndex].matched_skills.length > 0 ? (
                  top5Jobs[selectedJobIndex].matched_skills.map((skill, idx) => (
                    <div className="matched-skill-unique" key={idx}>{skill}</div>
                  ))
                ) : (
                  <p>{t.NoMatchedSkills || "No matched skills available."}</p>
                )}

              </div>
                <div className="skills-section-header">
                  <h3>{t.MissingSkills}</h3>
                </div>
              <div className="skills-section-unique">
              
                {top5Jobs[selectedJobIndex].missing_skills && top5Jobs[selectedJobIndex].missing_skills.length > 0 ? (
                  top5Jobs[selectedJobIndex].missing_skills.map((skill, idx) => (
                    <div className="missing-skill-unique" key={idx}>{skill}</div>
                  ))
                ) : (
                  <p>{t.NoMissingSkills || "No missing skills identified."}</p>
                )}

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}