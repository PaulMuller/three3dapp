import * as THREE from 'three'
import { GameObject } from './GameObject.js'
import assetLoader from '../AssetLoader.js'

export class Rock extends GameObject {
	constructor(coords) {
		const rotation = Math.random() * 2 * Math.PI
		const randomIndexForModel = Math.floor(Math.random() * 25) + 1
		const randomIndexForTexture = Math.floor(Math.random() * 2) + 1

		const model = assetLoader.getModel(`Rock_${randomIndexForModel}`)
		const texture = assetLoader.getTexture(`rockTexture_${randomIndexForTexture}`)
		const material = new THREE.MeshStandardMaterial({ map: texture, flatShading: false })

		model.traverse(child => {
			if (!child.isMesh) return

			child.material = material
			child.castShadow = true
			child.receiveShadow = true
			child.position.set(0.5, 0, 0.5)
			child.scale.set(.1,.1,.1)
			child.rotation.z = rotation
		})
		super(coords, model)

		this.position.set(coords.x, 0, coords.z)
		this.name = `Rock-(${coords.x},${coords.z})`
	}
}