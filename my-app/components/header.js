import Link from 'next/link'; // Importuj Link

const Header = () => {
    return (
        <header>
            <div className="poniatow"> 
                <img src={"/poniatow120.jpg"} alt="poniatowstaw" className="poniatowstaw" />
            </div>
            <div className="glowa">
                <div className="tytol">
                    <h1>Rybcia Forum</h1>
                </div>
                <img src={"/ryba.jpg"} alt="Rybka logo" className="logo" />
                <nav>
                    <ul>
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/info">Info</Link></li>
                        <li><Link href="/blogi">Blogi</Link></li>
                        <li><Link href="/regulamin">Regulamin</Link></li>
                        <li><Link href="/artykuły">Artykuły</Link></li>
                        <li><Link href="/kontakt">Kontakt</Link></li>
                        <li className="rejestracja"><Link href="/rejestracja">Zarejestruj się</Link></li>
                        <li className="login"><Link href="/login">login</Link></li>
                        <li className="verify"><Link href="/verify">verify</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;
