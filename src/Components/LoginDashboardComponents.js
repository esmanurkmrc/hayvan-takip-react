import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginDashboardComponents.css';

const LoginDashboardPage = () => {
  const navigate = useNavigate();

  const goToLogin = (role) => {
    navigate(`/auth?v=${role}`);
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-logo-side">
        <img
          src="/ChatGPT Image 9 May 2025 23_33_50.png"
          alt="Çiftlik Takip Sistemi Logo"
          className="dashboard-logo-img"
        />
      </div>
      <div className="dashboard-content-side">
        <h1>ÇİFTLİK TAKİP SİSTEMİ</h1>
        <p>Lütfen giriş türünüzü seçin:</p>
        <div className="dashboard-buttons">
          <button onClick={() => goToLogin('vet')}>Veteriner Girişi</button>
          <button onClick={() => goToLogin('ciftci')}>Çiftçi Girişi</button>
        </div>
      </div>
    </div>
  );
};

export default LoginDashboardPage;
