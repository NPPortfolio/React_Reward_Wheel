'use client'

import Image from "next/image";
import {CSSProperties, useState} from 'react'
import './globals.css'
import './Vector2'
import { Vector2 } from "./Vector2";

interface RewardSegment {
  id : number,
  color : string,
  percentage : number,
  percentage_offset : number,
}
export default function MyApp() {

  const [segments, setSegments] = useState<RewardSegment[]>([
    {id : 0, color : 'blue', percentage : 33, percentage_offset : 0},
  ])

  const addRandomSegment = () => {
    let segment_percentage = 100
    if (segments.length != 0) {
      segment_percentage = 100/(segments.length+1)
    }
    addSegment(randomHexColor(), segment_percentage, randomNumberRangeInclusive(0, 360))
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

  return (
    <div>
      <button onClick = {addRandomSegment}>ADD RANDOM SEGMENT</button>
      <Reward_Wheel segments = {segments} />
    </div>
  );
}
interface RewardSegmentProps {
  segments : RewardSegment[],
}
function Reward_Wheel({segments} : RewardSegmentProps){
  
  const [rotation, setRotation] = useState(0)
  const [mouseDown, setMouseDown] = useState(false)
  
  const handleMouseDown = () => {
    setMouseDown(true)
  }

  const handleMouseUp = () => {
    setMouseDown(false)
  }

  const handleMouseMove = () => {
    //console.log("MOUSE MOVED")
    if (mouseDown) {
      setRotation(rotation+5)
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
        position : 'absolute',
        width : '90vmin',
        height : '90vmin',
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

  clip_path_string += String(p1.x) + "% " + String(p1.y) + "%"
  clip_path_string += ", "

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
  }


  clip_path_string += String(p2.x) + "% " + String(p2.y) + "%"
  clip_path_string += ")"

  console.log(clip_path_string)

  return {
    position : 'absolute',
    width : '90vmin',
    height : '90vmin',
    borderRadius : "50%",
    backgroundColor : color,
    clipPath : clip_path_string,
  }

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

const Reward_Segment_polygon_coordinates_from_rotation_percentage = (percentage : number): Vector2 => {
  // 0.707... * 1.5 > 1, so the polygon wont clip when it goes to the next corner
  //console.log(Math.sin(percentage/100 * (2 * Math.PI)))
  //console.log(Math.cos(percentage/100 * (2 * Math.PI)))
  
  //let x_value = 1.5 * 50 * Math.sin(percentage/100 * (2 * Math.PI))
  //let y_value = 1.5 * 50 * -Math.cos(percentage/100 * (2 * Math.PI))
  
  let x_value = 50 * Math.sin(percentage/100 * (2 * Math.PI))
  let y_value = 50 * -Math.cos(percentage/100 * (2 * Math.PI))

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



