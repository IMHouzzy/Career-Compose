import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";
import '../../styles/HomePage/BottomHeader.css';

const BottomHeader = () => {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate(); // Initialize navigate
  return (
    <div className="bottom-header-container">
      <div className="bottom-header-header-text">
        {translations[language].bottomHeaderText}
      </div>
      <div className="bottom-header-button-container">
        <button className="bottom-header-button" onClick={() => navigate("/dragAndDrop")}>{translations[language].heroButton}</button>
      </div>
    </div>
  );
};

export default BottomHeader;
