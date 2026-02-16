import { badgeredText } from '../content/home';

/**
 * Circular "Badgered" element: text runs around the circle and rotates;
 * the pen icon in the centre stays fixed.
 */
export function Badgered() {
  return (
    <div className="badgered">
      <div className="badgered-ring">
        <svg viewBox="0 0 200 200" className="badgered-svg" aria-hidden>
          <defs>
            <path id="badgered-path" d="M 100,100 m -75,0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" fill="none" />
          </defs>
          <text className="badgered-text">
            <textPath href="#badgered-path" startOffset="0">
              {badgeredText.repeat(2)}
            </textPath>
          </text>
        </svg>
      </div>
      <div className="badgered-icon">
        <img src="/images/stamp-illustration.svg" width="48" height="48" alt="" aria-hidden />
      </div>
    </div>
  );
}
