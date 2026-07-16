'use client'

import Image from "next/image";
import {CSSProperties, useState, useRef, useEffect} from 'react'
import './globals.css'
import './Vector2'
import { Vector2 } from "./Vector2";


export default function MyApp() {

  const [segments, setSegments] = useState<RewardSegment[]>([
    //{id : 0, color : 'blue', percentage : 33, percentage_offset : 0},
  ])

  // 1. Define your initialization function
  const initFunction = () => {
    randomizeSegments(5, 5)
  };

  const randomizeSegments = (numSegments : number, minimumSegmentPercentage : number) => {
    // TODO? check that numSegments * minimumSegmentPercentage !> 100
    let percentageLeft = 100 - (minimumSegmentPercentage * numSegments)
    
    // In React, setting state does not happen immediately because state updates act as scheduled requests rather than instant commands, and the current execution block reads from a fixed snapshot of your component
    // ^ should use arrays made in scope instead
    let temp = Array.from({ length: numSegments }, (_, i) => new RewardSegment(i, randomHexColor(), minimumSegmentPercentage, i));
    // This is going to be very uniform, probably want better way to do it
    while (percentageLeft > 0) {
      temp[randomNumberRangeInclusive(0, numSegments-1)].percentage += 1
      percentageLeft -= 1;
    }

    let running_percentage_offset = 0
    for (let i = 0; i < temp.length; i += 1) {
      temp[i].percentage_offset = running_percentage_offset
      running_percentage_offset += temp[i].percentage
    }

    setSegments(temp);
  }

  // 2. Run it once on load
  useEffect(() => {
    initFunction();
  }, []); // <-- Empty array ensures this only runs once

  const addRandomSegment = () => {
    /*
    let segment_percentage = 100
    if (segments.length != 0) {
      segment_percentage = 100/(segments.length+1)
    }
    addSegment(randomHexColor(), segment_percentage, randomNumberRangeInclusive(0, 360))
    */
  }

  const addSegment = (color : string, percentage : number, percentage_offset : number) => {
    const newSegment = {
      id : Date.now(),
      color : color,
      percentage : percentage,
      percentage_offset : percentage_offset,
    }
    setSegments([...segments, newSegment])
  }

  const deleteSegment = (id : number) => {
    setSegments(segments.filter(segment => segment.id !== id))
  }

  // React can't update individual things in an array because it won't trigger a re-render? Need to remake the entire array
  const updateSegmentAtIndex = (index : number, newSegment : RewardSegment) => {
    setSegments((segments) => 
      segments.map((segment, i) => (i === index ? newSegment : segment))
    );
  };

  /*const handleMouseMove = () => {
    let newSegment = segments[0]
    newSegment.percentage += 2
    newSegment.percentage_offset += 1
    newSegment.percentage %= 100
    newSegment.percentage_offset %= 100
    updateSegmentAtIndex(0, newSegment)
  }*/

  

  return (
    <div 
      style = {{
        display : "flex",
        width : '100vw',
        height : '100vh',
        justifyContent : 'center',
        //height : '100%',
        //width : '100%',
        flexDirection : "row",
        backgroundColor : "blue",
        gap : 32,
        overflowX : 'hidden',
        overflowY : 'hidden',
      }}>
      <Reward_Wheel segments = {segments} />
      <RewardList segments = {segments}/>
    </div>
  );
}

function RewardList({segments} : RewardSegmentProps){

  return (
    <div
    style = {{
      backgroundColor : 'pink',
      flex : '1 1 0',
      minWidth : 0,
      minHeight : 0,
      display : 'flex',
      flexDirection : 'column',
      justifyContent : 'center',
      padding : '8px',
      //alignItems : 'center',
      gap : 16,
      //height : '100%',
      //width : '100%',
      //width : '90vmin',
      //height : '90vmin',
    }}
    >
    {
      segments.map((segment) => (
        <RewardListElement
          key = {segment.id}
          id = {segment.id}
          color = {segment.color}
          percentage = {segment.percentage}
        />
      ))
    }

    </div>
  )
}

