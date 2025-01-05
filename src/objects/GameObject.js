import * as THREE from 'three'
import { createTextMaterial } from '../utils.js'

export class GameObject extends THREE.Group {


	onMove = (object, oldCoords, newCoords) => { }
	onDestroy = (object) => { }

	constructor(coords, mesh) {
		super()

		this.coords = coords
		this.position.copy(coords)

		this.mesh = mesh
		this.add(mesh)

		this.hitPoints = 10
		this.maxHitPoints = 10

		this.healthOverlay = new THREE.Sprite()
		this.healthOverlay.position.set(0.5, 1.2, 0.5)
		this.healthOverlay.visible = false
		this.healthOverlay.layers.set(1)
		this.add(this.healthOverlay)

		this.updateHitpointOverlay()
	}

	get isDead() {
		return (this.hitPoints === 0)
	}

	destroy() {
		this.healthOverlay.material.dispose()

		if (this.onDestroy) {
			this.onDestroy(this)
		}
	}

	hit(damage) {
		this.hitPoints -= damage

		if (this.hitPoints <= 0) {
			this.hitPoints = 0
			this.destroy()
		}

		this.updateHitpointOverlay()
	}

	moveTo(coords) {
		const oldCoords = this.coords

		this.coords = coords
		this.position.copy(coords)

		if (this.onMove) {
			this.onMove(this, oldCoords, this.coords)
		}
	}

	updateHitpointOverlay() {
		if (this.healthOverlay.material) {
			this.healthOverlay.material.dispose()
		}
		this.healthOverlay.material = createTextMaterial(`${this.hitPoints}/${this.maxHitPoints}`)
	}
}