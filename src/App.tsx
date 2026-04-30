import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import PlatformSelect from './pages/PlatformSelect';
import Composer from './pages/Composer';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/platforms" element={<PlatformSelect />} />
        <Route path="/compose/:platform" element={<Composer />} />
      </Routes>
    </BrowserRouter>
  );
}
