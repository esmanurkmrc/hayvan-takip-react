import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css"; 

const LoginvPage = () => {
  const [formData, setFormData] = useState({
    eposta: "",
    sifre: ""
  });

  const [mesaj, setMesaj] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/veterinerler/login", formData);
      setMesaj("Giriş başarılı!");

      setTimeout(() => {
        navigate("/veterinerpage");
      }, 1000);
    } catch (err) {
      console.error(err);
      setMesaj("E-posta veya şifre hatalı.");
    }
  };

  return (
    <div
      className="fullscreen-bg"
      style={{ backgroundImage: 'url("/giris.jpg")' }}
    >
      <div className="overlay-box">
        <img src="/logo1.png" alt="Hayvan Takip Sistemi" className="login-logo" />

        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Veteriner Giriş</h2>

          <input
            type="email"
            name="eposta"
            placeholder="E-posta"
            value={formData.eposta}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="sifre"
            placeholder="Şifre"
            value={formData.sifre}
            onChange={handleChange}
            required
          />

          <button type="submit">Giriş Yap</button>

          {mesaj && <p className="login-message">{mesaj}</p>}

          <p className="alt-link">
            Hesabınız yok mu?{" "}
            <span
              onClick={() => navigate("/auth/vet")}
            >
              Kayıt Ol
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginvPage;