class RewardListElementProps {
  id : number;
  color : string;
  percentage : number;

  constructor(id : number, color : string, percentage : number) {
    this.id = id
    this.color = color
    this.percentage = percentage
  }
}
function RewardListElement({color, percentage} : RewardListElementProps) {

    return (
      <div
        style = {{
          backgroundColor : color,
          borderRadius : '100vmin',
          flexGrow : 1,
          flexShrink : 1,
          flexBasis : 'auto',
          minHeight : 0,
          minWidth : 0,
          justifyContent : 'flex-start',
          alignItems : 'stretch',
          //padding : '2%',
          display : 'flex'
        }}
      >
        <div
          style = {{
            borderRadius : '100vmin',
            backgroundColor : "white",

            flexGrow : 0,
            flexShrink : 1,
            flexBasis : 'auto',
            minWidth : 0,
            minHeight : 0,
            //marginRight : 'auto',
            //maxWidth : '0%',
            maxHeight : '110%',
            //alignSelf : 'center',
            aspectRatio : 1/1,


            display : 'flex',
            justifyContent : 'center',
            alignItems : 'center',

            containerType : 'inline-size',
          }}
        >
          <p style = {{
            fontFamily : "'Brush Script MT', 'Brush Script Std', cursive",
            fontSize : '80cqw',
          }}
          >
            {percentage}
          </p>
        </div>
      </div>
    )
}

// NOTE: some data for a reward segment on the wheel wouldn't be used for the list and vice versa, but can combine all data into one for simplicity
class RewardSegment {
  id : number;
  color : string;
  percentage : number;
  percentage_offset : number;

  constructor(id: number, color: string, percentage : number, percentage_offset : number) {
    this.id = id;
    this.color = color;
    this.percentage = percentage;
    this.percentage_offset = percentage_offset;
  }
}
interface RewardSegmentProps {
  segments : RewardSegment[],
}
function Reward_Wheel({segments} : RewardSegmentProps){
   
  const [rotation, setRotation] = useState(0.0)
  const [velocity, setVelocity] = useState(20.0)
  const [mouseDown, setMouseDown] = useState(false)
  
  const velocityRef = useRef(velocity)
  useEffect(() => {
    velocityRef.current = velocity;
  }, [velocity])

  const mouseDownRef = useRef(mouseDown)
  useEffect(() => {
    mouseDownRef.current = mouseDown;
  }, [mouseDown])

  useEffect(() => {
    animateSpin()    
  }, []);

  const animateSpin = () => {
    
    let animationFrameID : number

    const animate = () => {
      if (mouseDownRef.current) {
        cancelAnimationFrame(animationFrameID)
        return
      }
      if (Math.abs(velocityRef.current) < 0.01) {
        // TODO pop up winner
        cancelAnimationFrame(animationFrameID)
        return
      }
      const newVelocity = velocityRef.current * 0.97
      velocityRef.current = newVelocity
      
      setVelocity(newVelocity)
      setRotation((prevRotation) => prevRotation + newVelocity)
      
      animationFrameID = requestAnimationFrame(animate)
    }

    animationFrameID = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrameID)
  }

  const handleMouseDown = () => {
    setMouseDown(true)
  }

  const handleMouseUp = () => {
    setMouseDown(false)
    animateSpin()
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (mouseDown) {

      const rect = event.currentTarget.getBoundingClientRect();
      const center = new Vector2(rect.left + rect.width / 2, rect.top + rect.height / 2)

      const delta = new Vector2(event.clientX - center.x, event.clientY - center.y)
      const clockwiseTangent = new Vector2(-delta.y, delta.x).normalize()
      const mouseMovement = new Vector2(event.movementX, event.movementY)

      const dot = mouseMovement.dot(clockwiseTangent)

      //console.log("Delta: ", delta)
      //console.log("Tangent: ", clockwiseTangent);
      //console.log("Mouse movement: ", mouseMovement)
      //velocityRef.current = dot
      setVelocity(dot)
      //console.log(velocity)
      setRotation(rotation+dot)
    }
  }

  const handleMouseLeave = () => {
    setMouseDown(false)
  }

  return (
    <div 
      onMouseMove = {handleMouseMove}
      onMouseDown = {handleMouseDown}
      onMouseUp = {handleMouseUp}
      onMouseLeave = {handleMouseLeave}
      style = {{
        rotate : String(rotation) + "deg",
        flex : '0 0 auto',
        //backgroundColor : 'purple',
        height : '100%',
        aspectRatio : '1',
        //alignSelf : 'flex-start'
        //width : '100%',
        //width : '90vmin',
        //height : '90vmin'
      }}>
      {
        segments.map((segment) => (
          <Reward_Segment
            key = {segment.id}
            // TODO: how to get rid of this duplicate key and id?
            id = {segment.id}
            color = {segment.color}
            //_color = 'red'
            //_percentage = segment.percentage,
            percentage = {segment.percentage}
            percentage_offset = {segment.percentage_offset}
          />
        ))
      }
    </div>
  )
}

