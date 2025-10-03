import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { useRouter } from "next/router";

export default function Register(){
  const [nama,setNama]=useState(""); const [alamat,setAlamat]=useState(""); const [wa,setWa]=useState("");
  const [email,setEmail]=useState(""); const [pass,setPass]=useState(""); const [msg,setMsg]=useState("");
  const router=useRouter();
  const onSubmit=async(e)=>{
    e.preventDefault(); setMsg("Mendaftarkan...");
    try{
      const cred=await createUserWithEmailAndPassword(auth,email,pass);
      const uid=cred.user.uid;
      await setDoc(doc(db,"users",uid),{nama,alamat,wa,email,role:"warga",createdAt:serverTimestamp()});
      setMsg("Berhasil! Silakan login."); router.push("/login");
    }catch(err){ setMsg(err.message); }
  };
  return (<div className="card" style={{maxWidth:520,margin:"20px auto"}}>
    <h2>Daftar</h2>
    <form onSubmit={onSubmit}>
      <input className="input" placeholder="Nama" value={nama} onChange={e=>setNama(e.target.value)} required />
      <input className="input" placeholder="Alamat" value={alamat} onChange={e=>setAlamat(e.target.value)} required />
      <input className="input" placeholder="WhatsApp" value={wa} onChange={e=>setWa(e.target.value)} />
      <input className="input" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <input className="input" placeholder="Password" type="password" value={pass} onChange={e=>setPass(e.target.value)} required />
      <button className="btn" style={{marginTop:12}} type="submit">Buat Akun</button>
    </form><p>{msg}</p></div>);
}
