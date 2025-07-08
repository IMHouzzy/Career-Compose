import { createContext, useContext, useState, useCallback } from "react";
import ErrorToast from "./components/Error/ErrorToast";

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [message, setMessage] = useState("");

  const showError = useCallback((msg) => {
    setMessage(msg);
  }, []);

  const handleClose = () => setMessage("");

  return (
    <ErrorContext.Provider value={{ showError }}>
      {children}
      <ErrorToast message={message} onClose={handleClose} />
    </ErrorContext.Provider>
  );
};

export const useError = () => useContext(ErrorContext);
