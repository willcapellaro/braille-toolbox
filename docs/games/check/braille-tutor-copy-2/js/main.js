/**
 * Braille Keyboard Prototype Script
 * Handles: n-key rollover for S D F (left) and J K L (right), pressed state visuals,
 * debug toggles for showing/hiding keyboard, and safe reset on blur.
 */

const keyboardEl = document.getElementById('braille-keyboard');
const keyEls = Array.from(keyboardEl.querySelectorAll('.braille-key'));
const debugToggle = document.getElementById('toggle-visibility');
const debugAutoHide = document.getElementById('toggle-auto-hide');
const themeModeSelect = document.getElementById('theme-mode-select');
const keyLabelModeSelect = document.getElementById('key-label-mode');
const keyShapeModeSelect = document.getElementById('key-shape-mode');
const spaceDisplayModeSelect = document.getElementById('space-display-mode');
const KEY_LABEL_MODE_KEY = 'brailleKeyboardKeyLabelMode'; // 'print' | 'braille' | 'morph' | 'blank'
const SPACE_DISPLAY_MODE_KEY = 'brailleKeyboardSpaceDisplayMode'; // 'braille' | 'braille-print' | 'braille-print-long' | 'blank'
const KEY_SHAPE_MODE_KEY = 'brailleKeyboardKeyShapeMode'; // 'round' | 'roundrect' | 'square2' | 'diamond2'
// THEME MANAGEMENT ---------------------------------------------------------
const THEME_KEY = 'brailleKeyboardTheme'; // legacy (dark/light)
const HC_KEY = 'brailleKeyboardHighContrast'; // legacy boolean
const HC_NEW_KEY = 'brailleKeyboardHighContrastMode'; // legacy multi off/dark/light
const THEME_MODE_KEY = 'brailleKeyboardThemeMode'; // new single select: dark|dark-contrast|light|light-contrast

function applyThemeMode(mode) {
	const body = document.body;
	body.classList.remove('theme-dark', 'theme-light', 'theme-high-contrast', 'theme-high-contrast-light');
	switch(mode) {
		case 'dark': body.classList.add('theme-dark'); break;
		case 'light': body.classList.add('theme-light'); break;
		case 'dark-contrast': body.classList.add('theme-high-contrast'); break;
		case 'light-contrast': body.classList.add('theme-high-contrast-light'); break;
		default: body.classList.add('theme-dark');
	}
}

function loadThemeMode() {
	let mode = 'dark';
	try {
		// New unified key first
		const storedMode = localStorage.getItem(THEME_MODE_KEY);
		if (storedMode && ['dark','dark-contrast','light','light-contrast'].includes(storedMode)) {
			mode = storedMode;
		} else {
			// Attempt legacy migration
			const legacyTheme = localStorage.getItem(THEME_KEY); // dark/light
			const legacyHCBool = localStorage.getItem(HC_KEY); // '1' or '0'
			const legacyHCMode = localStorage.getItem(HC_NEW_KEY); // off/dark/light
			if (legacyHCMode) {
				if (legacyHCMode === 'dark') mode = 'dark-contrast';
				else if (legacyHCMode === 'light') mode = 'light-contrast';
				else if (legacyHCMode === 'off') mode = legacyTheme === 'light' ? 'light' : 'dark';
			} else if (legacyHCBool === '1') {
				mode = 'dark-contrast';
			} else if (legacyTheme === 'light') {
				mode = 'light';
			}
			// Persist migrated mode
			localStorage.setItem(THEME_MODE_KEY, mode);
			// Clean up old keys (optional)
			localStorage.removeItem(HC_KEY);
			localStorage.removeItem(HC_NEW_KEY);
		}
	} catch(e) { /* ignore */ }
	if (themeModeSelect) themeModeSelect.value = mode;
	applyThemeMode(mode);
}

themeModeSelect?.addEventListener('change', () => {
	const mode = themeModeSelect.value;
	applyThemeMode(mode);
	try { localStorage.setItem(THEME_MODE_KEY, mode); } catch(e){}
});

loadThemeMode();

