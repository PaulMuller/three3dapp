import * as THREE from 'three'
import { GameObject } from './GameObject'

const geometry = new THREE.ConeGeometry(0.2, 1, 8)

const material = new THREE.MeshStandardMaterial({
	color: 0x305010,
	// flatShading: true
})

export class Tree extends GameObject {
	/**
	 * @param {THREE.Vector3} coords 
	 */
	constructor(coords) {
		const mesh = new THREE.Mesh(geometry, material)
		mesh.position.set(0.5, 0.5, 0.5)
		mesh.castShadow = true

		super(coords, mesh)

		this.name = `Tree-(${coords.x},${coords.z})`
		
	}
}