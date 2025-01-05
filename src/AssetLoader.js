import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

class AssetLoader {
	static generateFilePaths(name, format, count = 1, basePath = './assets/') {
		const filePaths = {}
		for (let i = 0; i < count; i++) {
			const key = `${name}_${i + 1}`
			const value = `${basePath}/${name}_${i + 1}.${format}`
			filePaths[key] = value
		}
		return filePaths
	}

	constructor() {
		this.textureLoader = new THREE.TextureLoader()
		this.fbxLoader = new FBXLoader()

		// Storage for loaded assets
		this.assets = {
			models: {},
			textures: {},
		}

		// Track loading progress
		this.totalAssets = 0
		this.loadedAssets = 0
	}

	// Asset manifest - define all your assets here
	static assetManifest = {
		models: {
			...AssetLoader.generateFilePaths('Rock', 'fbx', 25, 'models/Rocks/'),
		},
		textures: {
			gridTexture: 'textures/grid.png',
			...AssetLoader.generateFilePaths('rockTexture', 'png', 2, 'textures/RockTexture/'),
		}
	};

	async loadAll(onProgress = () => { }) {
		const manifest = AssetLoader.assetManifest
		this.totalAssets = Object.keys(manifest.models).length +
			Object.keys(manifest.textures).length

		try {
			// Load all textures
			const texturePromises = Object.entries(manifest.textures).map(
				([name, path]) => this.loadTexture(name, path, onProgress)
			)

			// Load all models
			const modelPromises = Object.entries(manifest.models).map(
				([name, path]) => this.loadModel(name, path, onProgress)
			)

			// Wait for all assets to load
			await Promise.all([...texturePromises, ...modelPromises])

			return this.assets
		} catch (error) {
			console.error('Error loading assets:', error)
			throw error
		}
	}

	loadTexture(name, path, onProgress) {
		return new Promise((resolve, reject) => {
			this.textureLoader.load(
				path,
				(texture) => {
					this.assets.textures[name] = texture
					this.loadedAssets++
					onProgress(this.loadedAssets / this.totalAssets)
					resolve(texture)
				},
				undefined,
				(error) => reject(error)
			)
		})
	}

	loadModel(name, path, onProgress) {
		return new Promise((resolve, reject) => {
			this.fbxLoader.load(
				path,
				(model) => {
					this.assets.models[name] = model
					this.loadedAssets++
					onProgress(this.loadedAssets / this.totalAssets)
					resolve(model)
				},
				undefined,
				(error) => reject(error)
			)
		})
	}

	getModel(name) {
		const model = this.assets.models[name]
		if (!model) {
			console.warn(`Model '${name}' not found in loaded assets`)
			return null
		}
		// Return a clone so the original remains untouched
		return model.clone()
	}

	getTexture(name) {
		return this.assets.textures[name]
	}
}

const assetLoader = new AssetLoader()

export default assetLoader