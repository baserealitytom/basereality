import './App.css';
import React, { FunctionComponent, useEffect, useState, useRef } from 'react';
import ShowreelVideo from './assets/showreel.mp4';
import * as THREE from 'three';

interface THREEProps {

}

const createBox = (scene: THREE.Scene) => {
	const geo = new THREE.BoxGeometry(1, 1, 1);
	const mat = new THREE.MeshBasicMaterial({ color: 'white' });
	const mesh = new THREE.Mesh(geo, mat);
	scene.add(mesh);
	renderedMeshes.push(mesh);
	return mesh;
};

const createSphere = (scene: THREE.Scene) => {
	const geo = new THREE.SphereGeometry(1.5, 50, 50);
	const mat = new THREE.MeshBasicMaterial({ color: 'white' });
	const mesh = new THREE.Mesh(geo, mat);
	scene.add(mesh);
	mesh.position.y = 0;
	renderedMeshes.push(mesh);
	return mesh;
};

const renderedMeshes: THREE.Mesh[] = [];

const THREEScene: FunctionComponent<THREEProps> = (props) => {
	const canvasRef = useRef<HTMLCanvasElement>(null!);

	const render = (renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera) => {
		renderer.render(scene, camera);
		renderedMeshes.forEach(mesh => mesh.rotation.y += 0.1);
		requestAnimationFrame(() => render(renderer, scene, camera));
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

		camera.position.z = 5;
		renderer.setSize(window.innerWidth, window.innerHeight);
		createSphere(scene);
		requestAnimationFrame(() => render(renderer, scene, camera));
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
		<div>
			<Showreel />
			<THREEScene />
		</div>
	)
};

export default App;