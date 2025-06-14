import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Legend
} from "recharts";
import "./HastalikBelirtiPage.css";

const HastalikBelirtiPage = () => {
  const [belirtiler, setBelirtiler] = useState([]);
  const [seciliBelirtiId, setSeciliBelirtiId] = useState("");
  const [onerilenHastaliklar, setOnerilenHastaliklar] = useState([]);
  const [grafikVerisi, setGrafikVerisi] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/belirtiler")
      .then(res => setBelirtiler(res.data));

    axios.get("http://localhost:8080/api/hastalik-belirtileri/grafik")
      .then(res => setGrafikVerisi(res.data));
  }, []);

  const hastalikOner = () => {
    if (!seciliBelirtiId) {
      alert("Lütfen bir belirti seçiniz.");
      return;
    }

    axios.post("http://localhost:8080/api/hastalik-belirtileri/oneri", [parseInt(seciliBelirtiId)])
      .then(res => setOnerilenHastaliklar(res.data));
  };

  const ilaclariGoster = (hastalikId) => {
    window.location.href = `/ilaclar?hastalikId=${hastalikId}`;
  };

  return (
    <div className="hb-container">
      <h2>Belirtiye Göre Hastalık Önerisi</h2>

      <div className="hb-form">
        <select value={seciliBelirtiId} onChange={(e) => setSeciliBelirtiId(e.target.value)}>
          <option value="">Belirti Seç</option>
          {belirtiler.map(b => (
            <option key={b.id} value={b.id}>{b.belirtiAdi}</option>
          ))}
        </select>

        <button onClick={hastalikOner}>Hastalık Öner</button>
      </div>

      {onerilenHastaliklar.length > 0 && (
        <div className="oneriler">
          <h3>Önerilen Hastalıklar</h3>
          <ul>
            {onerilenHastaliklar.map(h => (
              <li key={h.id}>
                {h.hastalikAdi}
                <button onClick={() => ilaclariGoster(h.id)}>İlaçları Görüntüle</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="chart-container">
        <h3>Hastalıklara Göre Belirti Sayısı</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={grafikVerisi}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hastalikAdi" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="belirtiSayisi" fill="#8884d8" name="Belirti Sayısı" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HastalikBelirtiPage;
