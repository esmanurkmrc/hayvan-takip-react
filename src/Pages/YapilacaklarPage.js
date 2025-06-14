import React, { useState, useEffect } from "react";
import axios from "axios";
import "./YapilacaklarPage.css";

const YapilacaklarPage = () => {
  const [yapilacaklar, setYapilacaklar] = useState([]);
  const [form, setForm] = useState({ baslik: "", aciklama: "", onemDerecesi: "Orta" });

  useEffect(() => {
    fetchYapilacaklar();
  }, []);

  const fetchYapilacaklar = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/yapilacaklar");
      setYapilacaklar(res.data);
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

  return (
    <div className="todo-container">
      <h2>Yapılacaklar Listesi</h2>
      <form onSubmit={handleSubmit} className="todo-form">
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

      <ul className="todo-list">
        {yapilacaklar.map((item) => (
          <li
            key={item.id}
            className={`todo-item ${item.tamamlandi ? "tamamlandi" : ""}`}
          >
            <div className="item-content">
              <h4>{item.baslik}</h4>
              <p>{item.aciklama}</p>
              <span className={`priority ${item.onemDerecesi.toLowerCase()}`}>
                {item.onemDerecesi}
              </span>
            </div>
            <div className="item-actions">
              <button onClick={() => toggleTamamlandi(item)}>
                {item.tamamlandi ? "Geri Al" : "Tamamla"}
              </button>
              <button onClick={() => handleDelete(item.id)} className="sil">
                Sil
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default YapilacaklarPage;
