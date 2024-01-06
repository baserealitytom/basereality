import { FunctionComponent, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { updateOrbit } from './orbit';
import { fragmentShader, vertexShader } from './shader';
import cloudPNG from './assets/cloud.png';
import lavatileJPG from './assets/lavatile.jpg';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface RendererElements {
	renderer: THREE.WebGLRenderer,
	scene: THREE.Scene,
	camera: THREE.PerspectiveCamera,
	orbitControls: OrbitControls
};

const textureLoader = new THREE.TextureLoader();

const cloudTexture = textureLoader.load(cloudPNG);
const lavaTexture = textureLoader.load(lavatileJPG);

lavaTexture.colorSpace = THREE.SRGBColorSpace;

cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping;
lavaTexture.wrapS = lavaTexture.wrapT = THREE.RepeatWrapping;

const uniforms = {
	'fogDensity': { value: 0.05 },
	'fogColor': { value: new THREE.Vector3(0, 0, 0) },
	'time': { value: 1.0 },
	'uvScale': { value: new THREE.Vector2(3.0, 1.0) },
	'texture1': { value: cloudTexture },
	'texture2': { value: lavaTexture }
};

const createSphere = (parent: THREE.Group) => {
	const geo = new THREE.SphereGeometry(1, 30, 30);
	const mat = new THREE.MeshBasicMaterial({ color: 'white', wireframe: true });
	const mesh = new THREE.Mesh(geo, mat);
	parent.add(mesh);
	return mesh;
};

const createPlanet = (parent: THREE.Group) => {
	const geo = new THREE.SphereGeometry(1, 30, 30);

	const mat = new THREE.ShaderMaterial({
		uniforms: uniforms,
		vertexShader: vertexShader,
		fragmentShader: fragmentShader
	});
	const mesh = new THREE.Mesh(geo, mat);
	parent.add(mesh);
	return mesh;
};

const THREEScene: FunctionComponent = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null!);
	const updateFunctions: ((time: number) => void)[] = [];

	const clock = new THREE.Clock();

	const render = (props: RendererElements, time: number) => {
		const { renderer, scene, camera, orbitControls } = props;
		orbitControls.update();
		renderer.render(scene, camera);
		updateFunctions.map(update => update(time));

		const delta = 5 * clock.getDelta();
		uniforms['time'].value += 0.15 * delta;
		requestAnimationFrame((time: number) => render(props, time));
	};

	useEffect(() => {
		const scene = new THREE.Scene();
		const renderer = new THREE.WebGLRenderer({
			canvas: canvasRef.current,
			antialias: true
		});
		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

		const orbitControls = new OrbitControls(camera, renderer.domElement);

		orbitControls.autoRotate = true;
		orbitControls.autoRotateSpeed = 2;
		orbitControls.enableDamping = true;

		camera.position.z = 5;
		renderer.setSize(window.innerWidth, window.innerHeight);

		const orbitGroup = new THREE.Group();
		scene.add(orbitGroup);

		//createPlanet(orbitGroup);
		createSphere(orbitGroup);
		const orbiter = createSphere(orbitGroup);
		const orbiter2 = createSphere(orbitGroup);
		const orbiter3 = createSphere(orbitGroup);

		const orbiterScale = 0.15;
		orbiter.scale.set(orbiterScale, orbiterScale, orbiterScale);
		orbiter2.scale.set(orbiterScale / 2, orbiterScale / 2, orbiterScale / 2);
		orbiter3.scale.set(orbiterScale / 3, orbiterScale / 3, orbiterScale / 3);

		updateFunctions.push((time: number) => updateOrbit({ orbiter, time }, {
			semiMajorAxis: 2,
			eccentricity: 0.1,
			inclination: -Math.PI / 2,
			ascendingNode: 0,
			argumentOfPeriapsis: -Math.PI / 2,
			orbitalPeriod: 10
		}));

		updateFunctions.push((time: number) => updateOrbit({ orbiter: orbiter2, time }, {
			semiMajorAxis: 2,
			eccentricity: 0.1,
			inclination: Math.PI / 4,
			ascendingNode: 0,
			argumentOfPeriapsis: Math.PI / 2,
			orbitalPeriod: 8
		}));

		updateFunctions.push((time: number) => updateOrbit({ orbiter: orbiter3, time }, {
			semiMajorAxis: 2,
			eccentricity: 0.1,
			inclination: Math.PI / 4,
			ascendingNode: 0,
			argumentOfPeriapsis: -Math.PI / 4,
			orbitalPeriod: 12
		}));

		requestAnimationFrame((time: number) => render({ renderer, scene, camera, orbitControls }, time));

		window.addEventListener('resize', () => {
			canvasRef.current.width = window.innerWidth;
			canvasRef.current.height = window.innerHeight;
			renderer.setSize(window.innerWidth, window.innerHeight);
		});
	});

	return (
		<canvas ref={canvasRef} />
	)
};