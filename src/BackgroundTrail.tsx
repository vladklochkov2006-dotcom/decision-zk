import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

const MouseLight = () => {
    const lightRef = useRef<THREE.PointLight>(null);
    const { viewport, mouse } = useThree();

    useFrame(() => {
        if (!lightRef.current) return;
        const x = (mouse.x * viewport.width) / 2;
        const y = (mouse.y * viewport.height) / 2;
        lightRef.current.position.set(x, y, 5);
    });

    return (
        <pointLight ref={lightRef} distance={15} decay={2} intensity={50} color="#3B82F6" />
    );
};

const BackgroundTrail = () => {
    return (
        <div id="background-layer">
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                <color attach="background" args={['#050505']} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <ambientLight intensity={0.2} />
                <MouseLight />
            </Canvas>
        </div>
    );
};

export default BackgroundTrail;