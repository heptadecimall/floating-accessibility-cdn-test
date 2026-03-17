(function () {

    // ─── Inject CSS ───────────────────────────────────────────────────────────
    const style = document.createElement('style');
    style.textContent = `
    /* collapsed state - no bg, no border, no gap */
    .float-accessibility {
      background-color: transparent;
      border-radius: 8px;
      padding: 0;
      position: fixed;
      width: auto;
      top: 30%;
      left: 0;
      transition: all 0.3s linear;
      z-index: 10000;
      border: none;
      box-shadow: none;
    }
    /* open state - white bg, border, gap */
    .float-accessibility.menu-open {
      background-color: #ffffff;
      padding: 6px;
      left: 8px;
      box-shadow: 0 4px 16px rgba(0,0,0,.15);
      border: 1px solid #d0d0d0;
      border-radius: 8px;
    }
    .float-accessibility p { color: #555; margin: 0; }
    .no-change { font-size: 14px !important; }
    .no-change ul { padding: 4px !important; margin: 0 !important; }
    .no-change p { margin: 1px !important; }
    #access-btn {
      background-color: transparent !important;
      border: none !important;
      border-radius: 6px !important;
      padding: 6px 8px !important;
      cursor: pointer;
      color: #555 !important;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #access-btn i { color: #555 !important; font-size: 20px; }
    .a11y-menu-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 4px 8px 4px;
      border-bottom: 1px solid #e0e0e0;
      margin-bottom: 4px;
    }
    .a11y-menu-header p { color: #333 !important; font-weight: 600; font-size: 13px !important; }
    .a11y-menu-header button {
      background: transparent !important;
      border: none !important;
      color: #888 !important;
      cursor: pointer;
      padding: 2px 5px !important;
      border-radius: 4px !important;
    }
    .a11y-menu-header i { color: #888 !important; }
    .float-accessibility ul li button {
      width: 100%;
      text-align: left;
      background: transparent !important;
      border: none !important;
      border-radius: 6px !important;
      padding: 7px 10px !important;
      cursor: pointer;
      color: #555 !important;
      font-size: 13px !important;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: background 0.15s;
    }
    .float-accessibility ul li button i { color: #888 !important; font-size: 15px; }
    .float-accessibility ul li button:hover { background: #f5f5f5 !important; }
    .float-accessibility ul li button.active {
      background: #1a56db !important;
      color: #fff !important;
    }
    .float-accessibility ul li button.active i { color: #fff !important; }
    html.invert {
      background-color: white;
      mix-blend-mode: difference;
    }
    .grayscale { background-color: gray; mix-blend-mode: luminosity; }
    .reading-guide {
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

    // ─── Bootstrap Icons ─────────────────────────────────────────────────────
    if (!document.querySelector('link[href*="bootstrap-icons"]')) {
        const l = document.createElement('link');
        l.rel = 'stylesheet';
        l.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css';
        document.head.appendChild(l);
    }

    // ─── Inject HTML ─────────────────────────────────────────────────────────
    const wrapper = document.createElement('div');
    wrapper.className = 'float-accessibility no-change';
    wrapper.style.width = 'auto';
    wrapper.innerHTML = `
    <button type="button" id="access-btn" onclick="showAccessMenu()" style="background-color:transparent;border:none;">
      <i class="bi bi-universal-access-circle no-change" style="color:white;"></i>
    </button>
    <div class="accessMenu no-change" id="access-menu" style="width:200px;display:none;">
      <div class="a11y-menu-header no-change">
        <p class="no-change">Accessibility</p>
        <span style="display:flex;gap:4px;">
          <button onclick="resetAndReload()" class="no-change" title="Reset"><i class="bi bi-arrow-clockwise no-change"></i></button>
          <button onclick="closeAccessMenu()" class="no-change" title="Close"><i class="bi bi-x-circle no-change"></i></button>
        </span>
      </div>
      <ul class="no-change" style="list-style-type:none;background-color:transparent;">
        <li class="no-change" style="margin:10px 0"><button class="no-change" style="width:100%;" type="button" id="inc-btn" onclick="incTextSize()"><i class="bi bi-zoom-in"></i> Increase Text</button></li>
        <li class="no-change" style="margin:10px 0"><button class="no-change" style="width:100%;" type="button" id="dec-btn" onclick="decTextSize()"><i class="bi bi-zoom-out"></i> Decrease Text</button></li>
        <li class="no-change" style="margin:10px 0"><button class="no-change" style="width:100%;" type="button" id="invert-color-btn" onclick="invertColor()"><i class="bi bi-droplet-half"></i> Invert Color</button></li>
        <li class="no-change" style="margin:10px 0"><button class="no-change" style="width:100%;" type="button" id="toggle-link-underline-btn" onclick="toggleLinkUnderline()"><i class="bi bi-type-underline"></i> Link Underline</button></li>
        <li class="no-change" style="margin:10px 0"><button class="no-change" style="width:100%;" type="button" id="toggle-grayscale-btn" onclick="toggleGrayscale()"><i class="bi bi-droplet"></i> Grayscale</button></li>
        <li class="no-change" style="margin:10px 0"><button class="no-change" style="width:100%;" type="button" id="big-cursor-btn" onclick="bigCursor()"><i class="bi bi-cursor"></i> Big Cursor</button></li>
        <li class="no-change" style="margin:10px 0"><button class="no-change" style="width:100%;" type="button" id="read-guide-btn" onclick="toggleReadingGuide()"><i class="bi bi-rulers"></i> Reading Guide</button></li>
        <li class="no-change" style="margin:10px 0"><button class="no-change" style="width:100%;" type="button" id="text-to-speech-btn" onclick="applySpeakable()"><i class="bi bi-chat-left-text"></i> Text to Speech</button></li>
        <li class="no-change" style="margin:10px 0"><button class="no-change" style="width:100%;" type="button" id="voice-recog-btn" onclick="startRecognition()"><i class="bi bi-mic-fill"></i> Speech to Text</button></li>
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

    // ─── Expose functions to window (onclick= attributes need this) ───────────
    window.showAccessMenu = function () {
        document.getElementById('access-btn').style.display = 'none';
        document.getElementById('access-menu').style.display = 'block';
        document.querySelector('.float-accessibility').classList.add('menu-open');
    };

    window.closeAccessMenu = function () {
        document.getElementById('access-btn').style.display = 'block';
        document.getElementById('access-menu').style.display = 'none';
        document.querySelector('.float-accessibility').classList.remove('menu-open');
    };

    window.resetAndReload = function () {
        ['a11y_textSize', 'a11y_isInverted', 'a11y_isLinkUnderlined',
            'a11y_isGrayscale', 'a11y_isCursorBig', 'a11y_guideEnabled', 'a11y_isTextToSpeech']
            .forEach(k => localStorage.removeItem(k));
        location.reload();
    };

    function indicatorOn(id) {
        const el = document.getElementById(id);
        if (el) el.classList.add('active');
    }
    function indicatorOff(id) {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
    }

    function isNoChange(el) {
        return el.classList.contains('no-change') || el.closest('.no-change');
    }

    // ─── Text Size ────────────────────────────────────────────────────────────
    window.incTextSize = function () { changeTextSize(2); };
    window.decTextSize = function () { changeTextSize(-2); };

    function changeTextSize(step) {
        textSize += step;
        document.querySelectorAll('*').forEach(el => {
            if (isNoChange(el)) return;
            // store original font size on first touch
            if (!el.dataset.origFs) {
                el.dataset.origFs = parseFloat(window.getComputedStyle(el).fontSize);
            }
            const orig = parseFloat(el.dataset.origFs);
            if (orig) el.style.fontSize = (orig + textSize) + 'px';
        });
        localStorage.setItem('a11y_textSize', textSize);
    }

    function setTextLoad() {
        if (textSize === 0) return;
        document.querySelectorAll('*').forEach(el => {
            if (isNoChange(el)) return;
            if (!el.dataset.origFs) {
                el.dataset.origFs = parseFloat(window.getComputedStyle(el).fontSize);
            }
            const orig = parseFloat(el.dataset.origFs);
            if (orig) el.style.fontSize = (orig + textSize) + 'px';
        });
    }

    // ─── Invert ───────────────────────────────────────────────────────────────
    window.invertColor = function () {
        if (isInverted) {
            document.documentElement.classList.remove('invert');
            indicatorOff('invert-color-btn');
        } else {
            if (isGrayscale) window.toggleGrayscale();
            document.documentElement.classList.add('invert');
            indicatorOn('invert-color-btn');
        }
        isInverted = !isInverted;
        localStorage.setItem('a11y_isInverted', isInverted);
    };

    // ─── Link Underline ───────────────────────────────────────────────────────
    window.toggleLinkUnderline = function () {
        if (isLinkUnderlined) {
            document.querySelectorAll('a').forEach(el => el.style.textDecorationLine = 'none');
            isLinkUnderlined = false;
            indicatorOff('toggle-link-underline-btn');
        } else {
            document.querySelectorAll('a').forEach(el => el.style.textDecorationLine = 'underline');
            isLinkUnderlined = true;
            indicatorOn('toggle-link-underline-btn');
        }
        localStorage.setItem('a11y_isLinkUnderlined', isLinkUnderlined);
    };

    // ─── Grayscale ────────────────────────────────────────────────────────────
    window.toggleGrayscale = function () {
        if (isGrayscale) {
            document.body.classList.remove('grayscale');
            indicatorOff('toggle-grayscale-btn');
        } else {
            if (isInverted) window.invertColor();
            document.body.classList.add('grayscale');
            indicatorOn('toggle-grayscale-btn');
        }
        isGrayscale = !isGrayscale;
        localStorage.setItem('a11y_isGrayscale', isGrayscale);
    };

    // ─── Big Cursor ───────────────────────────────────────────────────────────
    window.bigCursor = function () {
        const allElements = document.querySelectorAll('*');
        if (!isCursorBig) {
            allElements.forEach(el => {
                el.style.cursor = 'url(https://cdn.jsdelivr.net/gh/heptadecimall/floating-accessibility-cdn-test/big-cursor.png), auto';
            });
            isCursorBig = true;
            indicatorOn('big-cursor-btn');
        } else {
            allElements.forEach(el => { el.style.cursor = ''; });
            isCursorBig = false;
            indicatorOff('big-cursor-btn');
        }
        localStorage.setItem('a11y_isCursorBig', isCursorBig);
    };

    // ─── Reading Guide ────────────────────────────────────────────────────────
    let guideLine;
    window.toggleReadingGuide = function () {
        if (!guideLine) {
            guideLine = document.createElement('div');
            guideLine.className = 'reading-guide';
            document.body.appendChild(guideLine);
        }
        guideEnabled = !guideEnabled;
        guideLine.style.display = guideEnabled ? 'block' : 'none';
        if (guideEnabled) {
            document.addEventListener('mousemove', moveGuideLine);
            indicatorOn('read-guide-btn');
        } else {
            document.removeEventListener('mousemove', moveGuideLine);
            indicatorOff('read-guide-btn');
        }
        localStorage.setItem('a11y_guideEnabled', guideEnabled);
    };

    function moveGuideLine(e) {
        guideLine.style.top = (e.clientY + 1) + 'px';
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

    window.applySpeakable = function () {
        if (!isTextToSpeech) {
            document.querySelectorAll('*').forEach(el => {
                if (isNoChange(el) || el.dataset.speakable) return;
                el.dataset.speakable = true;
                el.addEventListener('click', handleSpeakableClick);
            });
            isTextToSpeech = true;
            indicatorOn('text-to-speech-btn');
        } else {
            document.querySelectorAll('*').forEach(el => {
                if (el.dataset.speakable) {
                    delete el.dataset.speakable;
                    el.removeEventListener('click', handleSpeakableClick);
                }
            });
            window.speechSynthesis.cancel();
            isTextToSpeech = false;
            indicatorOff('text-to-speech-btn');
        }
        localStorage.setItem('a11y_isTextToSpeech', isTextToSpeech);
    };

    // ─── Speech to Text ───────────────────────────────────────────────────────
    window.startRecognition = function () {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { alert('Speech recognition not supported in this browser.'); return; }
        const r = new SR();
        r.lang = 'en-US'; r.interimResults = false; r.maxAlternatives = 1;
        indicatorOn('voice-recog-btn');
        r.onresult = e => {
            const focused = document.activeElement;
            if (focused && (focused.tagName === 'INPUT' || focused.tagName === 'TEXTAREA'))
                focused.value = e.results[0][0].transcript;
            indicatorOff('voice-recog-btn');
        };
        r.onerror = () => indicatorOff('voice-recog-btn');
        r.start();
    };

    // ─── Restore state on load ────────────────────────────────────────────────
    function checkAccessibility() {
        if (isCursorBig) { isCursorBig = false; window.bigCursor(); }
        if (isInverted) { document.documentElement.classList.add('invert'); indicatorOn('invert-color-btn'); }
        if (isGrayscale) { document.body.classList.add('grayscale'); indicatorOn('toggle-grayscale-btn'); }
        window.speechSynthesis.cancel();
        setTimeout(() => {
            if (isTextToSpeech) { isTextToSpeech = false; window.applySpeakable(); }
            if (isLinkUnderlined) { isLinkUnderlined = false; window.toggleLinkUnderline(); }
        }, 500);
        if (guideEnabled) { guideEnabled = false; window.toggleReadingGuide(); }
        setTextLoad();
    }

    checkAccessibility();

})();