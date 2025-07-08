import React, { useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";
import "../../styles/HomePage/Features.css"; // Ensure CSS is linked

// SVG Animated Icon
const BrainCircuitIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide-brain-circuit-icon lucide-brain-circuit animated-icon" // Add your class here
  >
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
    <path d="M9 13a4.5 4.5 0 0 0 3-4" />
    <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
    <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
    <path d="M6 18a4 4 0 0 1-1.967-.516" />
    <path d="M12 13h4" />
    <path d="M12 18h6a2 2 0 0 1 2 2v1" />
    <path d="M12 8h8" />
    <path d="M16 8V5a2 2 0 0 1 2-2" />
    <circle cx="16" cy="13" r=".5" />
    <circle cx="18" cy="3" r=".5" />
    <circle cx="20" cy="21" r=".5" />
    <circle cx="20" cy="8" r=".5" />
  </svg>
);

const BooksIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-book-copy-icon lucide-book-copy animated-icon">
    <path d="M2 16V4a2 2 0 0 1 2-2h11" />
    <path d="M22 18H11a2 2 0 1 0 0 4h10.5a.5.5 0 0 0 .5-.5v-15a.5.5 0 0 0-.5-.5H11a2 2 0 0 0-2 2v12" />
    <path d="M5 14H4a2 2 0 1 0 0 4h1" /></svg>
);

const ChartIcon = () => (

  <svg xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-chart-column-increasing-icon lucide-chart-column-increasing animated-icon" >
    <path d="M13 17V9" /><path d="M18 17V5" /><path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="M8 17v-3" /></svg>
);
const CaseIcon = () => (

  <svg xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-briefcase-icon lucide-briefcase animated-icon">
    <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    <rect width="20" height="14" x="2" y="6" rx="2" /></svg>
);

const Card = ({ title, description, icon }) => {
  return (
    <div className="features-card">
      <div className="features-icon">{icon}</div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
};

const Features = () => {
  const { language } = useContext(LanguageContext);
  const services = translations[language].features.map((feature, index) => ({
    ...feature,
    icon: [<BrainCircuitIcon />, <ChartIcon />, <BooksIcon />, <CaseIcon />][index], // Assign icons dynamically
  }));

  return (
    <div className="features-container">
      <h1>{translations[language].featuresTitle}</h1>
      <div className="features-grid-wrapper">
        <div className="features-grid">
          {services.map((service, index) => (
            <Card key={index} title={service.title} description={service.description} icon={service.icon} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
