  // Animate.css helper for individual braille keys
  function triggerKeyAnimation(keyName) {
    const keyEl = document.querySelector(`[data-key="${keyName}"]`);
    if (!keyEl) return;
    keyEl.classList.remove('animate__bounce', 'animate__animated');
    void keyEl.offsetWidth;
    keyEl.className += ' animate__animated animate__bounce';
    keyEl.addEventListener('animationend', function handler() {
      keyEl.classList.remove('animate__bounce', 'animate__animated');
      keyEl.removeEventListener('animationend', handler);
    });
  }
  
  // Legacy function - no longer used but kept for compatibility
  function triggerKeyboardAnimation() {
    // No longer animates the whole keyboard
  }
  // --- WEB AUDIO SOUND EFFECTS & WIGGLE ---
// --- AMBIENT SOUND ---
let ambientAudio = null;
let ambientGain = null;
let ambientSource = null;
let ambientFadeTarget = 0;
let ambientFadeCurrent = 0;
let ambientFadeStep = 0.05;
let ambientFadeInterval = null;
  let sfxAudioContext = new (window.AudioContext || window.webkitAudioContext)();
  let sfxBuffers = {};
  let sfxAnalyser = null;
  let sfxGain = sfxAudioContext.createGain();
  let sfxVolume = 0;
  let sfxWiggleAmount = 0;
  let sfxActive = true;

  const SFX_FILES = {
    chordStart: 'snds/43684__stijn__click7a.wav',
    arrowLaunch: 'snds/607859__department64__whipstick-21.wav',
    arrowSuccess: 'snds/573378__johnloser__cyber-punch-03.wav'
  };

  async function loadSfxBuffers() {
    for (const [key, url] of Object.entries(SFX_FILES)) {
      if (!sfxBuffers[key]) {
        const resp = await fetch(url);
        const arr = await resp.arrayBuffer();
        sfxBuffers[key] = await sfxAudioContext.decodeAudioData(arr);
      }
    }
  }

  function setupSfxAnalyser() {
    if (!sfxAnalyser) {
      sfxAnalyser = sfxAudioContext.createAnalyser();
      sfxAnalyser.fftSize = 256;
      sfxGain.connect(sfxAnalyser);
      sfxAnalyser.connect(sfxAudioContext.destination);
    }
    requestAnimationFrame(updateSfxVolume);
  }

  function playSfx(name) {
  if (!sfxBuffers[name]) return;
  const src = sfxAudioContext.createBufferSource();
  src.buffer = sfxBuffers[name];
  src.connect(sfxGain);
  src.start(0);
  }

  function updateSfxVolume() {
    if (!sfxAnalyser) return;
    const data = new Uint8Array(sfxAnalyser.fftSize);
    sfxAnalyser.getByteTimeDomainData(data);
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      let v = (data[i] - 128) / 128;
      sum += v * v;
    }
    sfxVolume = Math.sqrt(sum / data.length);
    sfxWiggleAmount = Math.min(1, sfxVolume * 8);
    requestAnimationFrame(updateSfxVolume);
  }

  // Add a button to debug panel to enable SFX wiggle
  document.addEventListener('DOMContentLoaded', function() {
    loadSfxBuffers().then(setupSfxAnalyser);
  });
  // --- SOUND SETUP ---
  const chordStartAudio = new Audio('snds/626262__jzdnvdoosj__bow-and-arrow.wav');
  const arrowLaunchAudio = new Audio('snds/534942__joedinessound__arrow_shoot_single_01_bright.wav');
  const arrowSuccessAudio = new Audio('snds/574044__thecrow_br__arrow.mp3');
  chordStartAudio.preload = 'auto';
  arrowLaunchAudio.preload = 'auto';
  arrowSuccessAudio.preload = 'auto';
// Target Practice Game Logic
// This script is loaded after the main.js and assumes DOM is ready

