import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RTSControls } from './RTSControls.js'
import Stats from 'three/addons/libs/stats.module.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { BattleWorld } from './worlds/BattleWorld.js'
import { CombatManager } from './CombatManager.js'

const gui = new GUI()

const stats = new Stats()
document.body.appendChild(stats.dom)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setAnimationLoop(animate)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
scene.add(camera)
camera.layers.enable(1)

const controls = new RTSControls(camera, renderer.domElement)
// controls.target.set(5, 0, 5)
// camera.position.set(0, 2, 0)
controls.update()

const world = new BattleWorld(10, 10, camera)
scene.add(world)

const combatManager = new CombatManager()

const sun = new THREE.DirectionalLight()
sun.intensity = 3
sun.position.set(1, 2, 3)
scene.add(sun)

const ambient = new THREE.AmbientLight()
ambient.intensity = 0.5
scene.add(ambient)

function animate() {
    controls.update()
    renderer.render(scene, camera)
    stats.update()
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

const worldFolder = gui.addFolder('BattleWorld').close()
worldFolder.add(world, 'width', 1, 20, 1).name('Width')
worldFolder.add(world, 'height', 1, 20, 1).name('Height')
worldFolder.add(world, 'treeCount', 1, 100, 1).name('Tree Count')
worldFolder.add(world, 'rockCount', 1, 100, 1).name('Rock Count')
worldFolder.add(world, 'bushCount', 1, 100, 1).name('Bush Count')
worldFolder.add(world, 'generate').name('Generate')

combatManager.takeTurns(world)