import "../styles/globals.css";
import Navbar from "../components/Navbar";
export default function App({ Component, pageProps }){
  return (<>
    <Navbar />
    <main className="container"><Component {...pageProps} /></main>
    <footer className="container">© 2025 Cilosari Barat RT01/RW08</footer>
  </>);
}
