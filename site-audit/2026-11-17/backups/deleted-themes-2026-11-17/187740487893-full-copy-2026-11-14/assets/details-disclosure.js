class DetailsDisclosure extends HTMLElement {
  constructor() {
    super();
    this.mainDetailsToggle = this.querySelector('details');
    if (!this.mainDetailsToggle) return;

    const summary = this.mainDetailsToggle.querySelector('summary');
    this.content = summary ? summary.nextElementSibling : null;

    this.mainDetailsToggle.addEventListener('focusout', this.onFocusOut.bind(this));
    this.mainDetailsToggle.addEventListener('toggle', this.onToggle.bind(this));
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    });
  }

  onToggle() {
    if (!this.content) return;
    if (!this.animations) this.animations = this.content.getAnimations();

    if (this.mainDetailsToggle.hasAttribute('open')) {
      this.animations.forEach((animation) => animation.play());
    } else {
      this.animations.forEach((animation) => animation.cancel());
    }
  }

  close() {
    if (!this.mainDetailsToggle) return;
    this.mainDetailsToggle.removeAttribute('open');
    this.mainDetailsToggle.querySelector('summary')?.setAttribute('aria-expanded', false);
  }
}

customElements.define('details-disclosure', DetailsDisclosure);

/* Do NOT define `header-menu` here. Horizon's assets/header-menu.js owns that
   tag (hover megamenu / Shop dropdown). Dawn's DetailsDisclosure-based
   HeaderMenu was registering first and blocking the Horizon component, so Shop
   only navigated to /collections/shop-all with no submenu. */
