import React, { useEffect,useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const KonumSecici = ({ onKonumSec }) => {
  useMapEvents({
    click(e) {
      onKonumSec(e.latlng);
    }
  });
  return null;
};



const VeterinerBilgileriPage = () => {
  const [form, setForm] = useState({
    ad: "",
    soyad: "",
    telefon: "",
    eposta: "",
    adres: "",
    uzmanlikAlani: "",
    sifre: ""
  });
  const [veterinerler, setVeterinerler] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [mesaj, setMesaj] = useState("");
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMapClick = async (latlng) => {
    setSelectedPosition(latlng);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`
      );
      const data = await response.json();
      const adres = data.display_name || `${latlng.lat},${latlng.lng}`;
      setForm({ ...form, adres });
    } catch (error) {
      console.error("Adres alınamadı:", error);
      setForm({ ...form, adres: `${latlng.lat},${latlng.lng}` });
    }
  };
useEffect(() => {
  document.body.className = "veteriner-bg";
  return () => {
    document.body.className = "";
  };
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:8080/api/veterinerler/${editingId}`, form);
        setMesaj("Güncelleme başarılı ✅");
      } else {
        await axios.post("http://localhost:8080/api/veterinerler/register", form);
        setMesaj("Kayıt başarılı ✅");
      }
      setTimeout(() => setMesaj(""), 3000);
      setForm({
        ad: "", soyad: "", telefon: "", eposta: "", adres: "", uzmanlikAlani: "", sifre: ""
      });
      setSelectedPosition(null);
      setEditingId(null);
      listeleVeterinerler();
    } catch (error) {
      console.error("Kayıt hatası:", error);
      setMesaj("Kayıt başarısız ❌");
      setTimeout(() => setMesaj(""), 3000);
    }
  };

  const listeleVeterinerler = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/veterinerler");
      setVeterinerler(res.data);
    } catch (error) {
      console.error("Listeleme hatası:", error);
    }
  };

  const handleEdit = (v) => {
    setForm(v);
    setEditingId(v.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/veterinerler/${id}`);
      listeleVeterinerler();
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };

  const inputStyle = {
    padding: "10px",
    margin: "5px",
    borderRadius: "6px",
    width: "200px"
  };

  return (
    <div style={{ padding: "30px", background: "linear-gradient(to right, #f0fff4, #d0f0c0)", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Veteriner Bilgileri</h2>

      {mesaj && (
        <div style={{ textAlign: "center", color: "#2e7d32", fontWeight: "bold", marginBottom: "15px" }}>{mesaj}</div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}
      >
        <input name="ad" value={form.ad} onChange={handleChange} placeholder="Ad" style={inputStyle} />
        <input name="soyad" value={form.soyad} onChange={handleChange} placeholder="Soyad" style={inputStyle} />
        <input name="telefon" value={form.telefon} onChange={handleChange} placeholder="Telefon" style={inputStyle} />
        <input name="eposta" value={form.eposta} onChange={handleChange} placeholder="E-posta" style={inputStyle} />
        <input name="uzmanlikAlani" value={form.uzmanlikAlani} onChange={handleChange} placeholder="Uzmanlık Alanı" style={inputStyle} />
        <input name="sifre" value={form.sifre} onChange={handleChange} placeholder="Şifre" style={inputStyle} />

        <input name="adres" value={form.adres} readOnly placeholder="Haritadan adres seçin" style={{ ...inputStyle, backgroundColor: "#e0e0e0" }} />

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#388e3c", color: "white", border: "none", borderRadius: "6px" }}>
            {editingId ? "Güncelle" : "Kaydet"}
          </button>
          <button type="button" onClick={listeleVeterinerler} style={{ padding: "10px 20px", backgroundColor: "#1976d2", color: "white", border: "none", borderRadius: "6px" }}>
            Listele
          </button>
        </div>
      </form>

      <div style={{ width: "90%", height: "300px", margin: "30px auto", borderRadius: "10px", overflow: "hidden" }}>
        <MapContainer center={[39.92, 32.85]} zoom={6} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <KonumSecici onKonumSec={handleMapClick} />
          {selectedPosition && <Marker position={selectedPosition} />}
        </MapContainer>
      </div>

      
      <div style={{ width: "95%", margin: "30px auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white" }}>
          <thead>
            <tr>
              <th>Ad</th>
              <th>Soyad</th>
              <th>Telefon</th>
              <th>Eposta</th>
              <th>Uzmanlık</th>
              <th>Adres</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {veterinerler.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: "center", padding: "10px" }}>Veri bulunamadı</td></tr>
            ) : (
              veterinerler.map((v) => (
                <tr key={v.id}>
                  <td>{v.ad}</td>
                  <td>{v.soyad}</td>
                  <td>{v.telefon}</td>
                  <td>{v.eposta}</td>
                  <td>{v.uzmanlikAlani}</td>
                  <td>{v.adres}</td>
                  <td>
                    <button onClick={() => handleEdit(v)} style={{ backgroundColor: "#ffa000", color: "white", border: "none", padding: "5px 10px", marginRight: "5px", borderRadius: "4px" }}>Düzenle</button>
                    <button onClick={() => handleDelete(v.id)} style={{ backgroundColor: "#e53935", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px" }}>Sil</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VeterinerBilgileriPage;
