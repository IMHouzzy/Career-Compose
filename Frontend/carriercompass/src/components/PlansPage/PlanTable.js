import React, { useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";
import "../../styles/PlanPage/PlanTable.css";
import checkIcon from "../../images/check.png";
import crossIcon from "../../images/minus.png";

const plansTable = [
  {
    planName: "Free",
    planUse: "2",
    tablefeatures: {
      "Reklamos": true,
      "Bendrinė CV analizė": true,
      "Mokymosi kursai": true,
      "Išplėstinė CV analizė": false,
      "Personalizuoti mokymosi kursai": false,
      "Personalizuoti darbo pasiūlymai": false,
      "Galimas skirtingas CV įkėlimas": false,
    },
  },
  {
    planName: "Premium",
    planUse: "Neribotas",
    tablefeatures: {
      "Reklamos": false,
      "Bendrinė CV analizė": true,
      "Mokymosi kursai": true,
      "Išplėstinė CV analizė": true,
      "Personalizuoti mokymosi kursai": true,
      "Personalizuoti darbo pasiūlymai": true,
      "Galimas skirtingas CV įkėlimas": true,
    },
  },
];

const PricingTable = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  const allFeatures = Object.keys(plansTable[0].tablefeatures);

  return (
    <div className="pricing-page">
      <div className="plan-hero-container">
        <h3 className="plan-hero-subtitle">{translations[language].plansHeroTitle}</h3>
        <h1 className="plan-hero-title">{translations[language].plansHeroSubTitle}</h1>

      </div>
      <div className="pricing-table-container">
        <table className="pricing-table">
          <thead>
            <tr>
              <th>{t.featureColumnName}</th>
              {plansTable.map((plan, index) => (
                <th key={index}>{plan.planName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{t.usagePerMonth}</td>
              {plansTable.map((plan, index) => (
                <td className="feature-text" key={index}>
                  {plan.planUse === "Neribotas" ? t.unlimited : plan.planUse}
                </td>
              ))}
            </tr>
            {allFeatures.map((feature, index) => (
              <tr key={index}>
                <td>{t.featuresTable[feature] || feature}</td>
                {plansTable.map((plan, i) => (
                  <td key={i} className="feature-cell">
                    <img
                      src={plan.tablefeatures[feature] ? checkIcon : crossIcon}
                      alt={plan.tablefeatures[feature] ? "✔" : "❌"}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
  );
};

export default PricingTable;
