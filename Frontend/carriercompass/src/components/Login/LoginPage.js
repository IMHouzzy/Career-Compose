import React, { useState, useContext } from 'react';
import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";
import '../../styles/Profile/LoginPage.css';
import LoginInput from './LoginInput';
import LoginButton from './LoginButton';
import logo from '../../images/logo CareerCompass.svg';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const t = translations[language]; // Get translations for the selected language

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const data = {
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
    };

    console.log('Login attempt with:', data.email);

    try {
      const response = await fetch('http://127.0.0.1:8000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        setError(result.detail || 'Login failed. Please check your credentials.');
        console.error('Login error:', result);
        return;
      }
      
      console.log('Login successful:', result);
      
      // Save token to localStorage
      localStorage.setItem('token', result.access_token);
      localStorage.setItem('token_type', result.token_type);
      
      // Redirect to home page or dashboard
      navigate('/');
      
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred during login. Please try again.');
    }
  };

  return (
    <main className="login-page">
      <div className="login-container">
        <img
          src={logo}
          alt="Login page logo"
          className="login-logo"
        />

        <form onSubmit={handleSubmit} className="login-form" aria-label="Login form">
          {error && <div className="error-message">{error}</div>}
          
          <section className="form-section">
            <div className="input-wrapper">
              <LoginInput label={t.email} type="email" id="email" />
            </div>

            <div className="input-wrapper">
              <LoginInput label={t.password} type="password" id="password" />
            </div>
          </section>

          <div className="button-wrapper">
            <LoginButton />
          </div>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;
