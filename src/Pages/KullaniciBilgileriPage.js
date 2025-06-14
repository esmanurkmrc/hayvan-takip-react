import React, { useEffect, useState } from "react";
import axios from "axios";
import "./KullaniciBilgileriPage.css";

const KullaniciBilgileriPage = () => {
  const [kullanicilar, setKullanicilar] = useState([]);
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    roleId: "1",
  });
  const [editingId, setEditingId] = useState(null);
  const [mesaj, setMesaj] = useState("");

  useEffect(() => {
    document.body.classList.add("kullanici-bg");
    return () => {
      document.body.classList.remove("kullanici-bg");
    };
  }, []);

  const getKullanicilar = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/kullanicilar");
      setKullanicilar(res.data);
      setMesaj("Listeleme başarılı.");
    } catch (error) {
      console.error("Kullanıcıları getirme hatası:", error);
      setMesaj("Listeleme başarısız.");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      ...form,
      roleId: parseInt(form.roleId),
    };

    try {
      if (editingId) {
        await axios.put(`http://localhost:8080/api/kullanicilar/${editingId}`, dataToSend);
        setMesaj("Güncelleme başarılı.");
      } else {
        await axios.post("http://localhost:8080/api/kullanicilar", dataToSend);
        setMesaj("Kayıt başarılı.");
      }

      setForm({
        name: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        roleId: "1",
      });
      setEditingId(null);
      getKullanicilar();
    } catch (error) {
      console.error("Kullanıcı kayıt/güncelleme hatası:", error);
      setMesaj("Kayıt/Güncelleme başarısız.");
    }
  };

  const handleEdit = (k) => {
    setForm({
      name: k.name,
      lastName: k.lastName,
      email: k.email,
      password: k.password,
      phone: k.phone,
      address: k.address,
      roleId: k.roleName === "Veteriner" ? "2" : "1",
    });
    setEditingId(k.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/kullanicilar/${id}`);
      setMesaj("Silme başarılı.");
      getKullanicilar();
    } catch (error) {
      console.error("Kullanıcı silme hatası:", error);
      setMesaj("Silme başarısız.");
    }
  };

  return (
    <div className="kullanici-page">
      <div className="form-card">
        <h2 className="title">Kullanıcı Bilgileri</h2>
        {mesaj && (
          <p style={{ color: mesaj.includes("başarılı") ? "green" : "red", textAlign: "center" }}>
            {mesaj}
          </p>
        )}

        <form className="form-container" onSubmit={handleSubmit}>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Ad" required />
          <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Soyad" required />
          <input name="email" value={form.email} onChange={handleChange} placeholder="E-posta" required />
          <input name="password" value={form.password} onChange={handleChange} placeholder="Şifre" required />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Telefon" />
          <input name="address" value={form.address} onChange={handleChange} placeholder="Adres" />
          <select name="roleId" value={form.roleId} onChange={handleChange}>
            <option value="1">Kullanıcı</option>
            <option value="2">Veteriner</option>
          </select>
          <div style={{ display: "flex", gap: "12px", gridColumn: "span 2" }}>
            <button className="submit-btn" type="submit">
              {editingId ? "Güncelle" : "Kaydet"}
            </button>
            <button
              className="submit-btn"
              type="button"
              onClick={getKullanicilar}
              style={{ backgroundColor: "#16a34a" }}
            >
              Listele
            </button>
          </div>
        </form>

        <table className="user-table">
          <thead>
            <tr>
              <th>Ad</th>
              <th>Soyad</th>
              <th>Email</th>
              <th>Telefon</th>
              <th>Adres</th>
              <th>Rol</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {kullanicilar.map((k) => (
              <tr key={k.id}>
                <td>{k.name}</td>
                <td>{k.lastName}</td>
                <td>{k.email}</td>
                <td>{k.phone}</td>
                <td>{k.address}</td>
                <td>{k.roleName}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(k)}>
                    Düzenle
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(k.id)}>
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KullaniciBilgileriPage;