// KEY SHAPE MODE MANAGEMENT ---------------------------------------------
function applyKeyShapeMode(mode) {
	const b = document.body;
	b.classList.remove('shape-round','shape-roundrect','shape-diamond','shape-square','shape-square2','shape-diamond2');
	switch(mode) {
		case 'roundrect': b.classList.add('shape-roundrect'); break;
		case 'square2': b.classList.add('shape-square2'); break;
		case 'diamond2': b.classList.add('shape-diamond2'); break;
		case 'round':
		default: b.classList.add('shape-round'); break;
	}

	// Apply experimental bevel via corner-shape when Diamond 2 is selected.
	// Not widely supported; requested explicitly by user. Done via JS to avoid CSS lint errors.
	const targets = [
		...document.querySelectorAll('.braille-key'),
		...document.querySelectorAll('.braille-space')
	];
	if (mode === 'diamond2') {
		targets.forEach(el => {
			try { el.style.setProperty('corner-shape', 'bevel'); } catch(e) {}
		});
	} else {
		targets.forEach(el => {
			try { el.style.removeProperty('corner-shape'); } catch(e) {}
		});
	}
}

function loadKeyShapeMode() {
	let mode = 'round';
	try {
		const stored = localStorage.getItem(KEY_SHAPE_MODE_KEY);
		if (stored) {
			// migrate legacy values
			if (stored === 'square') mode = 'square2';
			else if (stored === 'diamond') mode = 'diamond2';
			else if (['round','roundrect','square2','diamond2'].includes(stored)) mode = stored;
		} else {
			localStorage.setItem(KEY_SHAPE_MODE_KEY, mode);
		}
	} catch(e) { /* ignore */ }
	if (keyShapeModeSelect) keyShapeModeSelect.value = mode;
	applyKeyShapeMode(mode);
}

keyShapeModeSelect?.addEventListener('change', () => {
	const mode = keyShapeModeSelect.value;
	applyKeyShapeMode(mode);
	try { localStorage.setItem(KEY_SHAPE_MODE_KEY, mode); } catch(e){}
});

loadKeyShapeMode();

// Track currently pressed physical keys (n-key rollover)
const activeKeys = new Set();

// Valid key set for quick filtering
const validKeys = new Set(['s','d','f','j','k','l']);

// Map for retrieving element quickly + add space bar if present
const keyElementMap = keyEls.reduce((map, el) => {
	map.set(el.dataset.key, el);
	return map;
}, new Map());
const spaceEl = document.querySelector('.braille-space');
if (spaceEl) {
	keyElementMap.set(' ', spaceEl);
	keyElementMap.set('space', spaceEl);
}

const liveRegion = document.getElementById('braille-live');
const brailleSymbolEl = document.getElementById('braille-symbol');
const brailleLetterDescEl = document.getElementById('braille-letter-desc');
const brailleOutputArea = document.getElementById('braille-output');
const spaceKey = ' ';
const keyToDot = { s: 3, d: 2, f: 1, j: 4, k: 5, l: 6 };

// Build unicode braille: base 0x2800 plus bitmask
// Dot numbering bits: 1->0,2->1,3->2,4->3,5->4,6->5
function dotsToUnicodeBraille(dots) {
	let mask = 0;
	if (dots.has(1)) mask |= 1 << 0;
	if (dots.has(2)) mask |= 1 << 1;
	if (dots.has(3)) mask |= 1 << 2;
	if (dots.has(4)) mask |= 1 << 3;
	if (dots.has(5)) mask |= 1 << 4;
	if (dots.has(6)) mask |= 1 << 5;
	return String.fromCharCode(0x2800 + mask);
}

// Minimal braille alphabet mapping (Grade 1) for letters a-j using dots 1-5; extend as needed.
// We'll derive letter by sorted dots -> letter. For now only those reachable by provided keys (1-6) early set.
const dotsToLetter = {
	'1': 'a',
	'12': 'b',
	'14': 'c',
	'145': 'd',
	'15': 'e',
	'124': 'f',
	'1245': 'g',
	'125': 'h',
	'24': 'i',
	'245': 'j',
	'13': 'k',
	'123': 'l',
	'134': 'm',
	'1345': 'n',
	'135': 'o',
	'1234': 'p',
	'12345': 'q',
	'1235': 'r',
	'234': 's',
	'2345': 't',
	'136': 'u',
	'1236': 'v',
	'2456': 'w',
	'1346': 'x',
	'13456': 'y',
	'1356': 'z'
};

