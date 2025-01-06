import * as THREE from 'three'
import { updateStatus } from './utils.js'

export class CombatManager {
	players = [];

	constructor() {

	}

	addPlayer(player) {
		this.players.push(player)
	}

	async takeTurns(BattleWorld) {
		while (true) {
			for (const player of BattleWorld.players.children) {
				if (player.isDead) continue

				let actionPerformed = false

				// player.mesh.material.color = new THREE.Color(0xffff00)

				updateStatus(`Waiting for ${player.name} to select an action`)

				do {
					const action = await player.requestAction()
					const result = await action.canPerform()
					if (result.value) {
						// Wait for the player to finish performing their action
						await action.perform()
						actionPerformed = true
					} else {
						updateStatus(result.reason)
					}
				} while (!actionPerformed)

				// player.mesh.material.color = new THREE.Color(0x0000ff)
			}
		}
	}
}