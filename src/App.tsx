import React from 'react';
import './App.css';
import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber';
import Box from '@mui/material/Box';
import Scene from './Scene';
import { Stats } from '@react-three/drei';

export default function App() {
  return (
    <div id="canvas-container">
      <Box component="div" sx={{ height: '1000px', width: '100%' }}>
        <Canvas shadows gl={{ logarithmicDepthBuffer: true, antialias: true }} camera={{ position: [0, 0, 200] , far: 1000000}}>
          <Scene/>
          <Stats/>
        </Canvas>
      </Box>
    </div>
  );
}

// @ts-ignore
createRoot(document.getElementById('root')).render(<App />)