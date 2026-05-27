import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import HoverDecrypt from '../components/HoverDecrypt.jsx';
import LetterGlitch from '../components/LetterGlitch.jsx';
import { projects } from '../data/projects.js';

export default function Work() {
  return (
    <section className="page-section page-section--first" id="work">
      <LetterGlitch
        glitchColors={['#1b5def', '#4a7ff7', '#191818']}
        glitchSpeed={50}
        outerVignette
        smooth
      />
      <span className="section-scanline section-scanline--top" />
      <span className="section-watermark" aria-hidden="true">03</span>
      <div className="container">
        <Reveal as="span" className="eyebrow">// section.work</Reveal>
        <Reveal as="h2" className="section-title">
          <HoverDecrypt
            defaultText="Featured Work"
            hoverText="Case Studies"
            speed={45}
            className="title-decrypt-char"
            scrambledClassName="title-decrypt-char title-decrypt-char--scrambled"
          />
        </Reveal>
        <Reveal as="p" className="section-subtitle">A short list. Happy to walk through any of these in detail.</Reveal>
        <Reveal stagger className="work">
          {projects.map((p) => (
            <article className="work-card work-card--glass card-glow" key={p.title}>
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
                <Link to="/contact" className="work-card__cta">view case study &rarr;</Link>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
