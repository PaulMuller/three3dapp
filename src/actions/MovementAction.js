import * as THREE from 'three'
import { Action } from './Action.js'
import { search } from '../pathfinding.js'
import { updateStatus } from '../utils.js'

const breadcrumb = new THREE.Mesh(
	new THREE.SphereGeometry(0.1),
	new THREE.MeshBasicMaterial()
)

export class MovementAction extends Action {

	constructor(source, world) {
		super(source)
		this.world = world

		this.name = 'Move'
		this.path = []
		this.pathIndex = 0
		this.pathUpdater = null
	}

	async perform() {
		return new Promise((resolve) => {
			function updateSourcePosition() {
				// If we reached the end of the path, then stop
				// the movement update interval, clear the path
				// breadcrumbs, and resolve this action to unblock
				// the combat manager
				if (this.pathIndex === this.path.length) {
					clearInterval(this.pathUpdater)
					this.world.path.clear()
					resolve()

					// Otherwise, move source object to the next path node
				} else {
					const curr = this.path[this.pathIndex++]
					this.source.moveTo(curr)
				}
			}

			// Clear the existing path update interval
			clearInterval(this.pathUpdater)

			updateStatus('Moving...')

			// Add breadcrumbs to the world
			this.path.forEach((coords) => {
				const node = breadcrumb.clone()
				node.position.set(coords.x + 0.5, 0, coords.z + 0.5)
				this.world.path.add(node)
			})

			// Trigger interval function to update player's position
			this.pathIndex = 0
			this.pathUpdater = setInterval(updateSourcePosition.bind(this), 300)
		})
	}

	async canPerform() {
		const selectedCoords = await this.source.getTargetSquare()

		// Find path from player's current position to the selected square
		this.path = search(this.source.coords, selectedCoords, this.world)

		if (this.path === null) {
			return {
				value: false,
				reason: 'Could not find path to target square.'
			}
		}

		if (this.path.length === 0) {
			return {
				value: false,
				reason: 'Pick square other than starting square'
			}
		}

		// Return true if a valid path was found
		return { value: true }
	}
}