function Reward_Segment({color, percentage, percentage_offset} : RewardSegment){
  
  //const [_color, set_color] = useState(_color);
  //const [_percentage, set_percentage] = useState(_percentage);
  //const [rotation, set_rotation] = useState(0);

  //const handleMouseMove = () => {
    //console.log("MOUSE MOVED")
    //set_rotation(rotation+1)
  //}

  return (
    <div
      //onMouseMove = {handleMouseMove}
      style = {Reward_Segment_style(color, percentage, percentage_offset)}>
    </div>
  )
}

const Reward_Segment_style = (color : string, percentage : number, percentage_offset : number): CSSProperties => {
  
  //console.log(percentage, " ", percentage_offset)
  let clip_path_string : string = "polygon(50% 50%, "
  
  let p1 = Reward_Segment_polygon_coordinates_from_rotation_percentage(percentage_offset)
  let p2 = Reward_Segment_polygon_coordinates_from_rotation_percentage(percentage_offset + percentage)

  clip_path_string += String(p1.x) + "% " + String(p1.y) + "%, "

  // maybe put up the diagram I made to figure this out
  // also could clean up with a for loop but this might be easier to understand along with the diagram
  // 0.707... * 1.5 > 1, so the polygon wont clip when it goes to the next point, thats why all corners have scale value of 1.5 
  let corner1 = Reward_Segment_polygon_coordinates_from_rotation_percentage(percentage_offset + 12.5, 1.5)
  clip_path_string += String(corner1.x) + "% " + String(corner1.y) + "%, "
  if (percentage > 25) {
    let corner2 = Reward_Segment_polygon_coordinates_from_rotation_percentage(percentage_offset + 12.5 + 25, 1.5)
    clip_path_string += String(corner2.x) + "% " + String(corner2.y) + "%, "
    if (percentage > 50) {
      let corner3 = Reward_Segment_polygon_coordinates_from_rotation_percentage(percentage_offset + 12.5 + 50, 1.5)
      clip_path_string += String(corner3.x) + "% " + String(corner3.y) + "%, "
      if (percentage > 75) {
        let corner4 = Reward_Segment_polygon_coordinates_from_rotation_percentage(percentage_offset + 12.5 + 75, 1.5)
        clip_path_string += String(corner4.x) + "% " + String(corner4.y) + "%, "
      }
    }
  }

  clip_path_string += String(p2.x) + "% " + String(p2.y) + "%"
  clip_path_string += ")"

  return {
    position : 'absolute',
    width : '100%',
    height : '100%',
    borderRadius : "50%",
    backgroundColor : color,
    clipPath : clip_path_string,
  }

  /*
  const corners: Vector2[] = [
    new Vector2(100, 0),
    new Vector2(100, 100),
    new Vector2(0, 100),
    new Vector2(0, 0),
  ]

  let start_index = (percentage_offset % 100) % 25
  let end_index = ((percentage_offset+percentage) % 100) % 25

  const total_length = corners.length;
  const iterations = start_index <= end_index 
  ? end_index - start_index + 1 
  : (total_length - start_index) + (end_index + 1);

  for (let step = 0; step < iterations; step++) {
    const current_index = (start_index + step) % total_length;
    let corner = corners[current_index];
    clip_path_string += String(corner.x) + "% " + String(corner.y) + "%, "
  }*/

  /*
  let clip_path_string : string = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
  if (percentage < 100) {
    clip_path_string = "polygon(0% 0%, 50% 0%, 50% 50%, "

    // 0.707... * 1.5 > 1, so the polygon wont clip when it goes to the next corner
    let x_value = 1.5 * 50 * -Math.sin(percentage/100 * (2 * Math.PI))
    let y_value = 1.5 * 50 * -Math.cos(percentage/100 * (2 * Math.PI))

    let x_string = String(x_value + 50)
    let y_string = String(y_value + 50)

    clip_path_string += x_string + "% " + y_string + "%"

    //console.log(x_value)
    //console.log(y_value)
    //console.log(x_string)
    //console.log(y_string)

    if (percentage > 87) {
      clip_path_string += ", 100% 0%"
    }

    if (percentage > 62) {
      clip_path_string += ", 100% 100%"
    }
  
    if (percentage > 37) {
      clip_path_string += ", 0% 100%"
    }

    clip_path_string += ")"
  }

  return {
    rotate : String(rotation) + 'deg',
    position : 'absolute',
    width : '90vmin',
    height : '90vmin',
    borderRadius : "50%",
    backgroundColor : color,
    clipPath : clip_path_string,
  }*/
}

