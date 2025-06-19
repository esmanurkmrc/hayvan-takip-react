import React, { useState } from "react";
import axios from "axios";
import "./YapilacaklarPage.css";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const YapilacaklarPage = () => {
  const [yapilacaklar, setYapilacaklar] = useState([]);
  const [form, setForm] = useState({ baslik: "", aciklama: "", onemDerecesi: "Orta" });
  const [goster, setGoster] = useState(false);

  const renkler = ["#ff6b6b", "#ffa502", "#2ed573"];

  const fetchYapilacaklar = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/yapilacaklar");
      setYapilacaklar(res.data);
      setGoster(true);
    } catch (err) {
      console.error("Veriler alınamadı", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/yapilacaklar", form);
      setForm({ baslik: "", aciklama: "", onemDerecesi: "Orta" });
      fetchYapilacaklar();
    } catch (err) {
      console.error("Kayıt hatası", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/yapilacaklar/${id}`);
      fetchYapilacaklar();
    } catch (err) {
      console.error("Silme hatası", err);
    }
  };

  const toggleTamamlandi = async (item) => {
    try {
      await axios.put(`http://localhost:8080/api/yapilacaklar/${item.id}`, {
        ...item,
        tamamlandi: !item.tamamlandi,
      });
      fetchYapilacaklar();
    } catch (err) {
      console.error("Güncelleme hatası", err);
    }
  };

  const grafikVeriOnem = [
    { name: "Yüksek", value: yapilacaklar.filter(g => g.onemDerecesi === "Yüksek").length },
    { name: "Orta", value: yapilacaklar.filter(g => g.onemDerecesi === "Orta").length },
    { name: "Düşük", value: yapilacaklar.filter(g => g.onemDerecesi === "Düşük").length }
  ];

  const grafikVeriDurum = [
    {
      name: "Görevler",
      Tamamlandi: yapilacaklar.filter(g => g.tamamlandi).length,
      Bekliyor: yapilacaklar.filter(g => !g.tamamlandi).length
    }
  ];

  return (
    <div className="yapilacaklar-page-wrapper">
      <div className="yapilacaklar-form-kapsayici">
        <h2>Yapılacaklar Listesi</h2>

        <form onSubmit={handleSubmit} className="yapilacaklar-form">
          <input
            type="text"
            placeholder="Başlık"
            value={form.baslik}
            onChange={(e) => setForm({ ...form, baslik: e.target.value })}
            required
          />
          <textarea
            placeholder="Açıklama"
            value={form.aciklama}
            onChange={(e) => setForm({ ...form, aciklama: e.target.value })}
          ></textarea>
          <select
            value={form.onemDerecesi}
            onChange={(e) => setForm({ ...form, onemDerecesi: e.target.value })}
          >
            <option value="Yüksek">Yüksek Önem</option>
            <option value="Orta">Orta Önem</option>
            <option value="Düşük">Düşük Önem</option>
          </select>
          <button type="submit">Ekle</button>
        </form>

        <button onClick={fetchYapilacaklar} className="yapilacaklar-listele-button">Listele</button>

        {goster && (
          <>
            <div className="yapilacaklar-grafikler">
              <div className="yapilacaklar-grafik">
                <h3>Önem Derecesine Göre Dağılım</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={grafikVeriOnem} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {grafikVeriOnem.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={renkler[index % renkler.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="yapilacaklar-grafik">
                <h3>Tamamlanan vs Bekleyen Görevler</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={grafikVeriDurum}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Tamamlandi" fill="#2ed573" />
                    <Bar dataKey="Bekliyor" fill="#ffa502" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <ul className="yapilacaklar-listesi">
              {yapilacaklar.map((item) => (
                <li key={item.id} className={`yapilacaklar-item ${item.tamamlandi ? "tamamlandi" : ""}`}>
                  <div className="yapilacaklar-icerik">
                    <h4>{item.baslik}</h4>
                    <p>{item.aciklama}</p>
                    <span className={`onem-etiket ${item.onemDerecesi.toLowerCase()}`}>{item.onemDerecesi}</span>
                  </div>
                  <div className="yapilacaklar-buttons">
                    <button onClick={() => toggleTamamlandi(item)}>
                      {item.tamamlandi ? "Geri Al" : "Tamamla"}
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="sil-btn">Sil</button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default YapilacaklarPage;
