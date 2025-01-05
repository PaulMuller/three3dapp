import * as THREE from 'three'
import { Player } from './Player.js'
import { updateStatus } from '../utils.js'

export class HumanPlayer extends Player {
	name = 'HumanPlayer'
	raycaster = new THREE.Raycaster()

	constructor(coords, camera, world) {
		super(coords, camera, world)
		this.raycaster.layers.disable(1)
	}

	async getTargetSquare() {
		updateStatus('Select a target square')

		return new Promise((resolve) => {
			const onMouseDown = (event) => {
				const x = (event.clientX / window.innerWidth) * 2 - 1
				const y = - (event.clientY / window.innerHeight) * 2 + 1
				const coords = new THREE.Vector2(x, y)

				this.raycaster.setFromCamera(coords, this.camera)
				const intersections = this.raycaster.intersectObject(this.world.terrain)

				if (intersections.length > 0) {
					const selectedCoords = new THREE.Vector3(
						Math.floor(intersections[0].point.x),
						0,
						Math.floor(intersections[0].point.z)
					)
					window.removeEventListener('mousedown', onMouseDown)
					resolve(selectedCoords)
				}
			}

			// Wait for player to select a square
			window.addEventListener('mousedown', onMouseDown)
		})
	}

	async getTargetObject() {
		updateStatus('Select a target object')

		return new Promise((resolve) => {
			/**
			 * Event handler when user clicks on the screen
			 * @param {MouseEvent} event 
			 */
			const onMouseDown = (event) => {
				const x = (event.clientX / window.innerWidth) * 2 - 1
				const y = - (event.clientY / window.innerHeight) * 2 + 1
				const coords = new THREE.Vector2(x, y)

				this.raycaster.setFromCamera(coords, this.camera)
				const intersections = this.raycaster.intersectObject(this.world.objects, true)

				if (intersections.length > 0) {
					// Intersection is occurring with the mesh
					// The parent of the mesh is the GameObject
					const selectedObject = intersections[0].object.parent
					window.removeEventListener('mousedown', onMouseDown)
					resolve(selectedObject)
				}
			}

			window.addEventListener('mousedown', onMouseDown)
		})
	}

	async requestAction() {
		const actionButtonContainer = document.getElementById('actions')
		actionButtonContainer.innerHTML = ''

		const actions = this.getActions()

		return new Promise((resolve) => {
			actions.forEach((action) => {
				const button = document.createElement('button')
				button.innerText = action.name
				button.onclick = () => resolve(action)
				actionButtonContainer.appendChild(button)
			})
		})
	}
}