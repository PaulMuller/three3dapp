import * as THREE from 'three'
import { RTSControls } from './RTSControls.js'
import Stats from 'three/addons/libs/stats.module.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { BattleWorld } from './worlds/BattleWorld.js'
import { CombatManager } from './CombatManager.js'

const gui = new GUI()

const stats = new Stats()
document.body.appendChild(stats.dom)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setAnimationLoop(animate)
renderer.setPixelRatio(devicePixelRatio)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.layers.enable(1)
// const helper = new THREE.CameraHelper( camera )
// scene.add( helper )

const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const controls = new RTSControls(camera, renderer.domElement, scene)
controls.update()

const world = new BattleWorld(10, 10, camera)
scene.add(world)

const combatManager = new CombatManager()

const sun = new THREE.DirectionalLight(0xffffff, 5)
sun.position.set(1000, 1000, 1000)
sun.castShadow = true

sun.shadow.mapSize.width = 2048  // Higher values = better quality shadows
sun.shadow.mapSize.height = 2048
sun.shadow.camera.near = 0
sun.shadow.camera.far = 10000
sun.shadow.camera.left = -10
sun.shadow.camera.right = 10
sun.shadow.camera.top = 0
sun.shadow.camera.bottom = -10

scene.add(sun)

// const helper = new THREE.CameraHelper(sun.shadow.camera)
// scene.add(helper)

const ambient = new THREE.AmbientLight(0xffffff, 0.6)
scene.add(ambient)

function animate(time, delta) {
    controls.update(time, delta)
    stats.update()

    render()
}

function render() {
    renderer.render(scene, camera)
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

document.addEventListener('contextmenu', function (event) {
    event.preventDefault()
})

const worldFolder = gui.addFolder('BattleWorld').close()
worldFolder.add(world, 'width', 1, 20, 1).name('Width')
worldFolder.add(world, 'height', 1, 20, 1).name('Height')
worldFolder.add(world, 'treeCount', 1, 100, 1).name('Tree Count')
worldFolder.add(world, 'rockCount', 1, 100, 1).name('Rock Count')
worldFolder.add(world, 'bushCount', 1, 100, 1).name('Bush Count')
worldFolder.add(world, 'generate').name('Generate')

// Create a folder for light properties
const lightFolder = gui.addFolder('Light Properties').close()
lightFolder.add(sun.shadow.mapSize, 'width', 256, 2048).name('Shadow Map Width')
lightFolder.add(sun.shadow.mapSize, 'height', 256, 2048).name('Shadow Map Height')
lightFolder.add(sun.shadow.camera, 'near', 0.1, 10).name('Shadow Camera Near')
lightFolder.add(sun.shadow.camera, 'far', 10, 1000).name('Shadow Camera Far')
lightFolder.add(sun, 'intensity', 0, 10).name('Light Intensity')

combatManager.takeTurns(world)