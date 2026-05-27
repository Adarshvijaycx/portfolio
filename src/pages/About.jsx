import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import LogoLoop from '../components/LogoLoop.jsx';
import HoverDecrypt from '../components/HoverDecrypt.jsx';
import Aurora from '../components/Aurora.jsx';

const stack = [
  'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python',
  'Go', 'Docker', 'AWS', 'Postgres', 'Tailwind', 'Git', 'Figma',
  'Design Systems', 'Performance'
];

export default function About() {
  return (
    <>
      <section className="page-section page-section--alt page-section--first" id="about">
        <Aurora
          colorStops={['#7cff67', '#fa761a', '#5227FF']}
          amplitude={1.0}
          blend={0.5}
          speed={1.0}
        />
        <span className="section-scanline section-scanline--top" />
        <span className="section-watermark" aria-hidden="true">02</span>
        <div className="container">
          <Reveal as="span" className="eyebrow">// section.about</Reveal>
          <Reveal as="h2" className="section-title">
            <HoverDecrypt
              defaultText="A quick introduction"
              hoverText="Who I am"
              speed={45}
              className="title-decrypt-char"
              scrambledClassName="title-decrypt-char title-decrypt-char--scrambled"
            />
          </Reveal>
          <div className="about" style={{ marginTop: 40 }}>
            <Reveal>
              <p className="about__lead">
                I build software that's measured in clarity, not lines of code.
              </p>
              <p className="about__body">
                My approach leans on small interfaces, predictable state, and tooling that disappears once it's tuned. I care about the parts of a product users never see &mdash; build pipelines, error budgets, the seams between services &mdash; because that's usually where quality is decided.
              </p>
              <Link to="/contact" className="btn btn--secondary">More about me &rarr;</Link>
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

      <section className="page-section">
        <div className="container">
          <Reveal as="span" className="eyebrow">// system.stack</Reveal>
        </div>
        <Reveal style={{ marginTop: 24 }}>
          <LogoLoop
            items={stack.map((s) => ({ node: s }))}
            speed={50}
            direction="left"
            itemHeight={40}
            gap={16}
            pauseOnHover
            fadeOut
            ariaLabel="Tech stack"
          />
        </Reveal>
      </section>

      <section className="page-section page-section--alt lets-talk">
        <span className="section-scanline section-scanline--top" />
        <div className="container lets-talk__inner">
          <Reveal className="lets-talk__icon">
            <span className="plus-icon">
              <span className="plus-icon__bar plus-icon__bar--h" />
              <span className="plus-icon__bar plus-icon__bar--v" />
            </span>
          </Reveal>
          <Reveal as="h2" className="lets-talk__title">Let's talk</Reveal>
          <Reveal as="p" className="lets-talk__sub">
            I take on a few projects at a time so I can give each one real focus. If something here resonated, reach out.
          </Reveal>
          <Reveal>
            <Link to="/contact" className="btn btn--primary">Get in Touch</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
