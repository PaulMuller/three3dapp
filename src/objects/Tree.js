import * as THREE from 'three'
import { GameObject } from './GameObject'

const treeGeometry = new THREE.ConeGeometry(0.2, 1, 8)

const treeMaterial = new THREE.MeshStandardMaterial({
	color: 0x305010,
	flatShading: true
})

export class Tree extends GameObject {
	/**
	 * @param {THREE.Vector3} coords 
	 */
	constructor(coords) {
		const treeMesh = new THREE.Mesh(treeGeometry, treeMaterial)
		treeMesh.position.set(0.5, 0.5, 0.5)

		super(coords, treeMesh)

		this.name = `Tree-(${coords.x},${coords.z})`
	}
}