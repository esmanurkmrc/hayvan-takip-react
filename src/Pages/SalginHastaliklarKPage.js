import React, { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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


const SalginHastaliklarKPage = () => {
  const [hastaliklar, setHastaliklar] = useState([]);
  const [koordinatlar, setKoordinatlar] = useState([]);
  const [verilerYuklendi, setVerilerYuklendi] = useState(false);

  const listele = async () => {
    const response = await axios.get("http://localhost:8080/api/salgin-hastaliklar");
    const hastalikListesi = response.data;
    setHastaliklar(hastalikListesi);
    setVerilerYuklendi(true);

   
    const coords = await Promise.all(
      hastalikListesi.map(async (h) => {
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

  return (
    <div className="salgin-container">
      <h2>Salgın Hastalıklar</h2>
      <button className="listele-btn" onClick={listele}>Listele</button>

      {verilerYuklendi && (
        <>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ padding: "20px", marginTop: "20px" }}>
            <h2>Salgın Harita Görünümü</h2>
            <MapContainer center={[39.9208, 32.8541]} zoom={6} style={{ height: "500px", width: "100%" }}>
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
        </>
      )}
    </div>
  );
};

export default SalginHastaliklarKPage;
