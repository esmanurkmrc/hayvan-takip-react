import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./RandevularPage.css";

const LocationSelector = ({ setKonum }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setKonum(`${lat.toFixed(5)},${lng.toFixed(5)}`);
    },
  });
  return null;
};

const RandevularPage = () => {
  const [randevular, setRandevular] = useState([]);
  const [form, setForm] = useState({
    veterinerId: "",
    konum: "",
    hayvanId: "",
    tarih: "",
    saat: "",
    aciklama: "",
    durum: ""
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    document.body.classList.add("randevu-body-bg");
    fetchRandevular();
    return () => document.body.classList.remove("randevu-body-bg");
  }, []);

  const fetchRandevular = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/randevular");
      setRandevular(res.data);
    } catch (error) {
      console.error("Listeleme hatasi:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      ...form,
      veterinerId: parseInt(form.veterinerId),
      hayvanId: parseInt(form.hayvanId)
    };
    try {
      if (editingId) {
        await axios.put(`http://localhost:8080/api/randevular/${editingId}`, dataToSend);
      } else {
        await axios.post("http://localhost:8080/api/randevular", dataToSend);
      }
      setForm({
        veterinerId: "",
        konum: "",
        hayvanId: "",
        tarih: "",
        saat: "",
        aciklama: "",
        durum: ""
      });
      setEditingId(null);
      fetchRandevular();
    } catch (error) {
      console.error("Kayit hatasi:", error);
    }
  };

  const handleEdit = (r) => {
    setForm({
      veterinerId: r.veterinerId,
      konum: r.konum,
      hayvanId: r.hayvanId,
      tarih: r.tarih,
      saat: r.saat,
      aciklama: r.aciklama,
      durum: r.durum
    });
    setEditingId(r.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/randevular/${id}`);
      fetchRandevular();
    } catch (error) {
      console.error("Silme hatasi:", error);
    }
  };

  return (
    <div className="randevu-container">
      <h2 className="randevu-title">Randevu Yönetimi</h2>
      <form className="randevu-form" onSubmit={handleSubmit}>
        <input name="veterinerId" value={form.veterinerId} onChange={handleChange} placeholder="Veteriner ID" required />
        <input name="hayvanId" value={form.hayvanId} onChange={handleChange} placeholder="Hayvan ID" required />
        <input name="tarih" type="date" value={form.tarih} onChange={handleChange} required />
        <input name="saat" type="time" value={form.saat} onChange={handleChange} required />
        <input name="aciklama" value={form.aciklama} onChange={handleChange} placeholder="Açıklama" />
        <input name="durum" value={form.durum} onChange={handleChange} placeholder="Durum" />
        <input name="konum" value={form.konum} readOnly placeholder="Haritadan Konum Seçiniz" />

        <MapContainer center={[39.92, 32.85]} zoom={6} style={{ height: "200px", marginTop: "10px" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationSelector setKonum={(konum) => setForm({ ...form, konum })} />
          {form.konum && (
            <Marker
              position={[
                parseFloat(form.konum.split(",")[0]),
                parseFloat(form.konum.split(",")[1])
              ]}
            />
          )}
        </MapContainer>

        <button type="submit">{editingId ? "Güncelle" : "Kaydet"}</button>
      </form>

      <table className="randevu-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Veteriner ID</th>
            <th>Hayvan ID</th>
            <th>Tarih</th>
            <th>Saat</th>
            <th>Açıklama</th>
            <th>Durum</th>
            <th>Konum</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {randevular.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.veterinerId}</td>
              <td>{r.hayvanId}</td>
              <td>{r.tarih}</td>
              <td>{r.saat}</td>
              <td>{r.aciklama}</td>
              <td>{r.durum}</td>
              <td>{r.konum}</td>
              <td>
                <button onClick={() => handleEdit(r)}>Düzenle</button>
                <button onClick={() => handleDelete(r.id)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RandevularPage;
