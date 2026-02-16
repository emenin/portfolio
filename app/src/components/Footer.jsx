import { useEffect, useRef } from 'react';
import { footerTagline, footerTooltip } from '../content/home';

const MAX_OFFSET_TEXT = 3;
const MAX_OFFSET_TOOLTIP = 15;

export function Footer() {
  const year = new Date().getFullYear();
  const wrapRef = useRef(null);
  const textRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return;
    const wrap = wrapRef.current;
    const textSpan = textRef.current;
    const tooltip = tooltipRef.current;
    if (!wrap || !textSpan) return;

    function onMove(e) {
      const r = wrap.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      const txText = (x - 0.5) * 2 * MAX_OFFSET_TEXT;
      const tyText = (y - 0.5) * 2 * MAX_OFFSET_TEXT;
      textSpan.style.transform = `translate(${txText}px, ${tyText}px)`;
      if (tooltip) {
        const txTip = (x - 0.5) * 2 * MAX_OFFSET_TOOLTIP;
        const tyTip = (y - 0.5) * 2 * (MAX_OFFSET_TOOLTIP * 0.6);
        tooltip.style.transform = `translate3d(${txTip}px, ${tyTip}px, 0)`;
      }
    }

    function onLeave() {
      textSpan.style.transform = '';
      if (tooltip) tooltip.style.transform = 'translate3d(0, 0, 0)';
    }

    wrap.addEventListener('mousemove', onMove, { passive: true });
    wrap.addEventListener('mouseleave', onLeave);
    return () => {
      wrap.removeEventListener('mousemove', onMove);
      wrap.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <section className="section footer">
      <div className="container _100 vertical_mobile">
        <div>©{year} Érica Menin. All Rights Reserved.<br /></div>
        <div className="footer-tagline-wrap" ref={wrapRef}>
          <span ref={textRef}>{footerTagline}</span>
          <span className="footer-tooltip" ref={tooltipRef}>{footerTooltip}</span>
        </div>
      </div>
    </section>
  );
}
