import React, { useState } from 'react';
import './App.css';
import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber';
import Box from '@mui/material/Box';
import Scene from './Scene';
import { Stats } from '@react-three/drei';
import { Effect } from './helpers/PostProcessingComponent';

export default function App() {
  const [key, setKey] = useState(0);
  const [seed, setSeed] = useState('Ezra Bartlett');


  function randomSeed(length: number) {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
      return result;
  }

  const resetScene = () => {
    setKey(prevKey => prevKey + 1);
  };

  window.addEventListener("keyup", (event) => {
    if( event.code === 'KeyR') {
        setSeed(randomSeed(10))
        resetScene()
    }
})
  
  return (
    <div id="canvas-container">
      <Box component="div" sx={{ height: '1000px', width: '100%' }}>
        <Canvas dpr={window.devicePixelRatio * 2} key={key} gl={{ logarithmicDepthBuffer: true, antialias: true }} camera={{ position: [0, 0, 200] , far: 10000000}}>
          <Scene seed={seed}/>
          <Stats/>
          {/*<Effect />*/}
        </Canvas>
      </Box>
    </div>
  );
}

// @ts-ignore
createRoot(document.getElementById('root')).render(<App />)