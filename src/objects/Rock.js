import * as THREE from 'three'
import { GameObject } from './GameObject'
import assetLoader from '../AssetLoader'

export class Rock extends GameObject {
	constructor(coords) {
		const model = assetLoader.getModel('Rock_1')
		const texture = assetLoader.getTexture('rockTexture_1')
		const material = new THREE.MeshStandardMaterial({ map: texture })

		model.traverse(childMesh => {
			if (childMesh.isMesh) {
				childMesh.material = material
				childMesh.castShadow = true
				childMesh.receiveShadow = true
				childMesh.position.set(0.5, 0, 0.5)
				childMesh.scale.set(.1,.1,.1)
			}
		})
		// model.position.set(0.5, 0.5, 0.5)

		super(coords, model.children[0])

		this.position.set(coords.x, 0, coords.z)
		this.name = `Rock-(${coords.x},${coords.z})`
		this.visible = true
        // this.scale.set(1, 1, 1)
	}
}