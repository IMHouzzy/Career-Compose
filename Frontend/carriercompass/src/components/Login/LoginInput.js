import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../../styles/Profile/InputField.css';

const LoginInput = ({ label, type = "text", id, required = true }) => {
  const [showPassword, setShowPassword] = useState(false);

  // Check if this is a password field
  const isPasswordField = type === "password";
  // If password and showPassword is true, input type is text, else original type
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
          className="input-field"
          aria-label={label}
        />
        {isPasswordField && (
          <span className="toggle-password" onClick={toggleShowPassword} style={{ cursor: 'pointer' }}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        )}
      </div>
    </div>
  );
};

export default LoginInput;
