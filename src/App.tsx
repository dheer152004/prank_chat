import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import PlatformSelect from './pages/PlatformSelect';
import Composer from './pages/Composer';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Contact from './pages/Contact';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/platforms" element={<PlatformSelect />} />
        <Route path="/compose/:platform" element={<Composer />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}
