import './App.css'
import { FunctionComponent, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

const THREEScene: FunctionComponent = () => {
	const meshRef = useRef<THREE.Mesh>(null!);

	useFrame((state, delta) => (meshRef.current.rotation.x += delta));
	return (
		<>
			<ambientLight />
			<mesh ref={meshRef}>
				<boxGeometry args={[1, 1, 1]} />
				<meshStandardMaterial color={'white'} />
			</mesh>
		</>
	)
};

function App() {

	return (
		<Canvas>
			<THREEScene />
		</Canvas>
	)
}

export default App
