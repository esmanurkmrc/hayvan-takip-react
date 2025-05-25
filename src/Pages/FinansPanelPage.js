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
    urun: "",
    kategori: "",
    miktar: "",
    tarih: "",
    tip: ""
  });
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
        urun: g.urunAdi,
        kategori: g.kategori,
        miktar: parseFloat(g.miktar) || 0,
        tarih: g.tarih,
        tip: "gelir"
      }));

      const giderVeri = giderRes.data.map(g => ({
        id: g.id,
        urun: g.harcamaAdi,
        kategori: g.kategori,
        miktar: parseFloat(g.miktar) || 0,
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
    if (!form.urun || !form.kategori || !form.miktar || !form.tarih || !form.tip) {
      return alert("Lütfen tüm alanları doldurun.");
    }

    try {
      const url =
        form.tip === "gelir"
          ? "http://localhost:8080/api/gelirler"
          : "http://localhost:8080/api/giderler";

      const payload =
        form.tip === "gelir"
          ? {
              urunAdi: form.urun,
              kategori: form.kategori,
              miktar: parseFloat(form.miktar) || 0,
              tarih: form.tarih
            }
          : {
              harcamaAdi: form.urun,
              kategori: form.kategori,
              miktar: parseFloat(form.miktar) || 0,
              tarih: form.tarih
            };

      if (form.id) {
        await axios.put(`${url}/${form.id}`, payload);
      } else {
        await axios.post(url, payload);
      }

      setForm({ id: null, urun: "", kategori: "", miktar: "", tarih: "", tip: "" });
      setListeleAktif(true);
      fetchVeriler();
    } catch (error) {
      console.error("Ekleme/Güncelleme hatası:", error);
    }
  };

  const handleDuzenle = (item) => {
    setForm({
      id: item.id,
      urun: item.urun,
      kategori: item.kategori,
      miktar: item.miktar,
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

    const tableColumn = ["ID", "Ürün/Harcama", "Kategori", "Miktar", "Tarih", "Tip"];
    const tableRows = veriler.map((item) => [
      item.id,
      item.urun,
      item.kategori,
      item.miktar,
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
        if (item.tip === "gelir") map[ay].gelir += item.miktar;
        if (item.tip === "gider") map[ay].gider += item.miktar;
        return map;
      }, {})
  );

  return (
    <div className="finans-container">
      <h2>Finans Paneli</h2>

      <div className="form-alani">
        <input type="text" name="urun" placeholder="Ürün / Harcama" value={form.urun} onChange={handleChange} />
        <input type="text" name="kategori" placeholder="Kategori" value={form.kategori} onChange={handleChange} />
        <input type="number" name="miktar" placeholder="Miktar" value={form.miktar} onChange={handleChange} />
        <input type="date" name="tarih" value={form.tarih} onChange={handleChange} />
        <select name="tip" value={form.tip} onChange={handleChange}>
          <option value="">Tip Seç</option>
          <option value="gelir">Gelir</option>
          <option value="gider">Gider</option>
        </select>
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
                <th>Ürün/Harcama</th>
                <th>Kategori</th>
                <th>Miktar</th>
                <th>Tarih</th>
                <th>Tip</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {veriler.map((item, i) => (
                <tr key={i}>
                  <td>{item.id}</td>
                  <td>{item.urun}</td>
                  <td>{item.kategori}</td>
                  <td>{item.miktar}</td>
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