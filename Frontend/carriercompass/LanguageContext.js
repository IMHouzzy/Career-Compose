import React, { createContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const storedLang = localStorage.getItem("lang");
  const [language, setLanguage] = useState(storedLang ? storedLang : "en");

  useEffect(() => {
    if (language) {
      localStorage.setItem("lang", language);
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};


export default LanguageContext;