(function() {
  // --- CONFIG ---
  const targets = [
    { letter: 'period', img: 'imgs/heavybag-period.png', braille: ['d','k','l'], pushDirection: 'pushbagright' },
    { letter: 'comma', img: 'imgs/heavybag-comma.png', braille: ['d',], pushDirection: 'pushbagleft' },
    { letter: 'exclam', img: 'imgs/heavybag-exclam.png', braille: ['d','s','k'], pushDirection: 'pushbackcentered' }
  ];
  const gameAreaId = 'target-practice-area';
  // We'll use the image's native resolution, but allow scaling
  let imgWidth = 120;
  let imgHeight = 120;
  let imgScale = 12;
  let imgRendering = 'pixelated';
  const startSpeed = 1.2; // px/frame
  const speedIncrease = 0.12; // px/frame per target
  let currentTargetIdx = 0;
  let score = 0;
  let speed = startSpeed;
  let animationFrame;
  let imgEl, areaEl, scoreEl, livesEl, gameOverEl;
  let imgX, imgY; // Add Y position for centered bag
  let isActive = false;
  let lives = 5;
  let successes = 0;
  let failures = 0;
  // Store hit arrows for current target
  let hitArrows = [];
  
  // Punching bag specific variables
  let hitsOnCurrentTarget = 0;
  let hitsNeededPerTarget = 10;
  let bagSwaying = false;
  let swayAngle = 0;
  let swayVelocity = 0;
  let swayGravity = 0.03; // Much slower, more pendulous physics
  let swayDamping = 0.9985; // Very light damping for long, slow swings
  
  // Auto-advance timer variables
  let targetTimer = null;
  let targetDuration = 20000; // 20 seconds default
  
  // Directional pendulum variables
  let directionalPendulumEnabled = true;
  let directionalSwaying = false;
  let directionalAngle = 0;
  let directionalVelocity = 0;
  let directionalGravity = 0.08; // Slower than regular pendulum
  let directionalDamping = 0.992; // Gentle damping
  
  // Chain pendulum variables (top part - subtle movement)
  let chainAngle = 0;
  let chainVelocity = 0;
  let chainGravity = 0.03; // Very subtle movement
  let chainDamping = 0.998; // Very gentle damping
  
  // Debug physics controls (initialized with defaults)
  window.debugHitStrength = 0.5;
  window.debugRandomness = 1.0;
  window.debugSettleThreshold = 0.002;
  
  // Elements
  let chainEl = null;

  // --- DOM SETUP ---
// Animation pixelation toggle
let animationPixelSize = 4; // Hardcoded 4px pixelation

  // Animation pixel size toggle
  // Removed animation pixel size toggle control (hardcoded value used)
  function setupGameArea() {
    areaEl = document.createElement('div');
    areaEl.id = gameAreaId;
  areaEl.style.position = 'fixed';
  areaEl.style.left = '50%';
  areaEl.style.top = '50%';
  areaEl.style.transform = 'translate(-50%, -50%)';
  areaEl.style.width = 'auto';
  areaEl.style.height = 'auto';
  areaEl.style.pointerEvents = 'none';
  areaEl.style.zIndex = '1000';
  areaEl.style.display = 'block';
  areaEl.style.margin = '0';
    document.body.appendChild(areaEl);

  scoreEl = document.createElement('div');
  scoreEl.id = 'target-practice-score';
  scoreEl.className = 'arcade-ui';
  scoreEl.style.position = 'fixed';
  scoreEl.style.top = '16px';
  scoreEl.style.left = '24px';
  scoreEl.style.right = '';
  scoreEl.style.transform = 'none';
  scoreEl.style.background = 'rgba(20,20,30,0.92)';
  scoreEl.style.color = '#fff';
  scoreEl.style.fontSize = '22px';
  scoreEl.style.fontWeight = 'bold';
  scoreEl.style.padding = '8px 24px';
  scoreEl.style.borderRadius = '8px';
  scoreEl.style.boxShadow = '0 2px 8px #0008';
  scoreEl.style.zIndex = '1100';
  scoreEl.style.textAlign = 'left';
  scoreEl.innerHTML = `<div>Score: <span id="total-score">0</span></div><div>Hits: <span id="target-hits">0</span>/<span id="hits-needed">${hitsNeededPerTarget}</span></div>`;
  document.body.appendChild(scoreEl);

  livesEl = document.createElement('div');
  livesEl.id = 'target-practice-lives';
  livesEl.className = 'arcade-ui';
  livesEl.style.position = 'fixed';
  livesEl.style.top = '16px';
  livesEl.style.right = '24px';
  livesEl.style.left = '';
  livesEl.style.transform = 'none';
  livesEl.style.background = 'none';
  livesEl.style.fontSize = '20px';
  livesEl.style.fontWeight = 'bold';
  livesEl.style.padding = '8px 24px';
  livesEl.style.borderRadius = '8px';
  livesEl.style.boxShadow = '0 2px 8px #0008';
  livesEl.style.zIndex = '1100';
  livesEl.style.textAlign = 'right';
  livesEl.style.display = 'flex';
  livesEl.style.alignItems = 'center';
  livesEl.style.gap = '6px';
  updateLivesDisplay();
  document.body.appendChild(livesEl);
  // Debug controls for size and allow debug panel to be collapsed
  document.addEventListener('DOMContentLoaded', function() {
    // Removed debug controls for imgScale and rendering mode (hardcoded values used)
    // Advance to next target button
    const advanceBtn = document.getElementById('advance-target-btn');
    if (advanceBtn) advanceBtn.onclick = function() {
      if (!isActive) return;
      currentTargetIdx = (currentTargetIdx + 1) % targets.length;
      if (window.speedIncreaseEnabled && window.speedIncreaseEnabled()) {
        let inc = window.debugSpeedIncrease || speedIncrease;
        let max = window.debugSpeedMax || 6;
        speed = Math.min(speed + inc, max);
      }
      startTarget();
    };
    // Allow debug panel to be vertically centered, collapsed, and persist state
    const debugPanel = document.getElementById('debug-panel');
    if (debugPanel) {
      // --- Export/Export Delta Buttons ---
      const exportRow = document.createElement('div');
      exportRow.style.display = 'flex';
      exportRow.style.gap = '8px';
      exportRow.style.margin = '14px 0 0 0';

      const exportBtn = document.createElement('button');
      exportBtn.innerText = 'Export Debug';
      exportBtn.style.flex = '1';
      exportBtn.style.fontSize = '12px';
      exportBtn.style.padding = '6px 0';
      exportBtn.style.background = '#1a2a3a';
      exportBtn.style.color = '#fff';
      exportBtn.style.border = '1px solid #555';
      exportBtn.style.borderRadius = '6px';
      exportBtn.style.cursor = 'pointer';

      const exportDeltaBtn = document.createElement('button');
      exportDeltaBtn.innerText = 'Export Delta';
      exportDeltaBtn.style.flex = '1';
      exportDeltaBtn.style.fontSize = '12px';
      exportDeltaBtn.style.padding = '6px 0';
      exportDeltaBtn.style.background = '#3a1a1a';
      exportDeltaBtn.style.color = '#fff';
      exportDeltaBtn.style.border = '1px solid #555';
      exportDeltaBtn.style.borderRadius = '6px';
      exportDeltaBtn.style.cursor = 'pointer';

      exportRow.appendChild(exportBtn);
      exportRow.appendChild(exportDeltaBtn);
      debugPanel.appendChild(exportRow);

      // --- Export logic ---
      const debugDefaults = {
        animationPixelSize: 4,
        imgScale: 12,
        imgRendering: 'pixelated',
        speedIncrease: 0.12,
        debugSpeedIncrease: 0.12,
        debugSpeedMax: 6,
        speedIncreaseEnabled: true,
      };
      function getDebugVars() {
        return {
          animationPixelSize,
          imgScale,
          imgRendering,
          speedIncrease,
          debugSpeedIncrease: window.debugSpeedIncrease,
          debugSpeedMax: window.debugSpeedMax,
          speedIncreaseEnabled: window.speedIncreaseEnabled && window.speedIncreaseEnabled(),
        };
      }
      function exportDebug(all) {
        const vars = getDebugVars();
        let lines = [];
        for (const k in vars) {
          let v = vars[k];
          let def = debugDefaults[k];
          let isMod = (typeof v === 'number' && v !== def) || (typeof v === 'string' && v !== def) || (typeof v === 'boolean' && v !== def);
          if (all || isMod) {
            let valStr = typeof v === 'string' ? `'${v}'` : v;
            let comment = isMod ? ' // modified' : '';
            lines.push(`let ${k} = ${valStr};${comment}`);
          }
        }
        return lines.join('\n');
      }
      function copyToClipboard(text) {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text);
        } else {
          const ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
      }
      exportBtn.onclick = function() {
        copyToClipboard(exportDebug(true));
      };
      exportDeltaBtn.onclick = function() {
        copyToClipboard(exportDebug(false));
      };
      // --- Persist expanded/collapsed state of all debug details sections ---
      function persistDebugDetailsState() {
        const states = {};
        debugPanel.querySelectorAll('details').forEach(d => {
          if (d.id) states[d.id] = d.open;
        });
        localStorage.setItem('debugDetailsState', JSON.stringify(states));
      }
      function restoreDebugDetailsState() {
        let states = {};
        try {
          states = JSON.parse(localStorage.getItem('debugDetailsState')) || {};
        } catch(e) {}
        debugPanel.querySelectorAll('details').forEach(d => {
          if (d.id && typeof states[d.id] === 'boolean') d.open = states[d.id];
        });
      }
      // Assign IDs to all details if missing
      let detailsCount = 0;
      debugPanel.querySelectorAll('details').forEach(d => {
        if (!d.id) d.id = 'debug-details-' + (++detailsCount);
      });
      restoreDebugDetailsState();
      debugPanel.querySelectorAll('details').forEach(d => {
        d.addEventListener('toggle', persistDebugDetailsState);
      });
      debugPanel.style.top = '50%';
      debugPanel.style.transform = 'translateY(-50%)';
      debugPanel.style.transition = 'left 0.3s cubic-bezier(.4,2,.6,1)';
      let collapsed = false;
      const LS_KEY = 'debugPanelCollapsed';
      try {
        collapsed = localStorage.getItem(LS_KEY) === '1';
      } catch(e) {}
      if (collapsed) {
        debugPanel.style.left = '-220px';
      } else {
        debugPanel.style.left = '8px';
      }
      const collapseBtn = document.createElement('button');
      collapseBtn.innerText = collapsed ? '⇨' : '⇦';
      collapseBtn.title = collapsed ? 'Show debug panel' : 'Hide debug panel';
      collapseBtn.style.position = 'absolute';
      collapseBtn.style.top = '8px';
      collapseBtn.style.right = '-28px';
      collapseBtn.style.width = '24px';
      collapseBtn.style.height = '32px';
      collapseBtn.style.background = '#222';
      collapseBtn.style.color = '#eee';
      collapseBtn.style.border = '1px solid #444';
      collapseBtn.style.borderRadius = '0 6px 6px 0';
      collapseBtn.style.cursor = 'pointer';
      collapseBtn.style.zIndex = '1300';
      collapseBtn.onclick = function() {
        collapsed = !collapsed;
        if (collapsed) {
          debugPanel.style.left = '-220px';
          collapseBtn.innerText = '⇨';
          collapseBtn.title = 'Show debug panel';
        } else {
          debugPanel.style.left = '8px';
          collapseBtn.innerText = '⇦';
          collapseBtn.title = 'Hide debug panel';
        }
        try {
          localStorage.setItem(LS_KEY, collapsed ? '1' : '0');
        } catch(e) {}
      };
      debugPanel.appendChild(collapseBtn);

      // --- Start/Stop Buttons ---
      const btnRow = document.createElement('div');
      btnRow.style.display = 'flex';
      btnRow.style.gap = '8px';
      btnRow.style.margin = '12px 0 0 0';

      const startBtn = document.createElement('button');
      startBtn.innerText = 'Start';
      startBtn.style.flex = '1';
      startBtn.style.fontSize = '14px';
      startBtn.style.padding = '8px 0';
      startBtn.style.background = '#1a3a1a';
      startBtn.style.color = '#fff';
      startBtn.style.border = '1px solid #555';
      startBtn.style.borderRadius = '6px';
      startBtn.style.cursor = 'pointer';
      startBtn.onclick = function() {
        if (!isActive) {
          // If game over, restart; else resume
          if (lives <= 0) {
            restartGame();
          } else {
            isActive = true;
            animate();
          }
        }
      };

      const stopBtn = document.createElement('button');
      stopBtn.innerText = 'Stop';
      stopBtn.style.flex = '1';
      stopBtn.style.fontSize = '14px';
      stopBtn.style.padding = '8px 0';
      stopBtn.style.background = '#3a1a1a';
      stopBtn.style.color = '#fff';
      stopBtn.style.border = '1px solid #555';
      stopBtn.style.borderRadius = '6px';
      stopBtn.style.cursor = 'pointer';
      stopBtn.onclick = function() {
        isActive = false;
      };

      btnRow.appendChild(startBtn);
      btnRow.appendChild(stopBtn);
      debugPanel.appendChild(btnRow);

      // --- Collapsible Game Controls Section ---
      const gameDetails = document.createElement('details');
      gameDetails.style.marginTop = '14px';
      gameDetails.open = true;
      gameDetails.id = 'debug-game-controls-details';
      const gameSummary = document.createElement('summary');
      gameSummary.textContent = 'Game Controls';
      gameSummary.style.fontSize = '13px';
      gameSummary.style.fontWeight = 'bold';
      gameSummary.style.cursor = 'pointer';
      gameDetails.appendChild(gameSummary);

      // Speed Controls Row
      const speedRow = document.createElement('div');
      speedRow.style.display = 'flex';
      speedRow.style.gap = '8px';
      speedRow.style.margin = '12px 0 0 0';

      // Reset Speed Button
      const resetSpeedBtn = document.createElement('button');
      resetSpeedBtn.innerText = 'Reset Speed';
      resetSpeedBtn.style.flex = '1';
      resetSpeedBtn.style.fontSize = '13px';
      resetSpeedBtn.style.padding = '6px 0';
      resetSpeedBtn.style.background = '#1a2a3a';
      resetSpeedBtn.style.color = '#fff';
      resetSpeedBtn.style.border = '1px solid #555';
      resetSpeedBtn.style.borderRadius = '6px';
      resetSpeedBtn.style.cursor = 'pointer';
      resetSpeedBtn.onclick = function() {
        speed = startSpeed;
      };

      // Speed Increase Toggle
      const speedToggleLabel = document.createElement('label');
      speedToggleLabel.style.display = 'flex';
      speedToggleLabel.style.alignItems = 'center';
      speedToggleLabel.style.gap = '6px';
      speedToggleLabel.style.fontSize = '12px';
      speedToggleLabel.style.marginLeft = '8px';
      const speedToggle = document.createElement('input');
      speedToggle.type = 'checkbox';
      speedToggle.checked = true;
      speedToggle.id = 'speed-increase-toggle';
      speedToggleLabel.appendChild(speedToggle);
      const speedText = document.createTextNode('Speed Increases');
      speedToggleLabel.appendChild(speedText);
      speedToggleLabel.title = 'Enable automatic speed increases as targets advance. Legacy feature from scrolling game. Variable: window.speedIncreaseEnabled()';

      speedRow.appendChild(resetSpeedBtn);
      speedRow.appendChild(speedToggleLabel);

      // Speed Increment Input
      const speedIncLabel = document.createElement('label');
      speedIncLabel.style.display = 'flex';
      speedIncLabel.style.alignItems = 'center';
      speedIncLabel.style.gap = '4px';
      speedIncLabel.style.fontSize = '12px';
      speedIncLabel.style.marginLeft = '8px';
      speedIncLabel.textContent = 'Increment:';
      speedIncLabel.title = 'Speed increase per target advance (legacy feature). Variable: window.debugSpeedIncrease (default: 0.12)';
      const speedIncInput = document.createElement('input');
      speedIncInput.type = 'number';
      speedIncInput.value = speedIncrease;
      speedIncInput.step = '0.01';
      speedIncInput.min = '0';
      speedIncInput.style.width = '48px';
      speedIncInput.style.fontSize = '12px';
      speedIncInput.style.background = '#181818';
      speedIncInput.style.color = '#eee';
      speedIncInput.style.border = '1px solid #555';
      speedIncInput.style.borderRadius = '4px';
      speedIncInput.onchange = function() {
        window.debugSpeedIncrease = parseFloat(speedIncInput.value) || 0.01;
      };
      speedIncLabel.appendChild(speedIncInput);
      speedRow.appendChild(speedIncLabel);

      // Speed Max Input
      const speedMaxLabel = document.createElement('label');
      speedMaxLabel.style.display = 'flex';
      speedMaxLabel.style.alignItems = 'center';
      speedMaxLabel.style.gap = '4px';
      speedMaxLabel.style.fontSize = '12px';
      speedMaxLabel.style.marginLeft = '8px';
      speedMaxLabel.textContent = 'Max:';
      speedMaxLabel.title = 'Maximum speed limit for automatic increases (legacy feature). Variable: window.debugSpeedMax (default: 6)';
      const speedMaxInput = document.createElement('input');
      speedMaxInput.type = 'number';
      speedMaxInput.value = 6;
      speedMaxInput.step = '0.1';
      speedMaxInput.min = '0';
      speedMaxInput.style.width = '48px';
      speedMaxInput.style.fontSize = '12px';
      speedMaxInput.style.background = '#181818';
      speedMaxInput.style.color = '#eee';
      speedMaxInput.style.border = '1px solid #555';
      speedMaxInput.style.borderRadius = '4px';
      speedMaxInput.onchange = function() {
        window.debugSpeedMax = parseFloat(speedMaxInput.value) || 6;
      };
      speedMaxLabel.appendChild(speedMaxInput);
      speedRow.appendChild(speedMaxLabel);

      // Pendulum Physics Controls
      const physicsRow = document.createElement('div');
      physicsRow.style.display = 'flex';
      physicsRow.style.gap = '8px';
      physicsRow.style.margin = '8px 0 0 0';
      physicsRow.style.flexWrap = 'wrap';

      // Gravity Control
      const gravityLabel = document.createElement('label');
      gravityLabel.style.display = 'flex';
      gravityLabel.style.alignItems = 'center';
      gravityLabel.style.gap = '4px';
      gravityLabel.style.fontSize = '12px';
      gravityLabel.textContent = 'Gravity:';
      gravityLabel.title = 'Controls how fast the bag swings back to center. Lower = slower, more majestic swings. Higher = faster oscillations. Variable: swayGravity (default: 0.03)';
      const gravityInput = document.createElement('input');
      gravityInput.type = 'number';
      gravityInput.value = 0.03;
      gravityInput.step = '0.01';
      gravityInput.min = '0';
      gravityInput.max = '1';
      gravityInput.style.width = '58px';
      gravityInput.style.fontSize = '12px';
      gravityInput.style.background = '#181818';
      gravityInput.style.color = '#eee';
      gravityInput.style.border = '1px solid #555';
      gravityInput.style.borderRadius = '4px';
      gravityInput.onchange = function() {
        window.debugSwayGravity = parseFloat(gravityInput.value) || 0.15;
      };
      gravityLabel.appendChild(gravityInput);
      physicsRow.appendChild(gravityLabel);

      // Damping Control
      const dampingLabel = document.createElement('label');
      dampingLabel.style.display = 'flex';
      dampingLabel.style.alignItems = 'center';
      dampingLabel.style.gap = '4px';
      dampingLabel.style.fontSize = '12px';
      dampingLabel.textContent = 'Damping:';
      dampingLabel.title = 'Controls how quickly swinging energy is lost. Higher values = longer swings, lower values = quick settling. Range: 0.9-0.999. Variable: swayDamping (default: 0.9985)';
      const dampingInput = document.createElement('input');
      dampingInput.type = 'number';
      dampingInput.value = 0.9985;
      dampingInput.step = '0.001';
      dampingInput.min = '0.9';
      dampingInput.max = '1';
      dampingInput.style.width = '68px';
      dampingInput.style.fontSize = '12px';
      dampingInput.style.background = '#181818';
      dampingInput.style.color = '#eee';
      dampingInput.style.border = '1px solid #555';
      dampingInput.style.borderRadius = '4px';
      dampingInput.onchange = function() {
        window.debugSwayDamping = parseFloat(dampingInput.value) || 0.995;
      };
      dampingLabel.appendChild(dampingInput);
      physicsRow.appendChild(dampingLabel);

      // Target Timer Control
      const timerRow = document.createElement('div');
      timerRow.style.display = 'flex';
      timerRow.style.gap = '8px';
      timerRow.style.margin = '8px 0 0 0';
      timerRow.style.alignItems = 'center';

      const timerLabel = document.createElement('label');
      timerLabel.style.display = 'flex';
      timerLabel.style.alignItems = 'center';
      timerLabel.style.gap = '4px';
      timerLabel.style.fontSize = '12px';
      timerLabel.textContent = 'Target Duration (s):';
      timerLabel.title = 'How long each target stays before auto-advancing to the next one. Variable: targetDuration (default: 20000ms)';
      const timerInput = document.createElement('input');
      timerInput.type = 'number';
      timerInput.value = 20;
      timerInput.step = '1';
      timerInput.min = '5';
      timerInput.max = '120';
      timerInput.style.width = '48px';
      timerInput.style.fontSize = '12px';
      timerInput.style.background = '#181818';
      timerInput.style.color = '#eee';
      timerInput.style.border = '1px solid #555';
      timerInput.style.borderRadius = '4px';
      timerInput.onchange = function() {
        window.debugTargetDuration = parseFloat(timerInput.value) || 20;
        targetDuration = window.debugTargetDuration * 1000; // Convert to milliseconds
      };
      timerLabel.appendChild(timerInput);
      timerRow.appendChild(timerLabel);

      // Directional Pendulum Toggle
      const directionalToggleLabel = document.createElement('label');
      directionalToggleLabel.style.display = 'flex';
      directionalToggleLabel.style.alignItems = 'center';
      directionalToggleLabel.style.gap = '6px';
      directionalToggleLabel.style.fontSize = '12px';
      directionalToggleLabel.style.marginLeft = '8px';
      const directionalToggle = document.createElement('input');
      directionalToggle.type = 'checkbox';
      directionalToggle.checked = true;
      directionalToggle.id = 'directional-pendulum-toggle';
      directionalToggle.onchange = function() {
        directionalPendulumEnabled = directionalToggle.checked;
      };
      directionalToggleLabel.appendChild(directionalToggle);
      const directionalText = document.createTextNode('Directional Push');
      directionalToggleLabel.appendChild(directionalText);
      directionalToggleLabel.title = 'Enable/disable target-specific directional pushes (left/right/center). When enabled, successful hits trigger directional motion based on target type. Variable: directionalPendulumEnabled';
      timerRow.appendChild(directionalToggleLabel);

      // Directional Push Controls Row
      const directionalRow = document.createElement('div');
      directionalRow.style.display = 'flex';
      directionalRow.style.gap = '8px';
      directionalRow.style.margin = '8px 0 0 0';
      directionalRow.style.flexWrap = 'wrap';
      directionalRow.style.alignItems = 'center';

      // Push Scale Control
      const pushScaleLabel = document.createElement('label');
      pushScaleLabel.style.display = 'flex';
      pushScaleLabel.style.alignItems = 'center';
      pushScaleLabel.style.gap = '4px';
      pushScaleLabel.style.fontSize = '12px';
      pushScaleLabel.textContent = 'Push Scale:';
      pushScaleLabel.title = 'Multiplier for directional push strength. 1.0 = normal, 2.0 = double strength, 0.5 = half strength. Affects both angle and velocity. Variable: window.debugPushScale';
      const pushScaleInput = document.createElement('input');
      pushScaleInput.type = 'number';
      pushScaleInput.value = 1.0;
      pushScaleInput.step = '0.1';
      pushScaleInput.min = '0';
      pushScaleInput.max = '5';
      pushScaleInput.style.width = '58px';
      pushScaleInput.style.fontSize = '12px';
      pushScaleInput.style.background = '#181818';
      pushScaleInput.style.color = '#eee';
      pushScaleInput.style.border = '1px solid #555';
      pushScaleInput.style.borderRadius = '4px';
      pushScaleInput.onchange = function() {
        window.debugPushScale = parseFloat(pushScaleInput.value) || 1.0;
      };
      pushScaleLabel.appendChild(pushScaleInput);
      directionalRow.appendChild(pushScaleLabel);

      // Push Duration Control
      const pushDurationLabel = document.createElement('label');
      pushDurationLabel.style.display = 'flex';
      pushDurationLabel.style.alignItems = 'center';
      pushDurationLabel.style.gap = '4px';
      pushDurationLabel.style.fontSize = '12px';
      pushDurationLabel.style.marginLeft = '8px';
      pushDurationLabel.textContent = 'Duration:';
      pushDurationLabel.title = 'Time multiplier for directional pushes. Higher = slower motion that lasts longer. Adjusts gravity by dividing by this value. Variable: window.debugPushDuration';
      const pushDurationInput = document.createElement('input');
      pushDurationInput.type = 'number';
      pushDurationInput.value = 10.0;
      pushDurationInput.step = '0.1';
      pushDurationInput.min = '0.1';
      pushDurationInput.max = '10';
      pushDurationInput.style.width = '58px';
      pushDurationInput.style.fontSize = '12px';
      pushDurationInput.style.background = '#181818';
      pushDurationInput.style.color = '#eee';
      pushDurationInput.style.border = '1px solid #555';
      pushDurationInput.style.borderRadius = '4px';
      pushDurationInput.onchange = function() {
        window.debugPushDuration = parseFloat(pushDurationInput.value) || 1.0;
        // Update directional physics based on duration
        directionalGravity = 0.08 / window.debugPushDuration;
        directionalDamping = Math.pow(0.992, 1 / window.debugPushDuration);
      };
      pushDurationLabel.appendChild(pushDurationInput);
      directionalRow.appendChild(pushDurationLabel);

      // Push Damping Control (controls oscillations/settling behavior)
      const pushDampingLabel = document.createElement('label');
      pushDampingLabel.style.display = 'flex';
      pushDampingLabel.style.alignItems = 'center';
      pushDampingLabel.style.gap = '4px';
      pushDampingLabel.style.fontSize = '12px';
      pushDampingLabel.style.marginLeft = '8px';
      pushDampingLabel.textContent = 'Damping:';
      pushDampingLabel.title = 'Controls oscillation vs direct settling for directional pushes. Lower = less bouncy, more direct nudge. Higher = more oscillations. Variable: window.debugPushDamping (default: 0.85)';
      const pushDampingInput = document.createElement('input');
      pushDampingInput.type = 'number';
      pushDampingInput.value = 0.85;
      pushDampingInput.step = '0.05';
      pushDampingInput.min = '0.1';
      pushDampingInput.max = '0.99';
      pushDampingInput.style.width = '58px';
      pushDampingInput.style.fontSize = '12px';
      pushDampingInput.style.background = '#181818';
      pushDampingInput.style.color = '#eee';
      pushDampingInput.style.border = '1px solid #555';
      pushDampingInput.style.borderRadius = '4px';
      pushDampingInput.onchange = function() {
        window.debugPushDamping = parseFloat(pushDampingInput.value) || 0.85;
      };
      pushDampingLabel.appendChild(pushDampingInput);
      directionalRow.appendChild(pushDampingLabel);

      // Test Push Buttons
      const testPushLeft = document.createElement('button');
      testPushLeft.innerText = '← Left';
      testPushLeft.title = 'Test isolated left directional push. Triggers only directional motion without regular hit physics. Function: triggerDirectionalPendulumIsolated(\'pushbagleft\')';
      testPushLeft.style.fontSize = '11px';
      testPushLeft.style.padding = '4px 8px';
      testPushLeft.style.background = '#2a1a3a';
      testPushLeft.style.color = '#fff';
      testPushLeft.style.border = '1px solid #555';
      testPushLeft.style.borderRadius = '4px';
      testPushLeft.style.cursor = 'pointer';
      testPushLeft.onclick = function() {
        triggerDirectionalPendulumIsolated('pushbagleft');
      };
      directionalRow.appendChild(testPushLeft);

      const testPushCenter = document.createElement('button');
      testPushCenter.innerText = '↓ Center';
      testPushCenter.title = 'Test centered settling motion. Creates minimal random angle that settles to center. Function: triggerDirectionalPendulumIsolated(\'pushbackcentered\')';
      testPushCenter.style.fontSize = '11px';
      testPushCenter.style.padding = '4px 8px';
      testPushCenter.style.background = '#1a2a1a';
      testPushCenter.style.color = '#fff';
      testPushCenter.style.border = '1px solid #555';
      testPushCenter.style.borderRadius = '4px';
      testPushCenter.style.cursor = 'pointer';
      testPushCenter.onclick = function() {
        triggerDirectionalPendulumIsolated('pushbackcentered');
      };
      directionalRow.appendChild(testPushCenter);

      const testPushRight = document.createElement('button');
      testPushRight.innerText = 'Right →';
      testPushRight.title = 'Test isolated right directional push. Triggers only directional motion without regular hit physics. Function: triggerDirectionalPendulumIsolated(\'pushbagright\')';
      testPushRight.style.fontSize = '11px';
      testPushRight.style.padding = '4px 8px';
      testPushRight.style.background = '#3a1a1a';
      testPushRight.style.color = '#fff';
      testPushRight.style.border = '1px solid #555';
      testPushRight.style.borderRadius = '4px';
      testPushRight.style.cursor = 'pointer';
      testPushRight.onclick = function() {
        triggerDirectionalPendulumIsolated('pushbagright');
      };
      directionalRow.appendChild(testPushRight);

      // Advanced Chill Controls Row
      const chillRow = document.createElement('div');
      chillRow.style.display = 'flex';
      chillRow.style.gap = '8px';
      chillRow.style.margin = '8px 0 0 0';
      chillRow.style.flexWrap = 'wrap';
      chillRow.style.alignItems = 'center';

      // Initial Hit Strength
      const hitStrengthLabel = document.createElement('label');
      hitStrengthLabel.style.display = 'flex';
      hitStrengthLabel.style.alignItems = 'center';
      hitStrengthLabel.style.gap = '4px';
      hitStrengthLabel.style.fontSize = '12px';
      hitStrengthLabel.textContent = 'Hit Strength:';
      hitStrengthLabel.title = 'Controls initial swing force when bag is hit. Lower = more gentle, chill swings. Higher = more violent impacts. Variable: hitStrengthMultiplier (default: 1.0)';
      const hitStrengthInput = document.createElement('input');
      hitStrengthInput.type = 'number';
      hitStrengthInput.value = 1.0;
      hitStrengthInput.step = '0.1';
      hitStrengthInput.min = '0.1';
      hitStrengthInput.max = '3.0';
      hitStrengthInput.style.width = '58px';
      hitStrengthInput.style.fontSize = '12px';
      hitStrengthInput.style.background = '#181818';
      hitStrengthInput.style.color = '#eee';
      hitStrengthInput.style.border = '1px solid #555';
      hitStrengthInput.style.borderRadius = '4px';
      hitStrengthInput.onchange = function() {
        window.debugHitStrength = parseFloat(hitStrengthInput.value) || 1.0;
      };
      hitStrengthLabel.appendChild(hitStrengthInput);
      chillRow.appendChild(hitStrengthLabel);

      // Randomness Dampener
      const randomnessLabel = document.createElement('label');
      randomnessLabel.style.display = 'flex';
      randomnessLabel.style.alignItems = 'center';
      randomnessLabel.style.gap = '4px';
      randomnessLabel.style.fontSize = '12px';
      randomnessLabel.style.marginLeft = '8px';
      randomnessLabel.textContent = 'Randomness:';
      randomnessLabel.title = 'Controls random motion variation. 0 = perfectly predictable, 1 = full randomness. Lower for more consistent, chill motion. Variable: randomnessMultiplier (default: 1.0)';
      const randomnessInput = document.createElement('input');
      randomnessInput.type = 'number';
      randomnessInput.value = 1.0;
      randomnessInput.step = '0.1';
      randomnessInput.min = '0';
      randomnessInput.max = '2.0';
      randomnessInput.style.width = '58px';
      randomnessInput.style.fontSize = '12px';
      randomnessInput.style.background = '#181818';
      randomnessInput.style.color = '#eee';
      randomnessInput.style.border = '1px solid #555';
      randomnessInput.style.borderRadius = '4px';
      randomnessInput.onchange = function() {
        window.debugRandomness = parseFloat(randomnessInput.value) || 1.0;
      };
      randomnessLabel.appendChild(randomnessInput);
      chillRow.appendChild(randomnessLabel);

      // Chain Controls Row
      const chainRow = document.createElement('div');
      chainRow.style.display = 'flex';
      chainRow.style.gap = '8px';
      chainRow.style.margin = '8px 0 0 0';
      chainRow.style.flexWrap = 'wrap';
      chainRow.style.alignItems = 'center';

      // Chain Gravity
      const chainGravityLabel = document.createElement('label');
      chainGravityLabel.style.display = 'flex';
      chainGravityLabel.style.alignItems = 'center';
      chainGravityLabel.style.gap = '4px';
      chainGravityLabel.style.fontSize = '12px';
      chainGravityLabel.textContent = 'Chain Gravity:';
      chainGravityLabel.title = 'Controls how fast the chain settles. Lower = more floating, ethereal chain motion. Variable: chainGravity (default: 0.03)';
      const chainGravityInput = document.createElement('input');
      chainGravityInput.type = 'number';
      chainGravityInput.value = 0.03;
      chainGravityInput.step = '0.005';
      chainGravityInput.min = '0.001';
      chainGravityInput.max = '0.1';
      chainGravityInput.style.width = '58px';
      chainGravityInput.style.fontSize = '12px';
      chainGravityInput.style.background = '#181818';
      chainGravityInput.style.color = '#eee';
      chainGravityInput.style.border = '1px solid #555';
      chainGravityInput.style.borderRadius = '4px';
      chainGravityInput.onchange = function() {
        window.debugChainGravity = parseFloat(chainGravityInput.value) || 0.03;
        chainGravity = window.debugChainGravity;
      };
      chainGravityLabel.appendChild(chainGravityInput);
      chainRow.appendChild(chainGravityLabel);

      // Chain Damping
      const chainDampingLabel = document.createElement('label');
      chainDampingLabel.style.display = 'flex';
      chainDampingLabel.style.alignItems = 'center';
      chainDampingLabel.style.gap = '4px';
      chainDampingLabel.style.fontSize = '12px';
      chainDampingLabel.style.marginLeft = '8px';
      chainDampingLabel.textContent = 'Chain Damping:';
      chainDampingLabel.title = 'Controls chain energy loss. Higher = longer, more hypnotic chain movement. Variable: chainDamping (default: 0.998)';
      const chainDampingInput = document.createElement('input');
      chainDampingInput.type = 'number';
      chainDampingInput.value = 0.998;
      chainDampingInput.step = '0.001';
      chainDampingInput.min = '0.9';
      chainDampingInput.max = '0.9999';
      chainDampingInput.style.width = '68px';
      chainDampingInput.style.fontSize = '12px';
      chainDampingInput.style.background = '#181818';
      chainDampingInput.style.color = '#eee';
      chainDampingInput.style.border = '1px solid #555';
      chainDampingInput.style.borderRadius = '4px';
      chainDampingInput.onchange = function() {
        window.debugChainDamping = parseFloat(chainDampingInput.value) || 0.998;
        chainDamping = window.debugChainDamping;
      };
      chainDampingLabel.appendChild(chainDampingInput);
      chainRow.appendChild(chainDampingLabel);

      // Settle Threshold (how sensitive the "stop" detection is)
      const thresholdLabel = document.createElement('label');
      thresholdLabel.style.display = 'flex';
      thresholdLabel.style.alignItems = 'center';
      thresholdLabel.style.gap = '4px';
      thresholdLabel.style.fontSize = '12px';
      thresholdLabel.style.marginLeft = '8px';
      thresholdLabel.textContent = 'Settle Threshold:';
      thresholdLabel.title = 'How small motion must be before stopping. Lower = swings longer before settling. Higher = stops sooner. Variable: settleThreshold (default: 0.002)';
      const thresholdInput = document.createElement('input');
      thresholdInput.type = 'number';
      thresholdInput.value = 0.002;
      thresholdInput.step = '0.0005';
      thresholdInput.min = '0.0001';
      thresholdInput.max = '0.01';
      thresholdInput.style.width = '68px';
      thresholdInput.style.fontSize = '12px';
      thresholdInput.style.background = '#181818';
      thresholdInput.style.color = '#eee';
      thresholdInput.style.border = '1px solid #555';
      thresholdInput.style.borderRadius = '4px';
      thresholdInput.onchange = function() {
        window.debugSettleThreshold = parseFloat(thresholdInput.value) || 0.002;
      };
      thresholdLabel.appendChild(thresholdInput);
      chainRow.appendChild(thresholdLabel);

      gameDetails.appendChild(speedRow);
      gameDetails.appendChild(physicsRow);
      gameDetails.appendChild(timerRow);
      gameDetails.appendChild(directionalRow);
      gameDetails.appendChild(chillRow);
      gameDetails.appendChild(chainRow);
      debugPanel.appendChild(gameDetails);

      // Expose debug values globally for game logic
      window.speedIncreaseEnabled = () => speedToggle.checked;
      window.debugSpeedIncrease = parseFloat(speedIncInput.value) || 0.12;
      window.debugSpeedMax = parseFloat(speedMaxInput.value) || 6;
      window.debugSwayGravity = parseFloat(gravityInput.value) || 0.03;
      window.debugSwayDamping = parseFloat(dampingInput.value) || 0.9985;
      window.debugTargetDuration = parseFloat(timerInput.value) || 20;
      window.debugPushScale = parseFloat(pushScaleInput.value) || 1.0;
      window.debugPushDuration = parseFloat(pushDurationInput.value) || 1.0;
      window.debugPushDamping = parseFloat(pushDampingInput.value) || 0.85;
    }
  });
  // Update the lives display using heart images
  function updateLivesDisplay() {
    if (!livesEl) return;
    livesEl.innerHTML = '';
    for (let i = 0; i < lives; i++) {
      const heart = document.createElement('img');
      heart.src = 'imgs/heart.png';
      heart.alt = 'heart';
      heart.style.width = '28px';
      heart.style.height = '28px';
      heart.style.display = 'inline-block';
      heart.style.verticalAlign = 'middle';
      heart.style.imageRendering = 'pixelated';
      livesEl.appendChild(heart);
    }
  }

  function updateHitCounterDisplay() {
    const totalScoreEl = document.getElementById('total-score');
    const targetHitsEl = document.getElementById('target-hits');
    const hitsNeededEl = document.getElementById('hits-needed');
    
    if (totalScoreEl) totalScoreEl.textContent = score;
    if (targetHitsEl) targetHitsEl.textContent = hitsOnCurrentTarget;
    if (hitsNeededEl) hitsNeededEl.textContent = hitsNeededPerTarget;
  }
  }

  // --- GAME LOOP ---
  function startTarget() {
      const target = targets[currentTargetIdx];
      startAmbientSound(target);
      
      // Remove previous target wrapper and all hit arrows
      if (imgEl && imgEl.parentElement && imgEl.parentElement.classList.contains('target-wrapper')) {
        imgEl.parentElement.remove();
      } else if (imgEl) {
        imgEl.remove();
      }
      if (chainEl) {
        chainEl.remove();
        chainEl = null;
      }
      if (Array.isArray(hitArrows)) {
        hitArrows.forEach(a => a.remove());
        hitArrows = [];
      }
      
      // Create chain element (top part)
      chainEl = document.createElement('img');
      chainEl.src = 'imgs/heavybag-chain.png';
      chainEl.alt = 'Chain';
      chainEl.className = 'chain-element';
      chainEl.style.position = 'absolute';
      chainEl.style.transformOrigin = '50% 0%'; // Pivot at top
      chainEl.style.pointerEvents = 'none';
      chainEl.style.zIndex = 999; // Behind the bag
      chainEl.style.imageRendering = 'pixelated';
      
      // Create bag wrapper (hangs from chain)
      const wrapper = document.createElement('div');
      wrapper.className = 'target-wrapper punching-bag';
      wrapper.style.position = 'absolute';
      wrapper.style.transformOrigin = '50% 0%'; // Set pivot point at top center for swinging
      wrapper.style.pointerEvents = 'none';
      wrapper.style.zIndex = 1000;
      
      imgEl = document.createElement('img');
      imgEl.src = target.img;
      imgEl.alt = target.letter.toUpperCase();
      // Load chain first
      chainEl.onload = function() {
        const chainWidth = chainEl.naturalWidth;
        const chainHeight = chainEl.naturalHeight;
        chainEl.style.width = (chainWidth * imgScale) + 'px';
        chainEl.style.height = (chainHeight * imgScale) + 'px';
        chainEl.style.left = '0';
        chainEl.style.top = '0';
        
        // Position chain at top center
        areaEl.appendChild(chainEl);
        window.chainWrapper = chainEl;
      };
      
      imgEl.onload = function() {
        imgWidth = imgEl.naturalWidth;
        imgHeight = imgEl.naturalHeight;
        applyImgScale();
        applyImgRendering();
        imgEl.style.position = 'absolute';
        imgEl.style.left = '0';
        imgEl.style.top = '0';
        imgEl.style.transition = 'none';
        imgEl.style.pointerEvents = 'none';
        imgEl.style.width = (imgWidth * imgScale) + 'px';
        imgEl.style.height = (imgHeight * imgScale) + 'px';
        wrapper.style.width = (imgWidth * imgScale) + 'px';
        wrapper.style.height = (imgHeight * imgScale) + 'px';
        
        // Position bag below chain
        const chainHeight = chainEl ? chainEl.offsetHeight : 0;
        wrapper.style.left = '0';
        wrapper.style.top = chainHeight + 'px';
        
        // Adjust area size for both chain and bag
        const totalHeight = chainHeight + (imgHeight * imgScale);
        areaEl.style.width = (imgWidth * imgScale) + 'px';
        areaEl.style.height = totalHeight + 'px';
        
        isActive = true;
        // Don't call animate() - we're now static with physics-based swaying
        startSwayPhysics();
        // Start the auto-advance timer
        startTargetTimer();
      };
      
      wrapper.appendChild(imgEl);
      areaEl.appendChild(wrapper);
      window.targetWrapper = wrapper;
  }

  function startAmbientSound(target) {
      // Stop previous ambient sound
      if (ambientAudio) {
        ambientAudio.pause();
        ambientAudio = null;
        if (ambientSource) {
          try { ambientSource.disconnect(); } catch(e) {}
          ambientSource = null;
        }
        if (ambientGain) {
          try { ambientGain.disconnect(); } catch(e) {}
          ambientGain = null;
        }
        if (ambientFadeInterval) clearInterval(ambientFadeInterval);
      }
      // Determine ambient sound filename from target image
      let imgFile = target.img.split('/').pop();
      let base = imgFile.replace('-sign-stand.png', '');
      let ambientFile = `snds/${base}-ambientsound.wav`;
  ambientAudio = new Audio(ambientFile);
  ambientAudio.loop = true;
  ambientAudio.volume = 0;
  ambientAudio.play().catch((e)=>{console.warn('Ambient sound error:', e);});
      ambientFadeCurrent = 0;
      ambientFadeTarget = 1;
      // Use a gain node for smooth fade if possible
      if (window.AudioContext || window.webkitAudioContext) {
        let ctx = sfxAudioContext || new (window.AudioContext || window.webkitAudioContext)();
        ambientGain = ctx.createGain();
        ambientGain.gain.value = 0;
        ambientSource = ctx.createMediaElementSource(ambientAudio);
        try {
          ambientSource.connect(ambientGain);
          ambientGain.connect(ctx.destination);
        } catch (e) {
          console.warn('Ambient gain connect error:', e);
        }
      }
      // Fade in loop
      ambientFadeInterval = setInterval(() => {
        if (!ambientAudio) return;
        if (ambientFadeCurrent < ambientFadeTarget) {
          ambientFadeCurrent = Math.min(ambientFadeTarget, ambientFadeCurrent + ambientFadeStep);
        } else if (ambientFadeCurrent > ambientFadeTarget) {
          ambientFadeCurrent = Math.max(ambientFadeTarget, ambientFadeCurrent - ambientFadeStep);
        }
        if (ambientGain) {
          ambientGain.gain.value = ambientFadeCurrent;
        } else {
          ambientAudio.volume = ambientFadeCurrent;
        }
      }, 50);
      // Remove previous target wrapper and all hit arrows
      if (imgEl && imgEl.parentElement && imgEl.parentElement.classList.contains('target-wrapper')) {
        imgEl.parentElement.remove();
      } else if (imgEl) {
        imgEl.remove();
      }
      if (Array.isArray(hitArrows)) {
        hitArrows.forEach(a => a.remove());
        hitArrows = [];
      }
      const wrapper = document.createElement('div');
      wrapper.className = 'target-wrapper punching-bag';
      wrapper.style.position = 'absolute';
      wrapper.style.transformOrigin = '50% 0%'; // Set pivot point at top center for swinging
      // Center the punching bag
      imgX = 0;
      imgY = 0;
      wrapper.style.left = '0';
      wrapper.style.top = '0';
      wrapper.style.width = (imgWidth * imgScale) + 'px';
      wrapper.style.height = (imgHeight * imgScale) + 'px';
      wrapper.style.pointerEvents = 'none';
      wrapper.style.zIndex = 1000;
      imgEl = document.createElement('img');
      imgEl.src = target.img;
      imgEl.alt = target.letter.toUpperCase();
      imgEl.onload = function() {
        imgWidth = imgEl.naturalWidth;
        imgHeight = imgEl.naturalHeight;
        applyImgScale();
        applyImgRendering();
        imgEl.style.position = 'absolute';
        imgEl.style.left = '0';
        imgEl.style.top = '0';
        imgEl.style.transition = 'none';
        imgEl.style.pointerEvents = 'none';
        imgEl.style.width = (imgWidth * imgScale) + 'px';
        imgEl.style.height = (imgHeight * imgScale) + 'px';
        wrapper.style.width = (imgWidth * imgScale) + 'px';
        wrapper.style.height = (imgHeight * imgScale) + 'px';
        areaEl.style.width = (imgWidth * imgScale) + 'px';
        areaEl.style.height = (imgHeight * imgScale) + 'px';
        // Center the punching bag
        imgX = 0;
        imgY = 0;
        wrapper.style.left = imgX + 'px';
        wrapper.style.top = imgY + 'px';
        isActive = true;
        // Don't call animate() - we're now static with physics-based swaying
        startSwayPhysics();
      };
// Handle window resizing: keep punching bag centered
window.addEventListener('resize', function() {
  // Punching bag stays centered, no repositioning needed
});
      wrapper.appendChild(imgEl);
  areaEl.appendChild(wrapper);
  window.targetWrapper = wrapper;
    }

  function applyImgScale() {
    if (imgEl) {
      imgEl.style.width = (imgWidth * imgScale) + 'px';
      imgEl.style.height = (imgHeight * imgScale) + 'px';
      areaEl.style.height = (imgHeight * imgScale) + 'px';
      imgEl.style.left = imgX + 'px';
    }
  }

  function applyImgRendering() {
    if (imgEl) {
      imgEl.style.imageRendering = imgRendering;
    }
  }

  // Listen for debug menu graphic size controls
  document.addEventListener('DOMContentLoaded', function() {
    // Removed debug controls for imgScale and rendering mode (hardcoded values used)
  });

  // New pendulum physics system for punching bag
  function startSwayPhysics() {
    if (!isActive) return;
    updateSwayPhysics();
  }

  function updateSwayPhysics() {
    if (!isActive) return;
    
    // Apply physics to chain (subtle movement)
    if (Math.abs(chainAngle) > 0.001 || Math.abs(chainVelocity) > 0.001) {
      const chainRestoreForce = -Math.sin(chainAngle) * chainGravity;
      chainVelocity += chainRestoreForce;
      chainVelocity *= chainDamping;
      chainAngle += chainVelocity;
      
      // Stop chain swaying when movement is minimal (use smaller threshold for chain)
      const chainSettleThreshold = (window.debugSettleThreshold || 0.002) * 0.5;
      if (Math.abs(chainAngle) < chainSettleThreshold && Math.abs(chainVelocity) < chainSettleThreshold) {
        chainAngle = 0;
        chainVelocity = 0;
      }
    }
    
    // Apply physics to regular sway angle (bag movement)
    if (bagSwaying) {
      // Enhanced pendulum physics with more realistic motion
      const restoreForce = -Math.sin(swayAngle) * swayGravity;
      swayVelocity += restoreForce;
      swayVelocity *= swayDamping; // Apply damping (air resistance/friction)
      swayAngle += swayVelocity;
      
      // Add subtle random motion for more organic feel (scaled by randomness control)
      const randomness = window.debugRandomness || 1.0;
      if (Math.random() < 0.02 * randomness) { // Chance scaled by randomness setting
        swayVelocity += (Math.random() - 0.5) * 0.01 * randomness;
      }
      
      // Limit maximum angle to prevent unrealistic swinging
      const maxAngle = Math.PI / 4; // 45 degrees max
      if (Math.abs(swayAngle) > maxAngle) {
        swayAngle = Math.sign(swayAngle) * maxAngle;
        swayVelocity *= -0.3; // Bounce back with reduced velocity
      }
      
      // Stop swaying when movement is minimal (use debug threshold)
      const settleThreshold = window.debugSettleThreshold || 0.002;
      if (Math.abs(swayAngle) < settleThreshold && Math.abs(swayVelocity) < settleThreshold) {
        bagSwaying = false;
        swayAngle = 0;
        swayVelocity = 0;
        // Reset physics constants for next hit
        swayGravity = window.debugSwayGravity || 0.03;
        swayDamping = window.debugSwayDamping || 0.9985;
      }
    }
    
    // Apply physics to directional sway angle
    if (directionalSwaying) {
      // Directional pendulum physics - use debug controls
      const duration = window.debugPushDuration || 1.0;
      const damping = window.debugPushDamping || 0.85;
      const adjustedGravity = 0.08 / duration;
      
      const directionalRestoreForce = -Math.sin(directionalAngle) * adjustedGravity;
      directionalVelocity += directionalRestoreForce;
      directionalVelocity *= damping; // Use the debug damping control directly
      directionalAngle += directionalVelocity;
      
      // Stop directional swaying when movement is minimal (adjusted threshold for duration)
      const threshold = 0.001 * duration;
      if (Math.abs(directionalAngle) < threshold && Math.abs(directionalVelocity) < threshold) {
        directionalSwaying = false;
        directionalAngle = 0;
        directionalVelocity = 0;
      }
    }
    
    // Apply chain transform (subtle movement)
    if (window.chainWrapper) {
      const chainDegrees = (chainAngle * 180) / Math.PI;
      window.chainWrapper.style.transform = `rotate(${chainDegrees}deg)`;
      window.chainWrapper.style.transformOrigin = '50% 0%';
    }
    
    // Combine bag angles and apply transform (bag inherits chain movement plus its own)
    const totalBagAngle = chainAngle + swayAngle + directionalAngle;
    if (window.targetWrapper) {
      if (bagSwaying || directionalSwaying || Math.abs(chainAngle) > 0.001) {
        const degrees = (totalBagAngle * 180) / Math.PI;
        window.targetWrapper.style.transform = `rotate(${degrees}deg)`;
        window.targetWrapper.style.transformOrigin = '50% 0%'; // Ensure pivot stays at top
      } else {
        // Ensure bag is perfectly centered when not swaying
        window.targetWrapper.style.transform = 'rotate(0deg)';
      }
    }
    
    // Continue physics loop
    animationFrame = requestAnimationFrame(updateSwayPhysics);
  }

  // Function to trigger a hit on the punching bag
  function hitPunchingBag() {
    // Start swaying with initial velocity based on hit direction
    bagSwaying = true;
    
    // Apply debug controls for more chill pendulum
    const hitStrength = window.debugHitStrength || 1.0;
    const randomness = window.debugRandomness || 1.0;
    
    // Gentler hit for slower physics, scaled by hit strength
    swayAngle = (Math.random() - 0.5) * 0.2 * hitStrength * randomness; // Smaller initial displacement
    swayVelocity = (Math.random() - 0.5) * 0.3 * hitStrength * randomness; // Gentler initial velocity
    
    // Also give the chain a subtle movement (much smaller), scaled by hit strength
    chainAngle += (Math.random() - 0.5) * 0.05 * hitStrength * randomness; // Very small chain movement
    chainVelocity += (Math.random() - 0.5) * 0.02 * hitStrength * randomness; // Gentle chain velocity
    
    // Use debug values if available, otherwise defaults
    swayGravity = window.debugSwayGravity || 0.03;
    swayDamping = window.debugSwayDamping || 0.9985;
  }

  // Function to trigger directional pendulum motion based on target
  function triggerDirectionalPendulum(pushDirection) {
    if (!directionalPendulumEnabled) return;
    
    directionalSwaying = true;
    
    // Get controls from debug panel
    const scale = window.debugPushScale || 1.0;
    const hitStrength = window.debugHitStrength || 1.0;
    const randomness = window.debugRandomness || 1.0;
    const combinedScale = scale * hitStrength;
    
    switch(pushDirection) {
      case 'pushbagright':
        directionalAngle = 0.1 * combinedScale; // Start at slight right angle
        directionalVelocity = 0.05 * combinedScale; // Gentle push right
        // Also affect chain subtly
        chainAngle += 0.02 * combinedScale * randomness;
        chainVelocity += 0.01 * combinedScale * randomness;
        break;
      case 'pushbagleft':
        directionalAngle = -0.1 * combinedScale; // Start at slight left angle  
        directionalVelocity = -0.05 * combinedScale; // Gentle push left
        // Also affect chain subtly
        chainAngle -= 0.02 * combinedScale * randomness;
        chainVelocity -= 0.01 * combinedScale * randomness;
        break;
      case 'pushbackcentered':
        directionalAngle = (Math.random() - 0.5) * 0.05 * combinedScale * randomness; // Very small random angle
        directionalVelocity = 0; // No initial velocity, just settle to center
        // Very minimal chain effect
        chainAngle += (Math.random() - 0.5) * 0.01 * combinedScale * randomness;
        break;
      default:
        // No directional motion
        directionalSwaying = false;
        break;
    }
  }

  // Isolated function for debug testing - only triggers directional push
  function triggerDirectionalPendulumIsolated(pushDirection) {
    if (!directionalPendulumEnabled) return;
    
    // Only trigger directional pendulum, no regular hit physics
    directionalSwaying = true;
    
    // Get the scale factor from debug controls
    const scale = window.debugPushScale || 1.0;
    
    switch(pushDirection) {
      case 'pushbagright':
        directionalAngle = 0.1 * scale; // Start at slight right angle
        directionalVelocity = 0.05 * scale; // Gentle push right
        // Also affect chain subtly
        chainAngle += 0.02 * scale;
        chainVelocity += 0.01 * scale;
        break;
      case 'pushbagleft':
        directionalAngle = -0.1 * scale; // Start at slight left angle  
        directionalVelocity = -0.05 * scale; // Gentle push left
        // Also affect chain subtly
        chainAngle -= 0.02 * scale;
        chainVelocity -= 0.01 * scale;
        break;
      case 'pushbackcentered':
        directionalAngle = (Math.random() - 0.5) * 0.05 * scale; // Very small random angle
        directionalVelocity = 0; // No initial velocity, just settle to center
        // Very minimal chain effect
        chainAngle += (Math.random() - 0.5) * 0.01 * scale;
        break;
      default:
        // No directional motion
        directionalSwaying = false;
        break;
    }
    
    // Note: This function does NOT call hitPunchingBag() or any other hit-related functions
  }

  // Decrement lives on wrong chord
  function recordFailure() {
    console.log('[TargetPractice] recordFailure called. Lives before:', lives);
    // No arrows - just track the miss
    if (lives > 0) {
      lives--;
      updateLivesDisplay();
      if (lives <= 0) {
        endGame();
      }
    }
    // Force UI update
    livesEl && (livesEl.setAttribute('data-lives', lives));
    // Do not advance or reset target, do not stop round
  }

  // nextTarget removed: targets always scroll, no pause

  function recordSuccess() {
      if (isActive) {
        // Trigger punching bag physics
        hitPunchingBag();
        
        // Trigger directional pendulum based on current target
        const currentTarget = targets[currentTargetIdx];
        if (currentTarget && currentTarget.pushDirection) {
          triggerDirectionalPendulum(currentTarget.pushDirection);
        }
        
        // Update counters
        score++;
        hitsOnCurrentTarget++;
        updateHitCounterDisplay();
        
        // Check if we need to advance to next target
        if (hitsOnCurrentTarget >= hitsNeededPerTarget) {
          advanceToNextTarget();
        }
      }
  }

  function advanceToNextTarget() {
    // No arrows to clear - just advance target
    
    // Reset hit counter and advance target
    hitsOnCurrentTarget = 0;
    currentTargetIdx = (currentTargetIdx + 1) % targets.length;
    
    // Change the image without repositioning
    const target = targets[currentTargetIdx];
    if (imgEl) {
      imgEl.src = target.img;
      imgEl.alt = target.letter.toUpperCase();
    }
    
    // Update UI
    updateHitCounterDisplay();
    highlightTargetBrailleKeys(target);
    
    // Start new ambient sound
    startAmbientSound(target);
    
    // Restart the auto-advance timer
    startTargetTimer();
  }

  function startTargetTimer() {
    // Clear existing timer
    if (targetTimer) {
      clearTimeout(targetTimer);
    }
    
    // Start new timer
    const duration = (window.debugTargetDuration || 20) * 1000; // Convert seconds to milliseconds
    targetTimer = setTimeout(() => {
      if (isActive) {
        advanceToNextTarget();
      }
    }, duration);
  }

  function stopTargetTimer() {
    if (targetTimer) {
      clearTimeout(targetTimer);
      targetTimer = null;
    }
  }

  function endGame() {
    isActive = false;
    stopTargetTimer();
    if (gameOverEl) return;
    gameOverEl = document.createElement('div');
    gameOverEl.id = 'target-practice-game-over';
    gameOverEl.className = 'arcade-ui';
    gameOverEl.style.position = 'fixed';
    gameOverEl.style.top = '50%';
    gameOverEl.style.left = '50%';
    gameOverEl.style.transform = 'translate(-50%,-50%)';
    gameOverEl.style.background = 'rgba(30,10,10,0.97)';
    gameOverEl.style.color = '#fff';
    gameOverEl.style.fontSize = '32px';
    gameOverEl.style.fontWeight = 'bold';
    gameOverEl.style.padding = '32px 48px';
    gameOverEl.style.borderRadius = '16px';
    gameOverEl.style.boxShadow = '0 4px 24px #000b';
    gameOverEl.style.zIndex = '2000';
    gameOverEl.style.textAlign = 'center';
    gameOverEl.innerHTML = `Game Over<br>${score}<br><button id="restart-target-practice" style="margin-top:24px;font-size:20px;padding:10px 32px;border-radius:8px;background:#18324f;color:#fff;border:none;cursor:pointer;">Restart</button>`;
    document.body.appendChild(gameOverEl);
    document.getElementById('restart-target-practice').onclick = restartGame;
  }

  function restartGame() {
    score = 0;
    successes = 0;
    failures = 0;
    lives = 5;
    speed = startSpeed;
    currentTargetIdx = 0;
    hitsOnCurrentTarget = 0;
    bagSwaying = false;
    swayAngle = 0;
    swayVelocity = 0;
    directionalSwaying = false;
    directionalAngle = 0;
    directionalVelocity = 0;
    chainAngle = 0;
    chainVelocity = 0;
    stopTargetTimer();
    updateHitCounterDisplay();
    updateLivesDisplay();
    if (gameOverEl) gameOverEl.remove();
    gameOverEl = null;
    startTarget();
  }

  function highlightTargetBrailleKeys(target) {
    try {
      if (typeof window.clearAllKeyStatuses === 'function') {
        window.clearAllKeyStatuses();
      }
      if (target && Array.isArray(target.braille) && typeof window.setKeyStatus === 'function') {
        target.braille.forEach(k => window.setKeyStatus(k, 'info', { outline: true }));
      }
      console.log('[TargetPractice] highlightTargetBrailleKeys', target && target.braille);
    } catch (e) {
      console.error('[TargetPractice] highlightTargetBrailleKeys error', e);
    }
  }

  // Patch startTarget to highlight keys
  const originalStartTarget = startTarget;
  startTarget = function() {
    originalStartTarget.apply(this, arguments);
    setTimeout(() => highlightTargetBrailleKeys(targets[currentTargetIdx]), 0);
  };

  // Also highlight on init and after restart
  setTimeout(() => highlightTargetBrailleKeys(targets[currentTargetIdx]), 0);
  const originalRestartGame = restartGame;
  restartGame = function() {
    originalRestartGame.apply(this, arguments);
    setTimeout(() => highlightTargetBrailleKeys(targets[currentTargetIdx]), 0);
  };

  // --- BRAILLE INPUT HOOK ---
  let lastChord = [];
  let pressedKeys = new Set();
  document.addEventListener('keydown', function(e) {
    if (!isActive) return;
    if (!'sdfjkl'.includes(e.key)) return;
    if (!pressedKeys.has(e.key)) {
      pressedKeys.add(e.key);
      lastChord.push(e.key);
      
      // Play chord start sound only on first key of a new chord
      if (lastChord.length === 1) {
        sfxAudioContext.resume()
          .then(() => {
            try {
              playSfx('chordStart');
            } catch (err) {
              console.warn('Failed to play nocking sound:', err);
            }
          })
          .catch((err) => {
            console.warn('Failed to resume audio context for nocking sound:', err);
          });
        const kb = document.getElementById('braille-keyboard-animwrap');
        if (kb) kb.classList.add('scaled-up');
      }
    }
  });
  document.addEventListener('keyup', function(e) {
    if (!isActive) return;
    if (!'sdfjkl'.includes(e.key)) return;
    pressedKeys.delete(e.key);
    // Only process when all keys are released (end of a chord)
    if (lastChord.length > 0 && pressedKeys.size === 0) {
      setTimeout(() => {
        if (!isActive) return;
        const target = targets[currentTargetIdx];
        const chordSorted = lastChord.slice().sort();
        const targetSorted = target.braille.slice().sort();
        
        // Trigger bounce animation for all keys in the chord on release
        lastChord.forEach(key => triggerKeyAnimation(key));
        
        if (arraysEqual(chordSorted, targetSorted)) {
          playSfx('arrowSuccess');
          triggerTargetAnimation('tada');
          recordSuccess();
        } else {
          playSfx('arrowLaunch');
          triggerTargetAnimation('headShake');
          recordFailure();
        }
        // Return keyboard to normal after animation
        const kb = document.getElementById('braille-keyboard-animwrap');
        if (kb) {
          kb.classList.remove('scaled-up');
        }
        lastChord = []; // Clear lastChord so chordStart SFX can play again on next chord
      }, 10);
    }
  });
  // Animate.css helper for target sprite
  function triggerTargetAnimation(type) {
      if (!imgEl) return;
      let animClass = '';
      if (type === 'tada') animClass = 'animate__animated animate__tada';
      if (type === 'headShake') animClass = 'animate__animated animate__headShake';
      imgEl.classList.remove('animate__tada', 'animate__headShake', 'animate__animated');
      // No arrows to animate
      // Force reflow to restart animation
      void imgEl.offsetWidth;
      imgEl.className += ' ' + animClass;
      imgEl.addEventListener('animationend', function handler() {
        imgEl.classList.remove('animate__tada', 'animate__headShake', 'animate__animated');
        imgEl.removeEventListener('animationend', handler);
      });
    }
  function arraysEqual(a, b) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
  }

  // --- INIT ---
// Resume audio context on user interaction for reliable playback
document.addEventListener('pointerdown', function() {
  if (sfxAudioContext && sfxAudioContext.state === 'suspended') {
    sfxAudioContext.resume();
  }
});
  setupGameArea();
  startTarget();
})();
