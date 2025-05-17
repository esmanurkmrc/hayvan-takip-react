import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AsiTakvimiPagev.css";

const AsiTakvimiPagev = () => {
  const [asiTakvimi, setAsiTakvimi] = useState([]);
  const [form, setForm] = useState({
    hayvanId: "",
    uygulamaTarihi: "",
    veterinerId: "",
    aciklama: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [roleId, setRoleId] = useState("1");
  const [listelemeYapildi, setListelemeYapildi] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("roleId") || "1";
    setRoleId(role);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `http://localhost:8080/api/asitakvimi/${editingId}`
        : "http://localhost:8080/api/asitakvimi";

      const method = editingId ? axios.put : axios.post;
      await method(url, form);

      setMessage(editingId ? "Aşı kaydı güncellendi." : "Aşı kaydı eklendi.");
      setForm({ hayvanId: "", uygulamaTarihi: "", veterinerId: "", aciklama: "" });
      setEditingId(null);
      listeleAsilar();
    } catch (error) {
      console.error("Kayıt hatası:", error);
      setMessage("İşlem başarısız oldu.");
    }
  };

  const listeleAsilar = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/asitakvimi");
      setAsiTakvimi(res.data);
      setListelemeYapildi(true);
    } catch (err) {
      console.error("Listeleme hatası:", err);
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/asitakvimi/${id}`);
      listeleAsilar();
      setMessage("Aşı kaydı silindi.");
    } catch (err) {
      console.error("Silme hatası:", err);
    }
  };

  return (
    <div className="asi-container-vet">
      <h2 className="asi-title">Aşı Takvimi</h2>

      <form onSubmit={handleSubmit} className="asi-form-vet">
        <input name="hayvanId" value={form.hayvanId} onChange={handleChange} placeholder="Hayvan ID" required />
        <input name="uygulamaTarihi" type="date" value={form.uygulamaTarihi} onChange={handleChange} required />
        <input name="veterinerId" value={form.veterinerId} onChange={handleChange} placeholder="Veteriner ID" required />
        <textarea name="aciklama" value={form.aciklama} onChange={handleChange} placeholder="Açıklama" />
        <button type="submit">{editingId ? "Güncelle" : "Ekle"}</button>
      </form>

      <div className="listele-container">
        <button className="listele-button" onClick={listeleAsilar}>Listele</button>
      </div>

      {message && <p className="asi-message">{message}</p>}

      {listelemeYapildi && (
        <table className="asi-table-vet">
          <thead>
            <tr>
              <th>Hayvan ID</th>
              <th>Uygulama Tarihi</th>
              <th>Veteriner ID</th>
              <th>Açıklama</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {asiTakvimi.map((item) => (
              <tr key={item.id}>
                <td>{item.hayvanId}</td>
                <td>{item.uygulamaTarihi}</td>
                <td>{item.veterinerId}</td>
                <td>{item.aciklama}</td>
                <td>
                  <button onClick={() => handleEdit(item)}>Düzenle</button>
                  <button onClick={() => handleDelete(item.id)}>Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AsiTakvimiPagev;
