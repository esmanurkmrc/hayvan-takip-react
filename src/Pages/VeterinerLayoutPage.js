import React from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  FaUserMd, FaPills, FaSyringe, FaCalendarAlt, FaNotesMedical, FaVirus, FaSignOutAlt, FaUtensils,FaHippo,
  FaUsers,
  FaCapsules,FaClipboardList ,FaEdit ,FaClipboardCheck
} from "react-icons/fa";
import "./VeterinerLayoutPage.css";

const menuItems = [
  { label: "Veteriner Bilgileri", path: "/veterinerbilgileri", icon: <FaUserMd /> },
  { label: "İlaçlar", path: "/ilaclar-vet", icon: <FaPills /> },
  { label: "Aşı Takvimi", path: "/asi-takvimi-vet", icon: <FaSyringe /> },
  { label: "Randevu Takvimi", path: "/randevular-vet", icon: <FaCalendarAlt /> },
  { label: "Hastalıklar", path: "/hastaliklar-vet", icon: <FaNotesMedical /> },
  { label: "Salgın Hastalıklar", path: "/salgin-hastaliklar", icon: <FaVirus /> },
  { label: "Beslenme", path: "/beslenme-vet", icon: <FaUtensils /> },
  { label: "Hayvanlar", path: "/hayvanlar-vet", icon: <FaHippo /> },
  { label: "Veteriner Takım Yönetimi", path: "/veteriner-takim-vet", icon: <FaUsers /> },
  { label: "İlaç Stok Takibi", path: "/stok-takip", icon: <FaCapsules /> },
  { label: "Yapılacaklar", path: "/yapilacaklar", icon: <FaClipboardList /> },
  { label: "Bilgi Yönetimi", path: "/hayvancilik-bilgi-yonetimi", icon: <FaEdit /> },
   { label: "SSS Cevapla", path: "/sss-cevapla", icon: <FaClipboardCheck /> },



];

const VeterinerLayoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate("/veteriner-giris");
  };

  return (
    <div className="veteriner-layout">
      <aside className="sidebar">
        <h2 className="sidebar-title"> Veteriner Paneli</h2>
        <ul className="menu-list">
          {menuItems.map((item, i) => (
            <li
              key={i}
              className={`menu-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="icon">{item.icon}</span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> <span>Çıkış</span>
        </button>
      </aside>

      <main className="veteriner-content">
        <Outlet /> 
      </main>
    </div>
  );
};

export default VeterinerLayoutPage;
