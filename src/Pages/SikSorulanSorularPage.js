import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SikSorulanSorularPage.css";

const API_URL = "http://localhost:8080/api/sorular";

const SikSorulanSorularPage = () => {
  const [sorular, setSorular] = useState([]);
  const [form, setForm] = useState({ soru: "", kategori: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    listeleSorular();
  }, []);

  const listeleSorular = async () => {
    try {
      const res = await axios.get(API_URL);
      setSorular(res.data);
    } catch (err) {
      console.error("Listeleme hatası:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const soruEkle = async () => {
    try {
      await axios.post(API_URL, form);
      setForm({ soru: "", kategori: "" });
      listeleSorular();
    } catch (err) {
      console.error("Ekleme hatası:", err);
    }
  };

  const soruGuncelle = async () => {
    try {
      await axios.put(`${API_URL}/${editId}`, form);
      setEditId(null);
      setForm({ soru: "", kategori: "" });
      listeleSorular();
    } catch (err) {
      console.error("Güncelleme hatası:", err);
    }
  };

  const soruSil = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      listeleSorular();
    } catch (err) {
      console.error("Silme hatası:", err);
    }
  };

  const formuHazirla = (soru) => {
    setForm({ soru: soru.soru, kategori: soru.kategori });
    setEditId(soru.id);
  };

  return (
    <div className="sss-container">
      <h2>Sık Sorulan Sorular</h2>

      <div className="sss-form">
        <input
          type="text"
          name="soru"
          placeholder="Soru giriniz..."
          value={form.soru}
          onChange={handleChange}
        />
        <input
          type="text"
          name="kategori"
          placeholder="Kategori giriniz..."
          value={form.kategori}
          onChange={handleChange}
        />
        <button onClick={editId ? soruGuncelle : soruEkle}>
          {editId ? "Güncelle" : "Ekle"}
        </button>
      </div>

      <div className="sss-list">
        {sorular.map((s) => (
          <div className="sss-card" key={s.id}>
            <p><strong>Soru:</strong> {s.soru}</p>
            <p><strong>Kategori:</strong> {s.kategori}</p>
            <p><strong>Cevap:</strong> {s.cevap || "Henüz cevaplanmadı."}</p>
            <p className="sss-date">{new Date(s.eklenmeTarihi).toLocaleString()}</p>

            <div className="sss-actions">
              <button onClick={() => formuHazirla(s)}>Düzenle</button>
              <button onClick={() => soruSil(s.id)}>Sil</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SikSorulanSorularPage;
