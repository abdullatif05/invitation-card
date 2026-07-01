import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from 'framer-motion';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface ModelNodeProps {
  modelUrl?: string;
}

export default function ModelNode({ modelUrl }: ModelNodeProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Use framer-motion's useScroll to track scroll progress
  const { scrollYProgress } = useScroll();

  // Load the GLTF model (or fallback to null if no URL is provided)
  const gltf = modelUrl ? useGLTF(modelUrl) : null;

  useFrame((_state, delta) => {
    if (groupRef.current) {
      // Get the current scroll progress (0 to 1)
      const progress = scrollYProgress.get();
      
      // Map progress to rotation (e.g., 0 to 2 PI for a full spin, or more)
      // We use MathUtils.damp to smoothly interpolate to the target rotation
      // Let's do 1 full rotation per page scroll
      const targetRotationY = progress * Math.PI * 2; 
      
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        targetRotationY,
        4, // lambda/speed of damping
        delta
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {gltf ? (
        <primitive object={gltf.scene} scale={2} />
      ) : (
        // Solid placeholder so it's easily visible
        <mesh position={[0, 1, 0]}>
          <capsuleGeometry args={[0.5, 1, 4, 16]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.3} metalness={0.8} />
        </mesh>
      )}
    </group>
  );
}
