import { useEffect, useState } from "react"

const Navbar = ({logout}) => {
	const [isSearching, setIsSearching] = useState(false);

	const closeSearch = e => {
		if(e.target.id !== 'search' && e.target.id !== 'searchBtn' && isSearching === true) {
			setIsSearching(false)
		}
	}
	useEffect(() => {
		if(isSearching) {
			window.addEventListener('click', closeSearch)
		}
		return () => {
			if(isSearching) {
				window.removeEventListener('click', closeSearch)
			}
		}
	}, [isSearching])
	const path = location.pathname.split('/')[1]
	if(path === 'login' || path === 'register') {
		return (
			<nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top z-2">
				<div className="container">
					<a className="navbar-brand m-auto" href="/login">Facegram</a>
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
						<button id="searchBtn" className="nav-link" onClick={() => setIsSearching(prev => !prev)}>Search</button>
						<form id="search" className={`search position-absolute shadow d-flex justify-content-start align-items-center py-2 px-3 flex-column ${isSearching ? 'd-flex searchActive' : 'searchNotActive'}`}>
							<input type="text" name="" id="" placeholder="Search"/>
							<div className="history mt-2 d-flex flex-column align-items-start w-100 h-100">
								<h6>Recent</h6>
								<span className="text-muted text-center">No recent searches.</span>

							</div>
						</form>
						<button className="nav-link" onClick={() => logout()}>Logout</button>
					</div>
				</div>
			</nav>
		)
	}
}

export default Navbar