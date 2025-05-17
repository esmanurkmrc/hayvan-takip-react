import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from "recharts";
import "./IlacStokTakibiPage.css";

const IlacStokTakibiPage = () => {
  const [stoklar, setStoklar] = useState([]);
  const [grafikVerisi, setGrafikVerisi] = useState([]);
  const [ilaclar, setIlaclar] = useState([]);

  const [form, setForm] = useState({
    ilacId: "",
    miktar: "",
    birimFiyat: "",
    girisTarihi: "",
    sonKullanmaTarihi: "",
    aciklama: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getIlaclar = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/ilaclar");
      setIlaclar(res.data);
    } catch (err) {
      console.error("İlaçlar yüklenemedi", err);
    }
  };

  const listele = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/ilac-stok");
      setStoklar(res.data);

      const gruplu = res.data.reduce((acc, stok) => {
        const ilac = stok.ilacAdi;
        acc[ilac] = (acc[ilac] || 0) + stok.miktar;
        return acc;
      }, {});

      const grafik = Object.entries(gruplu).map(([ilacAdi, toplam]) => ({
        ilacAdi,
        miktar: toplam
      }));

      setGrafikVerisi(grafik);
    } catch (err) {
      console.error("Listeleme hatası", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/ilac-stok", form);
      setForm({
        ilacId: "",
        miktar: "",
        birimFiyat: "",
        girisTarihi: "",
        sonKullanmaTarihi: "",
        aciklama: ""
      });
      listele();
    } catch (err) {
      console.error("Kayıt hatası", err);
    }
  };

  useEffect(() => {
    getIlaclar();
  }, []);

  return (
    <div className="stok-page-container">
      <h2>İlaç Stok Takip Sayfası</h2>

      <form onSubmit={handleSubmit} className="stok-form">
        <select name="ilacId" value={form.ilacId} onChange={handleChange} required>
          <option value="">İlaç Seçiniz</option>
          {ilaclar.map((i) => (
            <option key={i.id} value={i.id}>{i.ilacAdi}</option>
          ))}
        </select>

        <input type="number" name="miktar" placeholder="Miktar" value={form.miktar} onChange={handleChange} required />
        <input type="number" step="0.01" name="birimFiyat" placeholder="Birim Fiyat" value={form.birimFiyat} onChange={handleChange} required />
        <input type="date" name="girisTarihi" value={form.girisTarihi} onChange={handleChange} required />
        <input type="date" name="sonKullanmaTarihi" value={form.sonKullanmaTarihi} onChange={handleChange} />
        <textarea name="aciklama" placeholder="Açıklama" value={form.aciklama} onChange={handleChange}></textarea>
        <button type="submit">Ekle</button>
      </form>

      <button onClick={listele} className="listele-btn">Listele</button>

      {stoklar.length > 0 && (
        <>
          <table className="stok-table">
            <thead>
              <tr>
                <th>İlaç Adı</th>
                <th>Miktar</th>
                <th>Birim Fiyat</th>
                <th>Giriş Tarihi</th>
                <th>Son Kullanma Tarihi</th>
                <th>Açıklama</th>
              </tr>
            </thead>
            <tbody>
              {stoklar.map((s) => (
                <tr key={s.id}>
                  <td>{s.ilacAdi}</td>
                  <td>{s.miktar}</td>
                  <td>{s.birimFiyat}₺</td>
                  <td>{s.girisTarihi}</td>
                  <td>{s.sonKullanmaTarihi}</td>
                  <td>{s.aciklama}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="grafik-container">
            <h3>Stok Miktarları (İlaç Bazlı)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={grafikVerisi}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ilacAdi" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="miktar" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default IlacStokTakibiPage;
