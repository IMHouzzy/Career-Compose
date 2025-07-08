import React, { useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";
import "../../styles/DragAndDrop/ToggleButtons.css";
const ToggleButtons = ({ activeButton, setActiveButton }) => {
  const { language } = useContext(LanguageContext);
  const t = translations[language] 

  return (
    <div className="button-group">
      <div className={`toggle-background ${activeButton === "it-job" ? "slide-right" : "slide-left"}`}></div>
      <button
        onClick={() => setActiveButton("it-job")}
        className={`toggle-button ${activeButton === "it-job" ? "active" : ""}`}
      >
        {t.selectITJob}
      </button>
      <button
        onClick={() => setActiveButton("general")}
        className={`toggle-button ${activeButton === "general" ? "active" : ""}`}
      >
        {t.general}
      </button>
    </div>
  );
};

export default ToggleButtons;
