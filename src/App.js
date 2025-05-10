import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginDashboardPage from './Components/LoginDashboardComponents';
import AuthPage from "./Pages/AuthPage";
import LoginPage from "./Pages/LoginPage";
import KullaniciPage from "./Pages/KullaniciPage";
import KullaniciBilgileriPage from "./Pages/KullaniciBilgileriPage";
import HayvanlarPage from "./Pages/HayvanlarPage";
import AsiTakvimiPage from "./Pages/AsiTakvimiPage";
import HastaliklarPage from "./Pages/HastaliklarPage";
import RandevularPage from "./Pages/RandevularPage";
import UretimPage from "./Pages/UretimPage";
import SatislarPage from "./Pages/SatislarPage";
import IlaclarPage from "./Pages/IlaclarPage";
import FinansPanelPage from "./Pages/FinansPanelPage";

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<LoginDashboardPage />} />

        
        <Route path="/giris-tipi" element={<LoginDashboardPage />} />

        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/kullanici" element={<KullaniciPage />} />
        <Route path="/kullanici-bilgileri" element={<KullaniciBilgileriPage />} />
        <Route path="/hayvanlar" element={<HayvanlarPage />} />
        <Route path="/asi-takvimi" element={<AsiTakvimiPage />} />
        <Route path="/hastaliklar" element={<HastaliklarPage />} />
        <Route path="/randevular" element={<RandevularPage />} />
        <Route path="/uretim" element={<UretimPage />} />
        <Route path="/satislar" element={<SatislarPage />} />
        <Route path="/ilaclar" element={<IlaclarPage />} />
        <Route path="/finans-panel" element={<FinansPanelPage />} /> 

       
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
