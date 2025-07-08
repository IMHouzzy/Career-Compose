import React, { useState, useEffect, useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";
import axios from "axios";

import "../../styles/Profile/ProfilePage.css";
import "../../styles/Profile/PasswordEye.css";
import { useOutletContext } from "react-router-dom";

import { FaEye, FaEyeSlash } from "react-icons/fa";

const ProfileForm = () => {
  const { userData } = useOutletContext();
  const [name, setName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const [changePassword, setChangePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatNewPassword, setShowRepeatNewPassword] = useState(false);

  const { language } = useContext(LanguageContext);
  const t = translations[language];

  const token = localStorage.getItem("token");

  useEffect(() => {
    setName(userData.name || "");
    setLastName(userData.last_name || "");
    setEmail(userData.email || "");
  }, [userData]);

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (changePassword) {
      if (newPassword !== repeatNewPassword) {
        setError(t.passwordMismatch || "Passwords mismatch");
        setLoading(false);
        return;
      }
      if (!validatePassword(newPassword)) {
        setError(t.weakPassword ||
          "Password must be at least 6 characters long, contain at least 1 upper case letter and special symbol."
        );
        setLoading(false);
        return;
      }
    }

    try {
      const payload = {
        token,
        name,
        last_name,
        email,
        current_password: changePassword ? currentPassword : null,
        new_password: changePassword ? newPassword : null,
        repeat_password: changePassword ? repeatNewPassword : null,
      };

      const response = await axios.put("http://localhost:8000/user/user_update", payload);
      alert("Paskyros informacija sėkmingai atnaujinta!");
      setChangePassword(false);
    } catch (error) {
      setError("Klaida: " + (error.response?.data?.detail || error.message));
    }

    setLoading(false);
  };

  return (
    <form className="personal-info-card" onSubmit={handleSubmit}>
      <div className="personal-info-header">
        <h2 className="personal-info-title">{t.editTitle}</h2>
      </div>

      <div className="personal-info-grid">
        <div className="info-item">
          <label className="info-label" htmlFor="name">{t.userName}</label>
          <input
            id="name"
            type="text"
            className="input-modern"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="info-item">
          <label className="info-label" htmlFor="surname">{t.surname}</label>
          <input
            id="last_name"
            type="text"
            className="input-modern"
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div className="info-item">
          <label className="info-label" htmlFor="email">{t.email}</label>
          <input
            id="email"
            type="email"
            className="input-modern"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="info-item" style={{ gridColumn: "1 / -1" }}>
          <div className="personal-info-header">
            <h2 className="personal-info-title">{t.editChangePasswordTitle}</h2>
          </div>
          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="info-item">
          <label className="info-label" htmlFor="current-password">{t.editCurrentPassword}</label>
          <div className="input-wrapper">
            <input
              id="current-password"
              type={showCurrentPassword ? "text" : "password"}
              className="input-modern with-icon"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={!changePassword}
            />
              <span
                className="icon-eye"
                onClick={() => setShowCurrentPassword(prev => !prev)}
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
          </div>
        </div>

        <div className="info-item">
          <label className="info-label" htmlFor="new-password">{t.editNewPassword}</label>
          <div className="input-wrapper">
            <input
              id="new-password"
              type={showNewPassword ? "text" : "password"}
              className="input-modern with-icon"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={!changePassword}
            />
            <span
              className="icon-eye"
              onClick={() => setShowNewPassword(prev => !prev)}
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <div className="info-item">
          <label className="info-label" htmlFor="repeat-password">{t.editRepeatNewPassword}</label>
          <div className="input-wrapper">
            <input
              id="repeat-password"
              type={showRepeatNewPassword ? "text" : "password"}
              className="input-modern with-icon"
              value={repeatNewPassword}
              onChange={(e) => setRepeatNewPassword(e.target.value)}
              disabled={!changePassword}
            />
            <span
              className="icon-eye"
              onClick={() => setShowRepeatNewPassword(prev => !prev)}
            >
              {showRepeatNewPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
      </div>

      <div className="edit-button-container">
        <label className="custom-checkbox-label">
          <input
            type="checkbox"
            className="custom-checkbox"
            checked={changePassword}
            onChange={() => {
              const newValue = !changePassword;
              setChangePassword(newValue);
              if (!newValue) {
                setCurrentPassword("");
                setNewPassword("");
                setRepeatNewPassword("");
              }
            }}
          />
          {t.editChangePasswordTitle}
        </label>

        <button type="submit" className="edit-button" disabled={loading}>
          {loading ? t.saving : t.saveChanges}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
