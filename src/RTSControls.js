import {
	Vector3,
	Controls
} from 'three'

const _changeEvent = { type: 'change' }

class RTSControls extends Controls {
	constructor(object, domElement) {
		super()

		this.object = object
		this.domElement = domElement

		this.movementSpeed = 1.0
		this.rollSpeed = 0.5
		this.zoomSpeed = 0.1
		this.minZoom = 10
		this.maxZoom = 1000

		this._moveState = { forward: 0, backward: 0, left: 0, right: 0, rotateLeft: 0, rotateRight: 0 }
		this._moveVector = new Vector3(0, 0, 0)
		this._rotationVector = new Vector3(0, 0, 0)

		this._onKeyDown 	= this._onKeyDown.bind(this)
		this._onKeyUp 		= this._onKeyUp.bind(this)
		this._onMouseWheel 	= this._onMouseWheel.bind(this)

		window.addEventListener('keydown', 	this._onKeyDown)
		window.addEventListener('keyup', 	this._onKeyUp)
		window.addEventListener('wheel', 	this._onMouseWheel)

		this.object.position.set(5, 5, 5)
		
		this.object.rotation.order = 'XYZ'
		this.object.rotation.x = -Math.PI/4 // 45 degrees
		// this.object.rotation.y = -Math.PI/4  // 45 degrees
	}

	_onKeyDown(event) {
		switch (event.key) {
			case 'w':
				this._moveState.forward = 1
				break
			case 's':
				this._moveState.backward = 1
				break
			case 'a':
				this._moveState.left = 1
				break
			case 'd':
				this._moveState.right = 1
				break
			case 'q':
				this._moveState.rotateLeft = 1
				break
			case 'e':
				this._moveState.rotateRight = 1
				break
		}
		this._updateMovementVector()
	}

	_onKeyUp(event) {
		switch (event.key) {
			case 'w':
				this._moveState.forward = 0
				break
			case 's':
				this._moveState.backward = 0
				break
			case 'a':
				this._moveState.left = 0
				break
			case 'd':
				this._moveState.right = 0
				break
			case 'q':
				this._moveState.rotateLeft = 0
				break
			case 'e':
				this._moveState.rotateRight = 0
				break
		}
		this._updateMovementVector()
	}

	_onMouseWheel(event) {
		const zoomChange = event.deltaY * this.zoomSpeed
		this.object.position.y = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.position.y + zoomChange))
	}

	_updateMovementVector() {
		const forward = this._moveState.forward - this._moveState.backward;
		const right = this._moveState.right - this._moveState.left;
	
		const angle = this.object.rotation.y;
		const sin = Math.sin(angle);
		const cos = Math.cos(angle);
	
		// Calculate the movement vector based on the current rotation angle
		this._moveVector.x = (forward * cos) + (right * sin);
		this._moveVector.z = (forward * sin) - (right * cos);
	
		this._rotationVector.y = this._moveState.rotateRight - this._moveState.rotateLeft;
	}
	
	update(delta = 0.01) {
		const moveMult = delta * this.movementSpeed;
		const rotMult = delta * this.rollSpeed;
	
		this.object.translateX(this._moveVector.x * moveMult);
		this.object.translateZ(this._moveVector.z * moveMult);
		this.object.rotation.y += this._rotationVector.y * rotMult;
	
		this.dispatchEvent(_changeEvent);
	}

	dispose() {
		window.removeEventListener('keydown', this._onKeyDown)
		window.removeEventListener('keyup',	  this._onKeyUp)
		window.removeEventListener('wheel',	  this._onMouseWheel)
	}
}

export { RTSControls }