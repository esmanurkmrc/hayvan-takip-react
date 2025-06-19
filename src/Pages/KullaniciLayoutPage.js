import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FaUser, FaDog, FaSyringe, FaNotesMedical, FaVirus, FaCalendarAlt,
  FaChartLine, FaShoppingCart, FaPills, FaWallet, FaWarehouse, FaUsersCog, FaUtensils,
  FaSignOutAlt,FaTemperatureHigh,FaBookOpen,FaQuestionCircle
} from "react-icons/fa";
import "./KullaniciLayoutPage.css";



const menuItems = [
  { label: "Kullanıcı", path: "/kullanici-bilgileri", icon: <FaUser /> },
  { label: "Hayvanlar", path: "/hayvanlar", icon: <FaDog /> },
  { label: "Aşı", path: "/asi-takvimi", icon: <FaSyringe /> },
  { label: "Hastalıklar", path: "/hastaliklar", icon: <FaNotesMedical /> },
  { label: "Salgın hastalıklar", path: "/salgin-hastaliklark", icon: <FaVirus /> },
  { label: "Randevular", path: "/randevular", icon: <FaCalendarAlt /> },
  { label: "Üretim", path: "/uretim", icon: <FaChartLine /> },
  { label: "Satışlar", path: "/satislar", icon: <FaShoppingCart /> },
  { label: "İlaçlar", path: "/ilaclar", icon: <FaPills /> },
  { label: "Finans", path: "/finans-panel", icon: <FaWallet /> },
  { label: "Yem", path: "/yem-stok", icon: <FaWarehouse /> },
 /* { label: "Görev", path: "/veteriner-takim", icon: <FaUsersCog /> },*/
  { label: "Beslenme", path: "/beslenme", icon: <FaUtensils /> },
   /*{ label: "Hastalik Belirtileri", path: "/hastalik-belirti", icon: <FaUtensils /> },*/
    { label: "İklim Verisi", path: "/iklim-verisi", icon: <FaTemperatureHigh /> },
    { label: "Hayvancılık Bilgisi", path: "/hayvancilik-bilgi", icon: <FaBookOpen /> },
    { label: " Sık Sorulan Sorular", path: "/sss", icon: <FaQuestionCircle /> }


];

const KullaniciLayoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    
    navigate("/veteriner-giris"); 
  };

  return (
    <div className="layout-container">


      <div className="main-layout">
        <aside className="sidebar">
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.path)}
              className={`sidebar-item ${location.pathname === item.path ? "active" : ""}`}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </button>
          ))}

         
          <button className="sidebar-item logout-button" onClick={handleLogout}>
            <span className="icon"><FaSignOutAlt /></span>
            <span className="label">Çıkış</span>
          </button>
        </aside>

        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default KullaniciLayoutPage;
