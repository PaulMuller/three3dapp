export class Action {
	name = 'BaseAction'
	source = null

	constructor(source) {
		this.source = source
	}

	async perform() {
		// Do nothing
	}

	async canPerform() {
		return { value: true }
	}
}