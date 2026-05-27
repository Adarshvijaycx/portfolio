import Dither from './Dither.jsx';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__bg">
        <Dither
          waveSpeed={0.04}
          waveFrequency={3}
          waveAmplitude={0.3}
          waveColor={[0.106, 0.365, 0.937]}
          baseColor={[1, 1, 1]}
          colorNum={5}
          pixelSize={2}
          enableMouseInteraction={true}
          mouseRadius={0.6}
        />
      </div>
      <div className="site-footer__inner">
        <div className="site-footer__brand">ADARSH VIJAY</div>
        <div className="site-footer__tagline">built with intention. maintained with care.</div>
        <div className="site-footer__legal">
          <a href="#" className="site-footer__legal-link">terms</a>
          <span className="site-footer__legal-sep">&middot;</span>
          <a href="#" className="site-footer__legal-link">privacy</a>
          <span className="site-footer__legal-sep">&middot;</span>
          <a href="#" className="site-footer__legal-link">cookie settings</a>
        </div>
        <div className="site-footer__copy">Made with care // adarshvijay.2026</div>
      </div>
    </footer>
  );
}
