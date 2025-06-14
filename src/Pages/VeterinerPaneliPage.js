import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
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

  const [selectedDate, setSelectedDate] = useState(new Date());

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
    { tur: "Tavuk", sayi: 5 }
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
    { label: "Hayvanlar", path: "/hayvanlar-vet" },
    { label: "Hastalıklar", path: "/hastaliklar-vet" },
    { label: "Veteriner Takım Yönetimi", path: "/veteriner-takim-vet" },
    { label: "Aşı Takvimi", path: "/asi-takvimi-vet" },
    { label: "Randevu Takvimi", path: "/randevular-vet" },
    { label: "Beslenme Programı", path: "/beslenme-vet" },
     { label: "Alarmlar ", path: "/alarm-paneli" }
  ];

  return (
    <div className="vet-panel-container">
      

      <main className="main-content">
        <div className="chart-section">
          <h3>🐄 Hayvan Türlerine Göre Sayılar</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={hayvanData}>
              <XAxis dataKey="tur" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sayi" fill="#FF9F1C" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="row-container">
          <div className="calendar-section">
            <h3>📆 Takvim</h3>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="custom-calendar"
            />
          </div>

          <div className="chart-section">
            <h3>📅 Randevu Sayıları</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={randevuData}>
                <XAxis dataKey="tarih" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sayisi" fill="#2EC4B6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VeterinerPaneliPage;
