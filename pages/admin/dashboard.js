import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../../lib/firebase";
import { useRouter } from "next/router";

export default function WargaDashboard(){
  const router=useRouter(); const [user,setUser]=useState(null);
  const [tab,setTab]=useState("pengumuman");
  useEffect(()=>{
    const unsub=onAuthStateChanged(auth, (u)=>{ if(!u){ router.push("/login"); return; } setUser(u); });
    return ()=>unsub();
  },[]);
  if(!user) return null;

  return (<div>
    <h1>Panel Warga</h1>
    <p>Login: {user?.email}</p>
    <button className="btn" onClick={()=>signOut(auth).then(()=>location.href='/login')}>Logout</button>

    <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>
      {["pengumuman","agenda","laporan","iuran","umkm"].map(k=>(
        <button key={k} className="btn" onClick={()=>setTab(k)}>{k.toUpperCase()}</button>
      ))}
    </div>

    {tab==="pengumuman" && <List col="pengumuman" render={(it)=>(<li key={it.id}><b>{it.judul}</b> — {it.isi||""}</li>)} />}
    {tab==="agenda" && <List col="agenda" render={(it)=>(<li key={it.id}><b>{it.nama}</b> — {it.waktu} @ {it.lokasi}</li>)} />}
    {tab==="laporan" && <FormLaporan uid={user.uid} />}
    {tab==="iuran" && <FormIuran uid={user.uid} />}
    {tab==="umkm" && <FormUMKM uid={user.uid} />}
  </div>);
}

function List({col, render}){
  const [items,setItems]=useState([]);
  useEffect(()=>{ (async()=>{
    const q=query(collection(db,col), orderBy("ts","desc"));
    const ss=await getDocs(q); setItems(ss.docs.map(d=>({id:d.id,...d.data()})));
  })(); },[col]);
  return (<div className="card" style={{marginTop:16}}><ul>{items.map(render)}</ul></div>);
}

function FormLaporan({uid}){
  const [nama,setNama]=useState(""); const [lokasi,setLokasi]=useState(""); const [deskripsi,setDeskripsi]=useState(""); const [msg,setMsg]=useState("");
  const submit=async()=>{
    await addDoc(collection(db,"laporan"),{uid,nama,lokasi,deskripsi,status:"pending",ts:serverTimestamp()});
    setNama(""); setLokasi(""); setDeskripsi(""); setMsg("Laporan terkirim.");
  };
  return (<div className="card" style={{marginTop:16}}>
    <h3>Buat Laporan</h3>
    <input className="input" placeholder="Nama" value={nama} onChange={e=>setNama(e.target.value)} />
    <input className="input" placeholder="Lokasi" value={lokasi} onChange={e=>setLokasi(e.target.value)} />
    <textarea className="input" placeholder="Deskripsi" value={deskripsi} onChange={e=>setDeskripsi(e.target.value)} />
    <button className="btn" onClick={submit} style={{marginTop:8}}>Kirim</button>
    <p>{msg}</p>
  </div>);
}

function FormIuran({uid}){
  const [kategori,setKategori]=useState("rt"); const [bulan,setBulan]=useState(""); const [jumlah,setJumlah]=useState(50000);
  const [metode,setMetode]=useState("tunai"); const [file,setFile]=useState(null); const [msg,setMsg]=useState("");
  const submit=async()=>{
    let buktiUrl="";
    if(file){
      const r=ref(storage, `bukti/${uid}-${Date.now()}`);
      await uploadBytes(r, file);
      buktiUrl = await getDownloadURL(r);
    }
    await addDoc(collection(db,"iuran"),{uid,kategori,bulan,jumlah:Number(jumlah),metode,buktiUrl,status:"menunggu_verifikasi", ts:serverTimestamp()});
    setBulan(""); setJumlah(50000); setFile(null); setMsg("Pengajuan iuran terkirim.");
  };
  return (<div className="card" style={{marginTop:16}}>
    <h3>Bayar Iuran</h3>
    <label>Kategori</label>
    <select className="input" value={kategori} onChange={e=>setKategori(e.target.value)}>
      <option value="rt">RT</option>
      <option value="karangtaruna">Karang Taruna</option>
      <option value="pkk">PKK</option>
    </select>
    <label>Bulan (YYYY-MM)</label>
    <input className="input" value={bulan} onChange={e=>setBulan(e.target.value)} placeholder="2025-10" />
    <label>Jumlah (Rp)</label>
    <input className="input" type="number" value={jumlah} onChange={e=>setJumlah(e.target.value)} />
    <label>Metode</label>
    <select className="input" value={metode} onChange={e=>setMetode(e.target.value)}>
      <option value="tunai">Tunai</option>
      <option value="transfer">Transfer</option>
      <option value="ewallet">E-Wallet/QRIS</option>
    </select>
    <label>Bukti (jika transfer/ewallet)</label>
    <input className="input" type="file" onChange={e=>setFile(e.target.files[0])} />
    <button className="btn" onClick={submit} style={{marginTop:8}}>Kirim</button>
    <p>{msg}</p>
  </div>);
}

function FormUMKM({uid}){
  const [nama,setNama]=useState(""); const [deskripsi,setDeskripsi]=useState(""); const [wa,setWa]=useState(""); const [msg,setMsg]=useState("");
  const submit=async()=>{
    await addDoc(collection(db,"umkm"),{pemilikUid:uid,nama,deskripsi,wa,ts:serverTimestamp()});
    setNama(""); setDeskripsi(""); setWa(""); setMsg("UMKM terkirim.");
  };
  return (<div className="card" style={{marginTop:16}}>
    <h3>Daftarkan UMKM</h3>
    <input className="input" placeholder="Nama Usaha" value={nama} onChange={e=>setNama(e.target.value)} />
    <textarea className="input" placeholder="Deskripsi" value={deskripsi} onChange={e=>setDeskripsi(e.target.value)} />
    <input className="input" placeholder="WhatsApp" value={wa} onChange={e=>setWa(e.target.value)} />
    <button className="btn" onClick={submit} style={{marginTop:8}}>Kirim</button>
    <p>{msg}</p>
  </div>);
}
