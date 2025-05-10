import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import "./SatislarPage.css";

const SatislarPage = () => {
  const [satislar, setSatislar] = useState([]);
  const [form, setForm] = useState({
    id: null,
    urunAdi: "",
    kategori: "",
    miktar: "",
    birimFiyat: "",
    tarih: "",
    aciklama: ""
  });

  useEffect(() => {
    
  }, []);

  const listele = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/satislar");
      setSatislar(res.data);
    } catch (err) {
      console.error("Listeleme hatası:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const payload = {
      urunAdi: form.urunAdi,
      kategori: form.kategori,
      miktar: parseFloat(form.miktar) || 0,
      birimFiyat: parseFloat(form.birimFiyat) || 0,
      tarih: form.tarih,
      aciklama: form.aciklama
    };

    try {
      if (form.id) {
        await axios.put(`http://localhost:8080/api/satislar/${form.id}`, payload);
      } else {
        await axios.post("http://localhost:8080/api/satislar", payload);
      }
      setForm({
        id: null,
        urunAdi: "",
        kategori: "",
        miktar: "",
        birimFiyat: "",
        tarih: "",
        aciklama: ""
      });
      listele();
    } catch (err) {
      console.error("Ekle/Güncelle hatası:", err);
    }
  };

  const handleEdit = (satis) => {
    setForm({ ...satis });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/satislar/${id}`);
      listele();
    } catch (err) {
      console.error("Silme hatası:", err);
    }
  };

  const grafikVerisi = Object.values(
    satislar.reduce((acc, item) => {
      const ay = item.tarih?.substring(0, 7);
      if (!acc[ay]) acc[ay] = { ay, toplam: 0 };
      acc[ay].toplam += item.miktar * item.birimFiyat;
      return acc;
    }, {})
  );

  const toplamGelir = satislar.reduce(
    (sum, item) => sum + (item.miktar * item.birimFiyat),
    0
  );

  return (
    <div className="satis-page-container">
      <h2>Satış İşlemleri</h2>

      <div className="satis-form">
        <input type="text" name="urunAdi" placeholder="Ürün Adı" value={form.urunAdi} onChange={handleChange} />
        <input type="text" name="kategori" placeholder="Kategori" value={form.kategori} onChange={handleChange} />
        <input type="number" name="miktar" placeholder="Miktar" value={form.miktar} onChange={handleChange} />
        <input type="number" name="birimFiyat" placeholder="Birim Fiyat" value={form.birimFiyat} onChange={handleChange} />
        <input type="date" name="tarih" value={form.tarih} onChange={handleChange} />
        <input type="text" name="aciklama" placeholder="Açıklama" value={form.aciklama} onChange={handleChange} />

        <button onClick={handleSubmit}>{form.id ? "Güncelle" : "Ekle"}</button>
        <button onClick={listele}>Listele</button>
      </div>

      {satislar.length > 0 && (
        <>
          <h3>Aylık Satış Geliri (₺)</h3>
          <div style={{ width: "100%", height: 300, marginBottom: "20px" }}>
            <ResponsiveContainer>
              <BarChart data={grafikVerisi}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ay" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="toplam" fill="#ff9800" name="Satış Geliri" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ textAlign: "right", margin: "10px 0", fontWeight: "bold", fontSize: "16px", color: "#2e7d32" }}>
            Toplam Gelir: ₺{toplamGelir.toFixed(2)}
          </div>

          <h3>Satış Listesi</h3>
          <table className="satis-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ürün</th>
                <th>Kategori</th>
                <th>Miktar</th>
                <th>Birim Fiyat</th>
                <th>Toplam</th>
                <th>Tarih</th>
                <th>Açıklama</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {satislar.map((satis) => (
                <tr key={satis.id}>
                  <td>{satis.id}</td>
                  <td>{satis.urunAdi}</td>
                  <td>{satis.kategori}</td>
                  <td>{satis.miktar}</td>
                  <td>{satis.birimFiyat}</td>
                  <td>{(satis.miktar * satis.birimFiyat).toFixed(2)}</td>
                  <td>{satis.tarih}</td>
                  <td>{satis.aciklama}</td>
                  <td>
                    <button onClick={() => handleEdit(satis)}>Düzenle</button>
                    <button onClick={() => handleDelete(satis.id)}>Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default SatislarPage;
