import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import GPay from './gpay.js';

class ShopBuyButton extends PolymerElement {

  static get template() {
    return html`
    <style>
      #container .gpay-button.long {
        width: 100%;
      }
    </style>

    <div id="container">
    </div>
    `;
  }

  static get is() { return 'shop-buy-button'; }

  static get properties() {
    return {
      onBuy: Function,
    };
  }

  ready() {
    super.ready();
    this._initializeButton();
  }

  _initializeButton() {
    let gpayClient;
    GPay.getClient()
      .then(client => {
        gpayClient = client;
        return client.isReadyToPay(GPay.gPayBaseRequest);
      })
      .then(response => {
        if (response.result) {
          const button = gpayClient.createButton({
            onClick: () => {
              if (this.onBuy) {
                this.onBuy();
              }
            }
          });

          this._copyGPayStyles();

          this.shadowRoot.getElementById('container').appendChild(button);
        }
      })
      .catch(err => {
        // show error in developer console for debugging
        console.error('Error in isReadyToPay', err);
      });
  }

  // workaround to get css styles into component
  _copyGPayStyles() {
    const styles = document.querySelectorAll('head > style');
    const gPayStyles = Array.from(styles).filter(s => s.innerText.indexOf('.gpay-button') !== -1);
    
    gPayStyles.forEach(s => {
      const style = document.createElement('style');
      style.innerText = s.innerText;
      this.shadowRoot.appendChild(style);
    });
  }
}

customElements.define(ShopBuyButton.is, ShopBuyButton);
