import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginDashboardPage from './Components/LoginDashboardComponents';
import AuthvPage from "./Pages/AuthvPage";           
import AuthPage from "./Pages/AuthPage";             
import LoginPage from "./Pages/LoginPage";           
import LoginvPage from "./Pages/LoginvPage";         

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
import VeterinerPaneliPage from "./Pages/VeterinerPaneliPage";
import VeterinerBilgileriPage from "./Pages/VeterinerBilgileriPage";
import SalginHastaliklarPage from "./Pages/SalginHastaliklarPage";
import VeterinerTakimYonetimiPage from "./Pages/VeterinerTakimYonetimiPage";
import IlacStokTakibiPage from "./Pages/IlacStokTakibiPage";
import YemStokTakipPage from "./Pages/YemStokTakipPage";
import BeslenmePage from "./Pages/BeslenmePage";
import AsiTakvimiPagev from "./Pages/AsiTakvimiPagev";
import IlaclarPagev from "./Pages/IlaclarPagev";
import SalginHastaliklarKPage from "./Pages/SalginHastaliklarKPage";

function App() {
  return (
    <Router>
      <Routes>
       
        <Route path="/" element={<LoginDashboardPage />} />
        <Route path="/giris-tipi" element={<LoginDashboardPage />} />

        {/* Kayıt Sayfaları */}
        <Route path="/auth/vet" element={<AuthvPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Giriş Sayfaları */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/vet" element={<LoginvPage />} />  {/* ✅ Yeni eklendi */}

        {/* Paneller */}
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
        <Route path="/veterinerpage" element={<VeterinerPaneliPage />} />
        <Route path="/veterinerbilgileri" element={<VeterinerBilgileriPage />} /> 
        <Route path="/salgin-hastaliklar" element={<SalginHastaliklarPage />} />
<Route path="/veteriner-takim" element={<VeterinerTakimYonetimiPage />} />
<Route path="/stok-takip" element={<IlacStokTakibiPage />} />
<Route path="/yem-stok" element={<YemStokTakipPage />} />
<Route path="/beslenme" element={<BeslenmePage />} />
<Route path="/asi-takvimi-vet" element={<AsiTakvimiPagev />} />
<Route path="/ilaclar-vet" element={<IlaclarPagev />} />
<Route path="/ilac-stok-takibi" element={<IlacStokTakibiPage />} />
<Route path="/salgin-hastaliklark" element={<SalginHastaliklarKPage />} />





        

        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
