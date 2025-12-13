import * as THREE from 'three';
const STATE = {
    START_SCREEN: 0,
    PLAYING: 1,
    GAME_OVER: 2
};
let scene, camera, renderer;
let orb, orbGlow, orbMaterial, orbEmissiveBase = 0.25, orbPulsate = 0;
let orbGroup;
let backgroundMesh;
let ambientLight, dirLight;
let container, overlay, scoreDisplay, timerDisplay, inputPanel, startScreen, gameOverScreen;
let resizeTimeout;
let gameState = STATE.START_SCREEN;
let score = 0;
let timer = 60;
let input = '';
let targetWord = '';
let lastWord = '';
let wordList = [
    'cosmic', 'galaxy', 'asteroid', 'supernova', 'gravity', 'nebula', 'eclipse', 'quantum', 'comet', 'singularity',
    'orbit', 'meteor', 'pulsar', 'satellite', 'cluster', 'planetary', 'horizon', 'zenith', 'solstice', 'lunar',
    'stellar', 'celestial', 'magnetar', 'nova', 'telescope', 'universe', 'black hole', 'wormhole', 'dark matter',
    'event horizon', 'starfield', 'red giant', 'white dwarf', 'cosmos', 'expanse', 'spectral', 'photon', 'interstellar',
    'expansion', 'vacuum', 'big bang', 'moonlight', 'starlight', 'space-time', 'cosmonaut', 'astronaut', 'rocket',
    'launch', 'atmosphere', 'asterism', 'aphelion', 'perigee', 'perihelion', 'equinox', 'planisphere', 'constellation',
    'milky way', 'deep space', 'zero gravity', 'solar wind', 'sunspot', 'tidal force', 'crater', 'exoplanet', 'rings',
    'gas giant', 'ice giant', 'dwarf planet', 'transit', 'light year', 'parsec', 'meteorite', 'aurora', 'cosmic ray',
    'infrared', 'ultraviolet', 'spectroscope', 'zenith', 'rotation', 'revolution', 'axis', 'orbital', 'apogee', 'galactic',
    'hypernova', 'flare', 'corona', 'photosphere', 'magnetosphere', 'gravity well', 'escape velocity', 'tidal lock',
    'celestial pole', 'ecliptic', 'space probe', 'star cluster', 'radio galaxy', 'gravity assist'
];
let timerInterval, animationTimeout;
let allowInput = false;
let successAnimation = false, failAnimation = false;
let particles, particleGroup, particleMaterial, particleStartTime, particleDuration = 0.85;
let fissureMesh, fissureStartTime, fissureDuration = 0.85, shakeMagnitude = 0.08, shakeStartTime;
function createOverlayUI() {
    overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.pointerEvents = 'none';
    overlay.style.fontFamily = 'sans-serif';
    overlay.style.userSelect = 'none';
    document.body.appendChild(overlay);
    scoreDisplay = document.createElement('div');
    scoreDisplay.style.position = 'absolute';
    scoreDisplay.style.top = '24px';
    scoreDisplay.style.left = '32px';
    scoreDisplay.style.fontSize = '2.2em';
    scoreDisplay.style.color = '#b6eaff';
    scoreDisplay.style.fontWeight = 'bold';
    scoreDisplay.style.textShadow = '0 0 8px #222';
    overlay.appendChild(scoreDisplay);
    timerDisplay = document.createElement('div');
    timerDisplay.style.position = 'absolute';
    timerDisplay.style.top = '24px';
    timerDisplay.style.right = '32px';
    timerDisplay.style.fontSize = '2.2em';
    timerDisplay.style.color = '#e1baff';
    timerDisplay.style.fontWeight = 'bold';
    timerDisplay.style.textShadow = '0 0 8px #222';
    overlay.appendChild(timerDisplay);
    inputPanel = document.createElement('div');
    inputPanel.style.position = 'absolute';
    inputPanel.style.left = '50%';
    inputPanel.style.top = '62%';
    inputPanel.style.transform = 'translate(-50%, 0)';
    inputPanel.style.fontSize = '2.4em';
    inputPanel.style.letterSpacing = '0.08em';
    inputPanel.style.background = 'rgba(18,24,38,0.65)';
    inputPanel.style.borderRadius = '18px';
    inputPanel.style.padding = '16px 40px 12px 40px';
    inputPanel.style.boxShadow = '0 0 32px #0cf4, 0 2px 18px #222';
    inputPanel.style.minWidth = '320px';
    inputPanel.style.textAlign = 'center';
    overlay.appendChild(inputPanel);
    startScreen = document.createElement('div');
    startScreen.style.position = 'absolute';
    startScreen.style.top = '50%';
    startScreen.style.left = '50%';
    startScreen.style.transform = 'translate(-50%,-50%)';
    startScreen.style.textAlign = 'center';
    startScreen.style.color = '#f2faff';
    startScreen.style.textShadow = '0 0 24px #6cf, 0 0 8px #222';
    startScreen.style.fontSize = '2.6em';
    startScreen.style.fontWeight = 'bold';
    startScreen.innerHTML = '<div style="font-size:3em;letter-spacing:0.1em;">AstroType</div><div style="margin-top:28px;font-size:1.15em;font-weight:400;">Press <span style="color:#6cf;">SPACE</span> to Start</div>';
    overlay.appendChild(startScreen);
    gameOverScreen = document.createElement('div');
    gameOverScreen.style.position = 'absolute';
    gameOverScreen.style.top = '50%';
    gameOverScreen.style.left = '50%';
    gameOverScreen.style.transform = 'translate(-50%,-50%)';
    gameOverScreen.style.textAlign = 'center';
    gameOverScreen.style.color = '#f2faff';
    gameOverScreen.style.textShadow = '0 0 24px #e17, 0 0 8px #222';
    gameOverScreen.style.fontSize = '2.6em';
    gameOverScreen.style.fontWeight = 'bold';
    gameOverScreen.style.display = 'none';
    overlay.appendChild(gameOverScreen);
}
function updateOverlayUI() {
    scoreDisplay.style.display = (gameState === STATE.PLAYING) ? '' : 'none';
    timerDisplay.style.display = (gameState === STATE.PLAYING) ? '' : 'none';
    inputPanel.style.display = (gameState === STATE.PLAYING) ? '' : 'none';
    startScreen.style.display = (gameState === STATE.START_SCREEN) ? '' : 'none';
    gameOverScreen.style.display = (gameState === STATE.GAME_OVER) ? '' : 'none';
    scoreDisplay.textContent = 'Score: ' + score;
    timerDisplay.textContent = 'Time: ' + timer + 's';
    if (gameState === STATE.PLAYING) {
        inputPanel.innerHTML = renderInputFeedback(input, targetWord);
    }
    if (gameState === STATE.GAME_OVER) {
        gameOverScreen.innerHTML = '<div style="font-size:2.2em;margin-bottom:0.5em;">Game Over!</div>' +
            '<div style="font-size:1.5em;margin-bottom:1.2em;">Final Score: <span style="color:#6cf;">' + score + '</span></div>' +
            '<div style="font-size:1.1em;">Press <span style="color:#6cf;">SPACE</span> to Play Again</div>';
    }
}
function renderInputFeedback(input, word) {
    let html = '';
    for (let i = 0; i < word.length; ++i) {
        if (i < input.length) {
            if (input[i] === word[i]) {
                html += '<span style="color:#3fae44;text-shadow:0 0 6px #3fae44;">' + word[i] + '</span>';
            } else {
                html += '<span style="color:#e14a4a;text-shadow:0 0 6px #e14a4a;">' + word[i] + '</span>';
            }
        } else {
            html += '<span style="color:#fff;">' + word[i] + '</span>';
        }
    }
    if (input.length > word.length) {
        html += '<span style="color:#e14a4a;text-shadow:0 0 6px #e14a4a;">' + input.slice(word.length) + '</span>';
    }
    return html;
}
function pickNewWord() {
    let idx, word;
    do {
        idx = Math.floor(Math.random() * wordList.length);
        word = wordList[idx];
    } while (word === lastWord);
    lastWord = word;
    return word;
}
function createScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 8);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x10131b, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    document.body.appendChild(renderer.domElement);
    let bgGeom = new THREE.SphereGeometry(32, 32, 32);
    let bgMat = new THREE.MeshBasicMaterial({ color: 0x11131b, side: THREE.BackSide });
    backgroundMesh = new THREE.Mesh(bgGeom, bgMat);
    scene.add(backgroundMesh);
    let starCount = 300;
    let starGeom = new THREE.BufferGeometry();
    let starPos = [];
    for (let i = 0; i < starCount; ++i) {
        let theta = Math.random() * 2 * Math.PI;
        let phi = Math.acos(2 * Math.random() - 1);
        let r = 30 + Math.random() * 2;
        let x = r * Math.sin(phi) * Math.cos(theta);
        let y = r * Math.sin(phi) * Math.sin(theta);
        let z = r * Math.cos(phi);
        starPos.push(x, y, z);
    }
    starGeom.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
    let starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.22, opacity: 0.82, transparent: true });
    let stars = new THREE.Points(starGeom, starMat);
    scene.add(stars);
    ambientLight = new THREE.AmbientLight(0x404080, 1.2);
    scene.add(ambientLight);
    dirLight = new THREE.DirectionalLight(0x9fdfff, 1.2);
    dirLight.position.set(8, 10, 7);
    scene.add(dirLight);
    orbGroup = new THREE.Group();
    scene.add(orbGroup);
    let orbGeom = new THREE.IcosahedronGeometry(1.45, 2);
    orbMaterial = new THREE.MeshPhongMaterial({
        color: 0x245cff,
        shininess: 80,
        emissive: new THREE.Color(0x4d82ff),
        emissiveIntensity: orbEmissiveBase,
        specular: 0x99aaff
    });
    orb = new THREE.Mesh(orbGeom, orbMaterial);
    orb.castShadow = false;
    orb.receiveShadow = false;
    orbGroup.add(orb);
    let glowGeom = new THREE.SphereGeometry(1.68, 32, 32);
    let glowMat = new THREE.MeshBasicMaterial({
        color: 0x78e7ff,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending
    });
    orbGlow = new THREE.Mesh(glowGeom, glowMat);
    orbGroup.add(orbGlow);
    createWordTexture('Press SPACE');
}
function createWordTexture(text) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let fontSize = 64;
    let padding = 32;
    ctx.font = 'bold ' + fontSize + 'px Montserrat, Arial, sans-serif';
    let metrics = ctx.measureText(text);
    let w = Math.ceil(metrics.width) + padding * 2;
    let h = fontSize + padding * 2;
    canvas.width = w;
    canvas.height = h;
    ctx.font = 'bold ' + fontSize + 'px Montserrat, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#6cf';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#fff';
    ctx.fillText(text, w / 2, h / 2);
    let tex = new THREE.Texture(canvas);
    tex.needsUpdate = true;
    if (orbGroup.getObjectByName('wordSprite')) {
        let prev = orbGroup.getObjectByName('wordSprite');
        orbGroup.remove(prev);
        prev.material.map.dispose();
        prev.material.dispose();
        prev.geometry.dispose();
    }
    let planeGeom = new THREE.PlaneGeometry(2.6, 0.7);
    let planeMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
    let plane = new THREE.Mesh(planeGeom, planeMat);
    plane.position.set(0, 0, 1.52);
    plane.name = 'wordSprite';
    orbGroup.add(plane);
}
function showFissures() {
    let fissureCanvas = document.createElement('canvas');
    fissureCanvas.width = 256;
    fissureCanvas.height = 256;
    let ctx = fissureCanvas.getContext('2d');
    ctx.clearRect(0, 0, 256, 256);
    for (let i = 0; i < 7; ++i) {
        let x = 128 + Math.cos((i / 7) * 2 * Math.PI) * 90;
        let y = 128 + Math.sin((i / 7) * 2 * Math.PI) * 90;
        ctx.save();
        ctx.translate(128, 128);
        ctx.rotate((i / 7) * 2 * Math.PI);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        for (let j = 0; j < 8; ++j) {
            let r = 60 + Math.random() * 28;
            let angle = (j / 8) * Math.PI;
            ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
        ctx.lineWidth = 5 + Math.random() * 3;
        ctx.strokeStyle = '#ff3e3e';
        ctx.shadowColor = '#ff3e3e';
        ctx.shadowBlur = 18;
        ctx.globalAlpha = 0.76;
        ctx.stroke();
        ctx.restore();
    }
    let tex = new THREE.Texture(fissureCanvas);
    tex.needsUpdate = true;
    if (fissureMesh) {
        orbGroup.remove(fissureMesh);
        fissureMesh.material.map.dispose();
        fissureMesh.material.dispose();
        fissureMesh.geometry.dispose();
        fissureMesh = null;
    }
    let planeGeom = new THREE.PlaneGeometry(2.95, 2.95);
    let planeMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.8 });
    fissureMesh = new THREE.Mesh(planeGeom, planeMat);
    fissureMesh.position.set(0, 0, 1.01);
    orbGroup.add(fissureMesh);
    fissureStartTime = performance.now();
}
function removeFissures() {
    if (fissureMesh) {
        orbGroup.remove(fissureMesh);
        fissureMesh.material.map.dispose();
        fissureMesh.material.dispose();
        fissureMesh.geometry.dispose();
        fissureMesh = null;
    }
}
function triggerSuccessAnimation() {
    successAnimation = true;
    particleStartTime = performance.now();
    let count = 60 + Math.floor(Math.random() * 20);
    let positions = [];
    let velocities = [];
    let colors = [];
    for (let i = 0; i < count; ++i) {
        let theta = Math.random() * 2 * Math.PI;
        let phi = Math.acos(2 * Math.random() - 1);
        let r = 1.5 + Math.random() * 0.2;
        let x = Math.sin(phi) * Math.cos(theta);
        let y = Math.sin(phi) * Math.sin(theta);
        let z = Math.cos(phi);
        positions.push(x * r, y * r, z * r);
        velocities.push(x * (1.5 + Math.random()), y * (1.2 + Math.random()), z * (1.6 + Math.random()));
        let c = new THREE.Color().setHSL(0.6 + 0.15 * Math.random(), 0.77, 0.72 + 0.18 * Math.random());
        colors.push(c.r, c.g, c.b);
    }
    let geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    particleMaterial = new THREE.PointsMaterial({
        size: 0.22,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });
    particles = new THREE.Points(geometry, particleMaterial);
    particleGroup = particles;
    scene.add(particleGroup);
    orbMaterial.emissiveIntensity = 0.8;
    orbGroup.scale.set(1.11, 1.11, 1.11);
    animationTimeout = setTimeout(() => {
        successAnimation = false;
        if (particleGroup) {
            scene.remove(particleGroup);
            particleGroup.geometry.dispose();
            particleGroup.material.dispose();
            particleGroup = null;
        }
        orbMaterial.emissiveIntensity = orbEmissiveBase;
        orbGroup.scale.set(1, 1, 1);
        nextWord();
    }, particleDuration * 1000);
}
function animateSuccessParticles(dt) {
    if (!particleGroup) return;
    let pos = particleGroup.geometry.getAttribute('position');
    let vel = particleGroup.geometry.getAttribute('velocity');
    let n = pos.count;
    for (let i = 0; i < n; ++i) {
        let vx = vel.getX(i), vy = vel.getY(i), vz = vel.getZ(i);
        pos.setX(i, pos.getX(i) + vx * dt * 1.5);
        pos.setY(i, pos.getY(i) + vy * dt * 1.5);
        pos.setZ(i, pos.getZ(i) + vz * dt * 1.5);
        vel.setX(i, vx * 0.98);
        vel.setY(i, vy * 0.98);
        vel.setZ(i, vz * 0.98);
    }
    pos.needsUpdate = true;
    vel.needsUpdate = true;
    let elapsed = (performance.now() - particleStartTime) / 1000;
    if (particleMaterial) {
        particleMaterial.opacity = Math.max(0, 0.9 - elapsed / particleDuration);
    }
}
function triggerFailureAnimation() {
    failAnimation = true;
    shakeStartTime = performance.now();
    orbMaterial.emissiveIntensity = 0.03;
    orbMaterial.color.set(0x1a2344);
    orbMaterial.emissive.set(0xff2c2c);
    showFissures();
    animationTimeout = setTimeout(() => {
        orbMaterial.emissiveIntensity = orbEmissiveBase;
        orbMaterial.color.set(0x245cff);
        orbMaterial.emissive.set(0x4d82ff);
        failAnimation = false;
        removeFissures();
        orbGroup.position.set(0, 0, 0);
        nextWord();
    }, fissureDuration * 1000);
}
function animateFailure(dt) {
    if (!failAnimation) return;
    let t = ((performance.now() - shakeStartTime) / 1000);
    let mag = shakeMagnitude * Math.max(0, 1 - t / fissureDuration);
    orbGroup.position.x = (Math.random() - 0.5) * mag;
    orbGroup.position.y = (Math.random() - 0.5) * mag;
    if (fissureMesh) {
        let pulse = 0.5 + 0.5 * Math.sin(t * 8);
        fissureMesh.material.opacity = 0.5 + 0.4 * pulse;
    }
}
function nextWord() {
    input = '';
    targetWord = pickNewWord();
    createWordTexture(targetWord);
    updateOverlayUI();
    allowInput = true;
}
function startGame() {
    gameState = STATE.PLAYING;
    score = 0;
    timer = 60;
    input = '';
    targetWord = pickNewWord();
    createWordTexture(targetWord);
    updateOverlayUI();
    allowInput = true;
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (gameState !== STATE.PLAYING) return;
        timer--;
        updateOverlayUI();
        if (timer <= 0) {
            endGame();
        }
    }, 1000);
}
function endGame() {
    gameState = STATE.GAME_OVER;
    if (timerInterval) clearInterval(timerInterval);
    allowInput = false;
    updateOverlayUI();
}
function resetGame() {
    if (animationTimeout) clearTimeout(animationTimeout);
    if (particleGroup) {
        scene.remove(particleGroup);
        particleGroup.geometry.dispose();
        particleGroup.material.dispose();
        particleGroup = null;
    }
    removeFissures();
    orbMaterial.emissiveIntensity = orbEmissiveBase;
    orbMaterial.color.set(0x245cff);
    orbMaterial.emissive.set(0x4d82ff);
    orbGroup.scale.set(1, 1, 1);
    orbGroup.position.set(0, 0, 0);
    orbGroup.rotation.set(0, 0, 0);
    startGame();
}
function onKeyDown(e) {
    if (gameState === STATE.START_SCREEN) {
        if (e.code === 'Space') {
            startScreen.style.display = 'none';
            startGame();
        }
        return;
    }
    if (gameState === STATE.GAME_OVER) {
        if (e.code === 'Space') {
            gameOverScreen.style.display = 'none';
            resetGame();
        }
        return;
    }
    if (!allowInput) return;
    if (successAnimation || failAnimation) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key.length === 1 && input.length < 32) {
        input += e.key;
    } else if (e.key === 'Backspace') {
        input = input.slice(0, -1);
    } else if (e.key === 'Enter') {
        submitInput();
    }
    updateOverlayUI();
    if (input.length === targetWord.length) {
        let correct = (input === targetWord);
        if (correct) submitInput();
    } else if (input.length > targetWord.length) {
        submitInput();
    }
}
function submitInput() {
    allowInput = false;
    if (input === targetWord) {
        score++;
        updateOverlayUI();
        triggerSuccessAnimation();
    } else {
        triggerFailureAnimation();
    }
}
function animate() {
    requestAnimationFrame(animate);
    let t = performance.now() * 0.001;
    orbPulsate = 1 + 0.07 * Math.sin(t * 2.2);
    orbGroup.rotation.y += 0.007;
    orbGroup.rotation.x = 0.11 * Math.sin(t * 0.5);
    orbGroup.scale.set(orbPulsate, orbPulsate, orbPulsate);
    let glowPulse = 0.92 + 0.08 * Math.sin(t * 2.2 + 1.3);
    orbGlow.material.opacity = 0.12 * glowPulse;
    if (successAnimation) {
        let dt = 1 / 60;
        animateSuccessParticles(dt);
        orbGroup.scale.set(1.11 + 0.06 * Math.sin(t * 12), 1.11 + 0.06 * Math.sin(t * 12), 1.11 + 0.06 * Math.sin(t * 12));
        orbMaterial.emissiveIntensity = 0.8 + 0.17 * Math.sin(t * 13);
    }
    if (failAnimation) {
        let dt = 1 / 60;
        animateFailure(dt);
    }
    renderer.render(scene, camera);
}
function onResize() {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        overlay.style.width = window.innerWidth + 'px';
        overlay.style.height = window.innerHeight + 'px';
    }, 40);
}
window.addEventListener('resize', onResize);
window.addEventListener('keydown', onKeyDown);
createScene();
createOverlayUI();
updateOverlayUI();
animate();