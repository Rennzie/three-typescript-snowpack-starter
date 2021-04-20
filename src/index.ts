import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas: HTMLCanvasElement | null = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * OBJECTS
 */

// RONDAVEL
const rondavelSizes = {
  height: 2.2,
  radius: 2.5,
  doorHeight: 2,
  windowHeight: 1,
  windowWidth: 2,
  roofHeight: 2,
  roofRadius: 2.65,
};

const rondavel = new THREE.Group();
scene.add(rondavel);

const bodyMaterial = new THREE.MeshStandardMaterial({ color: 'brown' });
const bodyGeometry = new THREE.CylinderGeometry(
  rondavelSizes.radius,
  rondavelSizes.radius,
  rondavelSizes.height,
  100,
);
const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);

const roofMaterial = new THREE.MeshStandardMaterial({ color: 'yelow' });
const roofGeometry = new THREE.CylinderGeometry(
  0,
  rondavelSizes.roofRadius,
  rondavelSizes.roofHeight,
  100,
);

const roofMesh = new THREE.Mesh(roofGeometry, roofMaterial);

rondavel.add(roofMesh);

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    color: 'green',
    // map: grassColorTexture,
    // aoMap: grassAmbientOcclusionTexture,
    // normalMap: grassNormalTexture,
    // roughnessMap: grassRoughnessTexture,
  }),
);
floor.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2),
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.2);
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 0.75);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001);
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001);
scene.add(moonLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x262837);

/**
 * Shadows
 */
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
floor.receiveShadow = true;
rondavel.castShadow = true;
moonLight.castShadow = true;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
