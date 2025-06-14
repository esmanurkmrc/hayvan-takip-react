import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./SalginHastaliklarPage.css";


const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: redIcon.options.iconUrl,
  shadowUrl: redIcon.options.shadowUrl,
});


const HaritaSecici = ({ onKonumSec }) => {
  const [konum, setKonum] = useState([39.9208, 32.8541]); // Ankara

  const HaritaTiklama = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        setKonum([lat, lng]);

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await response.json();
        const adres = data.display_name || `${lat}, ${lng}`;
        onKonumSec(adres);
      },
    });
    return null;
  };

  return (
    <MapContainer center={konum} zoom={6} style={{ height: "300px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={konum} />
      <HaritaTiklama />
    </MapContainer>
  );
};


const SalginHastaliklarPage = () => {
  const [hastaliklar, setHastaliklar] = useState([]);
  const [verilerGorunsunMu, setVerilerGorunsunMu] = useState(false);
  const [form, setForm] = useState({
    ad: "",
    belirtiler: "",
    yayilmaDurumu: "",
    korunmaYontemleri: "",
    etkiledigiTurler: "",
    aciklama: "",
    konum: ""
  });
  const [editingId, setEditingId] = useState(null);

  const listeleHastaliklar = async () => {
    const response = await axios.get("http://localhost:8080/api/salgin-hastaliklar");
    setHastaliklar(response.data);
    setVerilerGorunsunMu(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
useEffect(() => {
  document.body.className = "salgin-bg";
  return () => { document.body.className = ""; };
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`http://localhost:8080/api/salgin-hastaliklar/${editingId}`, form);
    } else {
      await axios.post("http://localhost:8080/api/salgin-hastaliklar", form);
    }
    setForm({
      ad: "",
      belirtiler: "",
      yayilmaDurumu: "",
      korunmaYontemleri: "",
      etkiledigiTurler: "",
      aciklama: "",
      konum: ""
    });
    setEditingId(null);
    listeleHastaliklar();
  };

  const handleEdit = (h) => {
    setForm(h);
    setEditingId(h.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8080/api/salgin-hastaliklar/${id}`);
    listeleHastaliklar();
  };

  return (
    <div className="salgin-container">
      <h2>Salgın Hastalıklar Yönetimi</h2>

      <form onSubmit={handleSubmit} className="salgin-form">
        <input type="text" name="ad" placeholder="Ad" value={form.ad} onChange={handleChange} required />
        <input type="text" name="belirtiler" placeholder="Belirtiler" value={form.belirtiler} onChange={handleChange} />
        <input type="text" name="yayilmaDurumu" placeholder="Yayılma Durumu" value={form.yayilmaDurumu} onChange={handleChange} />
        <input type="text" name="korunmaYontemleri" placeholder="Korunma Yöntemleri" value={form.korunmaYontemleri} onChange={handleChange} />
        <input type="text" name="etkiledigiTurler" placeholder="Etkilediği Türler" value={form.etkiledigiTurler} onChange={handleChange} />
        <textarea name="aciklama" placeholder="Açıklama" value={form.aciklama} onChange={handleChange}></textarea>

        <label><strong>Haritadan Konum Seç:</strong></label>
        <HaritaSecici onKonumSec={(adres) => setForm({ ...form, konum: adres })} />
        <p><strong>Seçilen Konum:</strong> {form.konum}</p>

        <button type="submit">{editingId ? "Güncelle" : "Ekle"}</button>
        <button type="button" onClick={listeleHastaliklar}>Listele</button>
      </form>

      {verilerGorunsunMu && (
        <div className="salgin-table-wrapper">
          <table className="salgin-table">
            <thead>
              <tr>
                <th>Ad</th>
                <th>Belirtiler</th>
                <th>Yayılma</th>
                <th>Korunma</th>
                <th>Türler</th>
                <th>Konum</th>
                <th>Açıklama</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {hastaliklar.map((h) => (
                <tr key={h.id}>
                  <td>{h.ad}</td>
                  <td>{h.belirtiler}</td>
                  <td>{h.yayilmaDurumu}</td>
                  <td>{h.korunmaYontemleri}</td>
                  <td>{h.etkiledigiTurler}</td>
                  <td>{h.konum}</td>
                  <td>{h.aciklama}</td>
                  <td>
                    <button onClick={() => handleEdit(h)}>Düzenle</button>
                    <button onClick={() => handleDelete(h.id)}>Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          

          <SalginHaritaGorunumu hastaliklar={hastaliklar} />
        </div>
      )}
    </div>
  );
};


const SalginHaritaGorunumu = ({ hastaliklar }) => {
  const [koordinatlar, setKoordinatlar] = useState([]);

  useEffect(() => {
    const fetchCoords = async () => {
      const coords = await Promise.all(
        hastaliklar.map(async (h) => {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
                h.konum
              )}&format=json&limit=1`
            );
            const data = await res.json();
            if (data.length > 0) {
              return {
                id: h.id,
                ad: h.ad,
                konum: h.konum,
                enlem: parseFloat(data[0].lat),
                boylam: parseFloat(data[0].lon),
                yayilmaDurumu: h.yayilmaDurumu,
                belirtiler: h.belirtiler,
              };
            }
          } catch (error) {
            console.error("Koordinat hatası:", h.konum, error);
          }
          return null;
        })
      );
      setKoordinatlar(coords.filter(Boolean));
    };

    if (hastaliklar.length > 0) fetchCoords();
  }, [hastaliklar]);

  return (
    <div style={{ padding: "20px", marginTop: "40px" }}>
      <h2>Salgın Harita Görünümü</h2>
      <MapContainer center={[39.9208, 32.8541]} zoom={6} style={{ height: "600px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {koordinatlar.map((k) => (
          <Marker key={k.id} position={[k.enlem, k.boylam]} icon={redIcon}>
            <Popup>
              <strong>{k.ad}</strong><br />
              {k.konum}<br />
              <i>Yayılma: {k.yayilmaDurumu}</i><br />
              <i>Belirtiler: {k.belirtiler}</i>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default SalginHastaliklarPage;
