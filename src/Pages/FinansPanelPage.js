import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./FinansPanelPage.css";

const FinansPanelPage = () => {
  const [veriler, setVeriler] = useState([]);
  const [form, setForm] = useState({
    id: null,
    kaynak: "",
    kategori: "",
    tutar: "",
    tarih: "",
    tip: ""
  });
   useEffect(() => {
  document.body.className = "finans-bg";
  return () => {
    document.body.className = "";
  };
}, []);

  const [listeleAktif, setListeleAktif] = useState(false);

  useEffect(() => {
    fetchVeriler();
  }, []);

  const fetchVeriler = async () => {
    try {
      const gelirRes = await axios.get("http://localhost:8080/api/gelirler");
      const giderRes = await axios.get("http://localhost:8080/api/giderler");

      const gelirVeri = gelirRes.data.map(g => ({
        id: g.id,
        kaynak: g.kaynak,
        tutar: parseFloat(g.tutar) || 0,
        tarih: g.tarih,
        tip: "gelir"
      }));

      const giderVeri = giderRes.data.map(g => ({
        id: g.id,
        kategori: g.kategori,
        tutar: parseFloat(g.tutar) || 0,
        tarih: g.tarih,
        tip: "gider"
      }));

      setVeriler([...gelirVeri, ...giderVeri]);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEkle = async () => {
    if ((form.tip === "gelir" && !form.kaynak) || !form.tutar || !form.tarih || !form.tip) {
      return alert("Lütfen tüm gerekli alanları doldurun.");
    }

    if (isNaN(form.tutar) || parseFloat(form.tutar) <= 0) {
      return alert("Geçerli bir tutar giriniz.");
    }

    try {
      const url =
        form.tip === "gelir"
          ? "http://localhost:8080/api/gelirler"
          : "http://localhost:8080/api/giderler";

      const payload =
        form.tip === "gelir"
          ? {
              kaynak: form.kaynak,
              tutar: parseFloat(form.tutar),
              tarih: form.tarih
            }
          : {
              kategori: form.kategori,
              tutar: parseFloat(form.tutar),
              tarih: form.tarih
            };

      if (form.id) {
        await axios.put(`${url}/${form.id}`, payload);
      } else {
        await axios.post(url, payload);
      }

      setForm({ id: null, kaynak: "", kategori: "", tutar: "", tarih: "", tip: "" });
      setListeleAktif(true);
      fetchVeriler();
    } catch (error) {
      console.error("Ekleme/Güncelleme hatası:", error);
    }
  };

  const handleDuzenle = (item) => {
    setForm({
      id: item.id,
      kaynak: item.kaynak || "",
      kategori: item.kategori || "",
      tutar: item.tutar,
      tarih: item.tarih,
      tip: item.tip
    });
  };

  const handleSil = async (item) => {
    const url =
      item.tip === "gelir"
        ? `http://localhost:8080/api/gelirler/${item.id}`
        : `http://localhost:8080/api/giderler/${item.id}`;

    try {
      await axios.delete(url);
      fetchVeriler();
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };

  const handlePdfExport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Finansal İşlem Raporu", 14, 22);
    doc.setFontSize(12);
    doc.text(`Tarih: ${new Date().toLocaleDateString()}`, 14, 30);

    const tableColumn = ["ID", "Açıklama", "Tutar", "Tarih", "Tip"];
    const tableRows = veriler.map((item) => [
      item.id,
      item.tip === "gelir" ? item.kaynak : item.kategori,
      item.tutar,
      item.tarih,
      item.tip
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: "striped"
    });

    doc.save("finans-raporu.pdf");
  };

  const grafikVerisi = Object.values(
    veriler
      .filter(item => item.tarih)
      .reduce((map, item) => {
        const ay = item.tarih.substring(0, 7);
        if (!map[ay]) map[ay] = { ay, gelir: 0, gider: 0 };
        if (item.tip === "gelir") map[ay].gelir += item.tutar;
        if (item.tip === "gider") map[ay].gider += item.tutar;
        return map;
      }, {})
  );

  return (
    <div className="finans-container">
      <h2>Finans Paneli</h2>

      <div className="form-alani">
        <select name="tip" value={form.tip} onChange={handleChange}>
          <option value="">Tip Seç</option>
          <option value="gelir">Gelir</option>
          <option value="gider">Gider</option>
        </select>

        {form.tip === "gelir" && (
          <input
            type="text"
            name="kaynak"
            placeholder="Gelir Kaynağı"
            value={form.kaynak}
            onChange={handleChange}
          />
        )}

        {form.tip === "gider" && (
          <input
            type="text"
            name="kategori"
            placeholder="Gider Kategorisi"
            value={form.kategori}
            onChange={handleChange}
          />
        )}

        <input
          type="number"
          name="tutar"
          placeholder="Tutar"
          value={form.tutar}
          onChange={handleChange}
        />
        <input
          type="date"
          name="tarih"
          value={form.tarih}
          onChange={handleChange}
        />

        <button onClick={handleEkle}>{form.id ? "Güncelle" : "Ekle"}</button>
        <button onClick={() => setListeleAktif(true)}>Listele</button>
      </div>

      <div className="grafik-alani">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={grafikVerisi}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ay" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="gelir" fill="#4caf50" name="Gelir (₺)" />
            <Bar dataKey="gider" fill="#f44336" name="Gider (₺)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <button onClick={handlePdfExport} style={{
          padding: "10px 20px",
          backgroundColor: "#26a69a",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold"
        }}>
          PDF Olarak İndir
        </button>
      </div>

      {listeleAktif && (
        <div className="liste">
          <h3>İşlem Listesi</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Açıklama</th>
                <th>Tutar</th>
                <th>Tarih</th>
                <th>Tip</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {veriler.map((item, i) => (
                <tr key={i}>
                  <td>{item.id}</td>
                  <td>{item.tip === "gelir" ? item.kaynak : item.kategori}</td>
                  <td>{item.tutar}</td>
                  <td>{item.tarih}</td>
                  <td>{item.tip}</td>
                  <td>
                    <button onClick={() => handleDuzenle(item)}>Düzenle</button>
                    <button onClick={() => handleSil(item)}>Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FinansPanelPage;
