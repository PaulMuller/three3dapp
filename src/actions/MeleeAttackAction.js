import { GameObject } from '../objects/GameObject'


export class MeleeAttackAction {
	name = 'Melee Attack'
	source = null
	target = null

	constructor(source) {
		this.source = source
	}

	async perform() {
		this.target.hit(3 + Math.floor(Math.random() * 5))
	}

	async canPerform() {
		this.target = await this.source.getTargetObject()

		if (!this.target) {
			return {
				value: false,
				reason: 'Must have a valid target'
			}
		}

		if (this.target === this.source) {
			return {
				value: false,
				reason: 'Cannot target self'
			}
		}

		const distance = this.target.coords.clone().sub(this.source.coords).length()

		if (distance > 1) {
			return {
				value: false,
				reason: 'Target is too far away'
			}
		}

		return { value: true }
	}
}