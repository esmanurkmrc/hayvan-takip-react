import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

const AuthPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: ""
  });

  const [mesaj, setMesaj] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8080/auth/register", formData);
      setMesaj("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
      setTimeout(() => navigate("/login"), 1500); 
    } catch (err) {
      console.error(err);
      if (
        err.response &&
        err.response.data &&
        typeof err.response.data === "string"
      ) {
        setMesaj("Hata: " + err.response.data);
      } else {
        setMesaj("Kayıt başarısız. Bilgilerinizi kontrol edin.");
      }
    }
  };

  return (
    <div
      className="auth-container"
      style={{
        backgroundImage: 'url("/hayvancilik3.webp")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Kayıt Ol</h2>

        <input
          type="text"
          name="name"
          placeholder="Adınız"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="E-posta"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Şifre"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Kayıt Ol</button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          style={{ marginTop: "1rem", backgroundColor: "#3498db", color: "white" }}
        >
          Giriş Yap
        </button>

        {mesaj && <p className="mesaj">{mesaj}</p>}
      </form>
    </div>
  );
};

export default AuthPage;
