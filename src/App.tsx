import './App.css'
import { FunctionComponent, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { CloudsShaderMaterial } from './shaders'

interface THREESceneProps {

}

const THREEScene: FunctionComponent<THREESceneProps> = (props) => {
	const meshRef = useRef<THREE.Mesh>(null!);
	//useFrame((state, delta) => (meshRef.current.rotation.x += delta));
	return (
		<mesh>
			<sphereGeometry args={[15, 32, 16]} />
			<CloudsShaderMaterial />
		</mesh>
	)
}

function App() {

	return (
		<Canvas camera={{ fov: 75, position: [0, 0, -30] }} style={{ display: 'block', position: 'absolute', width: '100%', height: '100%' }}>
			<THREEScene />
		</Canvas>
	)
}

export default App
