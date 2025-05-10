import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import "./UretimPage.css";

const UretimPage = () => {
  const [form, setForm] = useState({ urunAdi: "", miktar: "", tarih: "", hayvanId: "" });
  const [birlesikVeriler, setBirlesikVeriler] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const fetchData = async () => {
    try {
      const etRes = await axios.get("http://localhost:8080/api/uretim/et");
      const sutRes = await axios.get("http://localhost:8080/api/uretim/sut");

      const etVeri = etRes.data.map(item => ({
        ...item,
        urunAdi: "Et"
      }));

      const sutVeri = sutRes.data.map(item => ({
        ...item,
        urunAdi: "Süt"
      }));

      setBirlesikVeriler([...etVeri, ...sutVeri]);
    } catch (error) {
      console.error("Veri getirme hatası:", error);
    }
  };

  useEffect(() => {
    document.body.classList.add("uretim-body");
    return () => document.body.classList.remove("uretim-body");
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const yeniKayit = { ...form };

    if (editingIndex !== null) {
      const yeniListe = [...birlesikVeriler];
      yeniListe[editingIndex] = yeniKayit;
      setBirlesikVeriler(yeniListe);
      setEditingIndex(null);
    } else {
      setBirlesikVeriler(prev => [...prev, yeniKayit]);
    }

    setForm({ urunAdi: "", miktar: "", tarih: "", hayvanId: "" });
  };

  const handleEdit = (index) => {
    setForm(birlesikVeriler[index]);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const guncellenmis = [...birlesikVeriler];
    guncellenmis.splice(index, 1);
    setBirlesikVeriler(guncellenmis);
  };

  return (
    <div className="uretim-container">
      <h2 className="uretim-title">Tüm Üretim Girişi</h2>

      <form className="uretim-form" onSubmit={handleSubmit}>
        <input name="urunAdi" value={form.urunAdi} onChange={handleChange} placeholder="Ürün Adı" required />
        <input name="miktar" value={form.miktar} onChange={handleChange} placeholder="Miktar (kg)" required />
        <input name="tarih" type="date" value={form.tarih} onChange={handleChange} required />
        <input name="hayvanId" value={form.hayvanId} onChange={handleChange} placeholder="Hayvan ID (isteğe bağlı)" />
        <button type="submit">{editingIndex !== null ? "Güncelle" : "Ekle"}</button>
        <button type="button" onClick={fetchData}>Ürünleri Listele</button>
      </form>

      <table className="uretim-table">
        <thead>
          <tr>
            <th>Ürün Adı</th>
            <th>Tarih</th>
            <th>Miktar</th>
            <th>Hayvan ID</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {birlesikVeriler.map((v, index) => (
            <tr key={index}>
              <td>{v.urunAdi}</td>
              <td>{v.tarih}</td>
              <td>{v.miktar}</td>
              <td>{v.hayvanId || "-"}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(index)}>Düzenle</button>
                <button className="delete-btn" onClick={() => handleDelete(index)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="grafik-baslik">Ürün Bazlı Üretim Miktarı (kg)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={birlesikVeriler} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <XAxis dataKey="tarih" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="miktar"
            stroke="#009688"
            name="Toplam Miktar"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UretimPage;
