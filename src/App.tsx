import './App.css';
import { FunctionComponent, useEffect, useRef } from 'react';
import ShowreelVideo from './assets/showreel.mp4';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OrbitElements, updateOrbit } from './orbit';

interface RendererElements {
	renderer: THREE.WebGLRenderer,
	scene: THREE.Scene,
	camera: THREE.PerspectiveCamera,
	orbitControls: OrbitControls
};

const createBox = (scene: THREE.Scene) => {
	const geo = new THREE.BoxGeometry(2, 2, 2, 5, 5, 5);
	const mat = new THREE.MeshBasicMaterial({ color: 'white', wireframe: true });
	const mesh = new THREE.Mesh(geo, mat);
	scene.add(mesh);
	return mesh;
};

const createSphere = (scene: THREE.Scene) => {
	const geo = new THREE.SphereGeometry(1, 15, 15);
	const mat = new THREE.MeshBasicMaterial({ color: 'white', wireframe: true });
	const mesh = new THREE.Mesh(geo, mat);
	scene.add(mesh);
	return mesh;
};

const THREEScene: FunctionComponent = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null!);
	const updateFunctions: ((time: number) => void)[] = [];

	const render = (props: RendererElements, time: number) => {
		const { renderer, scene, camera, orbitControls } = props;
		orbitControls.update();
		renderer.render(scene, camera);
		updateFunctions.map(update => update(time));
		requestAnimationFrame((time: number) => render(props, time));
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
		orbitControls.autoRotateSpeed = 25;
		orbitControls.enableDamping = true;
		orbitControls.enableZoom = false;
		orbitControls.enablePan = false;
		orbitControls.update();

		camera.position.z = 5;
		renderer.setSize(window.innerWidth, window.innerHeight);

		createSphere(scene);
		const orbiter = createSphere(scene);
		const orbiter2 = createSphere(scene);
		const orbiter3 = createSphere(scene);

		const orbiterScale = 0.1;
		orbiter.scale.set(orbiterScale, orbiterScale, orbiterScale);
		orbiter2.scale.set(orbiterScale / 2, orbiterScale / 2, orbiterScale / 2);
		orbiter3.scale.set(orbiterScale / 2, orbiterScale / 2, orbiterScale / 2);

		updateFunctions.push((time: number) => updateOrbit({ orbiter, time }, {
			semiMajorAxis: 2,
			eccentricity: 0.2,
			inclination: Math.PI / 4,
			ascendingNode: 0,
			argumentOfPeriapsis: Math.PI / 4,
			orbitalPeriod: 2
		}));

		updateFunctions.push((time: number) => updateOrbit({ orbiter: orbiter2, time }, {
			semiMajorAxis: 2,
			eccentricity: 0.2,
			inclination: Math.PI / 2,
			ascendingNode: 0,
			argumentOfPeriapsis: -Math.PI / 2,
			orbitalPeriod: 3
		}));

		updateFunctions.push((time: number) => updateOrbit({ orbiter: orbiter3, time }, {
			semiMajorAxis: 2,
			eccentricity: 0.2,
			inclination: -Math.PI / 2,
			ascendingNode: 0,
			argumentOfPeriapsis: -Math.PI / 2,
			orbitalPeriod: 9
		}));

		requestAnimationFrame((time: number) => render({ renderer, scene, camera, orbitControls }, time));
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
		<THREEScene />
	)
};

export default App;