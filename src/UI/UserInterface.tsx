import React, {useRef, useEffect, RefObject, useState} from 'react';
import { Box, Stack } from "@mui/material";
export type UserInterfaceProps = {
    regenerate: (seed: string)=>void,
    changeView: ()=>void,
    orbitCamera: boolean
}

export default function UserInterface(props: UserInterfaceProps) {
    const [coordinates, setCoordinates] = useState('');

    return (
      <div className="absolute top-0 w-full h-full z-50 bg-transparent text-white h-400 underline pointer-events-none [&>*]:pointer-events-auto p-10">
        <div className='float-right flex flex-col space-y-4 w-80'>
            <div className='w-full flex flex-row space-x-2'>
                <input type="text" placeholder="Coordinates" value={coordinates} onChange={(e)=>(setCoordinates(e.currentTarget.value))} className="input input-bordered w-full text-white basis-3/4" />
                <button onClick={()=>props.regenerate(coordinates)} className="btn btn-active btn-accent basis-1/4">Go</button>
            </div>
            <button onClick={()=>props.changeView()} className="btn btn-active btn-error basis-1/4">{props.orbitCamera? 'Ship camera' : 'Orbit camera'}</button>
        </div>
        <div className={`float-left flex flex-col space-y-1 w-80 text-white ${props.orbitCamera && 'invisible'}`}>
            <h1 className='text-2xl'>Controls</h1>
            <p className="text-xl" >shift - accelerate\n</p>
            <p className="text-xl" >w a - pitch</p>
            <p className="text-xl" >a d - yaw</p>
            <p className="text-xl" >e q - roll</p>
            <p className="text-xl" >toggle speed - enter\n</p>
        </div>
      </div>
    );
  }