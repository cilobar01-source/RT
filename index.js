import Link from "next/link";
export default function Home(){
  return (
    <div className="card">
      <h1>Portal RT Cilosari Barat RT01/RW08</h1>
      <p>Selamat datang. Silakan <Link href="/login">Masuk</Link> atau <Link href="/register">Daftar</Link>.</p>
      <p>Tampilan otomatis mengikuti tema musiman & dark mode. Aplikasi ini bisa di-install (PWA).</p>
    </div>
  );
}
