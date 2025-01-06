import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

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
		this.gltfLoader = new GLTFLoader()

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
			// Barbarian: 'assets/models/Characters/Barbarian.fbx',
			Barbarian: 'assets/models/Characters/Barbarian.glb',
			// Knight: 'assets/models/Characters/Knight.fbx',
			// Mage: 'assets/models/Characters/Mage.fbx',
			// Rogue: 'assets/models/Characters/Rogue.fbx',

			...AssetLoader.generateFilePaths('Rock', 'fbx', 25, 'assets/models/Rocks'),
			...AssetLoader.generateFilePaths('DeadOak', 'fbx', 3, 'assets/models/Trees'),
			...AssetLoader.generateFilePaths('DeadSpruce', 'fbx', 3, 'assets/models/Trees'),
			...AssetLoader.generateFilePaths('Spruce', 'fbx', 3, 'assets/models/Trees'),
			...AssetLoader.generateFilePaths('Oak', 'fbx', 3, 'assets/models/Trees'),
		},
		textures: {
			gridTexture: 'assets/textures/grid.png',
			...AssetLoader.generateFilePaths('rockTexture', 'png', 2, 'assets/textures/RockTexture'),
			DeadOak_Trunk: 'assets/textures/TreesTexture/DeadOak_Trunk.png',
			DeadOak_Leaf: 'assets/textures/TreesTexture/DeadOak_Leaf.png',
			DeadSpruce_Trunk: 'assets/textures/TreesTexture/DeadSpruce_Trunk.png',
			DeadSpruce_Leaf: 'assets/textures/TreesTexture/DeadSpruce_Leaf.png',
			Oak_Leaf: 'assets/textures/TreesTexture/Oak_Leaf.png',
			Oak_Trunk: 'assets/textures/TreesTexture/Oak_Trunk.png',
			Spruce_Leaf: 'assets/textures/TreesTexture/Spruce_Leaf.png',
			Spruce_Trunk: 'assets/textures/TreesTexture/Spruce_Trunk.png',
		}
	};

	async loadAll(onProgress = () => { }) {
		const manifest = AssetLoader.assetManifest
		this.totalAssets = Object.keys(manifest.models).length + Object.keys(manifest.textures).length

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
					onProgress(this.loadedAssets / this.totalAssets, path, name)
					resolve(texture)
				},
				undefined,
				(error) => reject(error)
			)
		})
	}

	loadModel(name, path, onProgress) {
		return new Promise((resolve, reject) => {
			if (path.includes('.fbx')){
				this.fbxLoader.load(
					path,
					(model) => {
						this.assets.models[name] = model
						this.loadedAssets++
						onProgress(this.loadedAssets / this.totalAssets, path, name)
						resolve(model)
					},
					undefined,
					(error) => reject(error)
				)
			}else if(path.includes('.glb') || path.includes('.gltf')){
				this.gltfLoader.load(
					path,
					(model) => {
						this.assets.models[name] = model
						this.loadedAssets++
						onProgress(this.loadedAssets / this.totalAssets, path, name)
						resolve(model)
					},
					undefined,
					(error) => reject(error)
				)
			}


			
		})
	}

	getModel(name) {
		const model = this.assets.models[name]
		if (!model) {
			console.warn(`Model '${name}' not found in loaded assets`)
			return null
		}

		return model.clone ? model.clone() : model
	}

	getTexture(name) {
		return this.assets.textures[name]
	}
}

const assetLoader = new AssetLoader()

export default assetLoader