import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import "./IklimVerisiPage.css";

const IklimVerisiPage = () => {
  const [veri, setVeri] = useState({
    sicaklik: "",
    nem: "",
    ruzgarHizi: "",
    yagisMiktari: "",
    olcumTarihi: "",
  });
  const [veriler, setVeriler] = useState([]);
  const [guncelleId, setGuncelleId] = useState(null);
  const [uyari, setUyari] = useState("");
  const [goster, setGoster] = useState(false);

  const listele = () => {
    axios.get("http://localhost:8080/api/iklimverisi").then((res) => {
      setVeriler(res.data);
      setGoster(true);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...veri,
      barinak: null
    };
    const request = guncelleId
      ? axios.put(`http://localhost:8080/api/iklimverisi/${guncelleId}`, payload)
      : axios.post("http://localhost:8080/api/iklimverisi", payload);

    request.then(() => {
      alert(guncelleId ? "Veri güncellendi" : "Veri kaydedildi");
      setVeri({
        sicaklik: "",
        nem: "",
        ruzgarHizi: "",
        yagisMiktari: "",
        olcumTarihi: "",
      });
      setGuncelleId(null);
      setUyari("");
      listele();
    });
  };

  const handleSil = (id) => {
    axios.delete(`http://localhost:8080/api/iklimverisi/${id}`).then(() => {
      alert("Veri silindi");
      listele();
    });
  };

  const handleGuncelle = (veri) => {
    setVeri(veri);
    setGuncelleId(veri.id);
  };
  useEffect(() => {
  document.body.classList.add("iklim-bg");
  return () => {
    document.body.classList.remove("iklim-bg");
  };
}, []);


  useEffect(() => {
    const s = parseFloat(veri.sicaklik);
    const n = parseFloat(veri.nem);
    const r = parseFloat(veri.ruzgarHizi);
    const y = parseFloat(veri.yagisMiktari);

    let mesajlar = [];
    if (s > 35) mesajlar.push("🔥 Yüksek sıcaklık – Isı stresi riski!");
    if (n > 90) mesajlar.push("💧 Aşırı nem – Hastalık riski!");
    if (r > 40) mesajlar.push("🌪️ Şiddetli rüzgar – Barınaklara dikkat!");
    if (y > 20) mesajlar.push("☔ Aşırı yağış – Sel/çamur riski!");

    if (mesajlar.length > 0) {
      setUyari(mesajlar.join("\n"));
    } else {
      setUyari("ℹ️ Değerler normal aralıkta.");
    }
  }, [veri.sicaklik, veri.nem, veri.ruzgarHizi, veri.yagisMiktari]);

  return (
    <div className="iklim-container">
      <h2>İklim Verisi Girişi</h2>
      {uyari && <div className={`iklim-uyari ${uyari.includes("❗") || uyari.includes("🔥") || uyari.includes("💧") || uyari.includes("🌪️") || uyari.includes("☔") ? "kritik" : "normal"}`}>{uyari}</div>}

      <form className="iklim-form" onSubmit={handleSubmit}>
        <input type="number" step="any" placeholder="Sıcaklık (°C)" value={veri.sicaklik} onChange={(e) => setVeri({ ...veri, sicaklik: e.target.value })} required />
        <input type="number" step="any" placeholder="Nem (%)" value={veri.nem} onChange={(e) => setVeri({ ...veri, nem: e.target.value })} required />
        <input type="number" step="any" placeholder="Rüzgar Hızı (km/h)" value={veri.ruzgarHizi} onChange={(e) => setVeri({ ...veri, ruzgarHizi: e.target.value })} />
        <input type="number" step="any" placeholder="Yağış Miktarı (mm)" value={veri.yagisMiktari} onChange={(e) => setVeri({ ...veri, yagisMiktari: e.target.value })} />
        <input type="datetime-local" value={veri.olcumTarihi} onChange={(e) => setVeri({ ...veri, olcumTarihi: e.target.value })} required />
        <button type="submit">{guncelleId ? "Güncelle" : "Kaydet"}</button>
      </form>

      <button className="listele-btn" onClick={listele}>Verileri Listele</button>

      {goster && veriler.length > 0 && (
        <>
          <div className="iklim-legend">
            <span className="sicaklik">● Sıcaklık (°C)</span>
            <span className="nem">● Nem (%)</span>
            <span className="yagis">● Yağış (mm)</span>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={veriler}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="olcumTarihi" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sicaklik" stroke="#ff7300" name="Sıcaklık (°C)" />
              <Line type="monotone" dataKey="nem" stroke="#387908" name="Nem (%)" />
              <Line type="monotone" dataKey="yagisMiktari" stroke="#0088FE" name="Yağış (mm)" />
            </LineChart>
          </ResponsiveContainer>

          <h3 className="iklim-veri-baslik">Kaydedilen Veriler</h3>
          <table className="iklim-table">
            <thead>
              <tr>
                <th>Sıcaklık</th>
                <th>Nem</th>
                <th>Rüzgar</th>
                <th>Yağış</th>
                <th>Ölçüm Tarihi</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {veriler.map((v) => (
                <tr key={v.id}>
                  <td>{v.sicaklik}°C</td>
                  <td>{v.nem}%</td>
                  <td>{v.ruzgarHizi} km/h</td>
                  <td>{v.yagisMiktari} mm</td>
                  <td>{v.olcumTarihi?.replace("T", " ")}</td>
                  <td>
                    <button className="guncelle-btn" onClick={() => handleGuncelle(v)}>Güncelle</button>
                    <button className="sil-btn" onClick={() => handleSil(v.id)}>Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default IklimVerisiPage;
