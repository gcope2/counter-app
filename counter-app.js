/**
 * Copyright 2026 Gabby Cope
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `counter-app`
 * This shows a counter that has plus and minus buttons
 * It has min and max values as well as confetti popping at #21
 * We change the color of the number at its min, max, #21, and #18
 * 
 * @demo index.html
 * @element counter-app
 */
export class CounterApp extends DDDSuper(I18NMixin(LitElement)) {
  // HTML tag for the web component
  static get tag() {
    return "counter-app";
  } 

  // Setting default values
  constructor() {
    super();
    this.title = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Title",
    };

    // Connect the compnenets to its local files
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/counter-app.ar.json", import.meta.url).href +
        "/../",
    });

    this.count = 0;
    this.max = 100;
    this.min = -100;
    this.fancy = false;
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      count: { type: Number, reflect: true},
      max: { type: Number, reflect: true},
      min: { type: Number, reflect: true},
      fancy: {type: Boolean, reflect: true },
    };
  }


// updated runs after Lit updates the DOM.
// We use this to see when the counter hits 21 so we 
// can trigger the confetti pop
updated(changedProperties) {
  if (super.updated) {
    super.updated(changedProperties);
  }

  // If min or max changes we use this to make sure
  // they are in the right order
  // Then we force the counter to stay in bounds
  if (changedProperties.has("min") || changedProperties.has("max")) {
    if (this.min > this.max) {
      const temp = this.min;
      this.min = this.max;
      this.max = temp;
    }
    if (this.count < this.min) this.count = this.min;
    if (this.count > this.max) this.count = this.max;
  }

  // If the counter hits 21 then we trigger the confetti
  if (changedProperties.has("count")) {
    if (this.count === 21) {
      this.makeItRain();
    }
  }
}


// This imports the confetti container only when we need it
// We then set the popped attribute to trigger the animation.
makeItRain() {
  import("@haxtheweb/multiple-choice/lib/confetti-container.js").then(() => {
    setTimeout(() => {
      const confetti = this.shadowRoot.querySelector("#confetti");
      if (!confetti) return;

      // Remove then add so the animation can run more than once
      confetti.removeAttribute("popped");
      confetti.setAttribute("popped", "");
    }, 0);
  });
}


  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
      :host([count="18"]) h3 {
        color: var(--ddd-theme-default-skyBlue);
      }
      :host([count="21"]) h3 {
        color: var(--ddd-theme-default-globalNeon);
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
      }
      h3 span {
        font-size: var(--counter-app-label-font-size, var(--ddd-font-size-s));
      }
      .decrement-button {
        padding: 10px 20px;
        font-weight: bolder;
      }
      .increment-button {
        padding: 10px 20px;
        font-weight: bolder;
      }
      .increment-button:hover {
      background-color: var(--ddd-theme-default-wonderPurple);
      color: var(--ddd-theme-default-slateMaxLight);
      }
      .decrement-button:hover {
        background-color: var(--ddd-theme-default-wonderPurple);
        color: var(--ddd-theme-default-slateMaxLight);
      }
      :host([fancy]) {
        color: var(--ddd-theme-default-original87Pink);
      }
      button[disabled] {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `];
  }

  // Lit renders the HTML
  render() {
    return html`
    <confetti-container id="confetti">
      <div class="wrapper">
        <h3 class="${this.fancy}">${this.count}</h3>
        <button ?disabled="${this.min === this.count}" class="decrement-button" @click="${this.decrement}">-</button>
        <button ?disabled="${this.max === this.count}" class="increment-button" @click="${this.increment}">+</button>
        <slot></slot>
      </div>
    </confetti-container>
    `;
  }

  // Adds 1 to the counter until it hits max then it stops
  increment() {
    if (this.count < this.max) {
      this.count++;
      if (this.count == this.max) {
        this.fancy = true;
      } else {
        this.fancy = false;
      }
  }
}
// Subtracts 1 from the counter until it hits min then it stops
  decrement() {
    if (this.count > this.min) {
      this.count--;
      if (this.count == this.min) {
        this.fancy = true;
      } else {
        this.fancy = false;
      }
    }
  }


  // haxProperties integration via file reference
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(CounterApp.tag, CounterApp);