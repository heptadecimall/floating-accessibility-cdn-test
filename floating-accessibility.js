(function () {
    // ─── Inject CSS ───────────────────────────────────────────────────────────
    const style = document.createElement('style');
    style.textContent = `
    .float-accessibility {
      background-color: #060270;
      border-radius: 5px;
      padding: 10px;
      position: fixed;
      width: auto;
      top: 30%;
      left: 0;
      transition: all 0.3s linear;
      box-shadow: 2px 2px 8px 0px rgba(0,0,0,.4);
      z-index: 10000;
    }
    .float-accessibility p { color: white; margin: 0; }
    .float-accessibility button { border-radius: 5px; }
    .a11y-no-change { font-size: 16px !important; }
    .a11y-no-change ul { padding: 5px 5px 5px 20px !important; margin: 5px !important; }
    .a11y-no-change p { margin: 1px !important; }
    .a11y-invert { mix-blend-mode: difference; }
    .a11y-grayscale { background-color: gray; mix-blend-mode: luminosity; }
    .a11y-reading-guide {
      position: fixed;
      width: 100%;
      height: 2px;
      background-color: red;
      pointer-events: none;
      z-index: 10000;
      display: none;
    }
  `;
    document.head.appendChild(style);

    // ─── Inject Bootstrap Icons (if not already loaded) ───────────────────────
    if (!document.querySelector('link[href*="bootstrap-icons"]')) {
        const iconLink = document.createElement('link');
        iconLink.rel = 'stylesheet';
        iconLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css';
        document.head.appendChild(iconLink);
    }

    // ─── Inject HTML ──────────────────────────────────────────────────────────
    const wrapper = document.createElement('div');
    wrapper.className = 'float-accessibility a11y-no-change';
    wrapper.setAttribute('id', 'a11y-widget-root');
    wrapper.innerHTML = `
    <button type="button" id="a11y-access-btn" style="background:transparent;border:none;cursor:pointer;">
      <i class="bi bi-universal-access-circle" style="color:white;font-size:20px;"></i>
    </button>
    <div id="a11y-access-menu" style="width:200px;display:none;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <button id="a11y-close-btn" style="background:transparent;border:none;cursor:pointer;color:white;">
          <i class="bi bi-x-circle"></i>
        </button>
        <p>Accessibility</p>
        <button id="a11y-reset-btn" style="background:transparent;border:none;cursor:pointer;color:white;">
          <i class="bi bi-arrow-clockwise"></i>
        </button>
      </div>
      <ul style="list-style-type:none;background:transparent;padding:0;margin:0;">
        ${[
            ['a11y-inc-btn', 'bi-zoom-in', 'Increase Text'],
            ['a11y-dec-btn', 'bi-zoom-out', 'Decrease Text'],
            ['a11y-invert-btn', 'bi-droplet-half', 'Invert Color'],
            ['a11y-underline-btn', 'bi-type-underline', 'Link Underline'],
            ['a11y-grayscale-btn', 'bi-droplet', 'Grayscale'],
            ['a11y-cursor-btn', 'bi-cursor', 'Big Cursor'],
            ['a11y-guide-btn', 'bi-rulers', 'Reading Guide'],
            ['a11y-tts-btn', 'bi-chat-left-text', 'Text to Speech'],
            ['a11y-stt-btn', 'bi-mic-fill', 'Speech to Text'],
        ].map(([id, icon, label]) => `
          <li style="margin:10px 0;">
            <button id="${id}" style="width:100%;padding:4px 8px;cursor:pointer;">
              <i class="bi ${icon}"></i> ${label}
            </button>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
    document.body.appendChild(wrapper);

    // ─── State ────────────────────────────────────────────────────────────────
    let textSize = parseFloat(localStorage.getItem('a11y_textSize')) || 0;
    let isInverted = localStorage.getItem('a11y_isInverted') === 'true';
    let isLinkUnderlined = localStorage.getItem('a11y_isLinkUnderlined') === 'true';
    let isGrayscale = localStorage.getItem('a11y_isGrayscale') === 'true';
    let isCursorBig = localStorage.getItem('a11y_isCursorBig') === 'true';
    let guideEnabled = localStorage.getItem('a11y_guideEnabled') === 'true';
    let isTextToSpeech = localStorage.getItem('a11y_isTextToSpeech') === 'true';
    let guideLine = null;

    // ─── Helpers ──────────────────────────────────────────────────────────────
    function isA11yEl(el) {
        return el.closest('#a11y-widget-root');
    }

    function indicatorOn(id) {
        const el = document.getElementById(id);
        if (el) { el.style.background = 'blue'; el.style.color = 'white'; }
    }

    function indicatorOff(id) {
        const el = document.getElementById(id);
        if (el) { el.style.background = 'white'; el.style.color = 'black'; }
    }

    // ─── Text Size ────────────────────────────────────────────────────────────
    function changeTextSize(step) {
        textSize += step;
        document.querySelectorAll('*').forEach(el => {
            if (isA11yEl(el)) return;
            const fs = parseFloat(window.getComputedStyle(el).fontSize);
            if (fs) el.style.fontSize = (fs + step) + 'px';
        });
        localStorage.setItem('a11y_textSize', textSize);
    }

    function setTextLoad() {
        if (textSize === 0) return;
        document.querySelectorAll('*').forEach(el => {
            if (isA11yEl(el)) return;
            const fs = parseFloat(window.getComputedStyle(el).fontSize);
            if (fs) el.style.fontSize = (fs + textSize) + 'px';
        });
    }

    // ─── Invert ───────────────────────────────────────────────────────────────
    function invertColor() {
        if (isInverted) {
            document.body.classList.remove('a11y-invert');
            indicatorOff('a11y-invert-btn');
        } else {
            if (isGrayscale) toggleGrayscale();
            document.body.classList.add('a11y-invert');
            indicatorOn('a11y-invert-btn');
        }
        isInverted = !isInverted;
        localStorage.setItem('a11y_isInverted', isInverted);
    }

    // ─── Link Underline ───────────────────────────────────────────────────────
    function toggleLinkUnderline() {
        document.querySelectorAll('a').forEach(el => {
            el.style.textDecorationLine = isLinkUnderlined ? 'none' : 'underline';
        });
        isLinkUnderlined = !isLinkUnderlined;
        isLinkUnderlined ? indicatorOn('a11y-underline-btn') : indicatorOff('a11y-underline-btn');
        localStorage.setItem('a11y_isLinkUnderlined', isLinkUnderlined);
    }

    // ─── Grayscale ────────────────────────────────────────────────────────────
    function toggleGrayscale() {
        if (isGrayscale) {
            document.body.classList.remove('a11y-grayscale');
            indicatorOff('a11y-grayscale-btn');
        } else {
            if (isInverted) invertColor();
            document.body.classList.add('a11y-grayscale');
            indicatorOn('a11y-grayscale-btn');
        }
        isGrayscale = !isGrayscale;
        localStorage.setItem('a11y_isGrayscale', isGrayscale);
    }

    // ─── Big Cursor ───────────────────────────────────────────────────────────
    const CURSOR_URL = `url("data:image/png;base64,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"), auto`;

    function bigCursor() {
        const allElements = document.querySelectorAll('*');
        if (!isCursorBig) {
            allElements.forEach(el => { if (!isA11yEl(el)) el.style.cursor = CURSOR_URL; });
            isCursorBig = true;
            indicatorOn('a11y-cursor-btn');
        } else {
            allElements.forEach(el => { el.style.cursor = ''; });
            isCursorBig = false;
            indicatorOff('a11y-cursor-btn');
        }
        localStorage.setItem('a11y_isCursorBig', isCursorBig);
    }

    // ─── Reading Guide ────────────────────────────────────────────────────────
    function moveGuideLine(e) {
        guideLine.style.top = (e.clientY + 1) + 'px';
    }

    function toggleReadingGuide() {
        if (!guideLine) {
            guideLine = document.createElement('div');
            guideLine.className = 'a11y-reading-guide';
            document.body.appendChild(guideLine);
        }
        guideEnabled = !guideEnabled;
        guideLine.style.display = guideEnabled ? 'block' : 'none';
        if (guideEnabled) {
            document.addEventListener('mousemove', moveGuideLine);
            indicatorOn('a11y-guide-btn');
        } else {
            document.removeEventListener('mousemove', moveGuideLine);
            indicatorOff('a11y-guide-btn');
        }
        localStorage.setItem('a11y_guideEnabled', guideEnabled);
    }

    // ─── Text to Speech ───────────────────────────────────────────────────────
    function speak(text) {
        const u = new SpeechSynthesisUtterance(text.trim());
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
    }

    function handleSpeakableClick(e) {
        e.stopPropagation();
        const text = e.currentTarget.textContent.trim();
        if (text) speak(text);
    }

    function applySpeakable() {
        if (!isTextToSpeech) {
            document.querySelectorAll('*').forEach(el => {
                if (isA11yEl(el) || el.dataset.a11ySpeakable) return;
                el.dataset.a11ySpeakable = true;
                el.addEventListener('click', handleSpeakableClick);
            });
            isTextToSpeech = true;
            indicatorOn('a11y-tts-btn');
        } else {
            document.querySelectorAll('[data-a11y-speakable]').forEach(el => {
                delete el.dataset.a11ySpeakable;
                el.removeEventListener('click', handleSpeakableClick);
            });
            window.speechSynthesis.cancel();
            isTextToSpeech = false;
            indicatorOff('a11y-tts-btn');
        }
        localStorage.setItem('a11y_isTextToSpeech', isTextToSpeech);
    }

    // ─── Speech to Text ───────────────────────────────────────────────────────
    function startRecognition() {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { alert('Speech recognition not supported in this browser.'); return; }
        const r = new SR();
        r.lang = 'en-US';
        r.interimResults = false;
        r.maxAlternatives = 1;
        indicatorOn('a11y-stt-btn');
        r.onresult = (e) => {
            const transcript = e.results[0][0].transcript;
            const focused = document.activeElement;
            if (focused && (focused.tagName === 'INPUT' || focused.tagName === 'TEXTAREA')) {
                focused.value = transcript;
            }
            indicatorOff('a11y-stt-btn');
        };
        r.onerror = () => indicatorOff('a11y-stt-btn');
        r.start();
    }

    // ─── Reset ────────────────────────────────────────────────────────────────
    function resetAndReload() {
        ['a11y_textSize', 'a11y_isInverted', 'a11y_isLinkUnderlined',
            'a11y_isGrayscale', 'a11y_isCursorBig', 'a11y_guideEnabled', 'a11y_isTextToSpeech']
            .forEach(k => localStorage.removeItem(k));
        location.reload();
    }

    // ─── Menu Toggle ─────────────────────────────────────────────────────────
    document.getElementById('a11y-access-btn').addEventListener('click', () => {
        document.getElementById('a11y-access-btn').style.display = 'none';
        document.getElementById('a11y-access-menu').style.display = 'block';
    });
    document.getElementById('a11y-close-btn').addEventListener('click', () => {
        document.getElementById('a11y-access-btn').style.display = 'block';
        document.getElementById('a11y-access-menu').style.display = 'none';
    });

    // ─── Wire up buttons ──────────────────────────────────────────────────────
    document.getElementById('a11y-inc-btn').addEventListener('click', () => changeTextSize(2));
    document.getElementById('a11y-dec-btn').addEventListener('click', () => changeTextSize(-2));
    document.getElementById('a11y-invert-btn').addEventListener('click', invertColor);
    document.getElementById('a11y-underline-btn').addEventListener('click', toggleLinkUnderline);
    document.getElementById('a11y-grayscale-btn').addEventListener('click', toggleGrayscale);
    document.getElementById('a11y-cursor-btn').addEventListener('click', bigCursor);
    document.getElementById('a11y-guide-btn').addEventListener('click', toggleReadingGuide);
    document.getElementById('a11y-tts-btn').addEventListener('click', applySpeakable);
    document.getElementById('a11y-stt-btn').addEventListener('click', startRecognition);
    document.getElementById('a11y-reset-btn').addEventListener('click', resetAndReload);

    // ─── Restore state on load ────────────────────────────────────────────────
    (function restoreState() {
        if (isInverted) { document.body.classList.add('a11y-invert'); indicatorOn('a11y-invert-btn'); }
        if (isGrayscale) { document.body.classList.add('a11y-grayscale'); indicatorOn('a11y-grayscale-btn'); }
        if (isCursorBig) { isCursorBig = false; bigCursor(); }
        if (guideEnabled) { guideEnabled = false; toggleReadingGuide(); }
        window.speechSynthesis.cancel();
        setTimeout(() => {
            if (isTextToSpeech) { isTextToSpeech = false; applySpeakable(); }
            if (isLinkUnderlined) { isLinkUnderlined = false; toggleLinkUnderline(); }
        }, 500);
        setTextLoad();
    })();

})();