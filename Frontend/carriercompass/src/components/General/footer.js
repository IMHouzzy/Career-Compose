import React, { useContext } from "react";
import "../../styles/General/Footer.css";
import logo2 from "../../images/logo CareerCompass white.svg";
import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";

const Footer = () => {
      const { language } = useContext(LanguageContext);
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* AI TOOL Section */}
        <div className="footer-section">
          <div className="logo-container2">
            <a href="/"><img src={logo2} alt="CareerCompass Logo2" className="logo2" /></a>
            </div>
        </div>

        {/* Pagalba Section */}
        <div className="footer-section">
         
          <ul className="footer-list">
       
          </ul>
        </div>

        {/* Kontaktai Section */}
        <div className="footer-section"id="kontaktai">
          <div className="footer-title">{translations[language].contact}</div>
          <p className="footer-text-conntact"><strong>{translations[language].address}:</strong> Laisvės al. 12, Kaunas</p>
          <p className="footer-text-conntact"><strong>{translations[language].phoneNumber}:</strong> +370 612 34567</p>
          <p className="footer-text-conntact"><strong>{translations[language].email}:</strong> info@puslapis.lt</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
