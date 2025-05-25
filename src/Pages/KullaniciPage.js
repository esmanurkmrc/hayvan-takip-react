import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import "./KullaniciPage.css";
import { FaPaw, FaSyringe, FaChartLine, FaMoon, FaSun } from "react-icons/fa";

const COLORS_HAYVAN = ["#34d399", "#60a5fa", "#facc15"];
const COLORS_GELIR = ["#f472b6", "#fb923c", "#a78bfa"];

const KullaniciPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const toggleTheme = () => setDarkMode(!darkMode);

  const menuItems = [
    { label: "Kullanıcı Bilgileri", path: "/kullanici-bilgileri" },
    { label: "Hayvanlar", path: "/hayvanlar" },
    { label: "Aşı Takvimi", path: "/asi-takvimi" },
    { label: "Hastalıklar", path: "/hastaliklar" },
    { label: "Salgın Hastalıklar", path: "/salgin-hastaliklark" },
    { label: "Randevular", path: "/randevular" },
    { label: "Üretim", path: "/uretim" },
    { label: "Satışlar", path: "/satislar" },
    { label: "İlaçlar", path: "/ilaclar" },
    { label: "Finans", path: "/finans-panel" },
    { label: "Yem Stok Takibi", path: "/yem-stok" },
    { label: "Veteriner Görev Dağılımı", path: "/veteriner-takim" },
    { label: "Beslenme Programı", path: "/beslenme" }
  ];

  const chartDataHayvan = [
    { name: "Ocak", value: 45 },
    { name: "Şubat", value: 48 },
    { name: "Mart", value: 50 }
  ];

  const chartDataGelir = [
    { name: "Ocak", value: 12500 },
    { name: "Şubat", value: 14000 },
    { name: "Mart", value: 15500 }
  ];

  const chartDataYem = [
    { name: "Ocak", yemStok: 320 },
    { name: "Şubat", yemStok: 280 },
    { name: "Mart", yemStok: 250 }
  ];

  return (
    <div className={`dashboard-container ${darkMode ? "dark" : ""}`}>
      
      <div className="topbar">
        <p>Hoş geldiniz, <strong>{email}</strong></p>
        <button onClick={toggleTheme} className="theme-toggle">
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

    
      <div className="sidebar">
        <h2>Kullanıcı Paneli</h2>
        {menuItems.map((item, i) => (
          <button
            key={i}
            onClick={() => navigate(item.path)}
            className={location.pathname === item.path ? "active" : ""}
          >
            {item.label}
          </button>
        ))}
      </div>

     
      <div className="content">
       
        <div className="chart-row">
          <div className="chart-container">
            <h3><FaPaw /> Hayvan Sayısı</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={chartDataHayvan} dataKey="value" nameKey="name" outerRadius={90} label>
                  {chartDataHayvan.map((entry, i) => (
                    <Cell key={`hayvan-${i}`} fill={COLORS_HAYVAN[i % COLORS_HAYVAN.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3><FaChartLine /> Gelirler</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={chartDataGelir} dataKey="value" nameKey="name" outerRadius={90} label>
                  {chartDataGelir.map((entry, i) => (
                    <Cell key={`gelir-${i}`} fill={COLORS_GELIR[i % COLORS_GELIR.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      
        <div className="chart-container">
          <h3><FaSyringe /> Yem Stok Takibi</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartDataYem}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="yemStok" stroke="#facc15" name="Yem Stok (kg)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default KullaniciPage;
