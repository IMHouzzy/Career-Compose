import React, { useState, useEffect, useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";
import "../../styles/ResultsPage/CV-recommendations.css";

const CVRecommendations = ({ analysisData }) => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  const [cvTips, setCvTips] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [checkedItems, setCheckedItems] = useState([]);

  useEffect(() => {
    if (analysisData?.cv_tips) {
      setCvTips(analysisData.cv_tips);
      setCheckedItems(new Array(analysisData.cv_tips.length).fill(false));
    }
  }, [analysisData]);

  const toggleCheckbox = (index) => {
    const updated = [...checkedItems];
    updated[index] = !updated[index];
    setCheckedItems(updated);
  };

  const selectedTip = cvTips[selectedIndex] || {};

  return (
    <div className="cv-recommendations-container">
      <h1 className="cv-recommendations-title">{t.CVRecommendationsTitle}</h1>
      <div className="fade-in">
        {/* Top Summary Section */}
        <div className="cv-summary-box">
          <p className="cv-match-level"><strong>{t.matchLevel}:</strong> {analysisData?.match_level || "-"}</p>
          <p><strong>{t.summaryAnalysis}:</strong> {analysisData?.summary_analysis || "-"}</p>
        </div>

        {/* Split Layout */}
        <div className="cv-split-layout">
          {/* Tips List */}
          <div className="cv-tips-list">
            {cvTips.map((tip, index) => (
              <div
                key={index}
                className={`cv-tip-card ${selectedIndex === index ? "selected" : ""}`}
                onClick={() => setSelectedIndex(index)}
              >
                <input
                  type="checkbox"
                  checked={checkedItems[index] || false}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleCheckbox(index);
                  }}
                  className="cv-recommendation-checkbox"
                />
                <span className="cv-tip-title">{tip.tip}</span>
              </div>
            ))}
          </div>

          {/* Description Display */}
          <div className="cv-tip-details">


            <div className="cv-tip-details-header">
              <h2 className="cv-tip-details-title">{selectedTip.tip}</h2>
            </div>
            <p className="cv-tip-details-desc">{selectedTip.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVRecommendations;
