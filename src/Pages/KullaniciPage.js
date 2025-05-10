import React from "react";
import { useNavigate } from "react-router-dom";
import "./KullaniciPage.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const KullaniciPage = () => {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Kullanıcı Bilgileri", path: "/kullanici-bilgileri" },
    { label: "Hayvanlar", path: "/hayvanlar" },
    { label: "Aşı Takvimi", path: "/asi-takvimi" },
    { label: "Hastalıklar", path: "/hastaliklar" },
    { label: "Randevular", path: "/randevular" },
    { label: "Üretim", path: "/uretim" },
    { label: "Satışlar", path: "/satislar" },
    { label: "İlaçlar", path: "/ilaclar" },
    { label: "Finans", path: "/finans-panel" } 
  ];

  const chartData = [
    { name: "Ocak", hayvanSayisi: 45, gelir: 12500 },
    { name: "Şubat", hayvanSayisi: 48, gelir: 14000 },
    { name: "Mart", hayvanSayisi: 50, gelir: 15500 }
  ];

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Kullanıcı Paneli</h2>
        {menuItems.map((item, i) => (
          <button
            key={i}
            onClick={() => navigate(item.path)}
            className="menu-button"
          >
            {item.label}
          </button>
        ))}
        <div className="chat-box">
          <h3>Canlı Sohbet</h3>
          <div className="chat">
            <p><strong>Veteriner:</strong> Aşı takvimi güncellendi.</p>
            <p><strong>Kullanıcı:</strong> Teşekkürler!</p>
          </div>
        </div>
      </div>

      <div className="content">
        <h2>İstatistikler</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="hayvanSayisi" fill="#82ca9d" name="Hayvan Sayısı" />
              <Bar dataKey="gelir" fill="#8884d8" name="Gelir (₺)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <h2>Mesajlar</h2>
        <div className="messages">
          <p><strong>Sistem:</strong> Yeni randevunuz var.</p>
          <p><strong>Sistem:</strong> Bugün süt üretim kaydı girildi.</p>
        </div>
      </div>
    </div>
  );
};

export default KullaniciPage;
