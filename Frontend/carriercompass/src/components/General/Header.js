import React, { useState, useEffect, useRef, useContext } from "react";
import "../../styles/General/Header.css";
import logo from "../../images/logo CareerCompass.svg";
import translations from "../../translations";
import enFlag from "../../images/flags/en.png";
import ltFlag from "../../images/flags/lt.png";
import { LanguageContext } from "../../context/LanguageContext"; // Import context

const flags = { en: enFlag, lt: ltFlag };

const Header = () => {
  const { language, setLanguage } = useContext(LanguageContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setIsDropdownOpen(false);
  };

  return (
    <div className={`header-container ${scrolled ? "scrolled" : ""}`}>
      <div className="header">
        <div className="logo-container">
          <a href="/">
            <img src={logo} alt="CareerCompass Logo" className="logo" />
          </a>
        </div>

        {/* Hamburger Menu */}
        <div className="hamburger" onClick={() => setMenuOpen((prev) => !prev)}>
          ☰
        </div>

        {/* Navigation Links (Desktop) */}
        <div className="nav-links">
          <a href="/" className="nav-item">{translations[language].home}</a>
          <a href="/Plan" className="nav-item">{translations[language].plans}</a>
          <a href="#kontaktai" className="nav-item">{translations[language].contact}</a>
          <a href="/AllCoursesList" className="nav-item">{translations[language].allCourses}</a>
          <a href="/ALLJobList" className="nav-item">{translations[language].allJobs}</a>
          <a href="/results/CVRecommendationsPage" className="nav-item">Results</a>
        </div>

        {/* Account Button & Language Selector */}
        <div className="right-container">
          <div className="account-button">
            <a href="/profile/user-data" className="account-button-text">{translations[language].account}</a>
          </div>
          <div className="language-dropdown" ref={dropdownRef}>
            <button
              className={`language-button ${isDropdownOpen ? "open" : ""}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img src={flags[language]} alt={language} className="flag-icon" />
              {language.toUpperCase()} <span className="arrow">▼</span>
            </button>
            <div className={`language-menu ${isDropdownOpen ? "open" : ""}`}>
              <div className="language-option" onClick={() => changeLanguage("en")}>
                <img src={enFlag} alt="English" className="flag-icon" /> EN
              </div>
              <div className="language-option" onClick={() => changeLanguage("lt")}>
                <img src={ltFlag} alt="Lithuanian" className="flag-icon" /> LT
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${menuOpen ? "open" : ""}`} ref={menuRef}>
          <a href="/" className="nav-item" onClick={() => setMenuOpen(false)}>{translations[language].home}</a>
          <a href="/Plan" className="nav-item" onClick={() => setMenuOpen(false)}>{translations[language].plans}</a>
          <a href="#kontaktai" className="nav-item" onClick={() => setMenuOpen(false)}>{translations[language].contact}</a>
          <a href="/dragAndDrop" className="nav-item" onClick={() => setMenuOpen(false)}>{translations[language].tool}</a>
          <a href="/profile/user-data" className="nav-item" onClick={() => setMenuOpen(false)}>{translations[language].account}</a>

          <div className="account-button">
            <a href="/profile/user-data" className="account-button-text">{translations[language].account}</a>
          </div>
          <div className="language-dropdown" ref={dropdownRef}>
            <button
              className={`language-button ${isDropdownOpen ? "open" : ""}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img src={flags[language]} alt={language} className="flag-icon" />
              {language.toUpperCase()} <span className="arrow">▼</span>
            </button>
            <div className={`language-menu ${isDropdownOpen ? "open" : ""}`}>
              <div className="language-option" onClick={() => changeLanguage("en")}>
                <img src={enFlag} alt="English" className="flag-icon" /> EN
              </div>
              <div className="language-option" onClick={() => changeLanguage("lt")}>
                <img src={ltFlag} alt="Lithuanian" className="flag-icon" /> LT
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

  );
};

export default Header;
