import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import TopNav from './components/TopNav.jsx';
import StatusBar from './components/StatusBar.jsx';
import BootSequence from './components/BootSequence.jsx';
import Cursor from './components/Cursor.jsx';
import Footer from './components/Footer.jsx';
import NoiseOverlay from './components/NoiseOverlay.jsx';
import ScrollFX from './components/ScrollFX.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Work from './pages/Work.jsx';
import Contact from './pages/Contact.jsx';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  const pathLabel =
    location.pathname === '/'
      ? 'home'
      : location.pathname.replace('/', '') || 'home';

  return (
    <>
      <BootSequence />
      <NoiseOverlay />
      <Cursor />
      <ScrollFX />
      <TopNav />

      <main key={location.pathname} className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/work" element={<Work />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </main>

      <StatusBar pathLabel={pathLabel} />
    </>
  );
}
