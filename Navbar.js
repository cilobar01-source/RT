import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle";
import SeasonalTheme from "./SeasonalTheme";
import Ornamen from "./Ornamen";
export default function Navbar(){
  return (
    <header className="nav">
      <div className="wrap">
        <div className="brand"><span>🏘️</span><strong>RT01/RW08 Cilosari Barat</strong></div>
        <nav className="links">
          <Link href="/">Beranda</Link>
          <Link href="/login">Masuk</Link>
          <Link href="/register">Daftar</Link>
          <DarkModeToggle />
        </nav>
      </div>
      <SeasonalTheme />
      <Ornamen />
    </header>
  );
}
