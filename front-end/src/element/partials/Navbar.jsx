const Navbar = ({logout}) => {
	const path = location.pathname.split('/')[1]
	if(path === 'login' || path === 'register') {
		return (
			<nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top z-2">
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
					<div className="navbar-nav position-relative">
						<a className="nav-link" href={`/profile/${localStorage.getItem('username')}`}>@{localStorage.getItem('username')}</a>
						<button className="nav-link" href="/">Search</button>
						<div className="search position-absolute shadow d-flex justify-content-start align-items-center py-2 px-3 flex-column">
							<input type="text" name="" id="" placeholder="Search"/>
							<div className="history"></div>
						</div>
						<button className="nav-link" onClick={() => logout()}>Logout</button>
					</div>
				</div>
			</nav>
		)
	}
}

export default Navbar