import React, { useRef } from 'react';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { ShaderMaterial } from 'three';

extend({ ShaderMaterial });

export const CloudsShaderMaterial: React.FC = () => {
	const materialRef = useRef<ShaderMaterial>(null);

	const { clock } = useThree();

	// Use the useFrame hook to update the shader material
	useFrame(() => {
		const material = materialRef.current;
		if (material) {
			// Update the time uniform to animate the clouds
			material.uniforms.uTime.value = clock.elapsedTime;
		}
	});

	return (
		<shaderMaterial
			ref={materialRef}
			args={[
				{
					uniforms: {
						uTime: { value: 0 },
					},
					vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
					fragmentShader: `
            varying vec2 vUv;
            uniform float uTime;
            void main() {
              // Use noise function to generate cloud-like appearance
              float noise = fract(sin(dot(vUv, vec2(uTime * 0.2, uTime * 0.2))) * 43758.5453);
              float alpha = smoothstep(0.3, 0.5, noise);
              gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
            }
          `,
				},
			]}
		/>
	);
};