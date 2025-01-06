import * as THREE from 'three'
import { GameObject } from '../objects/GameObject.js'
import { Action, MeleeAttackAction, MovementAction, RangedAttackAction, WaitAction } from '../actions'
import assetLoader from '../AssetLoader.js'
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js'


export class Player extends GameObject {
	constructor(coords, camera, world) {
		const Barbarian =  assetLoader.getModel('Barbarian')
		const model = SkeletonUtils.clone( Barbarian.scene )
		const mixer = new THREE.AnimationMixer( model )

		mixer.clipAction( Barbarian.animations[ 0 ] ).play() // idle

		super(coords, model)

		this.healthOverlay.visible = true
		this.name = 'Player'

		this.moveTo(coords)
		this.camera = camera
		this.world = world
	}

	getActions() {
		return [
			new MovementAction(this, this.world),
			new MeleeAttackAction(this),
			new RangedAttackAction(this),
			new WaitAction()
		]
	}

	async getTargetSquare() {
		return null
	}

	async getTargetObject() {
		return null
	}

	async requestAction() {
		return null
	}
}