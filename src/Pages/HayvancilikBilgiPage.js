import React, { useState } from "react";
import axios from "axios";
import "./HayvancilikBilgiPagev.css";

const HayvancilikBilgiPage = () => {
  const [bilgiler, setBilgiler] = useState([]);
  const [arama, setArama] = useState("");
  const [kategori, setKategori] = useState("");

  const kategoriListesi = ["Beslenme", "Aşılama", "Barınak", "Hastalık", "Verimlilik"];

  const handleArama = async () => {
    if (arama.trim() === "") return;
    try {
      const response = await axios.get(`http://localhost:8080/api/hayvancilik-bilgileri/arama?baslik=${arama}`);
      setBilgiler(response.data);
    } catch (error) {
      console.error("Arama hatası:", error);
    }
  };

  const handleKategori = async (e) => {
    const secilen = e.target.value;
    setKategori(secilen);
    if (secilen === "") {
      setBilgiler([]); // hiçbir şey göstermemek için
    } else {
      try {
        const response = await axios.get(`http://localhost:8080/api/hayvancilik-bilgileri/kategori?kategori=${secilen}`);
        setBilgiler(response.data);
      } catch (error) {
        console.error("Kategori hatası:", error);
      }
    }
  };

  return (
    <div className="bilgi-sayfasi">
      <h2>Hayvancılık Bilgi Merkezi</h2>

      <div className="filtre-panel">
        <input
          type="text"
          placeholder="Başlığa göre ara..."
          value={arama}
          onChange={(e) => setArama(e.target.value)}
        />
        <button onClick={handleArama}>Ara</button>

        <select value={kategori} onChange={handleKategori}>
          <option value="">Kategori Seç</option>
          {kategoriListesi.map((kat, index) => (
            <option key={index} value={kat}>
              {kat}
            </option>
          ))}
        </select>
      </div>

      {bilgiler.length > 0 && (
        <div className="bilgi-listesi">
          {bilgiler.map((b) => (
            <div key={b.id} className="bilgi-karti">
              <h3>{b.baslik}</h3>
              <p><strong>Kategori:</strong> {b.kategori}</p>
              <p>{b.icerik}</p>
              {b.kaynak && <p><em>Kaynak: {b.kaynak}</em></p>}
              {b.resimUrl && <img src={b.resimUrl} alt="Bilgi görseli" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HayvancilikBilgiPage;
