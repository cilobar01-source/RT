import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, collection, addDoc, serverTimestamp, query, orderBy, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { useRouter } from "next/router";

export default function AdminDashboard(){
  const router=useRouter();
  const [user,setUser]=useState(null);
  const [role,setRole]=useState("warga");
  const [tab,setTab]=useState("pengumuman");

  useEffect(()=>{
    const unsub=onAuthStateChanged(auth, async(u)=>{
      if(!u){ router.push("/login"); return; }
      setUser(u);
      const snap=await getDoc(doc(db,"users",u.uid));
      const r=(snap.exists()&&snap.data().role)||"warga"; setRole(r);
      if(r!=="admin"){ router.push("/warga/dashboard"); }
    }); return ()=>unsub();
  },[]);

  if(role!=="admin") return null;

  return (
    <div>
      <h1>Panel Admin</h1>
      <p>Login: {user?.email}</p>
      <button className="btn" onClick={()=>signOut(auth).then(()=>location.href='/login')}>Logout</button>

      <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>
        {["pengumuman","agenda","laporan","iuran","umkm"].map(k=>(
          <button key={k} className="btn" onClick={()=>setTab(k)}>{k.toUpperCase()}</button>
        ))}
      </div>

      {tab==="pengumuman" && <CRUDPengumuman/>}
      {tab==="agenda" && <CRUDAgenda/>}
      {tab==="laporan" && <CRUDLaporan/>}
      {tab==="iuran" && <CRUDIuran/>}
      {tab==="umkm" && <CRUDUMKM/>}
    </div>
  );
}

function useList(col, order="ts"){
  const [items,setItems]=useState([]);
  useEffect(()=>{ (async()=>{
    const q=query(collection(db,col), orderBy(order,"desc"));
    const ss=await getDocs(q); setItems(ss.docs.map(d=>({id:d.id,...d.data()})));
  })(); },[col,order]);
  return [items,setItems];
}

function CRUDPengumuman(){
  const [judul,setJudul]=useState(""); const [isi,setIsi]=useState("");
  const [items,setItems]=useList("pengumuman","ts");
  const add=async()=>{ await addDoc(collection(db,"pengumuman"),{judul,isi,ts:serverTimestamp()}); setJudul(""); setIsi(""); location.reload(); };
  return (<div className="card" style={{marginTop:16}}>
    <h3>Pengumuman</h3>
    <input className="input" placeholder="Judul" value={judul} onChange={e=>setJudul(e.target.value)} />
    <textarea className="input" placeholder="Isi" value={isi} onChange={e=>setIsi(e.target.value)} />
    <button className="btn" onClick={add} style={{marginTop:8}}>Publikasikan</button>
    <ul>{items.map(it=>(<li key={it.id}><b>{it.judul}</b> â {it.isi||""}</li>))}</ul>
  </div>);
}

function CRUDAgenda(){
  const [nama,setNama]=useState(""); const [waktu,setWaktu]=useState(""); const [lokasi,setLokasi]=useState(""); const [deskripsi,setDeskripsi]=useState("");
  const [items,setItems]=useList("agenda","ts");
  const add=async()=>{ await addDoc(collection(db,"agenda"),{nama,waktu,lokasi,deskripsi,ts:serverTimestamp()}); setNama(""); setWaktu(""); setLokasi(""); setDeskripsi(""); location.reload(); };
  return (<div className="card" style={{marginTop:16}}>
    <h3>Agenda</h3>
    <input className="input" placeholder="Nama Kegiatan" value={nama} onChange={e=>setNama(e.target.value)} />
    <input className="input" placeholder="Waktu (YYYY-MM-DD HH:mm)" value={waktu} onChange={e=>setWaktu(e.target.value)} />
    <input className="input" placeholder="Lokasi" value={lokasi} onChange={e=>setLokasi(e.target.value)} />
    <textarea className="input" placeholder="Deskripsi" value={deskripsi} onChange={e=>setDeskripsi(e.target.value)} />
    <button className="btn" onClick={add} style={{marginTop:8}}>Tambah</button>
    <ul>{items.map(it=>(<li key={it.id}><b>{it.nama}</b> â {it.waktu} @ {it.lokasi}</li>))}</ul>
  </div>);
}