function updateChordDisplay() {
	if (!brailleSymbolEl || !brailleLetterDescEl) return;
	if (activeKeys.size === 0) {
		brailleSymbolEl.textContent = '⠿';
		brailleSymbolEl.setAttribute('data-idle', 'true');
		// Only show description in non-blank modes; text resets depending on space display mode
		brailleLetterDescEl.textContent = '(none)';
		return;
	} else {
		brailleSymbolEl.removeAttribute('data-idle');
	}
	const dots = new Set();
	activeKeys.forEach(k => { if (keyToDot[k]) dots.add(keyToDot[k]); });
	if (!dots.size) {
		brailleSymbolEl.textContent = '⣿';
		brailleLetterDescEl.textContent = '(none)';
		return;
	}
	const symbol = dotsToUnicodeBraille(dots);
	const key = Array.from(dots).sort((a,b)=>a-b).join('');
	const letter = dotsToLetter[key];
	brailleSymbolEl.textContent = symbol;
	const spaceMode = getCurrentSpaceDisplayMode();
	if (spaceMode === 'blank') {
		brailleLetterDescEl.textContent = '';
		return;
	}
	const dotsSorted = Array.from(dots).sort((a,b)=>a-b).join('');
	if (letter) {
		if (spaceMode === 'braille-print') {
			brailleLetterDescEl.textContent = letter; // short form just the print letter
		} else if (spaceMode === 'braille-print-long') {
			brailleLetterDescEl.textContent = `Lowercase letter ${letter}`; // long descriptive form
		} else { // braille only mode hides desc via CSS already
			brailleLetterDescEl.textContent = letter; // fallback, though hidden
		}
	} else {
		// Non-letter chord
		if (spaceMode === 'braille-print-long') {
			brailleLetterDescEl.textContent = `Dots ${dotsSorted}`;
		} else if (spaceMode === 'braille-print') {
			brailleLetterDescEl.textContent = dotsSorted;
		} else if (spaceMode === 'braille') {
			brailleLetterDescEl.textContent = dotsSorted; // hidden but set
		} else { // blank
			brailleLetterDescEl.textContent = '';
		}
	}
}

function setKeyVisual(key, pressed) {
	const el = keyElementMap.get(key);
	if (!el) return;
	if (pressed) {
		el.setAttribute('data-pressed', 'true');
		el.setAttribute('aria-pressed', 'true');
	} else {
		el.removeAttribute('data-pressed');
		el.setAttribute('aria-pressed', 'false');
	}
}

function refreshVisuals() {
	validKeys.forEach(k => setKeyVisual(k, activeKeys.has(k)));
}

window.addEventListener('keydown', (e) => {
	const raw = e.key;
	const k = raw.length === 1 ? raw.toLowerCase() : raw.toLowerCase();
	// Prevent direct typing of our chord keys into the textarea (we only insert after chord release)
	if (brailleOutputArea && document.activeElement === brailleOutputArea && validKeys.has(k)) {
		// We'll manage insertion manually; stop default
		e.preventDefault();
	}
	if (brailleOutputArea && document.activeElement === brailleOutputArea && k === ' ') {
		// We also handle space manually (space bar outside chord context)
		e.preventDefault();
	}
	if (k === ' ' || raw === ' ') {
		setKeyVisual(spaceKey, true);
		if (liveRegion) liveRegion.textContent = 'Space pressed';
		// Avoid page scroll
		e.preventDefault();
		return;
	}
	if (!validKeys.has(k)) return;
	if (activeKeys.has(k)) return;
	activeKeys.add(k);
	setKeyVisual(k, true);
	updateChordDisplay();
	if (liveRegion) liveRegion.textContent = `Pressed ${Array.from(activeKeys).join(' ')}`;
});

window.addEventListener('keyup', (e) => {
	const raw = e.key;
	const k = raw.length === 1 ? raw.toLowerCase() : raw.toLowerCase();
	if (k === ' ' || raw === ' ') {
		setKeyVisual(spaceKey, false);
		if (liveRegion) liveRegion.textContent = 'Space released';
		if (brailleOutputArea && document.activeElement === brailleOutputArea) {
			insertAtCaret(brailleOutputArea, ' ');
		}
		return;
	}
	if (!validKeys.has(k)) return;
	activeKeys.delete(k);
	setKeyVisual(k, false);
	updateChordDisplay();
	if (liveRegion) {
		if (activeKeys.size === 0) {
			liveRegion.textContent = 'Released all keys';
		} else {
			liveRegion.textContent = `Held: ${Array.from(activeKeys).join(' ')}`;
		}
	}
	// Start debounce commit when all keys released and a chord session is active
	if (activeKeys.size === 0 && chordSessionActive) {
		if (chordCommitTimer) clearTimeout(chordCommitTimer);
		chordCommitTimer = setTimeout(() => {
			commitChordFromUnion();
		}, CHORD_DEBOUNCE_MS);
	}
});

