/**
 * Cacao LP quantity retarget. Same rules as the draft cart script:
 * 3 bags → $219.99, then removing one bag uses the 2-bag plan ($149.98),
 * then one bag uses the 1-bag plan ($76.99). Quantity above 4 is capped.
 * Other products keep the theme cart update.
 */
(function () {
  const LP_VARIANT_ID = 67596435783893;
  const LP_PLANS = { 1: 6565560533, 2: 6565593301, 3: 6565626069, 4: 6565658837 };

  function sectionHtml(html, selector) {
    if (!html) return null;
    const node = new DOMParser().parseFromString(html, 'text/html').querySelector(selector);
    return node ? node.innerHTML : null;
  }

  function isLpSubscriptionLine(line) {
    const qtyInput = document.getElementById('Drawer-quantity-' + line) || document.getElementById('Quantity-' + line);
    const row = document.getElementById('CartDrawer-Item-' + line) || document.getElementById('CartItem-' + line);
    if (!qtyInput || !row) return false;
    if (Number(qtyInput.dataset.quantityVariantId) !== LP_VARIANT_ID) return false;
    return /every\s+\d+\s+days/i.test(row.textContent || '');
  }

  function install(Items) {
    if (!Items || Items.prototype.__ztLpPlans) return;
    const originalUpdate = Items.prototype.updateQuantity;
    if (typeof originalUpdate !== 'function') return;
    Items.prototype.__ztLpPlans = true;

    Items.prototype.ztLpSections = function () {
      try {
        return this.getSectionsToRender()
          .map(function (section) {
            return section && section.section;
          })
          .filter(Boolean);
      } catch (e) {
        return ['cart-drawer'];
      }
    };

    Items.prototype.ztSyncLpLines = async function (parsedState) {
      const items = (parsedState && parsedState.items) || [];
      const lines = items.filter(function (item) {
        return item.variant_id === LP_VARIANT_ID && item.selling_plan_allocation;
      });
      const total = lines.reduce(function (sum, item) {
        return sum + item.quantity;
      }, 0);
      if (total < 1) return parsedState;

      const capped = Math.min(total, 4);
      const plan = LP_PLANS[capped];
      let overflow = total - capped;
      let latest = parsedState;

      for (const item of lines.slice().reverse()) {
        let qty = item.quantity;
        if (overflow > 0) {
          const drop = Math.min(qty, overflow);
          qty -= drop;
          overflow -= drop;
        }
        const currentPlan = Number(item.selling_plan_allocation.selling_plan.id);
        if (qty === item.quantity && currentPlan === plan) continue;

        const payload = {
          id: item.key,
          quantity: qty,
          sections: this.ztLpSections(),
          sections_url: window.location.pathname,
        };
        if (qty > 0) payload.selling_plan = plan;

        const response = await fetch(routes.cart_change_url, {
          ...fetchConfig(),
          body: JSON.stringify(payload),
        });
        const nextState = JSON.parse(await response.text());
        if (nextState.errors || !nextState.sections) return latest.sections ? latest : parsedState;
        latest = nextState;
      }

      return latest;
    };

    Items.prototype.ztUpdateLpQuantity = function (line, nextQuantity, event, name, variantId, sellingPlan) {
      const eventTarget = event && event.currentTarget instanceof CartRemoveButton ? 'clear' : 'change';
      const marker =
        window.CartPerformance && CartPerformance.createStartingMarker(eventTarget + ':user-action');
      this.enableLoading(line);

      const payload = {
        line: line,
        quantity: nextQuantity,
        sections: this.ztLpSections(),
        sections_url: window.location.pathname,
      };
      if (sellingPlan) payload.selling_plan = sellingPlan;

      fetch(routes.cart_change_url, { ...fetchConfig(), body: JSON.stringify(payload) })
        .then(function (response) {
          return response.text();
        })
        .then(async function (state) {
          let parsedState = JSON.parse(state);
          if (!parsedState.errors) parsedState = await this.ztSyncLpLines(parsedState);

          const quantityElement =
            document.getElementById('Quantity-' + line) || document.getElementById('Drawer-quantity-' + line);
          const items = document.querySelectorAll('.cart-item');

          if (parsedState.errors) {
            if (quantityElement) quantityElement.value = quantityElement.getAttribute('value');
            this.updateLiveRegions(line, parsedState.errors);
            return;
          }

          this.classList.toggle('is-empty', parsedState.item_count === 0);
          const cartDrawerWrapper = document.querySelector('cart-drawer');
          const cartFooter = document.getElementById('main-cart-footer');
          if (cartFooter) cartFooter.classList.toggle('is-empty', parsedState.item_count === 0);
          if (cartDrawerWrapper) cartDrawerWrapper.classList.toggle('is-empty', parsedState.item_count === 0);

          this.getSectionsToRender().forEach(function (section) {
            const container = document.getElementById(section.id);
            const html = parsedState.sections && parsedState.sections[section.section];
            if (!container || !html) return;
            const elementToReplace = container.querySelector(section.selector) || container;
            const nextHtml = sectionHtml(html, section.selector);
            if (nextHtml == null) return;
            elementToReplace.innerHTML = nextHtml;
          });

          const updatedValue = parsedState.items[line - 1] ? parsedState.items[line - 1].quantity : undefined;
          let message = '';
          if (
            quantityElement &&
            items.length === parsedState.items.length &&
            updatedValue !== parseInt(quantityElement.value, 10)
          ) {
            if (typeof updatedValue === 'undefined') message = window.cartStrings.error;
            else message = window.cartStrings.quantityError.replace('[quantity]', updatedValue);
          }
          this.updateLiveRegions(line, message);

          const lineItem =
            document.getElementById('CartItem-' + line) || document.getElementById('CartDrawer-Item-' + line);
          if (lineItem && name && lineItem.querySelector('[name="' + name + '"]')) {
            const focusTarget = lineItem.querySelector('[name="' + name + '"]');
            if (cartDrawerWrapper && typeof trapFocus === 'function') trapFocus(cartDrawerWrapper, focusTarget);
            else focusTarget.focus();
          } else if (parsedState.item_count === 0 && cartDrawerWrapper && typeof trapFocus === 'function') {
            trapFocus(cartDrawerWrapper.querySelector('.drawer__inner-empty'), cartDrawerWrapper.querySelector('a'));
          } else if (document.querySelector('.cart-item') && cartDrawerWrapper && typeof trapFocus === 'function') {
            const focusTarget = document.querySelector('.cart-item__name');
            if (focusTarget) trapFocus(cartDrawerWrapper, focusTarget);
          }

          if (typeof publish === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
            publish(PUB_SUB_EVENTS.cartUpdate, { source: 'cart-items', cartData: parsedState, variantId: variantId });
          }
          // LP header badge listens for this (Dawn pubsub alone is not enough)
          try {
            document.dispatchEvent(
              new CustomEvent('cart:updated', {
                detail: { cart: parsedState, itemCount: parsedState.item_count },
              })
            );
          } catch (e) {}
        }.bind(this))
        .catch(function () {
          this.querySelectorAll('.loading__spinner').forEach(function (overlay) {
            overlay.classList.add('hidden');
          });
          const errors = document.getElementById('cart-errors') || document.getElementById('CartDrawer-CartErrors');
          if (errors && window.cartStrings) errors.textContent = window.cartStrings.error;
        }.bind(this))
        .finally(function () {
          this.disableLoading(line);
          if (marker && window.CartPerformance) CartPerformance.measureFromMarker(eventTarget + ':user-action', marker);
        }.bind(this));
    };

    Items.prototype.updateQuantity = function (line, quantity, event, name, variantId) {
      const requested = parseInt(quantity, 10) || 0;
      const qtyInput =
        document.getElementById('Drawer-quantity-' + line) || document.getElementById('Quantity-' + line);
      const isLpVariant = qtyInput && Number(qtyInput.dataset.quantityVariantId) === LP_VARIANT_ID;

      if (requested > 0 && isLpSubscriptionLine(line)) {
        const nextQuantity = Math.min(Math.max(requested, 1), 4);
        return this.ztUpdateLpQuantity(line, nextQuantity, event, name, variantId, LP_PLANS[nextQuantity]);
      }

      if (requested < 1 && isLpVariant) {
        return this.ztUpdateLpQuantity(line, 0, event, name, variantId, null);
      }

      return originalUpdate.call(this, line, quantity, event, name, variantId);
    };
  }

  function boot() {
    // Patch CartItems.prototype — cart-drawer-items extends it, so drawer qty
    // changes pick up 1/2/3-bag Seal plan retargeting.
    install(customElements.get('cart-items'));
  }

  boot();
  if (window.customElements && customElements.whenDefined) {
    customElements.whenDefined('cart-items').then(boot);
    customElements.whenDefined('cart-drawer-items').then(boot);
  }
})();
