'use client'

import Image from "next/image";
import {CSSProperties, useState} from 'react'
import './globals.css'

interface RewardSegment {
  id : number,
  color : string,
  percentage : number,
  rotation : number,
}
export default function MyApp() {

  const [segments, setSegments] = useState<RewardSegment[]>([
    {id : 0, color : 'blue', percentage : 50, rotation : 0},
  ])

  const addRandomSegment = () => {
    let segment_percentage = 100
    if (segments.length != 0) {
      segment_percentage = 100/(segments.length+1)
    }
    addSegment(randomHexColor(), segment_percentage, randomNumberRangeInclusive(0, 360))
    console.log(segment_percentage)
  }

  const addSegment = (color : string, percentage : number, rotation : number) => {
    const newSegment = {
      id : Date.now(),
      color : color,
      percentage : percentage,
      rotation : rotation,
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
  return (
    /*<Reward_Segment 
      _color = 'red'
      _percentage = {60}
    />*/

    <div>
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
            rotation = {segment.rotation}
          />
        ))
      }
    </div>
  )
}

function Reward_Segment({color, percentage, rotation} : RewardSegment){
  
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
      style = {Reward_Segment_style(color, percentage, rotation)}>
    </div>
  )
}

const Reward_Segment_style = (color : string, percentage : number, rotation : number): CSSProperties => {
  
  // calcuate the 
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
    position : 'absolute',
    width : '80%',
    height : '80%',
    borderRadius : "50%",
    backgroundColor : color,
    clipPath : clip_path_string,
    rotate : String(rotation) + 'deg',
  }
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