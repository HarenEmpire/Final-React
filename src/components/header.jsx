import "./header.css";
import harenIcon from "../assets/haren.png";

function Header() {
    return (
        <header className="header">
            <img src={harenIcon} alt="Haren" className="header-icon" />
            <h1>Haren İmparatorluğu Hava Durumu Servisi</h1>
            <p>Haren Meteoroloji Müdürlüğü</p>
        </header>
    );
}

export default Header;
