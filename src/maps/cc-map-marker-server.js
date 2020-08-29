import { css, LitElement, svg } from 'lit-element';

/**
 * A map marker displayed as a blinking dot with color grading depending on the value of `count`.
 *
 * 🎨 default CSS display: `block`
 * <br>
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/maps/cc-map-marker-dot.js)
 *
 * @prop {Number} count - Sets an abstract value for this marker to vary the color grading.
 *
 * @cssprop {Number} --cc-map-marker-dot-size - The size of the dot (defaults to 6px).
 */

export class CcMapMarkerServer extends LitElement {

  // We don't really need to trigger rerender but we want the property/attribute association
  static get properties () {
    return {
      enabled: { type: Boolean, reflect: true },
    };
  }

  constructor () {
    super();
    this.enabled = false;
  }

  render () {
    return svg`
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 100 100">
        <path stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1h90c2 0 4 2 4 4v75c0 2-2 4-4 4H60L50 99 40 84H5c-2.2 0-4-2-4-4V5c0-2 2-4 4-4z"/>
        <rect width="70" height="18" x="15" y="17" rx="4" ry="4"/>
        <circle cx="24" cy="26" r="4" fill="#fff"/>
        <circle cx="37" cy="26" r="4" fill="#fff"/>
        <circle cx="50" cy="26" r="4" fill="#fff"/>
        <circle cx="63" cy="26" r="4" fill="#fff"/>
        <circle cx="76" cy="26" r="4" fill="#fff"/>
        <rect width="70" height="18" x="15" y="50" rx="4" ry="4"/>
        <circle cx="24" cy="59" r="4" fill="#fff"/>
        <circle cx="37" cy="59" r="4" fill="#fff"/>
        <circle cx="50" cy="59" r="4" fill="#fff"/>
        <circle cx="63" cy="59" r="4" fill="#fff"/>
        <circle cx="76" cy="59" r="4" fill="#fff"/>
      </svg>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          /* Make sure container size adapts to inner div */
          display: inline-block;
        }

        svg {
          display: block;
          height: 2rem;
          /* Center trick ;-) */
          transform: translateY(-1rem);
          width: 2rem;
        }

        path {
          fill: #2b96fd;
        }

        :host([enabled]) circle {
          animation: var(--duration) var(--delay) infinite led-half;
        }

        circle:nth-of-type(2) {
          --duration: 0.9s;
          --delay: 0.25s;
        }

        circle:nth-of-type(3) {
          --duration: 1.1s;
          --delay: 0.5s;
        }

        circle:nth-of-type(4) {
          --duration: 0.8s;
          --delay: 0.75s;
        }

        circle:nth-of-type(6) {
          --duration: 0.95s;
          --delay: 0.15s;
        }

        circle:nth-of-type(8) {
          --duration: 0.85s;
          --delay: 0.45s;
        }

        circle:nth-of-type(9) {
          --duration: 1.05s;
          --delay: 0.65s;
        }

        circle:nth-of-type(10) {
          --duration: 0.75s;
          --delay: 0.95s;
        }

        :host([enabled]) path {
          fill: #30ab61;
        }

        @keyframes led-half {
          0% {
            visibility: visible;
          }
          80% {
            visibility: hidden;
          }
          100% {
            visibility: hidden;
          }
        }
      `,
    ];
  }
}

window.customElements.define('cc-map-marker-server', CcMapMarkerServer);
