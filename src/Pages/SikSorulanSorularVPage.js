import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./SikSorulanSorularVPage.css";

const API_URL = "http://localhost:8080/api/sorular";

const SikSorulanSorularVPage = () => {
  const [sorular, setSorular] = useState([]);
  const [editId, setEditId] = useState(null);
  const [cevap, setCevap] = useState("");
  const [istatistik, setIstatistik] = useState({
    toplam: 0,
    cevaplanan: 0,
    eksik: 0,
  });

  useEffect(() => {
    listeleSorular();
  }, []);

  const listeleSorular = async () => {
    try {
      const res = await axios.get(API_URL);
      setSorular(res.data);

      const toplam = res.data.length;
      const cevaplanan = res.data.filter(
        (s) => s.cevap && s.cevap.trim() !== "" && s.cevap !== "-"
      ).length;
      const eksik = toplam - cevaplanan;
      setIstatistik({ toplam, cevaplanan, eksik });
    } catch (err) {
      console.error("Listeleme hatası:", err);
    }
  };

  const cevapKaydet = async () => {
    try {
      const soru = sorular.find((s) => s.id === editId);
      const guncel = {
        soru: soru.soru,
        kategori: soru.kategori,
        cevap: cevap
      };
      await axios.put(`${API_URL}/${editId}`, guncel);
      setEditId(null);
      setCevap("");
      listeleSorular();
    } catch (err) {
      console.error("Cevap kaydı hatası:", err);
    }
  };

  const soruSil = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      listeleSorular();
    } catch (err) {
      console.error("Silme hatası:", err);
    }
  };

  const formuHazirla = (soru) => {
    setEditId(soru.id);
    setCevap(soru.cevap || "");
  };

  const pdfIndir = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Sık Sorulan Sorular", 14, 15);

    const rows = sorular.map((s) => [
      s.soru,
      s.kategori,
      s.cevap || "Henüz cevaplanmadı."
    ]);

    autoTable(doc, {
      head: [["Soru", "Kategori", "Cevap"]],
      body: rows,
      startY: 20
    });

    doc.save("sik-sorulan-sorular.pdf");
  };

  return (
    <div className="sss-container">
      <h2>Sık Sorulan Sorular</h2>

      <div className="sss-istatistik-kutusu">
        <div className="istatistik-kart toplam">Toplam Soru: {istatistik.toplam}</div>
        <div className="istatistik-kart cevaplanan">Cevaplanan: {istatistik.cevaplanan}</div>
        <div className="istatistik-kart eksik">Cevapsız: {istatistik.eksik}</div>
      </div>

      <button onClick={pdfIndir}>PDF Olarak İndir</button>

      <div className="sss-list">
        {sorular.map((s) => {
          const kartSinifi =
            s.cevap && s.cevap.trim() !== "" && s.cevap !== "-"
              ? "cevapli"
              : "cevapsiz";

          return (
            <div className={`sss-card ${kartSinifi}`} key={s.id}>
              <p><strong>Soru:</strong> {s.soru}</p>
              <p><strong>Kategori:</strong> {s.kategori}</p>
              <p><strong>Cevap:</strong> {s.cevap || "Henüz cevaplanmadı."}</p>
              <p className="sss-date">{new Date(s.eklenmeTarihi).toLocaleString()}</p>

              <div className="sss-actions">
                <button onClick={() => formuHazirla(s)}>Cevapla</button>
                <button onClick={() => soruSil(s.id)}>Sil</button>
              </div>

              {editId === s.id && (
                <div style={{ marginTop: "10px" }}>
                  <textarea
                    value={cevap}
                    onChange={(e) => setCevap(e.target.value)}
                    placeholder="Cevap giriniz..."
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "8px",
                      marginBottom: "8px",
                      borderRadius: "5px",
                      border: "1px solid #ccc"
                    }}
                  />
                  <button onClick={cevapKaydet}>Kaydet</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SikSorulanSorularVPage;
