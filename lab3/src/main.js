// src/main.js - Lab 3: Luz e materiais
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1e1e24);

const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 3, 11);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Legenda em HTML na parte de baixo da tela
const legenda = document.createElement('div');
legenda.style.cssText = 'position: absolute; bottom: 16px; left: 20%; width: 60%; display: flex; ' +
  'justify-content: space-around; font: 600 14px system-ui; color: #fff; pointer-events: none;';
legenda.innerHTML = '<span>Basic</span><span>Lambert</span><span>Phong</span>';
document.body.appendChild(legenda);

// Mesma geometria, três materiais vermelhos
const geo = new THREE.SphereGeometry(1, 48, 32);
const materialPhong = new THREE.MeshPhongMaterial({ color: 0xff0000, shininess: 30 });
const mats = [
  new THREE.MeshBasicMaterial({ color: 0xff0000 }),
  new THREE.MeshLambertMaterial({ color: 0xff0000 }),
  materialPhong
];
mats.forEach((m, i) => {
  const esfera = new THREE.Mesh(geo, m);
  esfera.position.x = (i - 1) * 3;   // x = -3, 0 e 3
  scene.add(esfera);
});

// Luzes
const ambiente = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambiente);

const luz = new THREE.PointLight(0xffffff, 60);
luz.position.set(5, 2, 0);
scene.add(luz);
const luzHelper = new THREE.PointLightHelper(luz, 0.2);   // mostra onde a luz está
scene.add(luzHelper);

// Tarefa 5: segunda luz pontual verde, girando no sentido contrário
const luzVerde = new THREE.PointLight(0x00ff00, 60);
scene.add(luzVerde);
const luzVerdeHelper = new THREE.PointLightHelper(luzVerde, 0.2);
scene.add(luzVerdeHelper);

// Painel com botões (criado pelo script)
const painel = document.createElement('div');
painel.style.cssText = 'position: absolute; top: 12px; left: 12px; padding: 10px 14px; border-radius: 8px; ' +
  'background: #000b; color: #fff; font: 14px/1.6 system-ui; display: flex; flex-direction: column; gap: 6px;';
document.body.appendChild(painel);

const estado = document.createElement('div');
painel.appendChild(estado);

function criarBotao(texto, acao) {
  const b = document.createElement('button');
  b.textContent = texto;
  b.style.cssText = 'padding: 6px 12px; font: 600 13px system-ui; border: 0; border-radius: 6px; cursor: pointer;';
  b.onclick = () => { acao(); atualizarEstado(); };
  painel.appendChild(b);
}

// Tarefa 1: intensidade da luz ambiente 0 e 1
const intensidades = [0.3, 0, 1];
let indiceIntensidade = 0;
criarBotao('T1: intensidade da luz ambiente', () => {
  indiceIntensidade = (indiceIntensidade + 1) % intensidades.length;
  ambiente.intensity = intensidades[indiceIntensidade];
});

// Tarefa 2: luz pontual azul (0x0000ff)
criarBotao('T2: cor da luz pontual', () => {
  if (luz.color.getHex() === 0xffffff) luz.color.setHex(0x0000ff);
  else luz.color.setHex(0xffffff);
  luzHelper.update();
});

// Tarefa 3: shininess 5 e 300 na esfera Phong
const brilhos = [30, 5, 300];
let indiceBrilho = 0;
criarBotao('T3: shininess da Phong', () => {
  indiceBrilho = (indiceBrilho + 1) % brilhos.length;
  materialPhong.shininess = brilhos[indiceBrilho];
});

// Tarefa 4: parar a luz e deixar fixa em (0, 5, 0)
let luzGirando = true;
criarBotao('T4: parar / girar a luz', () => {
  luzGirando = !luzGirando;
  if (!luzGirando) luz.position.set(0, 5, 0);
});

// Tarefa 5: ligar / desligar a luz verde
criarBotao('T5: luz verde', () => {
  luzVerde.visible = !luzVerde.visible;
  luzVerdeHelper.visible = luzVerde.visible;
});

function atualizarEstado() {
  estado.innerHTML =
    `Luz ambiente: ${ambiente.intensity}<br>` +
    `Luz pontual: ${luz.color.getHex() === 0xffffff ? 'branca' : 'azul'}<br>` +
    `Shininess: ${materialPhong.shininess}<br>` +
    `Luz pontual: ${luzGirando ? 'girando' : 'fixa em (0, 5, 0)'}<br>` +
    `Luz verde: ${luzVerde.visible ? 'ligada' : 'desligada'}`;
}
atualizarEstado();

const timer = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const t = timer.getElapsedTime();

  // A luz gira ao redor das esferas
  if (luzGirando) luz.position.set(Math.cos(t) * 5, 2, Math.sin(t) * 5);

  // Tarefa 5: -t faz a luz verde girar no sentido contrário
  luzVerde.position.set(Math.cos(-t) * 5, 2, Math.sin(-t) * 5);

  controls.update();
  renderer.render(scene, camera);
});

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
