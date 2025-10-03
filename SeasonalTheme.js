import { useEffect } from "react";
export default function SeasonalTheme(){
  useEffect(()=>{
    const html=document.documentElement;
    html.classList.remove("theme-xmas","theme-newyear","theme-imlek","theme-ramadhan","theme-idulfitri","theme-independence");
    const t=new Date(); const m=t.getMonth()+1, d=t.getDate();
    if(m===8 && d>=10 && d<=20) html.classList.add("theme-independence");
    if(m===12 && d>=20 && d<=26) html.classList.add("theme-xmas");
    if((m===12 && d===31)||(m===1 && d<=2)) html.classList.add("theme-newyear");
    const imlekDate=new Date(2026,1,17); if(Math.abs(t - imlekDate)/86400000<=7) html.classList.add("theme-imlek");
    const ramadhanStart=new Date(2026,1,18);
    if(t>=new Date(ramadhanStart.getTime()-7*86400000)&&t<=new Date(ramadhanStart.getTime()+7*86400000)) html.classList.add("theme-ramadhan");
    const fitriDate=new Date(2026,2,20); if(Math.abs(t - fitriDate)/86400000<=7) html.classList.add("theme-idulfitri");
  },[]);
  return null;
}
