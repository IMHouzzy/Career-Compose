import React, { useContext } from 'react';
import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";
import '../../styles/Profile/RegisterButton.css';

const RegisterButton = ({ isSubmitting }) => {
  const { language } = useContext(LanguageContext);
  const t = translations[language]; // Get translations for the selected language
  return (
    <button
      type="submit"
      className="register-button"
      aria-label="Register account"
      disabled={isSubmitting}
    >
      {isSubmitting ?  t.registering : t.register}
    </button>
  );
};

export default RegisterButton; 