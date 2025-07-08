import React, { useContext } from 'react';
import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";
import '../../styles/Profile/LoginButton.css';
import { Link } from 'react-router-dom';

const LoginButton = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language]; // Get translations for the selected language
  return (
    <div className="login-actions">
      <Link to="/register" className="register-link">
        {t.regRedir}
      </Link>
      
      <button
        type="submit"
        className="login-button"
        aria-label="Login to account"
      >
       {t.signIn}
      </button>
      
      <Link 
        to="#" 
        className="forgot-password-link"
        onClick={(e) => {
          e.preventDefault();
          alert('Password reset functionality coming soon');
        }}
      >
        {t.forgotPass}
      </Link>
    </div>
  );
};

export default LoginButton;
  