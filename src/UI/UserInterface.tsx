import React, {useRef, useEffect, RefObject, useState} from 'react';
import { Box, Stack } from "@mui/material";
import { TbUfo } from "react-icons/tb";
import { FaPerson } from "react-icons/fa6";
import { BiPlanet } from "react-icons/bi";

export type UserInterfaceProps = {
    regenerate: (seed: string)=>void,
    cameraIndex: number,
    setCameraIndex: Function
}

export default function UserInterface(props: UserInterfaceProps) {
    const [coordinates, setCoordinates] = useState('');

    return (
      <div className="absolute top-0 w-full h-full z-50 bg-transparent text-[#22577a] font-mono h-400 underline pointer-events-none [&>*]:pointer-events-auto p-10">
        <div className='float-right flex flex-col space-y-4 w-80 justify-around'>
            <div className='w-full flex flex-row space-x-2 justify-around'>
                <input type="text" placeholder="Coordinates" value={coordinates} onChange={(e)=>(setCoordinates(e.currentTarget.value))} className="input input-bordered text-white basis-3/4" />
                <button onClick={()=>props.regenerate(coordinates)} className="btn btn-active btn-accent basis-1/4">Go</button>
            </div>
            <div className='w-full flex flex-row space-x-2 justify-around px-2'>
                <button onClick={()=>props.setCameraIndex(0)} className="btn btn-active btn-primary basis-1/3"><BiPlanet className='h-[20px] w-[20px]'/></button>
                <button onClick={()=>props.setCameraIndex(1)} className="btn btn-active btn-error basis-1/3"><TbUfo className='h-[20px] w-[20px]'/></button>
                <button onClick={()=>props.setCameraIndex(2)} className="btn btn-active btn-warning basis-1/3"><FaPerson className='h-[20px] w-[20px]'/></button>
            </div>
        </div>
        <div className={`float-left flex flex-col bg-[#fdf0d5] rounded-lg p-6 space-y-1 w-80 ${props.cameraIndex !== 1 && 'invisible'}`}>
            <h1 className='text-2xl'>Controls</h1>
            <p className="text-xl leading-9" >Accelerate - shift</p>
            <p className="text-xl" >Pitch - w a</p>
            <p className="text-xl" >Yaw - a d</p>
            <p className="text-xl" >Roll - e q</p>
            <p className="text-xl" >enter - toggle speed</p>
        </div>
        <div className={`float-left flex flex-col bg-[#fdf0d5] absolute rounded-lg p-6 leading-2 space-y-1 w-80 justify-items-center ${props.cameraIndex !== 2 && 'invisible'}`}>
            <h1 className='text-2xl leading-9'>Controls</h1>
            <p className="text-xl" >Walk - w a s d</p>
            <p className="text-xl" >Turn - q e</p>
        </div>
      </div>
    );
  }