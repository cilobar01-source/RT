import { useEffect, useRef } from "react";

function Snow(){
  const ref=useRef(null);
  useEffect(()=>{
    const c=ref.current; if(!c) return; const ctx=c.getContext("2d");
    let w=c.width=window.innerWidth, h=c.height=160;
    const flakes=Array.from({length:80},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*3+1,s:Math.random()+0.5}));
    let raf;
    const draw=()=>{
      ctx.clearRect(0,0,w,h);
      ctx.fillStyle="rgba(255,255,255,0.9)";
      flakes.forEach(f=>{ ctx.beginPath(); ctx.arc(f.x,f.y,f.r,0,Math.PI*2); ctx.fill(); f.y+=f.s; f.x+=Math.sin(f.y/20); if(f.y>h){ f.y=-5; f.x=Math.random()*w; } });
      raf=requestAnimationFrame(draw);
    };
    draw();
    const onResize=()=>{ w=c.width=window.innerWidth; };
    window.addEventListener("resize", onResize);
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  },[]);
  return <canvas ref={ref} className="orn snow" />;
}

function Fireworks(){
  const ref=useRef(null);
  useEffect(()=>{
    const c=ref.current; if(!c) return; const ctx=c.getContext("2d");
    let w=c.width=window.innerWidth, h=c.height=180, t=0, raf;
    const draw=()=>{
      ctx.fillStyle="rgba(0,0,0,0.15)"; ctx.fillRect(0,0,w,h);
      for(let i=0;i<4;i++){ const x=(t*3+i*250)%w; const y=100+50*Math.sin((t+i)/20); ctx.beginPath(); ctx.arc(x,y,2,0,Math.PI*2); ctx.fillStyle="hsl("+((t+i*90)%360)+",100%,60%)"; ctx.fill(); }
      t++; raf=requestAnimationFrame(draw);
    };
    draw();
    const onResize=()=>{ w=c.width=window.innerWidth; };
    window.addEventListener("resize", onResize);
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  },[]);
  return <canvas ref={ref} className="orn fireworks" />;
}

export default function Ornamen(){
  if (typeof document === "undefined") return null;
  const html=document.documentElement;
  return (<>
    {html.classList.contains("theme-xmas") && <Snow/>}
    {html.classList.contains("theme-newyear") && <Fireworks/>}
    {html.classList.contains("theme-imlek") && <div className="orn lanterns" />}
    {html.classList.contains("theme-ramadhan") && <div className="orn lanterns moon" />}
    {html.classList.contains("theme-idulfitri") && <div className="orn ketupat" />}
    {html.classList.contains("theme-independence") && <div className="orn flags" />}
  </>);
}
