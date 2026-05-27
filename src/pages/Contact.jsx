import Reveal from '../components/Reveal.jsx';
import HoverDecrypt from '../components/HoverDecrypt.jsx';
import GameOfLife from '../components/GameOfLife.jsx';

export default function Contact() {
  return (
    <section className="page-section page-section--first" id="contact">
      <GameOfLife cellSize={8} speed={280} density={25} />
      <span className="section-scanline section-scanline--top" />
      <span className="section-watermark" aria-hidden="true">04</span>
      <div className="container contact">
        <Reveal as="span" className="eyebrow">// section.contact</Reveal>
        <Reveal as="h2" className="contact__title">
          <HoverDecrypt
            defaultText="Let's build something"
            hoverText="Say hello"
            speed={45}
            className="title-decrypt-char"
            scrambledClassName="title-decrypt-char title-decrypt-char--scrambled"
          />
        </Reveal>
        <Reveal as="p" className="contact__sub">
          Open to interesting problems, full-time roles, and the occasional consulting engagement. The fastest way to reach me is email.
        </Reveal>
        <Reveal className="contact__links">
          <a href="mailto:adarsh.vijay.v12@gmail.com" className="btn btn--primary">say hi &rarr;</a>
          <a href="https://github.com/Adarshvijaycx" target="_blank" rel="noopener noreferrer" className="btn btn--secondary">github</a>
          <a href="https://www.linkedin.com/in/adarsh-vijay-27685b289/" target="_blank" rel="noopener noreferrer" className="btn btn--secondary">linkedin</a>
        </Reveal>
      </div>
    </section>
  );
}
