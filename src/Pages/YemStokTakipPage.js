import React, { useState, useEffect } from "react";
import axios from "axios";
import "./YemStokTakipPage.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const YemStokTakipPage = () => {
  const [stoklar, setStoklar] = useState([]);
  const [form, setForm] = useState({
    yemAdi: "",
    yemTuru: "",
    miktarKg: "",
    girisTarihi: "",
    cikisTarihi: "",
    birimFiyat: "",
    aciklama: ""
  });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const listeleStoklar = async () => {
    const res = await axios.get("http://localhost:8080/api/yem-stok");
    setStoklar(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`http://localhost:8080/api/yem-stok/${editingId}`, form);
    } else {
      await axios.post("http://localhost:8080/api/yem-stok", form);
    }
    setForm({ yemAdi: "", yemTuru: "", miktarKg: "", girisTarihi: "", cikisTarihi: "", birimFiyat: "", aciklama: "" });
    setEditingId(null);
    listeleStoklar();
  };

  const handleDelete = async () => {
    if (editingId) {
      await axios.delete(`http://localhost:8080/api/yem-stok/${editingId}`);
      setEditingId(null);
      setForm({ yemAdi: "", yemTuru: "", miktarKg: "", girisTarihi: "", cikisTarihi: "", birimFiyat: "", aciklama: "" });
      listeleStoklar();
    }
  };

  const handleEdit = (stok) => {
    setEditingId(stok.id);
    setForm({
      yemAdi: stok.yemAdi,
      yemTuru: stok.yemTuru,
      miktarKg: stok.miktarKg,
      girisTarihi: stok.girisTarihi,
      cikisTarihi: stok.cikisTarihi,
      birimFiyat: stok.birimFiyat,
      aciklama: stok.aciklama
    });
  };
useEffect(() => {
  document.body.className = "yem-stok-bg";
  return () => {
    document.body.className = "";
  };
}, []);

  useEffect(() => {
    listeleStoklar();
  }, []);

  return (
    <div className="yem-stok-container">
      <h2 className="yem-stok-title">Yem Stok Takibi</h2>
      <div className="yem-stok-content">
        <form className="yem-form" onSubmit={handleSubmit}>
          <input type="text" name="yemAdi" placeholder="Yem Adı" value={form.yemAdi} onChange={handleChange} />
          <input type="text" name="yemTuru" placeholder="Yem Türü" value={form.yemTuru} onChange={handleChange} />
          <input type="number" name="miktarKg" placeholder="Miktar (kg)" value={form.miktarKg} onChange={handleChange} />
          <input type="date" name="girisTarihi" value={form.girisTarihi} onChange={handleChange} />
          <input type="date" name="cikisTarihi" value={form.cikisTarihi} onChange={handleChange} />
          <input type="text" name="birimFiyat" placeholder="Birim Fiyat" value={form.birimFiyat} onChange={handleChange} />
          <input type="text" name="aciklama" placeholder="Açıklama" value={form.aciklama} onChange={handleChange} />
          <div className="yem-buttons">
            <button type="submit">{editingId ? "Güncelle" : "Ekle"}</button>
            <button type="button" onClick={handleDelete}>Sil</button>
            <button type="button" onClick={listeleStoklar}>Listele</button>
          </div>
        </form>

        <div className="stok-table">
          <table>
            <thead>
              <tr>
                <th>Yem Adı</th>
                <th>Türü</th>
                <th>Miktar (kg)</th>
                <th>Giriş Tarihi</th>
              </tr>
            </thead>
            <tbody>
              {stoklar.map((s) => (
                <tr key={s.id} onClick={() => handleEdit(s)}>
                  <td>{s.yemAdi}</td>
                  <td>{s.yemTuru}</td>
                  <td>{s.miktarKg}</td>
                  <td>{s.girisTarihi}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="stok-chart">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stoklar}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="girisTarihi" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="miktarKg" stroke="#008080" name="Stok Miktarı (kg)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YemStokTakipPage;
