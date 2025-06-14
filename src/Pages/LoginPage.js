import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [mesaj, setMesaj] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const selectedRole = query.get("v");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        ...formData,
        role: selectedRole
      });

      setMesaj("Giriş başarılı!");
      const roleName = response.data.roleName?.toLowerCase();

      setTimeout(() => {
        if (roleName === "veteriner") {
          navigate("/veterinerpage");
        } else {
          navigate("/kullanici");
        }
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
          <h2>Giriş Yap</h2>
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
          <button type="submit">Giriş Yap</button>
          {mesaj && <p className="login-message">{mesaj}</p>}
          <p className="alt-link">
            Hesabınız yok mu?{" "}
            <span
              onClick={() => navigate("/register?v=" + selectedRole)}
              style={{ cursor: "pointer", color: "#2980b9" }}
            >
              Kayıt Ol
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
