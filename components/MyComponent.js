import { html, LitElement } from 'lit-element';
import { LastPromiseValue } from './lib/utils';

/**
 * (Component description)
 *
 * (details about the component)
 *
 * @customElement my-component
 *
 * @event eventName - Event description
 *
 * @attr {Type} attr-name - Attribute description
 */

function apiCall (id, abortController) {
  return fetch(`https://www.swapi.co/api/people/${id}/`, { signal: abortController.signal })
    .then((r) => r.json())
    .then((r) => {
      return `${id}<br>${r.name}`;
    });
  // const delay = Math.random() * 8000;
  // return new Promise((res, rej) => {
  //   console.log('START', value, delay);
  //   abortController.timeoutId = setTimeout(() => {
  //     console.log('STOP', value);
  //     res(value.toUpperCase());
  //   }, delay);
  // });
}

// class AbortTimeoutController {
//   abort () {
//     clearTimeout(this.timeoutId);
//   }
// }

export class MyComponent extends LitElement {

  static get properties () {
    return {
      _click: { type: Number, attribute: false },
      _theInput: { type: String, attribute: false },
      _theResult: { type: String, attribute: false },
      _theError: { type: String, attribute: false },
    };
  }

  constructor () {
    super();
    console.log('constuctor');
    this._click = 0;
    this._theInput = '';
    this._promise = new LastPromiseValue((error, result) => {
      this._theResult = result;
      this._theError = error;
    });
  }

  _onClick () {
    this._click += 1;
    // const txt = Math.random().toString(36).slice(2);
    const id = Math.floor(Math.random() * (50)) + 1;
    this._theInput = id;

    // NOT OK
    // apiCall(txt)
    //   .then((result) => {
    //     this._theResult = result;
    //     this._theError = null;
    //   })
    //   .catch((error) => {
    //     this._theResult = null;
    //     this._theError = error;
    //   });

    // OK
    // const controller = new AbortTimeoutController();
    const controller = new AbortController();
    this._promise.push(apiCall(id, controller), () => controller.abort());
  }

  render () {
    console.log('render', Math.random());
    return html`
      <button @click=${this._onClick}>api call</button>
      <div>click: ${this._click}</div>
      <div>theInput: ${this._theInput}</div>
      <div>theResult: ${this._theResult}</div>
      <div>theError: ${this._theError}</div>
    `;
  }

  static get styles () {
    return [];
  }
}

window.customElements.define('my-component', MyComponent);
