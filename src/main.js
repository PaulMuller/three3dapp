import * as THREE from 'three'
import { RTSControls } from './RTSControls.js'
import Stats from 'three/addons/libs/stats.module.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { BattleWorld } from './worlds/BattleWorld.js'
import { CombatManager } from './CombatManager.js'
import assetLoader from './AssetLoader.js'


const initialize = async () => {
    // Show loading progress
    const loadingDiv = document.createElement('div')
    loadingDiv.style.position = 'fixed'
    loadingDiv.style.top = '50%'
    loadingDiv.style.left = '50%'
    loadingDiv.style.transform = 'translate(-50%, -50%)'
    document.body.appendChild(loadingDiv)

    try {
        // Load all assets
        await assetLoader.loadAll((progress, path, name) => {
            loadingDiv.innerHTML = `<h2> Loading: ${Math.round(progress * 100)}%</h2> <h3>${path}</h3> <h3>${name}</h3> `
        })

        // Remove loading display
        document.body.removeChild(loadingDiv)
    } catch (error) {
        console.error('Failed to load assets:', error)
        loadingDiv.textContent = 'Error loading assets'
    }


    const Barbarian = assetLoader.getModel('Barbarian')

    const model = Barbarian.scene
    const animations = Barbarian.animations
    model.traverse( function ( object ) {
        if ( object.isMesh ) {
            object.castShadow = true;
            object.receiveShadow = true
        }
    })
    model.scale.setScalar(0.25)
    model.position.set(0.5, 0, 0.5)
}

const createScene = () => {
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
    scene.background = new THREE.Color( 0xa0a0a0 )

    const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 222222, depthWrite: false } ) )
    mesh.rotation.x = - Math.PI / 2
    // mesh.receiveShadow = true
    scene.add( mesh )
    
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.layers.enable(1)



    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)

    const controls = new RTSControls(camera, renderer.domElement, scene)
    controls.update()

    const world = new BattleWorld(10, 10, camera)
    scene.add(world)

    const combatManager = new CombatManager()

    const sun = new THREE.DirectionalLight(0xffff99, 5)
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

    const ambient = new THREE.AmbientLight(0x9999ff, 0.6)
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

    const gui = new GUI()
    const worldFolder = gui.addFolder('BattleWorld').close()
    worldFolder.add(world, 'width', 1, 20, 1).name('Width')
    worldFolder.add(world, 'height', 1, 20, 1).name('Height')
    worldFolder.add(world, 'treeCount', 1, 100, 1).name('Tree Count')
    worldFolder.add(world, 'rockCount', 1, 100, 1).name('Rock Count')
    worldFolder.add(world, 'bushCount', 1, 100, 1).name('Bush Count')
    worldFolder.add(world, 'generate').name('Generate')

    combatManager.takeTurns(world)
}

const main = async () => {
    await initialize()
    createScene()
}

main()
