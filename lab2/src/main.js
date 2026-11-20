// src/main.js - Lab 2: Transformações (translação, rotação e escala)
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1e1e24);

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 5, 11);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// OrbitControls: botão esquerdo gira, direito arrasta, roda dá zoom
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Luzes
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const sol = new THREE.DirectionalLight(0xffffff, 2);
sol.position.set(3, 4, 2);
scene.add(sol);

// Helpers: eixos grandes do mundo e grade no plano XZ
scene.add(new THREE.AxesHelper(6));
scene.add(new THREE.GridHelper(20, 20));

// Vermelho: translação
const cuboVermelho = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0xe53935 })
);
cuboVermelho.position.set(-4, 0.5, 0);
scene.add(cuboVermelho);

// Verde: rotação (os eixos pequenos são filhos do cubo)
const cuboVerde = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x43a047 })
);
cuboVerde.position.set(0, 0.5, 0);
cuboVerde.add(new THREE.AxesHelper(1.2));
scene.add(cuboVerde);

// Azul: escala
const cuboAzul = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x1e88e5 })
);
cuboAzul.position.set(4, 0.5, 0);
scene.add(cuboAzul);

// Amarelo: movido pelo teclado
const cuboAmarelo = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0xfdd835 })
);
cuboAmarelo.position.set(0, 0.5, 3);
cuboAmarelo.add(new THREE.AxesHelper(1));
scene.add(cuboAmarelo);

// Painel com botão (criado pelo script)
const painel = document.createElement('div');
painel.style.cssText = 'position: absolute; top: 12px; left: 12px; padding: 10px 14px; border-radius: 8px; ' +
  'background: #000b; color: #fff; font: 14px/1.6 system-ui;';
const texto = document.createElement('div');
const botao = document.createElement('button');
botao.textContent = 'T2/T3: trocar rotação do verde';
botao.style.cssText = 'margin-top: 6px; padding: 6px 12px; font: 600 13px system-ui; border: 0; border-radius: 6px; cursor: pointer;';
painel.append(texto, botao);
document.body.appendChild(painel);

// Tarefas 2 e 3: modos de rotação do cubo verde
const modos = ['eixo X', 'eixo Z', 'três eixos', 'parado em 90°'];
let modo = 0;
botao.onclick = () => {
  modo = (modo + 1) % modos.length;
  atualizarTexto();
};

function atualizarTexto() {
  const p = cuboAmarelo.position;
  texto.innerHTML =
    `Rotação do verde: ${modos[modo]}<br>` +
    'Amarelo: setas movem em X e Z, W/S em Y, R gira 15°<br>' +
    `Amarelo em (${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)})`;
}
atualizarTexto();

// Teclado: setas movem o cubo amarelo no plano XZ
// Tarefa 5: W e S movem no eixo Y, R gira 15°
const passo = 0.25;
addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') cuboAmarelo.position.x -= passo;
  if (e.key === 'ArrowRight') cuboAmarelo.position.x += passo;
  if (e.key === 'ArrowUp') cuboAmarelo.position.z -= passo;
  if (e.key === 'ArrowDown') cuboAmarelo.position.z += passo;
  if (e.key === 'w' || e.key === 'W') cuboAmarelo.position.y += passo;
  if (e.key === 's' || e.key === 'S') cuboAmarelo.position.y -= passo;
  if (e.key === 'r' || e.key === 'R') cuboAmarelo.rotation.y += THREE.MathUtils.degToRad(15);
  atualizarTexto();
});

const timer = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const t = timer.getElapsedTime();

  // Tarefa 1: vermelho anda da esquerda para a direita (eixo X)
  cuboVermelho.position.x = -4 + 2 * Math.sin(t);

  // Tarefa 2: verde gira em X, depois em Z, depois nos três eixos
  // Tarefa 3: verde parado em 90° (Math.PI / 2)
  if (modo === 0) cuboVerde.rotation.set(t, 0, 0);
  if (modo === 1) cuboVerde.rotation.set(0, 0, t);
  if (modo === 2) cuboVerde.rotation.set(t, t, t);
  if (modo === 3) cuboVerde.rotation.set(0, Math.PI / 2, 0);

  // Tarefa 4: azul cresce só na altura (eixo Y), como uma barra
  const altura = 2 + Math.sin(t);       // vai de 1 a 3
  cuboAzul.scale.y = altura;
  cuboAzul.position.y = altura / 2;     // base apoiada na grade

  controls.update();
  renderer.render(scene, camera);
});

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
