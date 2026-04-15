class NewsTicker {
    /**
     * @param {HTMLElement|string} root
     * @param {{
     *  scrollSpeed?: number,
     *  speedMode?: 'px'|'duration',
     *  easing?: 'linear'|'smooth'|'gentle'|number,
     *  pauseOnHover?: boolean,
     *  effect?: 'marquee'|'slideLeft'|'slideRight'|'slideUp'|'slideDown'|'fade',
     *  transitionDuration?: number,
     *  autoPlay?: boolean
     * }} options
     */
    constructor(root, options = {}) {
      this.root = typeof root === 'string' ? document.querySelector(root) : root;
      if (!this.root) throw new Error('NewsTicker: root element not found.');
  
      this.viewport = this.root.querySelector('[data-viewport]');
      this.track = this.root.querySelector('[data-track]');
      this.btnPlay = this.root.querySelector('[data-play]');
      this.btnNext = this.root.querySelector('[data-next]');
      this.btnPrev = this.root.querySelector('[data-prev]');
  
      this.opts = {
        scrollSpeed: 90,
        speedMode: 'px',
        easing: 'smooth',
        pauseOnHover: true,
        effect: 'marquee',
        transitionDuration: 420,
        autoPlay: true,
        ...options
      };
  
      this.x = 0;
      this.targetX = 0;
      this.lastTs = 0;
      this.rafId = 0;
      this.paused = !this.opts.autoPlay;
      this.hoverPaused = false;
      this.items = [];
      this.baseItems = [];
      this.widthCache = new WeakMap();
      this.totalWidth = 0;
      this.cycleWidth = 0;
      this.gap = 0;
      this.ease = this.resolveEasing(this.opts.easing);
      this.fxIndex = 0;
      this.fxBusy = false;
      this.fxElapsed = 0;
  
      this.boundTick = this.tick.bind(this);
      this.onEnter = () => { if (this.opts.pauseOnHover) this.hoverPaused = true; };
      this.onLeave = () => { this.hoverPaused = false; };
  
      this.init();
    }
  
    resolveEasing(easing) {
      if (typeof easing === 'number') return Math.min(1, Math.max(0.02, easing));
      if (easing === 'linear') return 1;
      if (easing === 'gentle') return 0.08;
      return 0.18;
    }
  
    getPxPerSec() {
      if (this.opts.speedMode === 'duration') {
        const duration = Math.max(300, Number(this.opts.scrollSpeed) || 12000);
        return this.totalWidth > 0 ? (this.totalWidth / duration) * 1000 : 80;
      }
      return Math.max(1, Number(this.opts.scrollSpeed) || 90);
    }
  
    init() {
      if (this.opts.effect === 'marquee') this.setupMarqueeMode();
      else {
        this.rebuildItems();
        this.setupEffectMode();
      }
      this.bindEvents();
      this.setPlayLabel();
      this.start();
    }
  
    setupMarqueeMode() {
      this.track.style.display = 'inline-flex';
      this.track.style.width = '';
      this.track.style.position = '';
      this.track.style.minHeight = '';
      this.viewport.style.whiteSpace = 'nowrap';
      this.viewport.style.position = '';
      if (!this.track.dataset.looped) {
        const originals = Array.from(this.track.children);
        const frag = document.createDocumentFragment();
        for (let i = 0; i < originals.length; i++) {
          const clone = originals[i].cloneNode(true);
          clone.setAttribute('data-clone', '1');
          clone.setAttribute('aria-hidden', 'true');
          frag.appendChild(clone);
        }
        this.track.appendChild(frag);
        this.track.dataset.looped = '1';
      }
      this.rebuildItems();
    }
  
    rebuildItems() {
      this.items = Array.from(this.track.children);
      this.totalWidth = 0;
      if (this.opts.effect !== 'marquee') return;
      this.baseItems = this.items.filter((el) => !el.hasAttribute('data-clone'));
      for (let i = 0; i < this.baseItems.length; i++) {
        const el = this.baseItems[i];
        const w = el.getBoundingClientRect().width;
        this.widthCache.set(el, w);
        this.totalWidth += w;
      }
      const cs = getComputedStyle(this.track);
      this.gap = Number.parseFloat(cs.columnGap || cs.gap || '0') || 0;
      this.cycleWidth = this.totalWidth + (this.baseItems.length * this.gap);
    }
  
    widthOf(el) {
      let w = this.widthCache.get(el);
      if (!w) {
        w = el.getBoundingClientRect().width;
        this.widthCache.set(el, w);
      }
      return w;
    }
  
    setupEffectMode() {
      this.track.style.display = 'block';
      this.track.style.width = '100%';
      this.track.style.position = 'relative';
      this.viewport.style.whiteSpace = 'normal';
      this.viewport.style.position = 'relative';
      let maxH = 24;
      for (let i = 0; i < this.items.length; i++) {
        const h = this.items[i].getBoundingClientRect().height;
        if (h > maxH) maxH = h;
      }
      this.track.style.height = `${Math.ceil(maxH)}px`;
      this.track.style.minHeight = `${Math.ceil(maxH)}px`;
      for (let i = 0; i < this.items.length; i++) {
        const el = this.items[i];
        el.style.position = 'absolute';
        el.style.left = '0';
        el.style.right = '0';
        el.style.top = '0';
        el.style.opacity = '0';
        el.style.transform = 'translate3d(0,0,0)';
        el.style.transition = 'none';
        el.style.pointerEvents = 'none';
        el.style.zIndex = '1';
        el.style.display = 'none';
      }
      if (this.items[0]) {
        this.items[0].style.display = 'block';
        this.items[0].style.opacity = '1';
        this.items[0].style.zIndex = '2';
      }
    }
  
    getEffectIntervalMs() {
      if (this.opts.speedMode === 'duration') return Math.max(400, Number(this.opts.scrollSpeed) || 2500);
      const px = Math.max(1, Number(this.opts.scrollSpeed) || 90);
      return Math.max(400, Math.round(2200 - Math.min(1600, px * 8)));
    }
  
    effectFrames(stepDir) {
      const e = this.opts.effect;
      if (e === 'fade') return { inFrom: 'translate3d(0,0,0)', outTo: 'translate3d(0,0,0)' };
      const dir = stepDir >= 0 ? 1 : -1;
      if (e === 'slideLeft') return dir > 0
        ? { inFrom: 'translate3d(100%,0,0)', outTo: 'translate3d(-100%,0,0)' }
        : { inFrom: 'translate3d(-100%,0,0)', outTo: 'translate3d(100%,0,0)' };
      if (e === 'slideRight') return dir > 0
        ? { inFrom: 'translate3d(-100%,0,0)', outTo: 'translate3d(100%,0,0)' }
        : { inFrom: 'translate3d(100%,0,0)', outTo: 'translate3d(-100%,0,0)' };
      if (e === 'slideUp') return dir > 0
        ? { inFrom: 'translate3d(0,100%,0)', outTo: 'translate3d(0,-100%,0)' }
        : { inFrom: 'translate3d(0,-100%,0)', outTo: 'translate3d(0,100%,0)' };
      return dir > 0
        ? { inFrom: 'translate3d(0,-100%,0)', outTo: 'translate3d(0,100%,0)' }
        : { inFrom: 'translate3d(0,100%,0)', outTo: 'translate3d(0,-100%,0)' };
    }
  
    runEffect(stepDir) {
      const len = this.items.length;
      if (this.fxBusy || len < 2) return;
      const fromIdx = this.fxIndex;
      const toIdx = (fromIdx + (stepDir >= 0 ? 1 : -1) + len) % len;
      const fromEl = this.items[fromIdx];
      const toEl = this.items[toIdx];
      if (!fromEl || !toEl) return;
  
      this.fxBusy = true;
      this.fxIndex = toIdx;
      const dur = Math.max(120, Number(this.opts.transitionDuration) || 420);
      const tf = this.effectFrames(stepDir);
  
      fromEl.style.transition = `transform ${dur}ms ease, opacity ${dur}ms ease`;
      toEl.style.transition = 'none';
      toEl.style.display = 'block';
      toEl.style.opacity = '1';
      toEl.style.transform = tf.inFrom;
      fromEl.style.zIndex = '1';
      toEl.style.zIndex = '2';
  
      requestAnimationFrame(() => {
        toEl.style.transition = `transform ${dur}ms ease, opacity ${dur}ms ease`;
        toEl.style.transform = 'translate3d(0,0,0)';
        if (this.opts.effect === 'fade') fromEl.style.opacity = '0';
        else {
          fromEl.style.transform = tf.outTo;
          fromEl.style.opacity = '0';
        }
      });
  
      window.setTimeout(() => {
        fromEl.style.transition = 'none';
        fromEl.style.transform = 'translate3d(0,0,0)';
        fromEl.style.opacity = '0';
        fromEl.style.display = 'none';
        toEl.style.display = 'block';
        toEl.style.opacity = '1';
        toEl.style.zIndex = '2';
        this.fxBusy = false;
      }, dur + 34);
    }
  
    bindEvents() {
      this.btnPlay?.addEventListener('click', () => this.toggle());
      this.btnNext?.addEventListener('click', () => this.next());
      this.btnPrev?.addEventListener('click', () => this.prev());
  
      if (this.opts.pauseOnHover) {
        this.viewport.addEventListener('mouseenter', this.onEnter, { passive: true });
        this.viewport.addEventListener('mouseleave', this.onLeave, { passive: true });
        this.viewport.addEventListener('touchstart', this.onEnter, { passive: true });
        this.viewport.addEventListener('touchend', this.onLeave, { passive: true });
      }
  
      this.resizeObserver = new ResizeObserver(() => this.rebuildItems());
      this.resizeObserver.observe(this.track);
    }
  
    setPlayLabel() {
      if (!this.btnPlay) return;
      const playing = !this.paused && !this.hoverPaused;
      this.btnPlay.textContent = playing ? 'Pause' : 'Play';
      this.btnPlay.setAttribute('aria-label', playing ? 'Pause ticker' : 'Play ticker');
    }
  
    play() {
      this.paused = false;
      this.setPlayLabel();
    }
  
    pause() {
      this.paused = true;
      this.setPlayLabel();
    }
  
    toggle() {
      this.paused ? this.play() : this.pause();
    }
  
    next() {
      if (this.opts.effect === 'marquee') {
        if (!this.baseItems.length) return;
        const step = this.cycleWidth / this.baseItems.length;
        this.x -= step;
        if (this.cycleWidth > 0) this.x = ((this.x % this.cycleWidth) + this.cycleWidth) % this.cycleWidth - this.cycleWidth;
        return;
      }
      this.runEffect(1);
    }
  
    prev() {
      if (this.opts.effect === 'marquee') {
        if (!this.baseItems.length) return;
        const step = this.cycleWidth / this.baseItems.length;
        this.x += step;
        while (this.cycleWidth > 0 && this.x > 0) this.x -= this.cycleWidth;
        return;
      }
      this.runEffect(-1);
    }
  
    recycle() {
      let first = this.track.firstElementChild;
      while (first) {
        const w = this.widthOf(first);
        if (this.x > -w) break;
        this.track.append(first);
        this.x += w;
        this.targetX += w;
        first = this.track.firstElementChild;
      }
  
      let last = this.track.lastElementChild;
      while (last && this.x > 0) {
        const w = this.widthOf(last);
        this.track.prepend(last);
        this.x -= w;
        this.targetX -= w;
        last = this.track.lastElementChild;
      }
    }
  
    tick(ts) {
      if (!this.lastTs) this.lastTs = ts;
      const dt = Math.min(48, ts - this.lastTs) / 1000;
      this.lastTs = ts;
  
      if (this.opts.effect === 'marquee') {
        if (!this.paused && !this.hoverPaused) {
          this.x -= this.getPxPerSec() * dt;
        }
        if (this.cycleWidth > 0) {
          while (this.x <= -this.cycleWidth) this.x += this.cycleWidth;
          while (this.x > 0) this.x -= this.cycleWidth;
        }
        this.track.style.transform = `translate3d(${this.x.toFixed(3)}px,0,0)`;
      } else if (!this.paused && !this.hoverPaused && !this.fxBusy) {
        this.fxElapsed += dt * 1000;
        if (this.fxElapsed >= this.getEffectIntervalMs()) {
          this.fxElapsed = 0;
          this.runEffect(1);
        }
      }
  
      this.setPlayLabel();
      this.rafId = requestAnimationFrame(this.boundTick);
    }
  
    start() {
      if (this.rafId) return;
      this.rafId = requestAnimationFrame(this.boundTick);
    }
  
    destroy() {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
      this.viewport.removeEventListener('mouseenter', this.onEnter);
      this.viewport.removeEventListener('mouseleave', this.onLeave);
      this.viewport.removeEventListener('touchstart', this.onEnter);
      this.viewport.removeEventListener('touchend', this.onLeave);
      this.resizeObserver?.disconnect();
    }
  }
  
  const tickerInstances = new Map();
  const autoPauseStates = new WeakMap();
  let intersectionObserver = null;

  function getAutoPauseState(element) {
    if (!autoPauseStates.has(element)) {
      autoPauseStates.set(element, {
        offscreen: false,
        hidden: document.hidden,
        wasPlayingBeforeAutoPause: null
      });
    }
    return autoPauseStates.get(element);
  }

  function syncAutoPause(element, instance) {
    const state = getAutoPauseState(element);
    const shouldAutoPause = state.offscreen || state.hidden;

    if (shouldAutoPause) {
      if (state.wasPlayingBeforeAutoPause === null) {
        state.wasPlayingBeforeAutoPause = !instance.paused;
        if (state.wasPlayingBeforeAutoPause) {
          instance.pause();
        }
      }
      return;
    }

    if (state.wasPlayingBeforeAutoPause) {
      instance.play();
    }

    state.wasPlayingBeforeAutoPause = null;
  }

  function createIntersectionObserver() {
    if (intersectionObserver || typeof IntersectionObserver === 'undefined') {
      return intersectionObserver;
    }

    intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target;
        const instance = tickerInstances.get(element);
        if (!instance) {
          return;
        }

        const state = getAutoPauseState(element);
        state.offscreen = !entry.isIntersecting;
        syncAutoPause(element, instance);
      });
    }, {
      root: null,
      threshold: 0.05
    });

    return intersectionObserver;
  }

  function cleanupRemovedTickers() {
    tickerInstances.forEach((instance, element) => {
      if (document.contains(element)) {
        return;
      }

      if (intersectionObserver) {
        intersectionObserver.unobserve(element);
      }

      instance.destroy();
      tickerInstances.delete(element);
      autoPauseStates.delete(element);
    });
  }

  function initNewsTickers(root = document) {
    if (!root || typeof root.querySelectorAll !== 'function') {
      return [];
    }

    const tickerElements = root.querySelectorAll('.ticker[data-effect]');
    const instances = [];

    tickerElements.forEach((element) => {
      if (element.dataset.tickerInitialized === '1') {
        return;
      }

      const effect = element.dataset.effect || 'marquee';
      const speedMode = effect === 'marquee' ? 'px' : 'duration';
      const scrollSpeed = speedMode === 'px' ? 95 : 2200;

      const instance = new NewsTicker(element, {
        scrollSpeed,
        speedMode,
        effect,
        transitionDuration: 420,
        easing: 'smooth',
        pauseOnHover: true,
        autoPlay: true
      });

      element.dataset.tickerInitialized = '1';
      tickerInstances.set(element, instance);

      const observer = createIntersectionObserver();
      if (observer) {
        observer.observe(element);
      }

      syncAutoPause(element, instance);
      instances.push(instance);
    });

    return instances;
  }

  const runInit = () => {
    window.NewsTicker = NewsTicker;
    window.newsTickerDemos = initNewsTickers(document);
  };

  function handleVisibilityChange() {
    tickerInstances.forEach((instance, element) => {
      const state = getAutoPauseState(element);
      state.hidden = document.hidden;
      syncAutoPause(element, instance);
    });
  }

  function observeTickerMounts() {
    if (typeof MutationObserver === 'undefined') {
      return;
    }

    const root = document.body || document.documentElement;
    if (!root) {
      return;
    }

    let timerId = null;
    const observer = new MutationObserver((mutations) => {
      const hasTickerMarkup = mutations.some((mutation) =>
        Array.from(mutation.addedNodes).some((node) =>
          node.nodeType === 1 && (
            (node.matches && node.matches('.ticker[data-effect]')) ||
            (node.querySelector && node.querySelector('.ticker[data-effect]'))
          )
        )
      );
      const hasRemovedNodes = mutations.some((mutation) =>
        Array.from(mutation.removedNodes).some((node) => node.nodeType === 1)
      );

      if (!hasTickerMarkup && !hasRemovedNodes) {
        return;
      }

      if (timerId) {
        return;
      }

      timerId = window.setTimeout(() => {
        initNewsTickers(document);
        cleanupRemovedTickers();
        timerId = null;
      }, 80);
    });

    observer.observe(root, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      runInit();
      observeTickerMounts();
      document.addEventListener('visibilitychange', handleVisibilityChange);
    });
  } else {
    runInit();
    observeTickerMounts();
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }
  