import * as THREE from 'three'
import { GameObject } from './GameObject.js'

const material = new THREE.MeshStandardMaterial({
	color: 0x80a040,
	// flatShading: true
})

const geometry = new THREE.SphereGeometry(1, 8, 8)

export class Bush extends GameObject {
	constructor(coords) {
		const minRadius = 0.1
		const maxRadius = 0.3
		const radius = minRadius + (Math.random() * (maxRadius - minRadius))
		const mesh = new THREE.Mesh(geometry, material)
		mesh.scale.set(radius, radius, radius)
		mesh.position.set(0.5, radius, 0.5)
		mesh.castShadow = true

		super(coords, mesh)

		this.name = `Bush-(${coords.x},${coords.z})`
	}
}