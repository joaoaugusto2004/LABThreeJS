// src/main.js - Lab 1: Minha primeira cena 3D
import * as THREE from 'three';

// 1) Cena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1e1e24);

// 2) Câmera perspectiva: fov (graus), aspecto, near, far
const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
camera.position.set(3, 2, 5);
camera.lookAt(0, 0, 0);

// 3) Renderizador WebGL
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// Eixos: X vermelho, Y verde, Z azul
scene.add(new THREE.AxesHelper(5));

// 4) Objeto: Mesh = Geometry (forma) + Material (aparência)
// Tarefa 1: MeshNormalMaterial trocado por MeshBasicMaterial laranja
const materialNormal = new THREE.MeshNormalMaterial();
const materialLaranja = new THREE.MeshBasicMaterial({ color: 0xff8800 });

// Tarefa 2: cubo trocado por esfera, cone e toro
const geometrias = [
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.SphereGeometry(1, 32, 16),
  new THREE.ConeGeometry(1, 2, 32),
  new THREE.TorusGeometry(1, 0.3, 16, 64)
];
const nomesGeometrias = ['Cubo', 'Esfera', 'Cone', 'Toro'];
let indiceGeometria = 1;

const objeto = new THREE.Mesh(geometrias[indiceGeometria], materialLaranja);
scene.add(objeto);

// Tarefa 3: segundo objeto em x = 3, depois y = 3 e z = 3
const objetoX = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshNormalMaterial());
objetoX.position.set(3, 0, 0);   // aparece no eixo vermelho (X)
scene.add(objetoX);

const objetoY = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshNormalMaterial());
objetoY.position.set(0, 3, 0);   // aparece no eixo verde (Y)
scene.add(objetoY);

const objetoZ = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshNormalMaterial());
objetoZ.position.set(0, 0, 3);   // aparece no eixo azul (Z)
scene.add(objetoZ);

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

// Tarefa 1
criarBotao('T1: trocar material', () => {
  objeto.material = objeto.material === materialLaranja ? materialNormal : materialLaranja;
});

// Tarefa 2
criarBotao('T2: trocar geometria', () => {
  indiceGeometria = (indiceGeometria + 1) % geometrias.length;
  objeto.geometry = geometrias[indiceGeometria];
});

// Tarefa 4: câmera em (0, 10, 0)
let cameraDeCima = false;
criarBotao('T4: câmera em (0, 10, 0)', () => {
  cameraDeCima = !cameraDeCima;
  if (cameraDeCima) camera.position.set(0, 10, 0);
  else camera.position.set(3, 2, 5);
  camera.lookAt(0, 0, 0);
});

// Tarefa 5: fov 60 -> 20 -> 120
const valoresFov = [60, 20, 120];
let indiceFov = 0;
criarBotao('T5: trocar fov', () => {
  indiceFov = (indiceFov + 1) % valoresFov.length;
  camera.fov = valoresFov[indiceFov];
  camera.updateProjectionMatrix();   // obrigatório ao mudar parâmetros da câmera
});

function atualizarEstado() {
  const nomeMaterial = objeto.material === materialLaranja ? 'MeshBasicMaterial laranja' : 'MeshNormalMaterial';
  estado.innerHTML =
    `Material: ${nomeMaterial}<br>` +
    `Geometria: ${nomesGeometrias[indiceGeometria]}<br>` +
    `Câmera: (${camera.position.x}, ${camera.position.y}, ${camera.position.z})<br>` +
    `fov: ${camera.fov}°`;
}
atualizarEstado();

// 5) Loop de animação
const timer = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const dt = timer.getDelta();
  objeto.rotation.x += 0.6 * dt;
  objeto.rotation.y += 0.9 * dt;
  renderer.render(scene, camera);
});

// 6) Redimensionamento
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
