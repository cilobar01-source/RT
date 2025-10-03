import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../lib/firebase";
export default function LupaPassword(){
  const [email,setEmail]=useState(""); const [msg,setMsg]=useState("");
  const onSubmit=async(e)=>{ e.preventDefault();
    try{ await sendPasswordResetEmail(auth,email); setMsg("Email reset terkirim."); }
    catch(err){ setMsg(err.message); }
  };
  return (<div className="card" style={{maxWidth:380,margin:"20px auto"}}>
    <h2>Lupa Password</h2>
    <form onSubmit={onSubmit}>
      <input className="input" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <button className="btn" style={{marginTop:12}} type="submit">Kirim Link Reset</button>
    </form><p>{msg}</p></div>);
}
