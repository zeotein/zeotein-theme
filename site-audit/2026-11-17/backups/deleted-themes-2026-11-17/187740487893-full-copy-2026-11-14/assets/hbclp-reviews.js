(function () {
  function initReviews(root) {
    if (!root || root.dataset.hbclpReady === '1') return;

    var track = root.querySelector('[data-hbclp-track]');
    var viewport = root.querySelector('[data-hbclp-viewport]');
    var dotsWrap = root.querySelector('[data-hbclp-dots]');
    var prev = root.querySelector('[data-hbclp-prev]');
    var next = root.querySelector('[data-hbclp-next]');
    if (!track || !viewport || !dotsWrap) return;

    var originals = Array.prototype.slice.call(track.children).filter(function (el) {
      return el && el.nodeType === 1 && !el.hasAttribute('data-hbclp-clone');
    });
    if (!originals.length) return;

    Array.prototype.slice.call(track.querySelectorAll('[data-hbclp-clone]')).forEach(function (el) {
      el.parentNode.removeChild(el);
    });

    var count = originals.length;
    var layout = root.getAttribute('data-layout') || 'centered';
    var visibleDesktop = Math.max(1, parseInt(root.getAttribute('data-visible') || '3', 10) || 3);
    var visibleMobile = Math.max(1, parseInt(root.getAttribute('data-visible-m') || '1', 10) || 1);

    function getVisible() {
      return window.matchMedia('(max-width: 989px)').matches ? visibleMobile : visibleDesktop;
    }

    function applyVisible() {
      var v = getVisible();
      root.style.setProperty('--hbclp-rev-visible-active', String(v));
      return v;
    }

    applyVisible();

    var infinite = layout === 'centered' && count > 1;

    if (infinite) {
      for (var i = count - 1; i >= 0; i--) {
        var pre = originals[i].cloneNode(true);
        pre.setAttribute('data-hbclp-clone', 'pre');
        pre.setAttribute('aria-hidden', 'true');
        track.insertBefore(pre, track.firstChild);
      }
      for (var j = 0; j < count; j++) {
        var post = originals[j].cloneNode(true);
        post.setAttribute('data-hbclp-clone', 'post');
        post.setAttribute('aria-hidden', 'true');
        track.appendChild(post);
      }
    }

    var slides = Array.prototype.slice.call(track.children).filter(function (el) {
      return el && el.nodeType === 1;
    });
    var cards = Array.prototype.slice.call(root.querySelectorAll('[data-hbclp-card]'));

    var realStart = infinite ? count : 0;
    var index = realStart;
    var jumping = false;

    root.dataset.hbclpReady = '1';
    root.classList.remove('is-ready');

    // One dot per review card
    dotsWrap.innerHTML = '';
    for (var d = 0; d < count; d++) {
      (function (dotIndex) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'hbclp-reviews__dot' + (dotIndex === 0 ? ' is-active' : '');
        btn.setAttribute('aria-label', 'Go to review ' + (dotIndex + 1));
        btn.addEventListener('click', function () {
          goTo(realStart + dotIndex, true);
        });
        dotsWrap.appendChild(btn);
      })(d);
    }
    var dots = Array.prototype.slice.call(dotsWrap.querySelectorAll('.hbclp-reviews__dot'));

    function realIndex(i) {
      if (!infinite) return i;
      return ((i - realStart) % count + count) % count;
    }

    function setActive(i) {
      index = i;
      var r = realIndex(i);
      cards.forEach(function (card) {
        card.classList.remove('is-active');
      });
      var currentSlide = slides[i];
      if (currentSlide) {
        var currentCard = currentSlide.querySelector('[data-hbclp-card]') || currentSlide;
        if (currentCard.classList) currentCard.classList.add('is-active');
      }
      originals.forEach(function (slide, n) {
        var card = slide.querySelector('[data-hbclp-card]') || slide;
        if (card.classList) card.classList.toggle('is-active', n === r);
      });
      dots.forEach(function (dot, n) {
        dot.classList.toggle('is-active', n === r);
      });
    }

    function scrollToIndex(i, smooth) {
      var slide = slides[i];
      if (!slide) return;
      var left;
      if (layout === 'left') {
        left = slide.offsetLeft;
      } else {
        left = slide.offsetLeft - (viewport.clientWidth - slide.offsetWidth) / 2;
      }
      viewport.scrollTo({
        left: Math.max(0, left),
        behavior: smooth ? 'smooth' : 'auto'
      });
    }

    function afterScroll(fn) {
      var done = false;
      function run() {
        if (done) return;
        done = true;
        fn();
      }
      if (typeof viewport.onscrollend !== 'undefined') {
        viewport.addEventListener('scrollend', run, { once: true });
        window.setTimeout(run, 600);
      } else {
        window.setTimeout(run, 450);
      }
    }

    function normalizeInfinite() {
      if (!infinite || jumping) return;
      if (index < count) {
        jumping = true;
        index = index + count;
        scrollToIndex(index, false);
        setActive(index);
        requestAnimationFrame(function () {
          jumping = false;
        });
      } else if (index >= count * 2) {
        jumping = true;
        index = index - count;
        scrollToIndex(index, false);
        setActive(index);
        requestAnimationFrame(function () {
          jumping = false;
        });
      }
    }

    function goTo(i, smooth) {
      if (infinite) {
        index = i;
        if (index < 0) index = 0;
        if (index >= slides.length) index = slides.length - 1;
      } else {
        index = (i + slides.length) % slides.length;
      }
      setActive(index);
      scrollToIndex(index, !!smooth);
      if (infinite && smooth) {
        afterScroll(normalizeInfinite);
      } else if (infinite) {
        normalizeInfinite();
      }
    }

    function syncFromScroll() {
      if (jumping) return;
      var center = viewport.scrollLeft + viewport.clientWidth / 2;
      var closest = index;
      var closestDist = Infinity;
      slides.forEach(function (slide, n) {
        var slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
        var dist = Math.abs(slideCenter - center);
        if (dist < closestDist) {
          closestDist = dist;
          closest = n;
        }
      });
      if (closest !== index) setActive(closest);
      normalizeInfinite();
    }

    if (prev) {
      prev.addEventListener('click', function () {
        goTo(index - 1, true);
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        goTo(index + 1, true);
      });
    }

    var scrollTimer = null;
    viewport.addEventListener(
      'scroll',
      function () {
        if (jumping) return;
        if (scrollTimer) window.clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(function () {
          syncFromScroll();
        }, 60);
      },
      { passive: true }
    );

    window.addEventListener('resize', function () {
      applyVisible();
      scrollToIndex(index, false);
    });

    function landCentered() {
      applyVisible();
      setActive(realStart);
      scrollToIndex(realStart, false);
      root.classList.add('is-ready');
    }

    requestAnimationFrame(function () {
      landCentered();
      requestAnimationFrame(landCentered);
    });
    window.setTimeout(landCentered, 50);
    window.setTimeout(landCentered, 200);
  }

  function boot() {
    document.querySelectorAll('[data-hbclp-reviews]').forEach(function (el) {
      el.dataset.hbclpReady = '0';
      el.classList.remove('is-ready');
      initReviews(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  document.addEventListener('shopify:section:load', boot);
  document.addEventListener('shopify:block:select', function (event) {
    var root = event.target && event.target.closest('[data-hbclp-reviews]');
    var card = event.target && event.target.closest('[data-hbclp-card]');
    if (!root) return;
    root.dataset.hbclpReady = '0';
    initReviews(root);
    if (!card || card.closest('[data-hbclp-clone]')) return;
    var track = root.querySelector('[data-hbclp-track]');
    if (!track) return;
    var originals = Array.prototype.slice.call(track.children).filter(function (el) {
      return el.nodeType === 1 && !el.hasAttribute('data-hbclp-clone');
    });
    var idx = -1;
    originals.forEach(function (slide, n) {
      if (slide.contains(card) || slide === card) idx = n;
    });
    if (idx < 0) return;
    var count = originals.length;
    var layout = root.getAttribute('data-layout') || 'centered';
    var realStart = layout === 'centered' && count > 1 ? count : 0;
    var viewport = root.querySelector('[data-hbclp-viewport]');
    var slides = Array.prototype.slice.call(track.children).filter(function (el) {
      return el.nodeType === 1;
    });
    var target = realStart + idx;
    var slide = slides[target];
    if (!slide || !viewport) return;
    var left =
      layout === 'left'
        ? slide.offsetLeft
        : slide.offsetLeft - (viewport.clientWidth - slide.offsetWidth) / 2;
    viewport.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
  });
})();
