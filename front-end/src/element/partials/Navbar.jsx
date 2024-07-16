const Navbar = ({logout}) => {
    if(!localStorage.getItem('token')) {
        return (
            <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
                <div className="container">
                    <a className="navbar-brand m-auto" href="index.html">Facegram</a>
                </div>
            </nav>
        )
    } else {
        return (
            <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
                <div className="container">
                    <a className="navbar-brand" href="/">Facegram</a>
                    <div className="navbar-nav">
                        <a className="nav-link" href={`/profile/${localStorage.getItem('username')}`}>@{localStorage.getItem('username')}</a>
                        <button className="nav-link" onClick={() => logout()}>Logout</button>
                    </div>
                </div>
            </nav>
        )
    }
}

export default Navbar