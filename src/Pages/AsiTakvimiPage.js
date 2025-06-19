import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AsiTakvimiPage.css";

const AsiTakvimiPage = () => {
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
  
  useEffect(() => {
  document.body.className = "asi-bg";
  return () => {
    document.body.className = "";
  };
}, []);


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
    } catch (err) {
      console.error("Listeleme hatası:", err);
      setMessage("Listeleme başarısız.");
    }
  };

  const handleEdit = (item) => {
    setForm({
      hayvanId: item.hayvanId,
      uygulamaTarihi: item.uygulamaTarihi,
      veterinerId: item.veterinerId, 
      aciklama: item.aciklama
    });
    setEditingId(item.id);
    setMessage("Düzenleme moduna geçildi.");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/asitakvimi/${id}`);
      setMessage("Aşı kaydı silindi.");
      listeleAsilar();
    } catch (err) {
      console.error("Silme hatası:", err);
      setMessage("Silme başarısız.");
    }
  };

  return (
    <div className="asi-container">
      <div className="form-card">
        <h2>Aşı Takvimi</h2>
        {message && (
          <p style={{ color: message.includes("başarılı") ? "green" : "red", textAlign: "center" }}>
            {message}
          </p>
        )}

        {roleId === "2" && (
          <form onSubmit={handleSubmit} className="asi-form">
            <input name="hayvanId" value={form.hayvanId} onChange={handleChange} placeholder="Hayvan ID" required />
            <input name="uygulamaTarihi" type="date" value={form.uygulamaTarihi} onChange={handleChange} required />
            <input name="veterinerId" value={form.veterinerId} onChange={handleChange} placeholder="Veteriner ID" required />
            <textarea name="aciklama" value={form.aciklama} onChange={handleChange} placeholder="Açıklama" />
            <button type="submit">{editingId ? "Güncelle" : "Ekle"}</button>
          </form>
        )}

        <button className="listele-button" onClick={listeleAsilar}>Listele</button>

        <table className="asi-table">
          <thead>
            <tr>
              <th>Hayvan ID</th>
              <th>Uygulama Tarihi</th>
              <th>Veteriner</th>
              <th>Açıklama</th>
              {roleId === "2" && <th>İşlem</th>}
            </tr>
          </thead>
          <tbody>
            {asiTakvimi.map((item) => (
              <tr key={item.id}>
                <td>{item.hayvanId}</td>
                <td>{item.uygulamaTarihi}</td>
                <td>{item.veterinerAdi || item.veterinerId}</td> 
                <td>{item.aciklama}</td>
                {roleId === "2" && (
                  <td>
                    <button onClick={() => handleEdit(item)}>Düzenle</button>{" "}
                    <button onClick={() => handleDelete(item.id)}>Sil</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AsiTakvimiPage;
