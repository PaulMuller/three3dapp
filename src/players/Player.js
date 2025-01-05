import * as THREE from 'three'
import { GameObject } from '../objects/GameObject.js'
import { Action, MeleeAttackAction, MovementAction, RangedAttackAction, WaitAction } from '../actions.js'

const DEFAULT_RADIUS = 0.1
const DEFAULT_HEIGHT = 0.15
const DEFAULT_CAP_SEGMENTS = 8
const DEFAULT_HEIGHT_SEGMENTS = 16



/**
 * Base player class that human and computer players derive from
 */
export class Player extends GameObject {
	

	constructor(coords, camera, world) {
		const geometry = new THREE.CapsuleGeometry(
			DEFAULT_RADIUS, 
			DEFAULT_HEIGHT, 
			DEFAULT_CAP_SEGMENTS, 
			DEFAULT_HEIGHT_SEGMENTS
		)
		const material = new THREE.MeshStandardMaterial({ color: 0x4040c0 })
		const mesh = new THREE.Mesh(geometry, material)
		mesh.castShadow = true
		mesh.position.set(0.5, DEFAULT_HEIGHT, 0.5)

		super(coords, mesh)

		this.healthOverlay.visible = true
		this.name = 'Player'

		this.moveTo(coords)
		this.camera = camera
		this.world = world
	}

	/**
	 * @returns {Action[]}
	 */
	getActions() {
		return [
			new MovementAction(this, this.world),
			new MeleeAttackAction(this),
			new RangedAttackAction(this),
			new WaitAction()
		]
	}

	/**
	 * Wait for the player to choose a target square
	 * @returns {Promise<Vector3 | null>}
	 */
	async getTargetSquare() {
		return null
	}

	/**
	 * Wait for the player to choose a target GameObject
	 * @returns {Promise<GameObject | null>}
	 */
	async getTargetObject() {
		return null
	}

	/**
	 * Wait for the player to select an action to perform
	 * @returns {Promise<Action | null>}
	 */
	async requestAction() {
		return null
	}
}