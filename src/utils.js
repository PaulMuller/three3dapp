import * as THREE from 'three'

export function updateStatus(text) {
	document.getElementById('status-text').innerText = text
}

export function getKey(coords) {
	return `${coords.x}-${coords.y}-${coords.z}`
}

export function createTextMaterial(text) {
	const size = 512

	const canvas = document.createElement('canvas')
	canvas.width = size
	canvas.height = size

	const context = canvas.getContext('2d')
	context.font = '100px Arial'
	context.textBaseline = 'middle'
	context.textAlign = 'center'

	context.strokeStyle = 'black'
	context.lineWidth = 4
	context.fillStyle = 'white'

	context.strokeText(text, size / 2, size / 2)
	context.fillText(text, size / 2, size / 2)

	return new THREE.SpriteMaterial({
		map: new THREE.CanvasTexture(canvas)
	})
}