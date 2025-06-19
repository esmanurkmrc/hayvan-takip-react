import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";


import LoginDashboardPage from './Components/LoginDashboardComponents';
import AuthPage from "./Pages/AuthPage";
import AuthvPage from "./Pages/AuthvPage";
import LoginPage from "./Pages/LoginPage";
import LoginvPage from "./Pages/LoginvPage";


import KullaniciLayoutPage from "./Pages/KullaniciLayoutPage";
import VeterinerLayoutPage from "./Pages/VeterinerLayoutPage";


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
import YemStokTakipPage from "./Pages/YemStokTakipPage";
import BeslenmePage from "./Pages/BeslenmePage";
import SalginHastaliklarKPage from "./Pages/SalginHastaliklarKPage";
import HastalikBelirtiPage from "./Pages/HastalikBelirtiPage";
import IklimVerisiPage from "./Pages/IklimVerisiPage";
import HayvancilikBilgiPage from "./Pages/HayvancilikBilgiPage";
import SikSorulanSorularPage from "./Pages/SikSorulanSorularPage";


import VeterinerPaneliPage from "./Pages/VeterinerPaneliPage";
import VeterinerBilgileriPage from "./Pages/VeterinerBilgileriPage";
import SalginHastaliklarPage from "./Pages/SalginHastaliklarPage";
import VeterinerTakimYonetimiPage from "./Pages/VeterinerTakimYonetimiPage";
import IlacStokTakibiPage from "./Pages/IlacStokTakibiPage";
import AsiTakvimiPagev from "./Pages/AsiTakvimiPagev";
import IlaclarPagev from "./Pages/IlaclarPagev";
import RandevularVPage from "./Pages/RandevularVPage";
import HastaliklarVPage from "./Pages/HastaliklarVPage";
import HayvanlarVPage from "./Pages/HayvanlarVPage";
import VeterinerTakimYonetimiVPage from "./Pages/VeterinerTakimYonetimiVPage";
import BeslenmeVPage from "./Pages/BeslenmeVPage";
import YapilacaklarPage from "./Pages/YapilacaklarPage"; 
import HayvancilikBilgiPagev from "./Pages/HayvancilikBilgiPagev";
import SikSorulanSorularVPage from "./Pages/SikSorulanSorularVPage";





function App() {
  return (
    <Router>
      <Routes>

       
        <Route path="/" element={<LoginDashboardPage />} />
        <Route path="/giris-tipi" element={<LoginDashboardPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/vet" element={<AuthvPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/vet" element={<LoginvPage />} />

        <Route path="/" element={<KullaniciLayoutPage />}>
          <Route path="kullanici" element={<KullaniciPage />} />
          <Route path="kullanici-bilgileri" element={<KullaniciBilgileriPage />} />
          <Route path="hayvanlar" element={<HayvanlarPage />} />
          <Route path="asi-takvimi" element={<AsiTakvimiPage />} />
          <Route path="hastaliklar" element={<HastaliklarPage />} />
          <Route path="randevular" element={<RandevularPage />} />
          <Route path="uretim" element={<UretimPage />} />
          <Route path="satislar" element={<SatislarPage />} />
          <Route path="ilaclar" element={<IlaclarPage />} />
          <Route path="finans-panel" element={<FinansPanelPage />} />
          <Route path="yem-stok" element={<YemStokTakipPage />} />
          <Route path="beslenme" element={<BeslenmePage />} />
          <Route path="/salgin-hastaliklark" element={<SalginHastaliklarKPage />} />
          <Route path="/hastalik-belirti" element={<HastalikBelirtiPage />} />
          <Route path="/iklim-verisi" element={<IklimVerisiPage />} />
          <Route path="/hayvancilik-bilgi" element={<HayvancilikBilgiPage />} />
           <Route path="/sss" element={<SikSorulanSorularPage />} />
        </Route>

        
        <Route path="/" element={<VeterinerLayoutPage />}>
          <Route path="veterinerpage" element={<VeterinerPaneliPage />} />
          <Route path="veterinerbilgileri" element={<VeterinerBilgileriPage />} />
          <Route path="salgin-hastaliklar" element={<SalginHastaliklarPage />} />
          <Route path="veteriner-takim" element={<VeterinerTakimYonetimiPage />} />
          <Route path="stok-takip" element={<IlacStokTakibiPage />} />
          <Route path="asi-takvimi-vet" element={<AsiTakvimiPagev />} />
          <Route path="ilaclar-vet" element={<IlaclarPagev />} />
          <Route path="randevular-vet" element={<RandevularVPage />} />
          <Route path="hayvanlar-vet" element={<HayvanlarVPage />} />
          <Route path="hastaliklar-vet" element={<HastaliklarVPage />} />
          <Route path="veteriner-takim-vet" element={<VeterinerTakimYonetimiVPage />} />
          <Route path="beslenme-vet" element={<BeslenmeVPage />} />
          <Route path="/yapilacaklar" element={<YapilacaklarPage />} />
          <Route path="/hayvancilik-bilgi-yonetimi" element={<HayvancilikBilgiPagev />} />
          <Route path="sss-cevapla" element={<SikSorulanSorularVPage />} />
         
          
        </Route>

        {/* ❗ Bilinmeyen route: Ana sayfaya yönlendir */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;
