import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { useRouter } from "next/router";

export default function Login(){
  const [email,setEmail]=useState(""); const [pass,setPass]=useState(""); const [msg,setMsg]=useState("");
  const router=useRouter();
  const onSubmit=async(e)=>{
    e.preventDefault(); setMsg("Memproses...");
    try{
      const cred=await signInWithEmailAndPassword(auth,email,pass);
      const uid=cred.user.uid; const snap=await getDoc(doc(db,"users",uid));
      if(!snap.exists()){ setMsg("Data user belum ada di Firestore"); return; }
      const role=snap.data().role||"warga";
      router.push(role==="admin"?"/admin/dashboard":"/warga/dashboard");
    }catch(err){ setMsg(err.message); }
  };
  return (<div className="card" style={{maxWidth:380,margin:"20px auto"}}>
    <h2>Masuk</h2>
    <form onSubmit={onSubmit}>
      <input className="input" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <input className="input" style={{marginTop:8}} placeholder="Password" type="password" value={pass} onChange={e=>setPass(e.target.value)} required />
      <button className="btn" style={{marginTop:12}} type="submit">Masuk</button>
    </form><p>{msg}</p></div>);
}
