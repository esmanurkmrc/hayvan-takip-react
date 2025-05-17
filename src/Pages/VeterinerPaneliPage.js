import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import "./VeterinerPaneliPage.css";

const VeterinerPaneliPage = () => {
  const navigate = useNavigate();
  const [veteriner, setVeteriner] = useState({
    ad: "",
    soyad: "",
    eposta: "",
    uzmanlikAlani: ""
  });

  useEffect(() => {
    const storedVeteriner = JSON.parse(localStorage.getItem("veterinerBilgi"));
    if (storedVeteriner) {
      setVeteriner(storedVeteriner);
    }
  }, []);

  const hayvanData = [
    { tur: "İnek", sayi: 25 },
    { tur: "Koyun", sayi: 40 },
    { tur: "Keçi", sayi: 15 },
    { tur: "Tavuk", sayi: 60 }
  ];

  const randevuData = [
    { tarih: "2024-05-01", sayisi: 5 },
    { tarih: "2024-05-02", sayisi: 8 },
    { tarih: "2024-05-03", sayisi: 3 },
    { tarih: "2024-05-04", sayisi: 10 }
  ];

const menuItems = [
  { label: "Veteriner Bilgileri", path: "/veterinerbilgileri" },
  { label: "İlaçlar", path: "/ilaclar-vet" }, 
  { label: "İlaç Stok Takibi", path: "/stok-takip" },
  { label: "Salgın Hastalıklar", path: "/salgin-hastaliklar" },
  { label: "Hayvanlar", path: "/hayvanlar" },
  { label: "Hastalık Geçmişi", path: "/hastaliklar" },
  { label: "Veteriner Takım Yönetimi", path: "/veteriner-takim" },
  { label: "Aşı Takvimi", path: "/asi-takvimi-vet" },
  { label: "Randevu Takvimi", path: "/randevular" },
  { label: "Beslenme Programı", path: "/beslenme" }
];



  return (
    <div className="vet-panel-container">
      <aside className="sidebar">
        <h2>🐾 Veteriner Paneli</h2>
        <div className="vet-info" onClick={() => navigate("/veterinerbilgileri")}>
          <p><strong>{veteriner.ad} {veteriner.soyad}</strong></p>
          <p>{veteriner.eposta}</p>
          <p><i>{veteriner.uzmanlikAlani}</i></p>
        </div>
        <ul className="menu full-height-menu">
          {menuItems.map((item, i) => (
            <li key={i} onClick={() => navigate(item.path)}>{item.label}</li>
          ))}
        </ul>
      </aside>

      <main className="main-content">
        <h3>🐄 Hayvan Türlerine Göre Sayılar</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={hayvanData}>
            <XAxis dataKey="tur" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sayi" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>

        <h3>📅 Randevu Sayıları</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={randevuData}>
            <XAxis dataKey="tarih" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sayisi" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </main>
    </div>
  );
};

export default VeterinerPaneliPage;