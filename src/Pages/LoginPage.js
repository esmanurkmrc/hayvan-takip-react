import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
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
      const response = await axios.post("http://localhost:8080/auth/login", formData);
      setMesaj("Giriş başarılı!");

      const role = response.data.roleName?.toLowerCase();

      setTimeout(() => {
        if (role === "veteriner") {
          navigate("/veteriner");
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
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
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
          <span onClick={() => navigate("/")} style={{ cursor: "pointer", color: "#2980b9" }}>
            Kayıt Ol
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
