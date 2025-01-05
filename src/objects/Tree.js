import * as THREE from 'three'
import { GameObject } from './GameObject'
import assetLoader from '../AssetLoader'
import { TechnicolorShader } from 'three/examples/jsm/Addons.js'

const geometry = new THREE.ConeGeometry(0.2, 1, 8)

const material = new THREE.MeshStandardMaterial({
	color: 0x305010,
	// flatShading: true
})

const VARIANTS = [
	'DeadOak',
	'DeadSpruce',
	'Oak',
	'Spruce',
]

export class Tree extends GameObject {
	constructor(coords) {
		const rotation = Math.random() * 2 * Math.PI
		const variant = VARIANTS[Math.floor(Math.random() * VARIANTS.length)]
		const randomIndexForModel = Math.floor(Math.random() * 3) + 1
		const model = assetLoader.getModel(`${variant}_${randomIndexForModel}`)

		const textureTrunc = assetLoader.getTexture(`${variant}_Trunk`)
		// const materialTrunc = new THREE.MeshStandardMaterial({ map: textureTrunc, flatShading: false })

		const textureLeaf = assetLoader.getTexture(`${variant}_Leaf`)
		// const materialLeaf = new THREE.MeshStandardMaterial({ map: textureLeaf, flatShading: false })	

		model.traverse(child => {
			if (child.isMesh){
				child.castShadow = true
				child.receiveShadow = true
		
				child.position.set(0.5, 0, 0.5)
				child.scale.set(.1,.1,.1)
				child.rotation.z = rotation

				const materials = Array.isArray( child.material ) ? child.material : [ child.material ]
				materials.map(material => {
					if (material.name.includes('Trunk')) {
						material.map = textureTrunc
					} else if (material.name.includes('Leaf')) {
						material.map = textureLeaf
					}
				})
			}
		})

		super(coords, model)

		this.position.set(coords.x, 0, coords.z)
		this.name = `Tree-(${coords.x},${coords.z})`
		
	}
}