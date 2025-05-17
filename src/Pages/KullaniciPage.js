import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./KullaniciPage.css";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const KullaniciPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const menuItems = [
    { label: "Kullanıcı Bilgileri", path: "/kullanici-bilgileri" },
    { label: "Hayvanlar", path: "/hayvanlar" },
    { label: "Aşı Takvimi", path: "/asi-takvimi" },
    { label: "Hastalıklar", path: "/hastaliklar" },
    { label: "Randevular", path: "/randevular" },
    { label: "Üretim", path: "/uretim" },
    { label: "Satışlar", path: "/satislar" },
    { label: "İlaçlar", path: "/ilaclar" },
    { label: "Finans", path: "/finans-panel" },
    { label: "Yem Stok Takibi", path: "/yem-stok" },
    { label: "Veteriner Görev Dağılımı", path: "/veteriner-takim" },
    { label: "Beslenme Programı", path: "/beslenme" }
  ];

  const chartData = [
    { name: "Ocak", hayvanSayisi: 45 },
    { name: "Şubat", hayvanSayisi: 48 },
    { name: "Mart", hayvanSayisi: 50 }
  ];

  const chartData3 = [
    { name: "Ocak", gelir: 12500 },
    { name: "Şubat", gelir: 14000 },
    { name: "Mart", gelir: 15500 }
  ];

  const chartData2 = [
    { name: "Ocak", yemStok: 320 },
    { name: "Şubat", yemStok: 280 },
    { name: "Mart", yemStok: 250 }
  ];

  return (
    <div className="dashboard-container" style={{ background: "linear-gradient(to right, #fdf6f0, #fffdf9)", color: "#4e342e" }}>
      <div className="topbar" style={{ backgroundColor: "#5d4037", color: "white", padding: "10px 20px" }}>
        <p>Hoş geldiniz, <strong>{email}</strong></p>
      </div>

      <div className="sidebar" style={{ backgroundColor: "#fbe9e7", padding: "20px", width: "250px" }}>
        <h2 style={{ color: "#6d4c41", textAlign: "center" }}>Kullanıcı Paneli</h2>
        {menuItems.map((item, i) => (
          <button
            key={i}
            onClick={() => navigate(item.path)}
            style={{
              backgroundColor: "#a1887f",
              color: "white",
              border: "none",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            {item.label}
          </button>
        ))}
        <div className="chat-box" style={{ backgroundColor: "#fff", padding: "10px", border: "1px solid #d7ccc8", borderRadius: "8px" }}>
          <h3 style={{ color: "#4e342e" }}>Canlı Sohbet</h3>
          <div className="chat">
            <p><strong>Veteriner:</strong> Aşı takvimi güncellendi.</p>
            <p><strong>Kullanıcı:</strong> Teşekkürler!</p>
          </div>
        </div>
      </div>

      <div className="content" style={{ flex: 1, padding: "60px 40px" }}>
        <h2>Hayvan Sayısı</h2>
        <div className="chart-container" style={{ backgroundColor: "#fffdf9", padding: "20px", borderRadius: "10px", marginBottom: "40px" }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="hayvanSayisi" fill="#795548" name="Hayvan Sayısı" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <h2>Gelirler</h2>
        <div className="chart-container" style={{ backgroundColor: "#fffdf9", padding: "20px", borderRadius: "10px", marginBottom: "40px" }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData3}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="gelir" fill="#9c27b0" name="Gelir (₺)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <h2>Yem Stok Takibi</h2>
        <div className="chart-container" style={{ backgroundColor: "#fffdf9", padding: "20px", borderRadius: "10px" }}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData2}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="yemStok" stroke="#ff9800" name="Yem Stok (kg)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <h2>Mesajlar</h2>
        <div className="messages" style={{ backgroundColor: "#fff", padding: "15px", border: "1px solid #e0e0e0", borderRadius: "8px" }}>
          <p><strong>Sistem:</strong> Yeni randevunuz var.</p>
          <p><strong>Sistem:</strong> Bugün süt üretim kaydı girildi.</p>
        </div>
      </div>
    </div>
  );
};

export default KullaniciPage;
