import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./HayvanlarPage.css";

const LocationSelector = ({ setKonum }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setKonum(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    },
  });
  return null;
};

const HayvanlarPage = () => {
  const [hayvanlar, setHayvanlar] = useState([]);
  const [form, setForm] = useState({
    kupeNo: "",
    yasamAlani: "",
    irk: "",
    dogumTarihi: "",
    cinsiyet: "",
    olumTarihi: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [mesaj, setMesaj] = useState("");

  useEffect(() => {
    document.body.classList.add("hayvanlar-bg");
    return () => {
      document.body.classList.remove("hayvanlar-bg");
    };
  }, []);

  const fetchHayvanlar = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/hayvanlar");
      setHayvanlar(res.data);
      setMesaj("Listeleme başarılı.");
    } catch (error) {
      console.error("Listeleme hatası:", error);
      setMesaj("Listeleme başarısız.");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const formatDate = (val) => val === "" ? null : val;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      ...form,
      dogumTarihi: formatDate(form.dogumTarihi),
      olumTarihi: formatDate(form.olumTarihi),
    };

    try {
      if (editingId) {
        await axios.put(`http://localhost:8080/api/hayvanlar/${editingId}`, dataToSend, {
          headers: { "Content-Type": "application/json" },
        });
        setMesaj("Güncelleme başarılı.");
      } else {
        await axios.post("http://localhost:8080/api/hayvanlar", dataToSend, {
          headers: { "Content-Type": "application/json" },
        });
        setMesaj("Ekleme başarılı.");
      }

      setForm({
        kupeNo: "",
        yasamAlani: "",
        irk: "",
        dogumTarihi: "",
        cinsiyet: "",
        olumTarihi: "",
      });
      setEditingId(null);
      fetchHayvanlar();
    } catch (error) {
      console.error("Kayıt hatası:", error);
      setMesaj("Kayıt başarısız.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/hayvanlar/${id}`);
      setMesaj("Silme başarılı.");
      fetchHayvanlar();
    } catch (error) {
      console.error("Silme hatası:", error);
      setMesaj("Silme başarısız.");
    }
  };

  const handleEdit = (hayvan) => {
    setForm({
      kupeNo: hayvan.kupeNo || "",
      yasamAlani: hayvan.yasamAlani || "",
      irk: hayvan.irk || "",
      dogumTarihi: hayvan.dogumTarihi || "",
      cinsiyet: hayvan.cinsiyet || "",
      olumTarihi: hayvan.olumTarihi || "",
    });
    setEditingId(hayvan.hayvanId || hayvan.id);
    setMesaj("Düzenleme moduna geçildi.");
  };

  return (
    <div className="hayvanlar-container">
      <h2>Hayvan Kayıtları</h2>
      <p style={{ color: mesaj.includes("başarılı") ? "green" : "red" }}>{mesaj}</p>

      <form onSubmit={handleSubmit} className="hayvan-form">
        <input name="kupeNo" value={form.kupeNo} onChange={handleChange} placeholder="Küpe No" required />
        <input name="irk" value={form.irk} onChange={handleChange} placeholder="Irk" />
        <input name="dogumTarihi" type="date" value={form.dogumTarihi} onChange={handleChange} />
        <input name="cinsiyet" value={form.cinsiyet} onChange={handleChange} placeholder="Cinsiyet" />
        <input name="olumTarihi" type="date" value={form.olumTarihi} onChange={handleChange} />
        <input name="yasamAlani" value={form.yasamAlani} readOnly placeholder="Haritadan Yaşam Alanı Seçiniz" />

        <MapContainer center={[39.92, 32.85]} zoom={6} style={{ height: "200px", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationSelector setKonum={(konum) => setForm({ ...form, yasamAlani: konum })} />
          {form.yasamAlani && (
            <Marker
              position={[
                parseFloat(form.yasamAlani.split(",")[0]),
                parseFloat(form.yasamAlani.split(",")[1]),
              ]}
            />
          )}
        </MapContainer>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button type="submit">{editingId ? "Güncelle" : "Ekle"}</button>
          <button type="button" onClick={fetchHayvanlar}>Listele</button>
        </div>
      </form>

      {hayvanlar.length > 0 && (
        <table className="hayvan-table">
          <thead>
            <tr>
              <th>Küpe No</th>
              <th>Irk</th>
              <th>Doğum Tarihi</th>
              <th>Cinsiyet</th>
              <th>Ölüm Tarihi</th>
              <th>Yaşam Alanı</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {hayvanlar.map((hayvan) => (
              <tr key={hayvan.hayvanId || hayvan.id}>
                <td>{hayvan.kupeNo}</td>
                <td>{hayvan.irk}</td>
                <td>{hayvan.dogumTarihi}</td>
                <td>{hayvan.cinsiyet}</td>
                <td>{hayvan.olumTarihi || "-"}</td>
                <td>{hayvan.yasamAlani}</td>
                <td>
                  <button onClick={() => handleEdit(hayvan)}>Düzenle</button>{" "}
                  <button onClick={() => handleDelete(hayvan.hayvanId || hayvan.id)}>Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HayvanlarPage;
