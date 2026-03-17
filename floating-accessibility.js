(function () {

    // ─── CSS ──────────────────────────────────────────────────────────────────
    const style = document.createElement('style');
    style.textContent = `
    #a11y-widget-root {
      background-color: #060270;
      border-radius: 5px;
      padding: 10px;
      position: fixed;
      width: auto;
      top: 30%;
      left: 0;
      transition: all 0.3s linear;
      box-shadow: 2px 2px 8px 0px rgba(0,0,0,.4);
      z-index: 2147483647;
      font-size: 14px !important;
      line-height: 1.4 !important;
      font-family: sans-serif !important;
    }
    #a11y-widget-root * {
      box-sizing: border-box !important;
      font-size: inherit !important;
      line-height: inherit !important;
    }
    #a11y-widget-root p  { color: white; margin: 0; }
    #a11y-widget-root ul { list-style: none; padding: 0; margin: 0; }
    #a11y-widget-root li { margin: 8px 0; }
    #a11y-widget-root button {
      border-radius: 5px;
      border: none;
      padding: 5px 8px;
      cursor: pointer !important;
      width: 100%;
      text-align: left;
      background: #fff;
      color: #000;
    }
    #a11y-open-btn {
      background: transparent !important;
      border: none !important;
      cursor: pointer !important;
      width: auto !important;
      padding: 0 !important;
    }
    .a11y-btn-active { background: #0000ff !important; color: #fff !important; }

    /* ── Invert ── */
    body.a11y-invert-active {
      isolation: isolate;
    }
    #a11y-invert-overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background-color: white;
      mix-blend-mode: difference;
      pointer-events: none;
      z-index: 2147483640;
    }

    /* ── Grayscale ── */
    html.a11y-grayscale { filter: grayscale(100%) !important; }

    /* ── Big Cursor ── */
    html.a11y-big-cursor,
    html.a11y-big-cursor * {
      cursor: url("big-cursor.png") 0 0, auto !important;
    }

    /* ── Reading guide ── */
    .a11y-reading-guide {
      position: fixed;
      width: 100%;
      height: 3px;
      background: red;
      pointer-events: none;
      z-index: 2147483646;
      display: none;
      top: 0; left: 0;
    }
  `;
    document.head.appendChild(style);

    // ─── Bootstrap Icons ─────────────────────────────────────────────────────
    if (!document.querySelector('link[href*="bootstrap-icons"]')) {
        const l = document.createElement('link');
        l.rel = 'stylesheet';
        l.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css';
        document.head.appendChild(l);
    }

    // ─── HTML ─────────────────────────────────────────────────────────────────
    const wrapper = document.createElement('div');
    wrapper.id = 'a11y-widget-root';
    wrapper.innerHTML = `
    <button id="a11y-open-btn" title="Accessibility options">
      <i class="bi bi-universal-access-circle" style="color:white;font-size:22px;display:block;"></i>
    </button>
    <div id="a11y-menu" style="display:none; width:190px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <span style="color:white;font-weight:bold;">Accessibility</span>
        <span style="display:flex;gap:6px;">
          <button id="a11y-reset-btn" title="Reset" style="width:auto;padding:3px 7px;background:transparent!important;color:white!important;">↺</button>
          <button id="a11y-close-btn" title="Close" style="width:auto;padding:3px 7px;background:transparent!important;color:white!important;">✕</button>
        </span>
      </div>
      <ul>
        <li><button id="a11y-inc-btn">🔍+ Increase Text</button></li>
        <li><button id="a11y-dec-btn">🔍− Decrease Text</button></li>
        <li><button id="a11y-invert-btn">🌓 Invert Color</button></li>
        <li><button id="a11y-underline-btn">U̲ Link Underline</button></li>
        <li><button id="a11y-grayscale-btn">◑ Grayscale</button></li>
        <li><button id="a11y-cursor-btn">↖ Big Cursor</button></li>
        <li><button id="a11y-guide-btn">— Reading Guide</button></li>
        <li><button id="a11y-tts-btn">🔊 Text to Speech</button></li>
        <li><button id="a11y-stt-btn">🎤 Speech to Text</button></li>
      </ul>
    </div>
  `;
    document.body.appendChild(wrapper);

    // ─── State ────────────────────────────────────────────────────────────────
    const S = {
        textSize: parseFloat(localStorage.getItem('a11y_textSize')) || 0,
        isInverted: localStorage.getItem('a11y_isInverted') === 'true',
        isUnderlined: localStorage.getItem('a11y_isUnderlined') === 'true',
        isGrayscale: localStorage.getItem('a11y_isGrayscale') === 'true',
        isCursorBig: localStorage.getItem('a11y_isCursorBig') === 'true',
        guideEnabled: localStorage.getItem('a11y_guideEnabled') === 'true',
        isTTS: localStorage.getItem('a11y_isTTS') === 'true',
    };

    const html = document.documentElement;
    let guideLine = null;

    // ─── Helpers ──────────────────────────────────────────────────────────────
    const $ = id => document.getElementById(id);
    const on = id => $(id) && $(id).classList.add('a11y-btn-active');
    const off = id => $(id) && $(id).classList.remove('a11y-btn-active');
    const save = (k, v) => localStorage.setItem('a11y_' + k, v);
    const widget = el => !!el.closest('#a11y-widget-root');

    // ─── Menu ─────────────────────────────────────────────────────────────────
    $('a11y-open-btn').addEventListener('click', () => {
        $('a11y-open-btn').style.display = 'none';
        $('a11y-menu').style.display = 'block';
    });
    $('a11y-close-btn').addEventListener('click', () => {
        $('a11y-open-btn').style.display = '';
        $('a11y-menu').style.display = 'none';
    });
    $('a11y-reset-btn').addEventListener('click', () => {
        Object.keys(S).forEach(k => localStorage.removeItem('a11y_' + k));
        location.reload();
    });

    // ─── Text Size ────────────────────────────────────────────────────────────
    function changeTextSize(step) {
        S.textSize += step;
        document.querySelectorAll('*').forEach(el => {
            if (widget(el)) return;
            const fs = parseFloat(window.getComputedStyle(el).fontSize);
            if (fs) el.style.fontSize = (fs + step) + 'px';
        });
        save('textSize', S.textSize);
    }
    function restoreTextSize() {
        if (!S.textSize) return;
        document.querySelectorAll('*').forEach(el => {
            if (widget(el)) return;
            const fs = parseFloat(window.getComputedStyle(el).fontSize);
            if (fs) el.style.fontSize = (fs + S.textSize) + 'px';
        });
    }
    $('a11y-inc-btn').addEventListener('click', () => changeTextSize(2));
    $('a11y-dec-btn').addEventListener('click', () => changeTextSize(-2));

    // ─── Invert ───────────────────────────────────────────────────────────────
    let invertOverlay = null;
    function setInvert(active) {
        if (active) {
            document.body.classList.add('a11y-invert-active');
            if (!invertOverlay) {
                invertOverlay = document.createElement('div');
                invertOverlay.id = 'a11y-invert-overlay';
                document.body.appendChild(invertOverlay);
            }
        } else {
            document.body.classList.remove('a11y-invert-active');
            if (invertOverlay) { invertOverlay.remove(); invertOverlay = null; }
        }
        active ? on('a11y-invert-btn') : off('a11y-invert-btn');
        S.isInverted = active;
        save('isInverted', active);
    }
    $('a11y-invert-btn').addEventListener('click', () => {
        if (S.isGrayscale) setGrayscale(false);
        setInvert(!S.isInverted);
    });

    // ─── Grayscale ────────────────────────────────────────────────────────────
    function setGrayscale(active) {
        html.classList.toggle('a11y-grayscale', active);
        active ? on('a11y-grayscale-btn') : off('a11y-grayscale-btn');
        S.isGrayscale = active;
        save('isGrayscale', active);
    }
    $('a11y-grayscale-btn').addEventListener('click', () => {
        if (S.isInverted) setInvert(false);
        setGrayscale(!S.isGrayscale);
    });

    // ─── Link Underline ───────────────────────────────────────────────────────
    function setUnderline(active) {
        document.querySelectorAll('a').forEach(el => {
            el.style.textDecorationLine = active ? 'underline' : '';
        });
        active ? on('a11y-underline-btn') : off('a11y-underline-btn');
        S.isUnderlined = active;
        save('isUnderlined', active);
    }
    $('a11y-underline-btn').addEventListener('click', () => setUnderline(!S.isUnderlined));

    // ─── Big Cursor ───────────────────────────────────────────────────────────
    function setCursor(active) {
        html.classList.toggle('a11y-big-cursor', active);
        active ? on('a11y-cursor-btn') : off('a11y-cursor-btn');
        S.isCursorBig = active;
        save('isCursorBig', active);
    }
    $('a11y-cursor-btn').addEventListener('click', () => setCursor(!S.isCursorBig));

    // ─── Reading Guide ────────────────────────────────────────────────────────
    function moveGuide(e) { guideLine.style.top = (e.clientY + 1) + 'px'; }
    function setGuide(active) {
        if (!guideLine) {
            guideLine = document.createElement('div');
            guideLine.className = 'a11y-reading-guide';
            document.body.appendChild(guideLine);
        }
        guideLine.style.display = active ? 'block' : 'none';
        active
            ? document.addEventListener('mousemove', moveGuide)
            : document.removeEventListener('mousemove', moveGuide);
        active ? on('a11y-guide-btn') : off('a11y-guide-btn');
        S.guideEnabled = active;
        save('guideEnabled', active);
    }
    $('a11y-guide-btn').addEventListener('click', () => setGuide(!S.guideEnabled));

    // ─── Text to Speech ───────────────────────────────────────────────────────
    function handleSpeak(e) {
        e.stopPropagation();
        const text = e.currentTarget.textContent.trim();
        if (!text) return;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }
    function setTTS(active) {
        if (active) {
            document.querySelectorAll('*').forEach(el => {
                if (widget(el) || el.dataset.a11ySpeak) return;
                el.dataset.a11ySpeak = '1';
                el.addEventListener('click', handleSpeak);
            });
            on('a11y-tts-btn');
        } else {
            document.querySelectorAll('[data-a11y-speak]').forEach(el => {
                delete el.dataset.a11ySpeak;
                el.removeEventListener('click', handleSpeak);
            });
            window.speechSynthesis.cancel();
            off('a11y-tts-btn');
        }
        S.isTTS = active;
        save('isTTS', active);
    }
    $('a11y-tts-btn').addEventListener('click', () => setTTS(!S.isTTS));

    // ─── Speech to Text ───────────────────────────────────────────────────────
    $('a11y-stt-btn').addEventListener('click', () => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { alert('Speech recognition not supported in this browser.'); return; }
        const r = new SR();
        r.lang = 'en-US'; r.interimResults = false; r.maxAlternatives = 1;
        on('a11y-stt-btn');
        r.onresult = e => {
            const focused = document.activeElement;
            if (focused && (focused.tagName === 'INPUT' || focused.tagName === 'TEXTAREA'))
                focused.value = e.results[0][0].transcript;
            off('a11y-stt-btn');
        };
        r.onerror = () => off('a11y-stt-btn');
        r.start();
    });

    // ─── Restore saved state on load ─────────────────────────────────────────
    if (S.isInverted) setInvert(true);
    if (S.isGrayscale) setGrayscale(true);
    if (S.isCursorBig) setCursor(true);
    if (S.guideEnabled) setGuide(true);
    window.speechSynthesis && window.speechSynthesis.cancel();
    setTimeout(() => {
        if (S.isTTS) setTTS(true);
        if (S.isUnderlined) setUnderline(true);
        restoreTextSize();
    }, 300);

})();