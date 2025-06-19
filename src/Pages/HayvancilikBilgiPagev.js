import React, { useState } from "react";
import axios from "axios";
import "./HayvancilikBilgiPage.css";

const initialForm = {
  baslik: "",
  icerik: "",
  kategori: "",
  kaynak: "",
  resimUrl: "",
};

const HayvancilikBilgiPagev = () => {
  const [bilgiler, setBilgiler] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [guncelleModu, setGuncelleModu] = useState(false);
  const [seciliId, setSeciliId] = useState(null);

  const kategoriListesi = ["Beslenme", "Aşılama", "Barınak", "Hastalık", "Verimlilik"];

  const getAll = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/hayvancilik-bilgileri");
      setBilgiler(res.data);
    } catch (err) {
      console.error("Veriler alınamadı", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (guncelleModu) {
        await axios.put(`http://localhost:8080/api/hayvancilik-bilgileri/${seciliId}`, form);
      } else {
        await axios.post("http://localhost:8080/api/hayvancilik-bilgileri", form);
      }
      getAll();
      setForm(initialForm);
      setGuncelleModu(false);
      setSeciliId(null);
    } catch (err) {
      console.error("İşlem hatası", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu bilgiyi silmek istediğinize emin misiniz?")) {
      await axios.delete(`http://localhost:8080/api/hayvancilik-bilgileri/${id}`);
      getAll();
    }
  };

  const handleEdit = (bilgi) => {
    setForm({
      baslik: bilgi.baslik,
      icerik: bilgi.icerik,
      kategori: bilgi.kategori,
      kaynak: bilgi.kaynak,
      resimUrl: bilgi.resimUrl,
    });
    setGuncelleModu(true);
    setSeciliId(bilgi.id);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="bilgi-wrapper">
      <h2>Hayvancılık Bilgi Merkezi</h2>

      <form className="bilgi-form" onSubmit={handleSubmit}>
        <input name="baslik" value={form.baslik} onChange={handleChange} placeholder="Başlık" required />
        <textarea name="icerik" value={form.icerik} onChange={handleChange} placeholder="İçerik" rows={3} required />
        <select name="kategori" value={form.kategori} onChange={handleChange} required>
          <option value="">Kategori Seç</option>
          {kategoriListesi.map((kat, i) => (
            <option key={i} value={kat}>{kat}</option>
          ))}
        </select>
        <input name="kaynak" value={form.kaynak} onChange={handleChange} placeholder="Kaynak (opsiyonel)" />
        <input name="resimUrl" value={form.resimUrl} onChange={handleChange} placeholder="Resim URL (opsiyonel)" />
        <button type="submit">{guncelleModu ? "Güncelle" : "Ekle"}</button>
      </form>

      <button className="listele-btn" onClick={getAll}>Listele</button>

      <div className="bilgi-listesi">
        {bilgiler.map((bilgi) => (
          <div key={bilgi.id} className="bilgi-karti">
            <h3>{bilgi.baslik}</h3>
            <p><strong>Kategori:</strong> {bilgi.kategori}</p>
            <p>{bilgi.icerik}</p>
            {bilgi.kaynak && <p><em>Kaynak: {bilgi.kaynak}</em></p>}
            {bilgi.resimUrl && <img src={bilgi.resimUrl} alt="resim" />}
            <div className="bilgi-butons">
              <button className="edit" onClick={() => handleEdit(bilgi)}>Düzenle</button>
              <button className="delete" onClick={() => handleDelete(bilgi.id)}>Sil</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HayvancilikBilgiPagev;
