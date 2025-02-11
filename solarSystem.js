// solarSystem.js

// Import Three.js using the bare specifier resolved by the import map
import * as THREE from 'three';
// Import OrbitControls from its module URL (the jsm version)
import { OrbitControls } from 'https://unpkg.com/three@0.128.0/examples/jsm/controls/OrbitControls.js';

// ------------------------------
// SETUP THE SCENE, CAMERA, AND RENDERER
// ------------------------------
const scene = new THREE.Scene();

// Load a skybox for a starry background using the six individual images
const cubeTextureLoader = new THREE.CubeTextureLoader();
const starTexture = cubeTextureLoader.load([
    'textures/skybox/right.png',  // px: right
    'textures/skybox/left.png',   // nx: left
    'textures/skybox/top.png',    // py: top
    'textures/skybox/bottom.png', // ny: bottom
    'textures/skybox/front.png',  // pz: front
    'textures/skybox/back.png',   // nz: back
]);
scene.background = starTexture;

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1500
);
camera.position.set(0, 80, 250);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ------------------------------
// ADD ORBIT CONTROLS
// ------------------------------
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// ------------------------------
// ADD LIGHTING
// ------------------------------
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffffff, 2, 1000);
scene.add(sunLight);

// ------------------------------
// CREATE THE SUN
// ------------------------------
const sunTexture = new THREE.TextureLoader().load("textures/sun.jpg");
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sunGeometry = new THREE.SphereGeometry(20, 32, 32);  // Bigger sun
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

sunLight.position.copy(sun.position);

// ------------------------------
// DEFINE PLANETS DATA (Scaled & Consistent Educational Info)
// ------------------------------
const planetsData = [
    {
        name: "Mercury",
        size: 3,
        distance: 40,
        texture: "textures/mercury.jpg",
        orbitSpeed: 0.02,
        spinSpeed: 0.005,
        overview: `
      <h2>Overview</h2>
      <p>Mercury is the smallest and innermost planet in our Solar System.</p>
      <h2>Surface & Temperature</h2>
      <p>It experiences extreme temperature fluctuations—soaring above 400°C (750°F) in the day and plunging to -180°C (-290°F) at night—and its surface is heavily cratered.</p>
      <h2>Orbit & Rotation</h2>
      <p>Mercury is in a 3:2 spin-orbit resonance, rotating three times for every two orbits around the Sun. A solar day lasts about 176 Earth days.</p>
      <h2>Magnetic Field & Dimensions</h2>
      <p>It possesses a weak magnetic field (about 1% of Earth's) and has a diameter of roughly 4,880 km.</p>
    `
    },
    {
        name: "Venus",
        size: 4,
        distance: 60,
        texture: "textures/venus.jpg",
        orbitSpeed: 0.015,
        spinSpeed: 0.005,
        overview: `
      <h2>Overview</h2>
      <p>Venus is the second planet from the Sun and is known for its scorching temperatures and thick atmosphere.</p>
      <h2>Surface & Atmosphere</h2>
      <p>Surface temperatures reach around 465°C (869°F) due to a runaway greenhouse effect, and its dense atmosphere is composed mainly of carbon dioxide with clouds of sulfuric acid.</p>
      <h2>Rotation & Orbit</h2>
      <p>Venus rotates very slowly in a retrograde direction, leading to unusual day-night cycles.</p>
      <h2>Dimensions</h2>
      <p>Venus is similar in size to Earth, with a diameter of about 12,104 km.</p>
    `
    },
    {
        name: "Earth",
        size: 4.5,
        distance: 80,
        texture: "textures/earth.jpg",
        orbitSpeed: 0.012,
        spinSpeed: 0.005,
        axialTilt: 23.5,
        overview: `
      <h2>Overview</h2>
      <p>Earth is the only planet known to support life, with abundant water and a protective atmosphere.</p>
      <h2>Surface & Atmosphere</h2>
      <p>About 70% of Earth's surface is covered by water, and its atmosphere regulates temperature and shields life from harmful solar radiation.</p>
      <h2>Orbit & Rotation</h2>
      <p>Earth completes one orbit around the Sun every 365.25 days and rotates once every 24 hours.</p>
      <h2>Magnetic Field & Dimensions</h2>
      <p>Earth has a strong magnetic field and a diameter of approximately 12,742 km.</p>
    `
    },
    {
        name: "Mars",
        size: 3.5,
        distance: 100,
        texture: "textures/mars.jpg",
        orbitSpeed: 0.01,
        spinSpeed: 0.005,
        overview: `
      <h2>Overview</h2>
      <p>Mars, known as the Red Planet, has captivated scientists with its potential for past water activity.</p>
      <h2>Surface & Temperature</h2>
      <p>Mars has a cold, desert-like surface marked by iron oxide, the largest volcano (Olympus Mons), and deep canyons.</p>
      <h2>Orbit & Rotation</h2>
      <p>It orbits the Sun in about 687 Earth days and experiences seasonal changes.</p>
      <h2>Dimensions</h2>
      <p>Mars has a diameter of roughly 6,779 km.</p>
    `
    },
    {
        name: "Jupiter",
        size: 10,
        distance: 130,
        texture: "textures/jupiter.jpg",
        orbitSpeed: 0.007,
        spinSpeed: 0.005,
        overview: `
      <h2>Overview</h2>
      <p>Jupiter is the largest planet in our Solar System, a gas giant with a dramatic presence.</p>
      <h2>Atmosphere & Storms</h2>
      <p>Its atmosphere is characterized by swirling storms, including the Great Red Spot—a massive, persistent storm.</p>
      <h2>Rotation & Orbit</h2>
      <p>Jupiter rotates very rapidly (about 10 hours per day) and has an extensive system of moons.</p>
      <h2>Dimensions</h2>
      <p>Its diameter is approximately 139,820 km.</p>
    `
    },
    {
        name: "Saturn",
        size: 9,
        distance: 160,
        texture: "textures/saturn.jpg",
        orbitSpeed: 0.005,
        spinSpeed: 0.005,
        overview: `
      <h2>Overview</h2>
      <p>Saturn is renowned for its spectacular ring system, making it one of the most visually striking planets.</p>
      <h2>Atmosphere & Rings</h2>
      <p>This gas giant has a beautiful atmosphere with banded cloud patterns, and its rings are composed of ice and rock particles.</p>
      <h2>Rotation & Orbit</h2>
      <p>Saturn rotates rapidly and is orbited by numerous moons.</p>
      <h2>Dimensions</h2>
      <p>Its diameter is about 116,460 km.</p>
    `
    },
    {
        name: "Uranus",
        size: 8,
        distance: 190,
        texture: "textures/uranus.jpg",
        orbitSpeed: 0.003,
        spinSpeed: 0.005,
        overview: `
      <h2>Overview</h2>
      <p>Uranus is an ice giant notable for its extreme axial tilt, causing it to rotate on its side.</p>
      <h2>Atmosphere & Appearance</h2>
      <p>The planet’s blue-green hue is due to methane in its atmosphere, and it has a faint ring system.</p>
      <h2>Rotation & Orbit</h2>
      <p>Uranus has a long orbital period and a unique tilt of about 98°.</p>
      <h2>Dimensions</h2>
      <p>Its diameter is roughly 50,724 km.</p>
    `
    },
    {
        name: "Neptune",
        size: 8,
        distance: 220,
        texture: "textures/neptune.jpg",
        orbitSpeed: 0.002,
        spinSpeed: 0.005,
        overview: `
      <h2>Overview</h2>
      <p>Neptune is known for its deep blue color and dynamic weather, including the fastest winds in the Solar System.</p>
      <h2>Atmosphere & Weather</h2>
      <p>This ice giant features a turbulent atmosphere with supersonic winds and large storms.</p>
      <h2>Orbit & Rotation</h2>
      <p>Neptune has a very long orbit and a relatively short day.</p>
      <h2>Dimensions</h2>
      <p>Its diameter is around 49,244 km.</p>
    `
    },
];

const planets = [];

// ------------------------------
// CREATE PLANETS
// ------------------------------
planetsData.forEach((data) => {
    const texture = new THREE.TextureLoader().load(data.texture);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const geometry = new THREE.SphereGeometry(data.size, 32, 32);
    const planetMesh = new THREE.Mesh(geometry, material);

    // Set a random starting orbit angle
    data.orbitAngle = Math.random() * Math.PI * 2;
    planetMesh.position.set(
        data.distance * Math.cos(data.orbitAngle),
        0,
        data.distance * Math.sin(data.orbitAngle)
    );
    scene.add(planetMesh);

    // Apply axial tilt if provided (e.g., for Earth)
    if (data.axialTilt) {
        planetMesh.rotation.z = THREE.MathUtils.degToRad(data.axialTilt);
    }

    data.mesh = planetMesh;
    planets.push(data);
});

// ------------------------------
// ADD SATURN'S RINGS
// ------------------------------
const saturnData = planetsData.find((p) => p.name === "Saturn");
if (saturnData) {
    const ringTexture = new THREE.TextureLoader().load("textures/saturn_ring.png");
    const ringGeometry = new THREE.RingGeometry(saturnData.size + 0.5, saturnData.size + 2, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
        map: ringTexture,
        side: THREE.DoubleSide,
        transparent: true,
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI / 2;
    saturnData.mesh.add(ringMesh);
}

// ------------------------------
// ADD EARTH'S MOON (Optional Extra Detail)
// ------------------------------
const earthData = planetsData.find((p) => p.name === "Earth");
if (earthData) {
    const moonGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const moonMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);

    const moonPivot = new THREE.Object3D();
    earthData.mesh.add(moonPivot);
    moonMesh.position.set(6, 0, 0);
    moonPivot.add(moonMesh);

    earthData.moonPivot = moonPivot;
    earthData.moonMesh = moonMesh;
    earthData.moonOrbitSpeed = 0.02;
}

// ------------------------------
// SETUP RAYCASTER & MOUSE HANDLING FOR INTERACTION
// ------------------------------
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Reference to our UI elements
const tooltip = document.getElementById('tooltip');
const infoPanel = document.getElementById('infoPanel');

// Handle mouse movement: update mouse coordinates and show tooltip if hovering over a planet
function onMouseMove(event) {
    // Normalize mouse coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Raycast against planet meshes
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planets.map(p => p.mesh));

    if (intersects.length > 0) {
        const planetMesh = intersects[0].object;
        // Find the corresponding planet data
        const planetData = planets.find(p => p.mesh === planetMesh);
        if (planetData) {
            tooltip.textContent = planetData.name;
            tooltip.style.left = event.clientX + 10 + 'px';
            tooltip.style.top = event.clientY + 10 + 'px';
            tooltip.style.opacity = 1;
            return;
        }
    }
    tooltip.style.opacity = 0;
}

window.addEventListener('mousemove', onMouseMove, false);

// Handle mouse click: show the info panel if a planet is clicked, or hide it if clicked elsewhere.
function onClick(event) {
    // Update mouse coordinates for raycasting
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planets.map(p => p.mesh));
    if (intersects.length > 0) {
        const planetMesh = intersects[0].object;
        const planetData = planets.find(p => p.mesh === planetMesh);
        if (planetData) {
            showInfoPanel(planetData);
            return;
        }
    }
    // If click not on a planet, hide the info panel.
    hideInfoPanel();
}

window.addEventListener('click', onClick, false);

// Function to show the info panel with details for the given planet.
function showInfoPanel(planetData) {
    // Set the panel HTML content with consistent formatting.
    infoPanel.innerHTML = `
    <h1>${planetData.name}</h1>
    <img src="${planetData.texture}" alt="${planetData.name}" />
    ${planetData.overview}
  `;
    infoPanel.classList.add('visible');
}

// Function to hide the info panel.
function hideInfoPanel() {
    infoPanel.classList.remove('visible');
}

// ------------------------------
// SPACE DEBRIS: SHOOTING STARS & METEORITES
// ------------------------------
let shootingStars = [];
let meteorites = [];

function spawnShootingStar() {
    const geometry = new THREE.SphereGeometry(0.3, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1 });
    const star = new THREE.Mesh(geometry, material);
    star.position.set(
        THREE.MathUtils.randFloatSpread(300),
        THREE.MathUtils.randFloat(100, 150),
        THREE.MathUtils.randFloatSpread(300)
    );
    star.userData.velocity = new THREE.Vector3(
        THREE.MathUtils.randFloat(-0.5, 0.5),
        -THREE.MathUtils.randFloat(2.0, 4.0),
        THREE.MathUtils.randFloat(-0.5, 0.5)
    );
    star.userData.lifetime = THREE.MathUtils.randFloat(2, 4);
    star.userData.age = 0;
    shootingStars.push(star);
    scene.add(star);
}

function spawnMeteorite() {
    const geometry = new THREE.BufferGeometry();
    const count = THREE.MathUtils.randInt(5, 10);
    const vertices = [];
    for (let i = 0; i < count; i++) {
        vertices.push(
            THREE.MathUtils.randFloatSpread(1),
            THREE.MathUtils.randFloatSpread(1),
            THREE.MathUtils.randFloatSpread(1)
        );
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({
        color: 0xffaa00,
        size: 0.5,
        transparent: true,
        opacity: 0.8,
    });
    const meteorite = new THREE.Points(geometry, material);
    meteorite.position.set(
        THREE.MathUtils.randFloatSpread(300),
        THREE.MathUtils.randFloat(100, 150),
        THREE.MathUtils.randFloatSpread(300)
    );
    meteorite.userData.velocity = new THREE.Vector3(
        THREE.MathUtils.randFloat(-1, 1),
        -THREE.MathUtils.randFloat(2, 5),
        THREE.MathUtils.randFloat(-1, 1)
    );
    meteorite.userData.lifetime = THREE.MathUtils.randFloat(3, 6);
    meteorite.userData.age = 0;
    meteorites.push(meteorite);
    scene.add(meteorite);
}

function updateSpaceDebris(deltaTime) {
    for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        star.position.addScaledVector(star.userData.velocity, deltaTime);
        star.userData.age += deltaTime;
        const t = star.userData.age / star.userData.lifetime;
        star.material.opacity = THREE.MathUtils.lerp(1, 0, t);
        if (star.userData.age >= star.userData.lifetime) {
            scene.remove(star);
            shootingStars.splice(i, 1);
        }
    }
    for (let i = meteorites.length - 1; i >= 0; i--) {
        const meteor = meteorites[i];
        meteor.position.addScaledVector(meteor.userData.velocity, deltaTime);
        meteor.userData.age += deltaTime;
        const t = meteor.userData.age / meteor.userData.lifetime;
        meteor.material.opacity = THREE.MathUtils.lerp(1, 0, t);
        if (meteor.userData.age >= meteor.userData.lifetime) {
            scene.remove(meteor);
            meteorites.splice(i, 1);
        }
    }
}

let shootingStarTimer = 0;
let meteoriteTimer = 0;

// ------------------------------
// ANIMATION LOOP
// ------------------------------
let prevTime = performance.now() / 1000;
function animate() {
    requestAnimationFrame(animate);
    const currentTime = performance.now() / 1000;
    const deltaTime = currentTime - prevTime;
    prevTime = currentTime;

    // Rotate the sun slowly.
    sun.rotation.y += 0.001 * deltaTime * 60;

    // Update each planet's orbit and spin.
    planets.forEach((data) => {
        data.orbitAngle += data.orbitSpeed * deltaTime;
        data.mesh.position.x = data.distance * Math.cos(data.orbitAngle);
        data.mesh.position.z = data.distance * Math.sin(data.orbitAngle);
        data.mesh.rotation.y += data.spinSpeed * deltaTime;
    });

    // Update Earth's moon orbit.
    if (earthData && earthData.moonPivot) {
        earthData.moonPivot.rotation.y += earthData.moonOrbitSpeed * deltaTime;
    }

    // Update space debris.
    updateSpaceDebris(deltaTime);
    shootingStarTimer += deltaTime;
    meteoriteTimer += deltaTime;
    if (shootingStarTimer > 0.5 && Math.random() < 0.02) {
        spawnShootingStar();
        shootingStarTimer = 0;
    }
    if (meteoriteTimer > 0.5 && Math.random() < 0.02) {
        spawnMeteorite();
        meteoriteTimer = 0;
    }

    controls.update();
    renderer.render(scene, camera);
}

animate();

// ------------------------------
// HANDLE WINDOW RESIZE
// ------------------------------
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
