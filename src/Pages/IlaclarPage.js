import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaVirus, FaClinicMedical, FaPlusCircle, FaTrashAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";
import "./IlaclarPage.css";

const IlaclarPage = () => {
  const [hastaliklar, setHastaliklar] = useState([]);
  const [eslesmeler, setEslesmeler] = useState([]);
  const [secilenHastalikId, setSecilenHastalikId] = useState("");
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [roleId, setRoleId] = useState("1");

  const [yeniEsleme, setYeniEsleme] = useState({
    hastalikId: "",
    ilacId: "",
    aciklama: ""
  });

  useEffect(() => {
    getHastaliklar();
    const role = localStorage.getItem("roleId") || "1";
    setRoleId(role);
  }, []);

  const getHastaliklar = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/hastaliklar");
      setHastaliklar(res.data);
    } catch (err) {
      console.error("Hastalıklar getirilemedi", err);
    }
  };

  const getEslesmeler = async (hastalikId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/hastalik-ilac/hastalik/${hastalikId}`);
      setEslesmeler(res.data);

     
      if (res.data.length > 0) {
        const ilk = res.data[0];
        setYeniEsleme({
          hastalikId: ilk.hastalikId,
          ilacId: ilk.ilacId,
          aciklama: ilk.aciklama
        });
      } else {
        setYeniEsleme({ hastalikId, ilacId: "", aciklama: "" });
      }
    } catch (err) {
      console.error("Eşleşmeler getirilemedi", err);
    }
  };

  const handleHastalikSecimi = (e) => {
    const id = e.target.value;
    setSecilenHastalikId(id);
    getEslesmeler(id);
  };

  const handleEslemeEkle = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/hastalik-ilac", yeniEsleme);
      alert("Eşleme başarıyla eklendi.");
      getEslesmeler(secilenHastalikId);
    } catch (err) {
      alert("Eşleme eklenemedi.");
    }
  };

  const handleDeleteEsleme = async (id) => {
    if (!window.confirm("Bu eşlemeyi silmek istediğinize emin misiniz?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/hastalik-ilac/${id}`);
      getEslesmeler(secilenHastalikId);
    } catch (err) {
      alert("Silme işlemi başarısız oldu.");
    }
  };

  const toggleExpand = (id) => {
    setExpandedItemId(expandedItemId === id ? null : id);
  };

  return (
    <div className="hastalikilac-container">
      <h2><FaVirus className="icon" /> Hastalık - İlaç Eşleşmesi</h2>

      <div className="form-section">
        <label htmlFor="hastalik-select"><FaClinicMedical className="icon" /> Hastalık Seç:</label>
        <select id="hastalik-select" value={secilenHastalikId} onChange={handleHastalikSecimi}>
          <option value="">-- Hastalık Seçin --</option>
          {hastaliklar.map(h => (
            <option key={h.id} value={h.id}>{h.hastalikAdi}</option>
          ))}
        </select>
      </div>

      {roleId === "2" && (
        <form className="esleme-ekle-form" onSubmit={handleEslemeEkle}>
          <h4><FaPlusCircle className="icon" /> Yeni Eşleme Ekle</h4>

         
          <input type="hidden" name="hastalikId" value={yeniEsleme.hastalikId} readOnly />

         
          <input
            type="text"
            name="ilacId"
            value={yeniEsleme.ilacId}
            readOnly
            placeholder="İlaç ID"
          />

          <textarea
            name="aciklama"
            placeholder="Açıklama"
            value={yeniEsleme.aciklama}
            readOnly
          />
          <button type="submit">Ekle</button>
        </form>
      )}

      <div className="ilaclar-section">
        <ul className="ilac-listesi">
          {eslesmeler.map((item) => (
            <li key={item.id} onClick={() => toggleExpand(item.id)}>
              <div className="ilac-header">
                <span><strong>İlaç:</strong> {item.ilacAdi}</span>
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
                  <strong>Hastalık:</strong> {item.hastalikAdi} <br />
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
