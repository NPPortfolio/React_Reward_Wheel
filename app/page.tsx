'use client'

import Image from "next/image";
import {CSSProperties, useState} from 'react'
import './globals.css'

function MyButton() {
  return (
    <button>
      HELLO SIR
    </button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
      <Reward_Segment />
    </div>
  );
}



function Reward_Segment(){
  
  const [color, set_color] = useState('purple');
  const [percentage, set_percentage] = useState(99);


  return (
   <div style = {Reward_Segment_style(color, percentage)}>

    </div>
  )
}

const Reward_Segment_style = (color : string, percentage : number): CSSProperties => {
  
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

    console.log(x_value)
    console.log(y_value)
    console.log(x_string)
    console.log(y_string)

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

  console.log(clip_path_string)

  return {
    position : 'absolute',
    width : '80%',
    height : '80%',
    borderRadius : "50%",
    backgroundColor : color,
    clipPath : clip_path_string,
  }
}

/*
export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}*/
