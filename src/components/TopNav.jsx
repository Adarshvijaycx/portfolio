import { NavLink, Link } from 'react-router-dom';
import GlassSurface from './GlassSurface.jsx';

const links = [
  { to: '/', label: 'home' },
  { to: '/about', label: 'about' },
  { to: '/work', label: 'work' },
  { to: '/contact', label: 'contact' }
];

export default function TopNav() {
  return (
    <nav className="top-nav top-nav--glass">
      <GlassSurface
        className="top-nav__glass"
        borderRadius={999}
        borderWidth={0.08}
        brightness={60}
        opacity={0.85}
        blur={10}
        displace={0.5}
        backgroundOpacity={0.04}
        saturation={1.4}
        distortionScale={-140}
        redOffset={0}
        greenOffset={8}
        blueOffset={16}
      >
        <div className="top-nav__inner">
          <Link to="/" className="top-nav__brand">
            <span className="top-nav__brand-mark">A</span>
            <span>adarsh.vijay</span>
          </Link>
          <ul className="top-nav__links">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    'top-nav__link' + (isActive ? ' is-active' : '')
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </GlassSurface>
    </nav>
  );
}
