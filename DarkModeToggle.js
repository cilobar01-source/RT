import { useEffect, useState } from "react";
export default function DarkModeToggle(){
  const [dark,setDark]=useState(false);
  useEffect(()=>{
    const saved=typeof window!=="undefined" && localStorage.getItem("theme")==="dark";
    setDark(saved); if(typeof document!=="undefined"){ document.documentElement.classList.toggle("dark", saved); }
  },[]);
  useEffect(()=>{
    if(typeof document!=="undefined"){ document.documentElement.classList.toggle("dark", dark); }
    if(typeof window!=="undefined"){ localStorage.setItem("theme", dark?"dark":"light"); }
  },[dark]);
  return <button className="btn" onClick={()=>setDark(!dark)}>{dark?"☀️":"🌙"}</button>;
}