const Reward_Segment_polygon_coordinates_from_rotation_percentage = (percentage : number, scaleValue : number = 1): Vector2 => {
  // 0.707... * 1.5 > 1, so the polygon wont clip when it goes to the next corner
  //console.log(Math.sin(percentage/100 * (2 * Math.PI)))
  //console.log(Math.cos(percentage/100 * (2 * Math.PI)))
  
  //let x_value = 1.5 * 50 * Math.sin(percentage/100 * (2 * Math.PI))
  //let y_value = 1.5 * 50 * -Math.cos(percentage/100 * (2 * Math.PI))
  
  let x_value = scaleValue * 50 * Math.sin(percentage/100 * (2 * Math.PI))
  let y_value = scaleValue * 50 * -Math.cos(percentage/100 * (2 * Math.PI))

  return new Vector2(x_value + 50, y_value + 50)

  //let x_string = String(x_value + 50)
  //let y_string = String(y_value + 50)

  //console.log(percentage, ": ", x_string, " ", y_string)

  //return x_string + "% " + y_string + "%"
}



// misc functions
const randomHexColor = (): string => {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0')}`;
};

function randomNumberRangeInclusive(min : number, max : number): number {
  const minCeil = Math.ceil(min);
  const maxFloor = Math.floor(max);
  
  return Math.floor(Math.random() * (maxFloor - minCeil + 1)) + minCeil;
}



/*

Advanced: Pausing, Resuming, or Resetting TimersIf you need a dynamic interval (e.g., a stopwatch with start, pause, and stop buttons), map a boolean status variable directly to your dependency array. React automatically executes the cleanup function to wipe out the old interval before starting a fresh one.jsximport { useState, useEffect } from 'react';

function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let intervalId;

    if (isActive) {
      intervalId = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    // Clears the interval immediately when isActive changes or unmounts
    return () => clearInterval(intervalId);
  }, [isActive]); 

  return (
    <div>
      <h1>Time: {seconds}s</h1>
      <button onClick={() => setIsActive(!isActive)}>
        {isActive ? 'Pause' : 'Start'}
      </button>
      <button onClick={() => { setIsActive(false); setSeconds(0); }}>
        Reset
      </button>
    </div>
  );
}
  */