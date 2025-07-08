import React, { useContext } from "react";
import "../../styles/HomePage/HowToUse.css";
import UploadPurple from "../../images/UploadPurple.png";
import Brains from "../../images/brain-circuit.png";
import Assessment from "../../images/assessment.png";
import Job from "../../images/business-growth.png";
import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";

const HowToUse = () => {
  const { language } = useContext(LanguageContext);
  const steps = translations[language].steps.map((step, index) => ({
    ...step,
    image: [UploadPurple, Brains, Assessment, Job][index], // Add images dynamically
  }));
  return (
    <div className="how-to-use-container">
      <h1 className="title">{translations[language].HowToUseTitle}</h1>
      <div className="timeline">
        <div className="timeline-line"></div>
        {steps.map((step, index) => (
          <div key={step.id} className={`step-container ${index % 2 === 0 ? "left" : "right"}`}>
            <div className="step-content">
              <div className="step-number">{step.id} {translations[language].Step}</div>
              <h2>{step.title}</h2>
              <p>{step.description}</p>
            </div>
            <div className="step-icon">
              <img src={step.image} alt={`Step ${step.id}`} />
            </div>
            <div className="timeline-circle"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowToUse;