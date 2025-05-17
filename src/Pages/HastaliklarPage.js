import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./HastaliklarPage.css";

const HastaliklarPage = () => {
  const [hastaliklar, setHastaliklar] = useState([]);
  const [form, setForm] = useState({
    hayvanId: "",
    hastalikAdi: "",
    belirtiler: "",
    taniTarihi: "",
    tedavi: "",
    ilacAdi: "",
    dozaj: "",
    sureGun: "",
    veterinerId: "",
    aciklama: ""
  });
  const [duzenlenenId, setDuzenlenenId] = useState(null);
  const [rapor, setRapor] = useState({ toplam: 0, enCok: "", sonTarih: "" });

  const listele = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/hastaliklar");
      setHastaliklar(response.data);
      raporuHesapla(response.data);
    } catch (err) {
      console.error("Listeleme hatası:", err);
    }
  };

  const raporuHesapla = (veri) => {
    if (veri.length === 0) return;

    const enCokHastalik = veri.reduce((acc, curr) => {
      acc[curr.hastalikAdi] = (acc[curr.hastalikAdi] || 0) + 1;
      return acc;
    }, {});

    const enCok = Object.entries(enCokHastalik).sort((a, b) => b[1] - a[1])[0][0];
    const sonTarih = veri.sort((a, b) => new Date(b.taniTarihi) - new Date(a.taniTarihi))[0].taniTarihi;

    setRapor({ toplam: veri.length, enCok, sonTarih });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (duzenlenenId) {
        await axios.put(`http://localhost:8080/api/hastaliklar/${duzenlenenId}`, form);
      } else {
        await axios.post("http://localhost:8080/api/hastaliklar", form);
      }
      setForm({
        hayvanId: "",
        hastalikAdi: "",
        belirtiler: "",
        taniTarihi: "",
        tedavi: "",
        ilacAdi: "",
        dozaj: "",
        sureGun: "",
        veterinerId: "",
        aciklama: ""
      });
      setDuzenlenenId(null);
      listele();
    } catch (err) {
      console.error("Kayıt hatası:", err);
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setDuzenlenenId(item.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/hastaliklar/${id}`);
      listele();
    } catch (err) {
      console.error("Silme hatası:", err);
    }
  };

  const raporIndirPDF = () => {
    const doc = new jsPDF();
    doc.text("Hastalık Geçmişi Raporu", 14, 15);

    const columns = [
      "ID",
      "Hayvan ID",
      "Hastalık",
      "Belirtiler",
      "Tarih",
      "Veteriner ID"
    ];

    const rows = hastaliklar.map((item) => [
      item.id,
      item.hayvanId,
      item.hastalikAdi,
      item.belirtiler,
      item.taniTarihi,
      item.veterinerId
    ]);

    doc.autoTable({
      startY: 25,
      head: [columns],
      body: rows,
    });

    doc.save("HastalikRaporu.pdf");
  };

  return (
    <div className="hastaliklar-container">
      <h2>Hastalık Kayıtları</h2>

      <form onSubmit={handleSubmit} className="hastalik-form">
        <input name="hayvanId" placeholder="Hayvan ID" value={form.hayvanId} onChange={handleChange} required />
        <input name="hastalikAdi" placeholder="Hastalık Adı" value={form.hastalikAdi} onChange={handleChange} required />
        <input name="belirtiler" placeholder="Belirtiler" value={form.belirtiler} onChange={handleChange} />
        <input type="date" name="taniTarihi" value={form.taniTarihi} onChange={handleChange} />
        <input name="tedavi" placeholder="Tedavi" value={form.tedavi} onChange={handleChange} />
        <input name="ilacAdi" placeholder="İlaç Adı" value={form.ilacAdi} onChange={handleChange} />
        <input name="dozaj" placeholder="Dozaj" value={form.dozaj} onChange={handleChange} />
        <input name="sureGun" placeholder="Süre (gün)" type="number" value={form.sureGun} onChange={handleChange} />
        <input name="veterinerId" placeholder="Veteriner ID" value={form.veterinerId} onChange={handleChange} />
        <input name="aciklama" placeholder="Açıklama" value={form.aciklama} onChange={handleChange} />
        <button type="submit">{duzenlenenId ? "Güncelle" : "Ekle"}</button>
      </form>

      <button type="button" onClick={listele} className="listele-button">
        Listele
      </button>

      <div className="rapor-kutusu">
        <h3>📊 Hastalık Geçmişi Raporu</h3>
        <p>Toplam Kayıt: {rapor.toplam}</p>
        <p>En Sık Görülen Hastalık: {rapor.enCok}</p>
        <p>Son Teşhis Tarihi: {rapor.sonTarih}</p>
        <button onClick={raporIndirPDF} className="pdf-button">📄 PDF Olarak İndir</button>
      </div>

      <table className="hastaliklar-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Hastalık</th>
            <th>Hayvan ID</th>
            <th>Belirtiler</th>
            <th>Tarih</th>
            <th>Veteriner ID</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {hastaliklar.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.hastalikAdi}</td>
              <td>{item.hayvanId}</td>
              <td>{item.belirtiler}</td>
              <td>{item.taniTarihi}</td>
              <td>{item.veterinerId}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Düzenle</button>
                <button onClick={() => handleDelete(item.id)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HastaliklarPage;
