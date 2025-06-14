import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BeslenmePage.css";

const BeslenmePage = () => {
  const [liste, setListe] = useState([]);
  const [form, setForm] = useState({
    hayvanId: "",
    yemAdi: "",
    miktarKg: "",
    tarih: "",
    notlar: "",
    veterinerId: ""
  });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const listele = async () => {
    const res = await axios.get("http://localhost:8080/api/beslenme");
    setListe(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`http://localhost:8080/api/beslenme/${editingId}`, form);
    } else {
      await axios.post("http://localhost:8080/api/beslenme", form);
    }
    setEditingId(null);
    setForm({ hayvanId: "", yemAdi: "", miktarKg: "", tarih: "", notlar: "", veterinerId: "" });
    listele();
  };
  useEffect(() => {
  document.body.className = 'beslenme-bg';
  return () => {
    document.body.className = '';
  };
}, []);


  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      hayvanId: item.hayvanId,
      yemAdi: item.yemAdi,
      miktarKg: item.miktarKg,
      tarih: item.tarih,
      notlar: item.notlar,
      veterinerId: item.veterinerId
    });
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8080/api/beslenme/${id}`);
    listele();
  };

  return (
    <div className="beslenme-container">
      <h2>Beslenme Kayıtları</h2>

      <form className="beslenme-form" onSubmit={handleSubmit}>
        <input type="text" name="hayvanId" placeholder="Hayvan ID" value={form.hayvanId} onChange={handleChange} />
        <input type="text" name="yemAdi" placeholder="Yem Adı" value={form.yemAdi} onChange={handleChange} />
        <input type="number" name="miktarKg" placeholder="Miktar (kg)" value={form.miktarKg} onChange={handleChange} />
        <input type="date" name="tarih" value={form.tarih} onChange={handleChange} />
        <input type="text" name="notlar" placeholder="Notlar" value={form.notlar} onChange={handleChange} />
        <input type="text" name="veterinerId" placeholder="Veteriner ID" value={form.veterinerId} onChange={handleChange} />
        <button type="submit">{editingId ? "Güncelle" : "Ekle"}</button>
      </form>

      <button className="listele-button" onClick={listele}>Listele</button>

      <table>
        <thead>
          <tr>
            <th>Hayvan ID</th>
            <th>Yem Adı</th>
            <th>Miktar (kg)</th>
            <th>Tarih</th>
            <th>Notlar</th>
            <th>Veteriner ID</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {liste.map((item) => (
            <tr key={item.id}>
              <td>{item.hayvanId}</td>
              <td>{item.yemAdi}</td>
              <td>{item.miktarKg}</td>
              <td>{item.tarih}</td>
              <td>{item.notlar}</td>
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

export default BeslenmePage;
