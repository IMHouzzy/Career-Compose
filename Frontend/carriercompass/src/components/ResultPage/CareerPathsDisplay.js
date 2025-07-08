import "../../styles/ResultsPage/CareerPathsDisplay.css"; // Updated CSS file
import { useOutletContext } from "react-router-dom";
import { useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";

const CareerPathsDisplay = () => {
  const { language } = useContext(LanguageContext);
  const { careerPaths } = useOutletContext() || { careerPaths: [] }; // Default to empty array if undefined
   const t = translations[language];

  return (
    <div className="career-path-container">

      <h2 className="career-path-title">{t.yourCareerPaths}</h2>
      <div className="career-path-content">
        {careerPaths.length > 0 ? (
          <div className="career-paths-list">
            {careerPaths.map((pathObj, index) => (
              <div key={index} className="career-path-item">
                <div className="career-path-header">
                  <h3 className="career-path-name">{pathObj.path}</h3>
                </div>
                <p className="career-path-description">{pathObj.description}</p>
                <div className="career-path-timeline">
                  <div className="career-path-header">
                    <h3>{t.careerPathsteps}</h3>
                  </div>
                  {pathObj.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="career-path-step-wrapper">
                      <div className="career-path-step-bubble"></div>
                      {stepIndex < pathObj.steps.length - 1 && (
                        <div className="career-path-step-line"></div>
                      )}
                      <div className="career-path-step-content">
                        <span className="career-path-step-text">{step}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-career-paths">{t.noCareerPathsAvailable}</p>
        )}
      </div>
    </div>
  );
};

export default CareerPathsDisplay;