// Insert a string at the current caret position in a textarea, preserving scroll
function insertAtCaret(el, text) {
	if (!el) return;
	const start = el.selectionStart;
	const end = el.selectionEnd;
	const before = el.value.slice(0, start);
	const after = el.value.slice(end);
	el.value = before + text + after;
	const newPos = start + text.length;
	el.selectionStart = el.selectionEnd = newPos;
	el.focus();
}

// CHORD UNION + DEBOUNCE LOGIC ------------------------------------------
let CHORD_DEBOUNCE_MS = 90; // runtime-adjustable for key release slop
const DEBOUNCE_LS_KEY = 'brailleChordDebounceMs';
const chordDebounceInput = document.getElementById('chord-debounce-ms');
const chordDebounceResetBtn = document.getElementById('chord-debounce-reset');

// Load persisted value
try {
	const stored = localStorage.getItem(DEBOUNCE_LS_KEY);
	if (stored !== null) {
		const parsed = parseInt(stored, 10);
		if (!isNaN(parsed)) {
			CHORD_DEBOUNCE_MS = clampDebounce(parsed);
		}
	}
} catch(e) { /* ignore */ }
if (chordDebounceInput) chordDebounceInput.value = CHORD_DEBOUNCE_MS;

function clampDebounce(v) { return Math.min(500, Math.max(0, v)); }

function applyDebounceValue(newVal) {
	CHORD_DEBOUNCE_MS = clampDebounce(newVal);
	if (chordDebounceInput) chordDebounceInput.value = CHORD_DEBOUNCE_MS;
	try { localStorage.setItem(DEBOUNCE_LS_KEY, String(CHORD_DEBOUNCE_MS)); } catch(e){}
	if (chordCommitTimer) {
		clearTimeout(chordCommitTimer);
		chordCommitTimer = setTimeout(() => { commitChordFromUnion(); }, CHORD_DEBOUNCE_MS);
	}
}

if (chordDebounceInput) {
	const handleInput = () => {
		const v = parseInt(chordDebounceInput.value, 10);
		if (!isNaN(v)) applyDebounceValue(v);
	};
	chordDebounceInput.addEventListener('input', handleInput);
	chordDebounceInput.addEventListener('change', handleInput);
}
if (chordDebounceResetBtn) {
	chordDebounceResetBtn.addEventListener('click', () => {
		applyDebounceValue(90);
	});
}
let chordSessionActive = false;
let chordMaxKeys = new Set(); // union of all keys pressed during the current chord session
let chordCommitTimer = null;

// Augment existing keydown handling by wrapping existing listener logic above; we insert union tracking earlier.
// (We patch by listening at capture phase to record before main logic if needed.)
window.addEventListener('keydown', (e) => {
	const raw = e.key;
	const k = raw.length === 1 ? raw.toLowerCase() : raw.toLowerCase();
	if (!validKeys.has(k)) return;
	// New chord session starts when no active chord keys currently down
	if (!chordSessionActive && activeKeys.size === 0) {
		chordSessionActive = true;
		chordMaxKeys.clear();
	}
	if (chordSessionActive) chordMaxKeys.add(k);
	if (chordCommitTimer) { clearTimeout(chordCommitTimer); chordCommitTimer = null; }
}, true);

function commitChordFromUnion() {
	if (!chordSessionActive) return;
	if (!chordMaxKeys.size) { chordSessionActive = false; chordMaxKeys.clear(); return; }
	// Build dots set from union keys
	const dots = new Set();
	chordMaxKeys.forEach(k => { const d = keyToDot[k]; if (d) dots.add(d); });
	if (!dots.size) { chordSessionActive = false; chordMaxKeys.clear(); return; }
	const symbol = dotsToUnicodeBraille(dots);
	if (brailleOutputArea) insertAtCaret(brailleOutputArea, symbol);
	chordSessionActive = false;
	chordMaxKeys.clear();
}

