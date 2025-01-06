import { Vector3, Controls, Object3D } from 'three'
	
const _changeEvent = { type: 'change' }

class RTSControls extends Controls {
	constructor(object, domElement, scene) {
		super()

		this.object = object
		this.domElement = domElement

		this.operator = new Object3D()
		this.operator.add(this.object)
		this.operator.position.set(5, 5, 5)
		scene.add(this.operator)

		this.object.rotation.order = 'YXZ'
		this.object.rotation.y = -Math.PI / 2
		this.object.rotation.x = -Math.PI / 4

		this.movementSpeed = 10
		this.rollSpeed = 2
		this.zoomSpeed = 0.005
		this.minZoom = 1
		this.maxZoom = 10

		this._moveState = {
			forward: 0,
			backward: 0,
			left: 0,
			right: 0,
			rotateLeft: 0,
			rotateRight: 0
		}

		this._moveVector = new Vector3(0, 0, 0)

		this._onKeyDown = this._onKeyDown.bind(this)
		this._onKeyUp = this._onKeyUp.bind(this)
		this._onMouseWheel = this._onMouseWheel.bind(this)

		window.addEventListener('keydown', this._onKeyDown)
		window.addEventListener('keyup', this._onKeyUp)
		window.addEventListener('wheel', this._onMouseWheel)
	}

	_onKeyDown(event) {
		console.log(event)
		switch (event.code) {
			case 'KeyW':
				this._moveState.forward = 1
				break
			case 'KeyS':
				this._moveState.backward = 1
				break
			case 'KeyA':
				this._moveState.left = 1
				break
			case 'KeyD':
				this._moveState.right = 1
				break
			case 'KeyQ':
				this._moveState.rotateLeft = 1
				break
			case 'KeyE':
				this._moveState.rotateRight = 1
				break
		}
		this._updateMovementVector()
	}

	_onKeyUp(event) {
		switch (event.code) {
			case 'KeyW':
				this._moveState.forward = 0
				break
			case 'KeyS':
				this._moveState.backward = 0
				break
			case 'KeyA':
				this._moveState.left = 0
				break
			case 'KeyD':
				this._moveState.right = 0
				break
			case 'KeyQ':
				this._moveState.rotateLeft = 0
				break
			case 'KeyE':
				this._moveState.rotateRight = 0
				break
		}
		this._updateMovementVector()
	}

	_onMouseWheel(event) {
		const zoomChange = event.deltaY * this.zoomSpeed
		this.operator.position.y = Math.max(this.minZoom, Math.min(this.maxZoom, this.operator.position.y + zoomChange))
	}

	_updateMovementVector() {
		this._moveVector.x = this._moveState.forward - this._moveState.backward
		this._moveVector.z = this._moveState.right - this._moveState.left
		this._moveVector.y = this._moveState.rotateRight - this._moveState.rotateLeft
	}

	update(time, delta = 0.01) {
		const moveMult = delta * this.movementSpeed
		const rotMult = delta * this.rollSpeed

		this.operator.translateX(this._moveVector.x * moveMult)
		this.operator.translateZ(this._moveVector.z * moveMult)
		this.operator.rotation.y += this._moveVector.y * rotMult

		this.dispatchEvent(_changeEvent)
	}

	dispose() {
		window.removeEventListener('keydown', this._onKeyDown)
		window.removeEventListener('keyup', this._onKeyUp)
		window.removeEventListener('wheel', this._onMouseWheel)
		this.operator.dispose()
	}
}

export { RTSControls }