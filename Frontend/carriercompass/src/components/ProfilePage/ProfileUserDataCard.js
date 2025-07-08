import React, { useState, useEffect, useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/Profile/ProfilePage.css";
import { useOutletContext } from "react-router-dom";


const ProfileForm = () => {
 const { userData } = useOutletContext();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");


  const { language } = useContext(LanguageContext);
  const t = translations[language];

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {

        setName(userData.name || "");
        setSurname(userData.last_name || "");
        setEmail(userData.email || "");
   
 }, [userData]);

  return (
    <div>
      <div className="personal-info-card">
        <div className="personal-info-header">
          <h2 className="personal-info-title">{t.personalInfoTitle}</h2>
          <button className="edit-button" onClick={() => navigate("/profile/edit-profile")}>
            <svg
              className="edit-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09c0 .7.4 1.34 1 1.51h.09c.46 0 .91-.16 1.27-.44l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09c0 .7.4 1.34 1 1.51H21a2 2 0 1 1 0 4h-.09c-.7 0-1.34.4-1.51 1z" />
            </svg>
            {t.editButton}
          </button>
        </div>

        <div className="personal-info-grid">
          <div className="info-item">
            <span className="info-label">{t.userName}</span>
            <span className="info-value">{name}</span>
          </div>
          <div className="info-item">
            <span className="info-label">{t.surname}</span>
            <span className="info-value">{surname}</span>
          </div>
          <div className="info-item">
            <span className="info-label">{t.email}</span>
            <span className="info-value">{email}</span>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ProfileForm;
