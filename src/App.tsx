import React from 'react';
import logo from './logo.svg';
import './App.css';
import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { ColorRepresentation } from 'three';
import Box from '@mui/material/Box';
import StarSystem from './system-objects/StarSystem';

export default function App() {
  return (
    <div id="canvas-container">
      <Box component="div" sx={{ height: '1000px', width: '100%' }}>
        <Canvas camera={{ position: [0, 0, 200] }}>
          <color attach="background" args={["black" as ColorRepresentation]} />
          <OrbitControls/>
          <ambientLight intensity={0} />
          <StarSystem time={3} seed={3}/>
        </Canvas>
      </Box>
    </div>
  );
}

// @ts-ignore
createRoot(document.getElementById('root')).render(<App />)