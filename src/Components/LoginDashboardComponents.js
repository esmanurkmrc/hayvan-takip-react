import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginDashboardComponents.css';

const LoginDashboardPage = () => {
  const navigate = useNavigate();

  const goToLogin = (role) => {
    if (role === 'vet') {
      navigate('/auth/vet');
    } else if (role === 'ciftci') {
      navigate('/auth');
    }
  };

  return (
    <div className="dashboard-full-wrapper">
     
      <video autoPlay loop muted className="dashboard-full-video">
        <source src="/1vi.mp4" type="video/mp4" />
        Tarayıcınız video etiketini desteklemiyor.
      </video>

      
      <div className="dashboard-overlay-content">
        <div className="dashboard-buttons-top">
          <button onClick={() => goToLogin('vet')}>Veteriner Girişi</button>
          <button onClick={() => goToLogin('ciftci')}>Çiftçi Girişi</button>
        </div>
        <div className="dashboard-main-text">
          <h1>HAYVAN TAKİP SİSTEMİ</h1>
         
        </div>
      </div>
    </div>
  );
};

export default LoginDashboardPage;
