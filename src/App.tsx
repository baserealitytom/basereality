import './App.css';
import { FunctionComponent, useEffect, useRef } from 'react';
import ShowreelVideo from './assets/showreel.mp4';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface RendererElements {
	renderer: THREE.WebGLRenderer,
	scene: THREE.Scene,
	camera: THREE.PerspectiveCamera,
	orbitControls: OrbitControls
};

const createBox = (scene: THREE.Scene) => {
	const geo = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5);
	const mat = new THREE.MeshBasicMaterial({ color: 'white', wireframe: true });
	const mesh = new THREE.Mesh(geo, mat);
	scene.add(mesh);
	return mesh;
};

const THREEScene: FunctionComponent = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null!);

	const render = (props: RendererElements) => {
		const { renderer, scene, camera, orbitControls } = props;
		orbitControls.update();
		renderer.render(scene, camera);
		requestAnimationFrame(() => render(props));
	};

	useEffect(() => {
		const scene = new THREE.Scene();
		const renderer = new THREE.WebGLRenderer({
			canvas: canvasRef.current,
			antialias: true
		});
		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
		scene.add(ambientLight);

		const orbitControls = new OrbitControls(camera, renderer.domElement);
		orbitControls.autoRotate = true;
		orbitControls.autoRotateSpeed = 1;
		orbitControls.enableDamping = true;
		orbitControls.update();

		camera.position.z = 5;
		renderer.setSize(window.innerWidth, window.innerHeight);
		createBox(scene);
		requestAnimationFrame(() => render({ renderer, scene, camera, orbitControls }));
	});

	return (
		<canvas ref={canvasRef} />
	)
};

const Showreel = () => {
	return (
		<video src={ShowreelVideo} autoPlay loop muted style={{ position: 'absolute' }}></video>
	)
};

const App = () => {
	return (
		<>
			<THREEScene />
		</>
	)
};

export default App;