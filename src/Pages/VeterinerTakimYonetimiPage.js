import React, { useEffect, useState } from "react";
import axios from "axios";
import "./VeterinerTakimYonetimiPage.css";

const VeterinerTakimYonetimiPage = () => {
  const [veterinerler, setVeterinerler] = useState([]);
  const [gorevler, setGorevler] = useState([]);
  const [form, setForm] = useState({
    veterinerId: "",
    gorevAdi: "",
    aciklama: "",
    tarih: "",
    saat: "",
    durum: "Aktif",
  });
  const [editingId, setEditingId] = useState(null);
  const [mesaj, setMesaj] = useState("");

  useEffect(() => {
    fetchVeterinerler();
  }, []);

  const fetchVeterinerler = async () => {
    const res = await axios.get("http://localhost:8080/api/veterinerler");
    setVeterinerler(res.data);
  };

  const fetchGorevler = async () => {
    const res = await axios.get("http://localhost:8080/api/gorevler");
    setGorevler(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:8080/api/gorevler/${editingId}`, form);
        setMesaj("Görev güncellendi ✅");
      } else {
        await axios.post("http://localhost:8080/api/gorevler", form);
        setMesaj("Görev atandı ✅");
      }
      fetchGorevler();
      setForm({ veterinerId: "", gorevAdi: "", aciklama: "", tarih: "", saat: "", durum: "Aktif" });
      setEditingId(null);
      setTimeout(() => setMesaj(""), 3000);
    } catch (error) {
      console.error("Görev kaydı hatası:", error);
      setMesaj("İşlem başarısız ❌");
    }
  };

  const handleEdit = (gorev) => {
    setForm(gorev);
    setEditingId(gorev.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8080/api/gorevler/${id}`);
    fetchGorevler();
  };

  return (
    <div className="takim-container">
      <h2>Veteriner Takım Yönetimi</h2>

      {mesaj && <div className="mesaj">{mesaj}</div>}

      <form className="gorev-form" onSubmit={handleSubmit}>
        <select name="veterinerId" value={form.veterinerId} onChange={handleChange} required>
          <option value="">Veteriner Seç</option>
          {veterinerler.map((v) => (
            <option key={v.id} value={v.id}>
              {v.ad} {v.soyad}
            </option>
          ))}
        </select>

        <input name="gorevAdi" placeholder="Görev Adı" value={form.gorevAdi} onChange={handleChange} required />
        <textarea name="aciklama" placeholder="Açıklama" value={form.aciklama} onChange={handleChange} />
        <input type="date" name="tarih" value={form.tarih} onChange={handleChange} required />
        <input type="time" name="saat" value={form.saat} onChange={handleChange} required />
        <select name="durum" value={form.durum} onChange={handleChange}>
          <option>Aktif</option>
          <option>Tamamlandı</option>
          <option>İptal</option>
        </select>

        <button type="submit" className="btn-submit">{editingId ? "Güncelle" : "Ata"}</button>
        <button type="button" onClick={fetchGorevler} className="listele-btn">
          Listele
        </button>
      </form>

      <table className="gorev-table">
        <thead>
          <tr>
            <th>Veteriner</th>
            <th>Görev</th>
            <th>Açıklama</th>
            <th>Tarih</th>
            <th>Saat</th>
            <th>Durum</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {gorevler.map((gorev) => (
            <tr key={gorev.id}>
              <td>{veterinerler.find((v) => v.id === gorev.veterinerId)?.ad || "-"}</td>
              <td>{gorev.gorevAdi}</td>
              <td>{gorev.aciklama}</td>
              <td>{gorev.tarih}</td>
              <td>{gorev.saat}</td>
              <td>{gorev.durum}</td>
              <td>
                <button onClick={() => handleEdit(gorev)} className="btn-edit">Düzenle</button>
                <button onClick={() => handleDelete(gorev.id)} className="btn-delete">Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VeterinerTakimYonetimiPage;