function CRUDLaporan(){
  const [items,setItems]=useList("laporan","ts");
  const updateStatus=async(id,status)=>{ await updateDoc(doc(db,"laporan",id),{status}); location.reload(); };

  const exportExcel = async()=>{
    const XLSX = (await import("xlsx")).default;
    const ws = XLSX.utils.json_to_sheet(items);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "laporan");
    XLSX.writeFile(wb, "laporan-rt.xlsx");
  };
  const exportPDF = async()=>{
    const { jsPDF } = await import("jspdf");
    const docp = new jsPDF();
    docp.text("Laporan Warga RT", 10, 10);
    let y=20; items.forEach(it=>{ docp.text(`- ${it.nama}: ${it.deskripsi} [${it.status||"pending"}]`, 10, y); y+=8; if(y>280){ docp.addPage(); y=20; }});
    docp.save("laporan-rt.pdf");
  };

  return (<div className="card" style={{marginTop:16}}>
    <h3>Laporan Warga</h3>
    <div style={{display:"flex",gap:8,marginBottom:8}}>
      <button className="btn" onClick={exportExcel}>Export Excel</button>
      <button className="btn" onClick={exportPDF}>Export PDF</button>
    </div>
    <ul>{items.map(it=>(<li key={it.id}><b>{it.nama}</b> â {it.deskripsi} [{it.status||"pending"}] 
      <button className="btn" onClick={()=>updateStatus(it.id,"proses")} style={{marginLeft:8}}>Proses</button>
      <button className="btn" onClick={()=>updateStatus(it.id,"selesai")} style={{marginLeft:8}}>Selesai</button>
    </li>))}</ul>
  </div>);
}

function CRUDIuran(){
  const [items,setItems]=useList("iuran","ts");
  const setLunas=async(id)=>{ await updateDoc(doc(db,"iuran",id),{status:"lunas"}); location.reload(); };

  const exportExcel = async()=>{
    const XLSX = (await import("xlsx")).default;
    const ws = XLSX.utils.json_to_sheet(items);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "iuran");
    XLSX.writeFile(wb, "iuran-rt.xlsx");
  };
  const exportPDF = async()=>{
    const { jsPDF } = await import("jspdf");
    const docp = new jsPDF();
    docp.text("Data Iuran RT", 10, 10);
    let y=20; items.forEach(it=>{ docp.text(`- ${it.kategori?.toUpperCase()} ${it.bulan} Rp${it.jumlah} (${it.metode}) [${it.status}]`, 10, y); y+=8; if(y>280){ docp.addPage(); y=20; }});
    docp.save("iuran-rt.pdf");
  };

  return (<div className="card" style={{marginTop:16}}>
    <h3>Iuran (RT / Karang Taruna / PKK)</h3>
    <div style={{display:"flex",gap:8,marginBottom:8}}>
      <button className="btn" onClick={exportExcel}>Export Excel</button>
      <button className="btn" onClick={exportPDF}>Export PDF</button>
    </div>
    <ul>{items.map(it=>(<li key={it.id}>
      [{it.kategori?.toUpperCase()}] {it.bulan} â Rp{it.jumlah} â {it.metode} â <b>{it.status}</b>
      {it.buktiUrl && <> â <a href={it.buktiUrl} target="_blank" rel="noreferrer">Bukti</a></>}
      <button className="btn" onClick={()=>setLunas(it.id)} style={{marginLeft:8}}>Verifikasi Lunas</button>
    </li>))}</ul>
  </div>);
}

function CRUDUMKM(){
  const [nama,setNama]=useState(""); const [deskripsi,setDeskripsi]=useState(""); const [wa,setWa]=useState("");
  const [items,setItems]=useList("umkm","ts");
  const add=async()=>{ await addDoc(collection(db,"umkm"),{nama,deskripsi,wa,ts:serverTimestamp()}); setNama(""); setDeskripsi(""); setWa(""); location.reload(); };
  const delOne=async(id)=>{ await deleteDoc(doc(db,"umkm",id)); location.reload(); };
  return (<div className="card" style={{marginTop:16}}>
    <h3>UMKM</h3>
    <input className="input" placeholder="Nama Usaha" value={nama} onChange={e=>setNama(e.target.value)} />
    <input className="input" placeholder="WhatsApp" value={wa} onChange={e=>setWa(e.target.value)} />
    <textarea className="input" placeholder="Deskripsi" value={deskripsi} onChange={e=>setDeskripsi(e.target.value)} />
    <button className="btn" onClick={add} style={{marginTop:8}}>Tambah</button>
    <ul>{items.map(it=>(<li key={it.id}><b>{it.nama}</b> â {it.deskripsi} ({it.wa})
      <button className="btn" onClick={()=>delOne(it.id)} style={{marginLeft:8}}>Hapus</button></li>))}</ul>
  </div>);
}
