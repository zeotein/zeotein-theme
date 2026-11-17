(function () {
  function youtubeEmbed(url) {
    if (!url) return '';
    var m = String(url).match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{6,})/
    );
    return m ? 'https://www.youtube.com/embed/' + m[1] + '?autoplay=1&rel=0' : '';
  }

  function vimeoEmbed(url) {
    if (!url) return '';
    var m = String(url).match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return m ? 'https://player.vimeo.com/video/' + m[1] + '?autoplay=1' : '';
  }

  function initSection(root) {
    if (!root || root.dataset.ztRcReady === '1') return;
    root.dataset.ztRcReady = '1';

    var tabs = Array.prototype.slice.call(root.querySelectorAll('[data-zt-rc-tab]'));
    var panels = Array.prototype.slice.call(root.querySelectorAll('[data-zt-rc-panel]'));
    if (!tabs.length || !panels.length) return;

    function activate(id, focusTab) {
      tabs.forEach(function (tab) {
        var on = tab.getAttribute('data-zt-rc-tab') === id;
        tab.classList.toggle('is-active', on);
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        tab.setAttribute('tabindex', on ? '0' : '-1');
        if (on && focusTab) tab.focus();
      });
      panels.forEach(function (panel) {
        var on = panel.getAttribute('data-zt-rc-panel') === id;
        panel.classList.toggle('is-open', on);
        if (on) panel.removeAttribute('hidden');
        else panel.setAttribute('hidden', '');
      });
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () {
        activate(tab.getAttribute('data-zt-rc-tab'), false);
      });
      tab.addEventListener('keydown', function (event) {
        var key = event.key;
        if (key !== 'ArrowRight' && key !== 'ArrowLeft' && key !== 'Home' && key !== 'End') return;
        event.preventDefault();
        var next = index;
        if (key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        if (key === 'Home') next = 0;
        if (key === 'End') next = tabs.length - 1;
        activate(tabs[next].getAttribute('data-zt-rc-tab'), true);
      });
    });

    var initial = tabs.find(function (tab) {
      return tab.classList.contains('is-active');
    });
    activate((initial || tabs[0]).getAttribute('data-zt-rc-tab'), false);
    equalizeTabs(root);

    var modal = root.querySelector('[data-zt-rc-modal]');
    var frame = root.querySelector('[data-zt-rc-modal-frame]');
    var closeBtn = root.querySelector('[data-zt-rc-modal-close]');
    var backdrop = root.querySelector('[data-zt-rc-modal-backdrop]');
    if (!modal || !frame) return;

    function closeModal() {
      modal.setAttribute('hidden', '');
      frame.innerHTML = '';
      document.documentElement.style.removeProperty('overflow');
    }

    function openModal(url, hostedSrc) {
      frame.innerHTML = '';
      var yt = youtubeEmbed(url);
      var vim = vimeoEmbed(url);
      if (yt || vim) {
        var iframe = document.createElement('iframe');
        iframe.src = yt || vim;
        iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');
        iframe.title = 'Customer video review';
        frame.appendChild(iframe);
      } else if (hostedSrc) {
        var video = document.createElement('video');
        video.src = hostedSrc;
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        frame.appendChild(video);
      } else if (url) {
        window.open(url, '_blank', 'noopener');
        return;
      } else {
        return;
      }
      modal.removeAttribute('hidden');
      document.documentElement.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    root.addEventListener('click', function (event) {
      var trigger = event.target.closest('[data-zt-rc-video]');
      if (!trigger || !root.contains(trigger)) return;
      event.preventDefault();
      openModal(trigger.getAttribute('data-video-url') || '', trigger.getAttribute('data-video-src') || '');
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !modal.hasAttribute('hidden')) closeModal();
    });
  }

  function equalizeTabs(root) {
    var tabs = root.querySelectorAll('.zt-rc__switcher .zt-rc__tab');
    var desktop = window.matchMedia('(min-width: 990px)').matches;
    Array.prototype.forEach.call(tabs, function (tab) {
      tab.style.width = '';
    });
    if (!desktop || !tabs.length) return;
    var max = 0;
    Array.prototype.forEach.call(tabs, function (tab) {
      var width = tab.getBoundingClientRect().width;
      if (width > max) max = width;
    });
    if (!max) return;
    var px = Math.ceil(max) + 'px';
    Array.prototype.forEach.call(tabs, function (tab) {
      tab.style.width = px;
    });
  }

  function equalizeAll() {
    document.querySelectorAll('[data-zt-rc]').forEach(equalizeTabs);
  }

  function boot() {
    document.querySelectorAll('[data-zt-rc]').forEach(initSection);
    equalizeAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  document.addEventListener('shopify:section:load', function (event) {
    var root = event.target && event.target.querySelector('[data-zt-rc]');
    if (root) {
      delete root.dataset.ztRcReady;
      initSection(root);
    }
    equalizeAll();
  });

  var resizeTimer;
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(equalizeAll, 60);
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(equalizeAll);
  }
})();
