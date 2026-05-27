import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import DataRain from '../components/DataRain.jsx';
import HoverDecrypt from '../components/HoverDecrypt.jsx';
import PixelBackground from '../components/PixelBackground.jsx';
import DotGrid from '../components/DotGrid.jsx';
import { projects } from '../data/projects.js';

export default function Home() {
  const items = useRef([]);

  useEffect(() => {
    items.current.forEach((el, i) => {
      if (!el) return;
      setTimeout(() => el.classList.add('is-in'), 200 + i * 110);
    });
  }, []);

  const set = (i) => (el) => (items.current[i] = el);
  const featured = projects.slice(0, 3);

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="hero" id="top">
        <DataRain speed={0.4} columnGap={22} fontSize={13} density={50} opacity={0.12} />
        <div className="hero__grid" />
        <span className="section-watermark" aria-hidden="true">01</span>
        <div className="hero__container">
          <div className="hero__content">
            <span className="eyebrow stagger-item" ref={set(0)}>// system.init</span>
            <div className="hero__stats stagger-item" ref={set(1)}>
              <a href="#" className="hero__stat-link">5+ years</a>
              <span className="hero__stat-sep">&middot;</span>
              <a href="#" className="hero__stat-link">30+ projects</a>
              <span className="hero__stat-sep">&middot;</span>
              <a href="#" className="hero__stat-link">12 stack tools</a>
            </div>
            <h1 className="hero__title">
              <span className="hero__greeting stagger-item" ref={set(2)}>Hello, I'm</span>
              <span className="hero__name stagger-item" ref={set(3)}>
                <HoverDecrypt
                  defaultText="Adarsh Vijay"
                  hoverText="Developer"
                  speed={40}
                  className="hero__name-char"
                  scrambledClassName="hero__name-char hero__name-char--scrambled"
                />
              </span>
            </h1>
            <p className="hero__role stagger-item" ref={set(4)}>Software Engineer</p>
            <p className="hero__tagline stagger-item" ref={set(5)}>
              Your team feels stuck. Features drag, releases break things, and nobody can explain why. I find the structural problems and organize the way forward.
            </p>
            <div className="hero__cta stagger-item" ref={set(6)}>
              <Link to="/work" className="btn btn--primary">See my approach</Link>
              <Link to="/work" className="btn btn--secondary">Case studies</Link>
            </div>
          </div>
          <div className="hero__visual stagger-item" ref={set(7)}>
            <div className="hero__card">
              <span className="hero__card-corner hero__card-corner--tl" />
              <span className="hero__card-corner hero__card-corner--tr" />
              <span className="hero__card-corner hero__card-corner--bl" />
              <span className="hero__card-corner hero__card-corner--br" />
              <div className="hero__card-init">Av</div>
              <div className="hero__card-meta">
                <span>id://0xAV</span>
                <span>26&prime;</span>
              </div>
            </div>
          </div>
        </div>
        <Link to="/about" className="hero__scroll-hint" aria-label="Go to about">
          <span className="hero__scroll-label">explore</span>
          <span className="hero__scroll-chevron">
            <svg viewBox="0 0 12 8" width="12" height="8" aria-hidden="true">
              <path d="M1 1 L6 6 L11 1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
            </svg>
          </span>
        </Link>
      </section>

      {/* ============ ABOUT GLANCE ============ */}
      <section className="page-section page-section--alt">
        <PixelBackground gap={10} speed={55} colors="#1b5def,#e25327,#191818" />
        <span className="section-scanline section-scanline--top" />
        <span className="section-watermark" aria-hidden="true">02</span>
        <div className="container">
          <Reveal as="span" className="eyebrow">// section.about</Reveal>
          <Reveal as="h2" className="section-title">A quick <em>introduction</em>.</Reveal>
          <div className="about" style={{ marginTop: 40 }}>
            <Reveal>
              <p className="about__lead">
                I build software that's measured in clarity, not lines of code.
              </p>
              <p className="about__body">
                My approach leans on small interfaces, predictable state, and tooling that disappears once it's tuned. I care about the parts of a product users never see &mdash; build pipelines, error budgets, the seams between services.
              </p>
              <Link to="/about" className="btn btn--secondary">More about me &rarr;</Link>
            </Reveal>
            <Reveal className="about__stats">
              <div className="stat">
                <div className="stat__num">5<span className="unit">+</span></div>
                <div className="stat__label">years shipping</div>
              </div>
              <div className="stat">
                <div className="stat__num">30<span className="unit">+</span></div>
                <div className="stat__label">projects delivered</div>
              </div>
              <div className="stat">
                <div className="stat__num">12<span className="unit">+</span></div>
                <div className="stat__label">stack tools daily</div>
              </div>
              <div className="stat">
                <div className="stat__num">&infin;</div>
                <div className="stat__label">cups of coffee</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ FEATURED WORK ============ */}
      <section className="page-section">
        <DotGrid spacing={26} dotSize={1.6} opacity={30} color="#9ca3af" />
        <span className="section-scanline section-scanline--top" />
        <span className="section-watermark" aria-hidden="true">03</span>
        <div className="container">
          <Reveal as="span" className="eyebrow">// section.featured</Reveal>
          <Reveal as="h2" className="section-title">Featured Work</Reveal>
          <Reveal as="p" className="section-subtitle">A few things I've shipped recently.</Reveal>
          <Reveal stagger className="work">
            {featured.map((p) => (
              <article className="work-card card-glow" key={p.title}>
                <div className="work-card__visual">
                  <div className="browser-chrome">
                    <div className="browser-chrome__bar">
                      <span className="browser-chrome__dot browser-chrome__dot--r" />
                      <span className="browser-chrome__dot browser-chrome__dot--y" />
                      <span className="browser-chrome__dot browser-chrome__dot--g" />
                      <span className="browser-chrome__addr">{p.domain}</span>
                    </div>
                    <div className="browser-chrome__body">
                      <span className="work-card__pattern" />
                      <span className="work-card__glyph">{p.glyph}</span>
                    </div>
                  </div>
                </div>
                <div className="work-card__content">
                  <div className="work-card__header">
                    <span className="work-card__year">{p.year}</span>
                    <span className="work-card__role">{p.role}</span>
                  </div>
                  <h3 className="work-card__title">{p.title}</h3>
                  <p className="work-card__desc">{p.desc}</p>
                  <div className="work-card__tags">
                    {p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
                  </div>
                  <Link to="/work" className="work-card__cta">view case study &rarr;</Link>
                </div>
              </article>
            ))}
          </Reveal>
          <Reveal className="section-cta">
            <Link to="/work" className="btn btn--primary">View all projects</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
