// Originally written by Sean Dempsey https://codepen.io/seanseansean/pen/EaBZEY?editors=0010
// Adapted to React by Bryan White

import React, { Component } from "react"
import * as THREE from "three"

class StarField extends Component {
	componentDidMount() {
		const scene = new THREE.Scene()
		const fogColor = new THREE.Color(0x000000)
		const farPlane = 3000
		
		let color = null
		let size = null
		let h = null
		let mouseX = 0
		let mouseY = 0
		
		let height = this.mount.offsetHeight
		let width = this.mount.offsetWidth
		let windowHalfX = width / 2
        let windowHalfY = height / 2

		this.camera = new THREE.PerspectiveCamera(75, width/height, 1, farPlane)
		this.camera.position.z = farPlane / 3
		this.renderer = new THREE.WebGLRenderer()
		this.renderer.setSize(width, height)
		this.renderer.setPixelRatio(this.mount.devicePixelRatio)
		this.mount.appendChild(this.renderer.domElement)

		scene.background = fogColor
		scene.fog = new THREE.FogExp2(fogColor, 0.0007)

		let geometry = new THREE.Geometry()
		
		const particleCount = 20000

		for ( let i = 0; i < particleCount; i ++ ) {
			var vertex = new THREE.Vector3()

			vertex.x = THREE.MathUtils.randFloatSpread( 2000 )
			vertex.y = THREE.MathUtils.randFloatSpread( 2000 )
			vertex.z = THREE.MathUtils.randFloatSpread( 2000 )

			geometry.vertices.push(vertex)
		}

		const parameters = [
            [
                [1, 1, 0.5], 5
            ],
            [
                [0.95, 1, 0.5], 4
            ],
            [
                [0.90, 1, 0.5], 3
            ],
            [
                [0.85, 1, 0.5], 2
            ],
            [
                [0.80, 1, 0.5], 1
            ]
		]
		
		const parameterCount = parameters.length
		let materials = []
		
		for (let i = 0; i < parameterCount; i++) {

            color = parameters[i][0]
			size = parameters[i][1]

            materials[i] = new THREE.PointsMaterial({
                size: size
            })

            let particles = new THREE.Points(geometry, materials[i])

            particles.rotation.x = Math.random() * 6
            particles.rotation.y = Math.random() * 6
            particles.rotation.z = Math.random() * 6

            scene.add(particles)
        }

		this.render = () => {
			const time = Date.now() * 0.00005

			this.camera.position.x += (mouseX - this.camera.position.x) * 0.05
			this.camera.position.y += (-mouseY - this.camera.position.y) * 0.05

			this.camera.lookAt(scene.position)

			for (let i = 0; i < scene.children.length; i+= 1) {

				const object = scene.children[i]
	
				if (object instanceof THREE.Points) {
	
					object.rotation.y = time * (i < 4 ? i + 1 : -(i + 1))
				}
			}
	
			for (let i = 0; i < materials.length; i+= 1) {
				color = parameters[i][0]
	
				h = (360 * (color[0] + time) % 360) / 360;
				materials[i].color.setHSL(h, color[1], color[2])
			}

			this.renderer.render(scene, this.camera)
		}

		this.animate = function () {
			requestAnimationFrame(this.animate.bind(this))
			this.render()
		}

		this.animate()

		this.onDocumentMouseMove = (e) => {
			mouseX = e.clientX - windowHalfX
			mouseY = e.clientY - windowHalfY
		}

		this.onDocumentTouchStart = (e) => {

			if (e.touches.length === 1) {
	
				e.preventDefault()
				mouseX = e.touches[0].pageX - windowHalfX
				mouseY = e.touches[0].pageY - windowHalfY
			}
		}
	
		this.onDocumentTouchMove = (e) => {
	
			if (e.touches.length === 1) {
	
				e.preventDefault()
				mouseX = e.touches[0].pageX - windowHalfX
				mouseY = e.touches[0].pageY - windowHalfY
			}
		}

		this.onWindowResize = () => {
			if (this.mount) {
				windowHalfX = this.mount.offsetWidth / 2
				windowHalfY = this.mount.offsetHeight / 2
	
				this.camera.aspect = width / height
				this.camera.updateProjectionMatrix()
				this.renderer.setSize(width, height)
			}
		}

		this.mount.addEventListener('resize', this.onWindowResize.bind(this), false)
		this.mount.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false)
		this.mount.addEventListener('touchstart', this.onDocumentTouchStart.bind(this), false)
        this.mount.addEventListener('touchmove', this.onDocumentTouchMove.bind(this), false)
	}

	render() {
		return (
			<div ref={ref => (this.mount = ref)} style={{ width: `100vw`, height: `100vh` }}></div>
		)
	}
}

export default StarField