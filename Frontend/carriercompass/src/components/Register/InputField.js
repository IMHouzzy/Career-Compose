import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../../styles/Profile/InputField.css';

const InputField = ({ label, type = "text", id, required = true, error }) => {
  const [showPassword, setShowPassword] = useState(false);

  // Determine actual input type
  const isPasswordField = type === "password";
  const inputType = isPasswordField && showPassword ? "text" : type;

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="input-container">
      <label htmlFor={id} className="input-label">
        {label}
      </label>

      <div className="input-with-icon">
        <input
          type={inputType}
          id={id}
          name={id}
          required={required}
          className={`input-field ${error ? 'input-error' : ''}`}
          aria-label={label}
          aria-invalid={error ? 'true' : 'false'}
        />
        {isPasswordField && (
          <span className="toggle-password" onClick={toggleShowPassword}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        )}
      </div>

      {error && <div className="error-text">{error}</div>}
    </div>
  );
};

export default InputField;
