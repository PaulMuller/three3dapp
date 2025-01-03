import { Action } from './Action.js'

export class WaitAction extends Action {
	name = 'Wait'

	constructor(source) {
		super(source)
	}
}