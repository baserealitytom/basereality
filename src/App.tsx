import './App.css';
import React, { FunctionComponent, useEffect, useState, useRef } from 'react';
import * as THREE from 'three';

interface THREEProps {

}

const createBox = (scene: THREE.Scene) => {
	const geo = new THREE.BoxGeometry(1, 1, 1);
	const mat = new THREE.MeshBasicMaterial({ color: 'white' });
	const mesh = new THREE.Mesh(geo, mat);
	mesh.scale.set(10, 10, 10);
	scene.add(mesh);
	renderedMeshes.push(mesh);
	return mesh;
};

const renderedMeshes: THREE.Mesh[] = [];

const THREEScene: FunctionComponent<THREEProps> = (props) => {
	const canvasRef = useRef<HTMLCanvasElement>(null!);

	const render = (renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera) => {
		renderer.render(scene, camera);
		requestAnimationFrame(() => render(renderer, scene, camera));
	};

	useEffect(() => {
		const scene = new THREE.Scene();
		const renderer = new THREE.WebGLRenderer({
			canvas: canvasRef.current,
			antialias: false
		});
		const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
		renderer.setSize(window.innerWidth, window.innerHeight);
		createBox(scene);
		requestAnimationFrame(() => render(renderer, scene, camera));
	});

	return (
		<canvas ref={canvasRef} width={'100%'} height={'100%'} />
	)
};

const App = () => {
	return (
		<THREEScene />
	)
};

export default App;