// If window loses focus (alt-tab, etc.), clear stuck keys
window.addEventListener('blur', () => {
	if (activeKeys.size) {
		activeKeys.clear();
		refreshVisuals();
		updateChordDisplay();
	}
	if (spaceEl) spaceEl.removeAttribute('data-pressed');
	// Abandon current chord
	chordSessionActive = false;
	chordMaxKeys.clear();
	if (chordCommitTimer) { clearTimeout(chordCommitTimer); chordCommitTimer = null; }
});

// Debug visibility toggle
debugToggle.addEventListener('change', () => {
	if (debugToggle.checked) {
		keyboardEl.removeAttribute('data-hidden');
	} else {
		keyboardEl.setAttribute('data-hidden', 'true');
	}
});

// Allow hide off-screen only if auto-hide enabled; this example just ties to same attribute for now
debugAutoHide.addEventListener('change', () => {
	// Potential future logic; for now this just re-applies transform so user can test
	if (!debugAutoHide.checked) {
		// Force visible if auto-hide disabled
		keyboardEl.removeAttribute('data-hidden');
		debugToggle.checked = true;
	}
});

// Accessibility: mark keys as toggle buttons for screen readers
keyEls.forEach(el => {
	el.setAttribute('role', 'button');
	el.setAttribute('tabindex', '0');
	el.setAttribute('aria-pressed', 'false');
	// Remove legacy chrome-base if present (deprecated)
	const oldBase = el.querySelector('.chrome-base');
	if (oldBase) oldBase.remove();
	// Insert persistent key ring element (always visible)
	if (!el.querySelector('.key-ring')) {
		const ring = document.createElement('div');
		ring.className = 'key-ring';
		el.appendChild(ring);
	}
	// Status layers (kept for highlighting) - ensure they exist
	if (!el.querySelector('.status-outline')) {
		const under = document.createElement('div');
		under.className = 'status-underlay';
		el.appendChild(under);
		const outline = document.createElement('div');
		outline.className = 'status-outline';
		el.appendChild(outline);
	}
});

// Space bar ring (persistent)
if (spaceEl && !spaceEl.querySelector('.space-ring')) {
	const spaceRing = document.createElement('div');
	spaceRing.className = 'space-ring';
	spaceEl.appendChild(spaceRing);
}

// Ensure status layers on space as well for ring highlighting
if (spaceEl && !spaceEl.querySelector('.status-outline')) {
	const under = document.createElement('div');
	under.className = 'status-underlay';
	spaceEl.appendChild(under);
	const outline = document.createElement('div');
	outline.className = 'status-outline';
	spaceEl.appendChild(outline);
}

// Optional: click / space / enter simulation for demonstration
keyboardEl.addEventListener('keydown', (e) => {
	// Handle when focus is on a key (keyboard navigation)
	if (!validKeys.has(e.key.toLowerCase())) return;
	// Already handled by window listener; prevent duplicate effect
});

// KEY LABEL MODE MANAGEMENT -----------------------------------------------
function applyKeyLabelMode(mode) {
	document.body.classList.remove('keymode-print','keymode-braille','keymode-morph','keymode-blank');
	switch(mode) {
		case 'braille': document.body.classList.add('keymode-braille'); break;
		case 'morph': document.body.classList.add('keymode-morph'); break;
		case 'blank': document.body.classList.add('keymode-blank'); break;
		case 'print':
		default: document.body.classList.add('keymode-print'); break;
	}
}

function loadKeyLabelMode() {
	let mode = 'print';
	try {
		const stored = localStorage.getItem(KEY_LABEL_MODE_KEY);
		if (stored && ['print','braille','morph','blank'].includes(stored)) {
			mode = stored;
		} else {
			// Migration: if body previously had 'braille-anim' class persisted via some external logic
			if (document.body.classList.contains('braille-anim')) {
				mode = 'morph';
			}
			localStorage.setItem(KEY_LABEL_MODE_KEY, mode);
		}
	} catch(e) { /* ignore */ }
	if (keyLabelModeSelect) keyLabelModeSelect.value = mode;
	applyKeyLabelMode(mode);
}

keyLabelModeSelect?.addEventListener('change', () => {
	const mode = keyLabelModeSelect.value;
	applyKeyLabelMode(mode);
	try { localStorage.setItem(KEY_LABEL_MODE_KEY, mode); } catch(e){}
});

loadKeyLabelMode();

