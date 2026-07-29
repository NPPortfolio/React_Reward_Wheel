'use client'

import Image from "next/image";
import React, {CSSProperties, useState, useRef, useEffect} from 'react'
import './globals.css'
import './Vector2'
import { Vector2 } from "./Vector2";

export default function Root() {

  const [segments, setSegments] = useState<RewardSegment[]>([
    {id : 0, color : 'red', percentage : 40, percentage_offset : 0},
    {id : 1, color : 'green', percentage : 30, percentage_offset : 40},
    {id : 2, color : 'blue', percentage : 15, percentage_offset : 70},
    {id : 3, color : 'yellow', percentage : 10, percentage_offset : 85},
    {id : 4, color : 'white', percentage : 5, percentage_offset : 95},
  ])

  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0)

  const initFunction = () => {
    //randomizeSegments(5, 5)
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
      // DEBUG
      // temp[i].color = 'rgba(' + (i/numSegments) * 255 + ', 0, 0, 255)'
      // console.log(temp[i].color)
    }

    setSegments(temp);
  }

  useEffect(() => {
    initFunction();
  }, []);

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

  return (
    <div
      className="mainBackgroundStyle"
      style = {{
        display : "flex",
        width : '100vw',
        height : '100vh',
        justifyContent : 'center',
        //height : '100%',
        //width : '100%',
        flexDirection : "row",
        gap : 32,
        overflowX : 'hidden',
        overflowY : 'hidden',
      }}>
      <RewardWheel segments = {segments} currentSegmentIndex={currentSegmentIndex} setCurrentSegmentIndex={setCurrentSegmentIndex}/>
      <RewardList segments = {segments} currentSegmentIndex={currentSegmentIndex} setCurrentSegmentIndex={setCurrentSegmentIndex}/>
    </div>
  );
}

