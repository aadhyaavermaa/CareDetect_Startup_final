import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function DoctorModel() {
  const { scene } = useGLTF("/doctor.glb");
  return <primitive object={scene} scale={3.5} />; // Increased scale for bigger avatar
}

export default function DoctorModel3D() {
  return (
    <div
      style={{
        width: 320, // Increased width
        height: 420,
        // borderRadius: "50%", // Removed to prevent cutting
        overflow: "visible",   // Allow avatar to overflow if needed
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        boxShadow: "none",
        border: "none"
      }}
    >
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[2, 2, 2]} intensity={1.5} />
        <Suspense fallback={null}>
          <DoctorModel />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
      </Canvas>
    </div>
  );
} 