// SPACE DISPLAY MODE MANAGEMENT -------------------------------------------
function applySpaceDisplayMode(mode) {
	document.body.classList.remove('spacemode-braille','spacemode-braille-print','spacemode-braille-print-long','spacemode-blank');
	switch(mode) {
		case 'braille-print': document.body.classList.add('spacemode-braille-print'); break;
		case 'braille-print-long': document.body.classList.add('spacemode-braille-print-long'); break;
		case 'blank': document.body.classList.add('spacemode-blank'); break;
		case 'braille':
		default: document.body.classList.add('spacemode-braille'); break;
	}
}

function getCurrentSpaceDisplayMode() {
	if (!spaceDisplayModeSelect) return 'braille';
	return spaceDisplayModeSelect.value || 'braille';
}

function loadSpaceDisplayMode() {
	let mode = 'braille';
	try {
		const stored = localStorage.getItem(SPACE_DISPLAY_MODE_KEY);
		if (stored && ['braille','braille-print','braille-print-long','blank'].includes(stored)) {
			mode = stored;
		} else {
			localStorage.setItem(SPACE_DISPLAY_MODE_KEY, mode);
		}
	} catch(e) { /* ignore */ }
	if (spaceDisplayModeSelect) spaceDisplayModeSelect.value = mode;
	applySpaceDisplayMode(mode);
}

spaceDisplayModeSelect?.addEventListener('change', () => {
	const mode = spaceDisplayModeSelect.value;
	applySpaceDisplayMode(mode);
	try { localStorage.setItem(SPACE_DISPLAY_MODE_KEY, mode); } catch(e){}
	updateChordDisplay(); // refresh text form immediately
});

loadSpaceDisplayMode();

// KEY STATUS SYSTEM (Ring only) ---------------------------------------------
function setKeyStatus(key, severity, { outline = true } = {}) {
	const el = keyElementMap.get(key);
	if (!el) return;
	if (outline) {
		el.setAttribute('data-status', severity);
		if (liveRegion) liveRegion.textContent = `Highlight ${severity} on key ${key}`;
	} else {
		el.removeAttribute('data-status');
	}
}

function clearKeyStatus(key) {
	const el = keyElementMap.get(key);
	if (!el) return;
	el.removeAttribute('data-status');
}

function clearAllKeyStatuses() {
	validKeys.forEach(k => clearKeyStatus(k));
	if (spaceEl) clearKeyStatus('space');
}

// DEBUG CONTROL WIRING ----------------------------------------------------
const severitySelect = document.getElementById('status-severity');
const statusKeySelect = document.getElementById('status-key');
const applyStatusBtn = document.getElementById('apply-status');
const clearStatusBtn = document.getElementById('clear-status');
const clearAllStatusBtn = document.getElementById('clear-all-status');
const statusIncludeRingCheckbox = document.getElementById('status-include-ring');
const testRingsBtn = document.getElementById('test-rings');

// Feature detection: color-mix support (used earlier; now we provide fallback class if missing)
try {
	const supportsColorMix = CSS && CSS.supports && CSS.supports('color: color-mix(in srgb, red 50%, blue)');
	if (!supportsColorMix) {
		document.body.classList.add('no-color-mix');
		console.info('[KeyStatus] color-mix unsupported, using simplified ring style');
	}
} catch(e) { /* ignore */ }

function computeStatusOptions() {
    return { outline: !!statusIncludeRingCheckbox?.checked };
}

applyStatusBtn?.addEventListener('click', () => {
	const sev = severitySelect.value;
	const key = statusKeySelect.value;
	const opts = computeStatusOptions();
	setKeyStatus(key, sev, opts);
});

clearStatusBtn?.addEventListener('click', () => {
	const key = statusKeySelect.value;
	clearKeyStatus(key);
});

clearAllStatusBtn?.addEventListener('click', () => {
	clearAllKeyStatuses();
});

testRingsBtn?.addEventListener('click', () => {
	console.info('[KeyStatus] Testing all severities with rings');
	const severities = ['info','focus','success','warning','failure'];
	severities.forEach((sev, idx) => {
		const key = Array.from(validKeys)[idx];
		setKeyStatus(key, sev, { outline: true, emoji: false });
	});
});

// No-op placeholder; previous dynamic field enabling removed.

console.info('[BrailleKeyboard] Initialized. Press S,D,F and J,K,L.');
updateChordDisplay();
