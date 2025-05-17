import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaVirus, FaPills, FaClinicMedical, FaChevronDown, FaChevronUp, FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import "./IlaclarPage.css";

const IlaclarPage = () => {
  const [hastaliklar, setHastaliklar] = useState([]);
  const [ilaclar, setIlaclar] = useState([]);
  const [secilenHastalikId, setSecilenHastalikId] = useState("");
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [roleId, setRoleId] = useState("1");
  const [ilacAdiFiltre, setIlacAdiFiltre] = useState("");

  const [yeniEsleme, setYeniEsleme] = useState({ hastalikId: "", ilacId: "", aciklama: "" });

  useEffect(() => {
    hastaliklariGetir();
    const role = localStorage.getItem("roleId") || "1";
    setRoleId(role);
  }, []);

  const hastaliklariGetir = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/hastaliklar");
      setHastaliklar(res.data);
    } catch (err) {
      console.error("Hastalıklar getirilemedi", err);
    }
  };

  const ilaclariGetir = async (hastalikId) => {
    try {
      const url = hastalikId
        ? `http://localhost:8080/api/hastalik-ilac/hastalik/${hastalikId}`
        : `http://localhost:8080/api/hastalik-ilac`;
      const res = await axios.get(url);
      setIlaclar(res.data);
    } catch (err) {
      console.error("İlaçlar getirilemedi", err);
    }
  };

  const handleHastalikSecimi = (e) => {
    const id = e.target.value;
    setSecilenHastalikId(id);
  };

  const handleListele = () => {
    ilaclariGetir(secilenHastalikId);
  };

  const toggleExpand = (id) => {
    setExpandedItemId(expandedItemId === id ? null : id);
  };

  const handleEslemeChange = (e) => {
    const { name, value } = e.target;
    setYeniEsleme(prev => ({ ...prev, [name]: value }));
  };

  const handleEslemeEkle = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/hastalik-ilac", yeniEsleme);
      alert("Eşleme başarıyla eklendi.");
      if (secilenHastalikId === yeniEsleme.hastalikId) {
        ilaclariGetir(secilenHastalikId);
      }
      setYeniEsleme({ hastalikId: "", ilacId: "", aciklama: "" });
    } catch (err) {
      alert("Eşleme eklenemedi.");
    }
  };

  const handleDeleteEsleme = async (id) => {
    if (!window.confirm("Bu eşlemeyi silmek istediğinize emin misiniz?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/hastalik-ilac/${id}`);
      ilaclariGetir(secilenHastalikId);
    } catch (err) {
      alert("Silme işlemi başarısız oldu.");
    }
  };

  const filtrelenmisIlaclar = ilaclar.filter(item =>
    item.ilacId.toString().includes(ilacAdiFiltre.trim()) ||
    item.aciklama?.toLowerCase().includes(ilacAdiFiltre.toLowerCase())
  );

  return (
    <div className="hastalikilac-container">
      <h2>
        <FaVirus className="icon" /> Hastalık - İlaç Eşleşmesi
      </h2>

      <div className="form-section">
        <label htmlFor="hastalik-select">
          <FaClinicMedical className="icon" />Hastalık Seç:
        </label>
        <select id="hastalik-select" value={secilenHastalikId} onChange={handleHastalikSecimi}>
          <option value="">-- Hastalık Seçin --</option>
          {hastaliklar.map((h) => (
            <option key={h.id} value={h.id}>{h.hastalikAdi}</option>
          ))}
        </select>
        <button onClick={handleListele} className="listele-button">Listele</button>
      </div>

      <div className="form-section">
        <label>İlaç Arama:</label>
        <input
          type="text"
          placeholder="İlaç ID ya da açıklama"
          value={ilacAdiFiltre}
          onChange={(e) => setIlacAdiFiltre(e.target.value)}
        />
      </div>

      {roleId === "2" && (
        <form className="esleme-ekle-form" onSubmit={handleEslemeEkle}>
          <h4><FaPlusCircle className="icon" />Yeni Eşleme Ekle</h4>
          <input type="text" name="hastalikId" placeholder="Hastalık ID" value={yeniEsleme.hastalikId} onChange={handleEslemeChange} required />
          <input type="text" name="ilacId" placeholder="İlaç ID" value={yeniEsleme.ilacId} onChange={handleEslemeChange} required />
          <textarea name="aciklama" placeholder="Açıklama" value={yeniEsleme.aciklama} onChange={handleEslemeChange} />
          <button type="submit">Ekle</button>
        </form>
      )}

      <div className="ilaclar-section">
        <ul className="ilac-listesi">
          {filtrelenmisIlaclar.map((item) => (
            <li key={item.id} onClick={() => toggleExpand(item.id)}>
              <div className="ilac-header">
                <span><strong>İlaç ID:</strong> {item.ilacId}</span>
                <div>
                  {roleId === "2" && (
                    <FaTrashAlt
                      className="delete-icon"
                      title="Sil"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEsleme(item.id);
                      }}
                    />
                  )}
                  {expandedItemId === item.id ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>
              {expandedItemId === item.id && (
                <div className="ilac-detay">
                  <strong>Hastalık ID:</strong> {item.hastalikId} <br />
                  <strong>Açıklama:</strong> {item.aciklama}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default IlaclarPage;