function RewardList({segments, currentSegmentIndex} : RewardSegmentProps){

  return (
    <div
    style = {{
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
      segments.toReversed().map((segment) => (
        <RewardListElement
          key = {segment.id}
          id = {segment.id}
          color = {segment.color}
          className = {segment.id === currentSegmentIndex ? 'rewardListElementStyleActive' : 'rewardListElementStyleBase'}
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
  className : string;
  percentage : number;

  constructor(id : number, color : string, className : string, percentage : number) {
    this.id = id
    this.color = color
    this.className = className
    this.percentage = percentage
  }
}
function RewardListElement({color, percentage, className} : RewardListElementProps) {

    return (
      <div
        className = {className}
        style = {{
          '--background-color' : color,
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
        } as React.CSSProperties}
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
            //maxHeight : '110%',
            //alignSelf : 'center',
            aspectRatio : 1/1,


            display : 'flex',
            justifyContent : 'center',
            alignItems : 'center',

            containerType : 'inline-size',
          }}
        >
          <div style = {{
            fontFamily : "'Brush Script MT', 'Brush Script Std', cursive, Arial",
            fontSize : '80cqw',
          }}
          >
            {percentage}
          </div>
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
  currentSegmentIndex : number,
  setCurrentSegmentIndex : React.Dispatch<React.SetStateAction<number>>,
}
function RewardWheel({segments, currentSegmentIndex, setCurrentSegmentIndex} : RewardSegmentProps){
  
  const [rotation, setRotation] = useState(3.0)
  const [velocity, setVelocity] = useState(0.0)
  const [mouseDown, setMouseDown] = useState(false)
  
  const [releasedRotation, setReleasedRotation] = useState(0)
  const [numberOfSpins, setNumberOfSpins] = useState(0)
  
  // using this to track if the mouse is still
  const lastMousePos = useRef({x : 0, y : 0, time : Date.now()})
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const rotationRef = useRef(rotation)
  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation])

  const velocityRef = useRef(velocity)
  useEffect(() => {
    velocityRef.current = velocity;
  }, [velocity])

  const mouseDownRef = useRef(mouseDown)
  useEffect(() => {
    mouseDownRef.current = mouseDown;
  }, [mouseDown])

  const releasedRotationRef = useRef(releasedRotation)
  useEffect(() => {
    releasedRotationRef.current = releasedRotation;
  }, [releasedRotation])

  const numberOfSpinsRef = useRef(numberOfSpins)
  useEffect(() => {
    numberOfSpinsRef.current = numberOfSpins;
  }, [numberOfSpins])
  
  /* the parent segment state isnt set at this point, so just have a static rotation with the currentSegmentIndex of 0
  useEffect(() => {
    animateSpin()    
  }, []);
  */

  const applyRotation = (delta : number) => {
    let newRotation = rotationRef.current + delta

    let spinCompleted : Boolean = false

    if (!mouseDownRef.current && (isBetween(releasedRotationRef.current, rotationRef.current, newRotation, false))) {
      spinCompleted = true
    }

    // could minus and add 100 but maybe somehow one frame will put the rotation at -200 or less
    // also, in that case it wouldn't count as two spins completed only one
    if (newRotation < 0) {
      if (newRotation < -100) {
        newRotation %= 100
      }
      newRotation = 100 + newRotation
    } else {
      if (newRotation >= 100) {
        newRotation %= 100
        // need an additional check here because the rotation is always positive, maybe better way to do it
        if (!mouseDownRef.current && (isBetween(releasedRotationRef.current, rotationRef.current, newRotation-100, false))) {
          spinCompleted = true
        }
      }
    }

    if (spinCompleted) {
      //console.log(rotationRef.current, releasedRotationRef.current, newRotation)
      numberOfSpinsRef.current += 1
      setNumberOfSpins(numberOfSpinsRef.current)
    }

    rotationRef.current = newRotation
    setRotation(newRotation)

    // optimization here to not iterate through the array every frame, maybe store rotation and left and right distance to next segment
    // TODO: could check if a segment is passed over so it still lights up in the list while spinning
    for (let i = 0; i < segments.length; i += 1) {
      if ((rotationRef.current > segments[i].percentage_offset) && (rotationRef.current < segments[i].percentage_offset + segments[i].percentage)) {
        setCurrentSegmentIndex(i)
      }
    }
  }

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

      applyRotation(newVelocity)

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
    releasedRotationRef.current = rotationRef.current
    setReleasedRotation(rotationRef.current)
    numberOfSpinsRef.current = 0;
    setNumberOfSpins(0)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    animateSpin()
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (mouseDown) {
      
      // mouse move timeout
      const currentTime = Date.now()
      const timeDelta = currentTime - lastMousePos.current.time;
      lastMousePos.current = {x : event.clientX, y : event.clientY, time : currentTime}
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        setVelocity(0)
      }, 100);

      const rect = event.currentTarget.getBoundingClientRect();
      const center = new Vector2(rect.left + rect.width / 2, rect.top + rect.height / 2)

      const delta = new Vector2(event.clientX - center.x, event.clientY - center.y)
      const clockwiseTangent = new Vector2(-delta.y, delta.x).normalize()
      const mouseMovement = new Vector2(event.movementX, event.movementY)

      const dot = mouseMovement.dot(clockwiseTangent)
      let rotationDelta = -dot * 0.3

      setVelocity(rotationDelta)
      applyRotation(rotationDelta)
    }
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setMouseDown(false)
  }

  return (
    <div
      style = {{
        position : 'relative',
        //backgroundColor : 'green',
        padding : '3%',
        filter : 'drop-shadow(0px 0px 20px rgba(0, 0, 0, 1))',
      }}
    >
      <div
        style = {{
          position : 'absolute',
          background : 'linear-gradient(180deg,rgba(131, 58, 180, 1) 0%, rgba(253, 29, 29, 1) 50%, rgba(252, 176, 69, 1) 100%)',
          width : '5%',
          height : '10%',
          left : '50%',
          transform: 'translate(-50%, -50%)',
          zIndex : '1',
          clipPath : 'polygon(0% 0%, 50% 100%, 100% 0%)',
        }}>
      </div>
      <ValidIndicator numberOfSpins={numberOfSpins}/>
      <div 
        onMouseMove = {handleMouseMove}
        onMouseDown = {handleMouseDown}
        onMouseUp = {handleMouseUp}
        onMouseLeave = {handleMouseLeave}
        style = {{
          rotate : "-" + String(rotation * 3.6) + "deg",
          flex : '0 0 auto',
          //backgroundColor : 'purple',
          height : '100%',
          aspectRatio : '1',
          //alignSelf : 'flex-start'
          //width : '100%',
          //width : '90vmin',
          //height : '90vmin'
          //filter : 'drop-shadow(0px 0px 20px rgba(0.0, 0.0, 0.0, 1.0))',
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

function ValidIndicator({numberOfSpins} : {numberOfSpins : number}) {
  return (
    <div
      className="vaildIndicatorStyle"
      style = {{
        borderRadius : '100vmin',

        position : 'absolute',
        width : '20%',
        maxWidth : '20%',
        height : '10%',
        maxHeight : '10%',
        left : '2%',
        bottom : '2%',

        display : 'flex',
        alignItems : 'center',
        justifyContent : 'center',

        containerType : 'inline-size',

        '--valid-percentage' : numberOfSpins/5 * 100,
      } as React.CSSProperties}
    >
      <div style = {{
        fontFamily : "'Brush Script MT', 'Brush Script Std', cursive, Arial",
        fontSize : '30cqw',
      }}>
        VALID
      </div>
    </div>
  )
}

/*
  old code, attempting to change the color of individual letters
  <div
  style = {{
    color : 'red',
    backgroundColor : 'white',
    textAlign : 'right',
    flexGrow : 1,
    flexShrink : 1,
    minWidth : 0,
    minHeight : 0,

    containerType : 'inline-size',
  }}
  >
    <div style = {{
      fontSize : '60cqw',
    }}>
    {"VALID".substring(0, 0)}
    </div>
  </div>
  <div
  style = {{
    color : 'white',
    backgroundColor : 'red',
    flexGrow : 1,
    flexShrink : 1,
    minWidth : 0,
    minHeight : 0,

    containerType : 'inline-size',
  }}
  >
    <div style = {{
      fontSize : '60cqw',
    }}>
    {"VALID".substring(0, 5)}
    </div>
  </div>

*/


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

function isBetween(num: number, a: number, b: number, inclusive: boolean = true): boolean {
  return inclusive 
    ? num >= Math.min(a, b) && num <= Math.max(a, b) 
    : num > Math.min(a, b) && num < Math.max(a, b);
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