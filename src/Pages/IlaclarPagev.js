import React, { useEffect, useState } from "react";
import axios from "axios";
import "./IlaclarPagev.css";

const IlaclarPagev = () => {
  const [veriler, setVeriler] = useState([]);
  const [form, setForm] = useState({
    hastalikId: "",
    ilacId: "",
    doz: "",
    aciklama: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [ilaclar, setIlaclar] = useState([]);
  const [hastaliklar, setHastaliklar] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const listele = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/hastalik-ilac");
      setVeriler(res.data);
    } catch (error) {
      console.error("Listeleme hatası", error);
    }
  };

  const getIlaclar = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/ilaclar");
      setIlaclar(res.data);
    } catch (error) {
      console.error("İlaçlar yüklenemedi", error);
    }
  };

  const getHastaliklar = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/hastaliklar");
      setHastaliklar(res.data);
    } catch (error) {
      console.error("Hastalıklar yüklenemedi", error);
    }
  };

  useEffect(() => {
    getIlaclar();
    getHastaliklar();
    
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:8080/api/hastalik-ilac/${editingId}`, form);
      } else {
        await axios.post("http://localhost:8080/api/hastalik-ilac", form);
      }
      setForm({ hastalikId: "", ilacId: "", doz: "", aciklama: "" });
      setEditingId(null);
      listele(); 
    } catch (error) {
      console.error("Kayıt hatası", error);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      hastalikId: item.hastalikId,
      ilacId: item.ilacId,
      doz: item.doz,
      aciklama: item.aciklama
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Silmek istediğinize emin misiniz?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/hastalik-ilac/${id}`);
      listele();
    } catch (error) {
      console.error("Silme hatası", error);
    }
  };

  return (
    <div className="ilaclar-pagev-container">
      <h2 className="baslik">Hastalık-İlaç Eşleşme Paneli</h2>

      <form onSubmit={handleSubmit} className="ilac-form">
        <select
          name="hastalikId"
          value={form.hastalikId}
          onChange={handleChange}
          required
          className="dropdown"
        >
          <option value="">Hastalık Seçiniz</option>
          {hastaliklar.map((h) => (
            <option key={h.id} value={h.id}>{h.hastalikAdi}</option>
          ))}
        </select>

        <select
          name="ilacId"
          value={form.ilacId}
          onChange={handleChange}
          required
          className="dropdown"
        >
          <option value="">İlaç Seçiniz</option>
          {ilaclar.map((i) => (
            <option key={i.id} value={i.id}>{i.ilacAdi}</option>
          ))}
        </select>

        <input
          type="text"
          name="doz"
          placeholder="Doz"
          value={form.doz}
          onChange={handleChange}
          required
        />

        <textarea
          name="aciklama"
          placeholder="Açıklama"
          value={form.aciklama}
          onChange={handleChange}
        ></textarea>

        <button type="submit">{editingId ? "Güncelle" : "Ekle"}</button>
        <button type="button" onClick={listele} className="listele-btn">Listele</button>
      </form>

      <table className="ilaclar-table">
        <thead>
          <tr>
            <th>Hastalık</th>
            <th>İlaç</th>
            <th>Doz</th>
            <th>Açıklama</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {veriler.map((item) => (
            <tr key={item.id}>
              <td>{item.hastalikAdi}</td>
              <td>{item.ilacAdi}</td>
              <td>{item.doz}</td>
              <td>{item.aciklama}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Düzenle</button>
                <button onClick={() => handleDelete(item.id)} className="sil-btn">Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IlaclarPagev;
