import axios from "axios";
import { useEffect, useState } from "react"

const Navbar = ({logout}) => {
	const [isSearching, setIsSearching] = useState(false);
	const [searches, setSearches] = useState([]);

	const search = async (key) => {
		if(key !== '') {
			try {
				const response = await axios.get(`http://localhost:8000/api/v1/users/${key}/search`);
				if(response.status === 200) {
					setSearches(response.data.users)
				}
			} catch(err) {
				if(err.response.status === 404) {
					setSearches('notFound')
				}
			}
		} else {
			setSearches([]);
		}
	}

	const closeSearch = e => {
		if(!e.target.classList.contains('searchForm') && e.target.id !== 'searchBtn' && isSearching === true) {
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
						<form className={`searchForm search position-absolute shadow d-flex justify-content-start align-items-center py-2 px-3 flex-column ${isSearching ? 'd-flex searchActive' : 'searchNotActive'}`}>
							<input type="text" id="" placeholder="Search" className="searchForm" onChange={e => search(e.target.value)}/>
							<div className="searchForm history mt-2 d-flex flex-column align-items-start w-100 h-100">
								{
									searches.length === 0 ? 
										<div className="px-3 py-1">
											<h6 className="searchForm">Recent</h6>
											<span className="text-muted text-center searchForm">No recent searches.</span>
										</div> :
										searches === 'notFound' ? <div className="px-3 py-1">
											<span className="text-muted text-center searchForm">No results found.</span>
										</div> :
										<div className="searchForm searchProfiles w-100 d-flex flex-column">
										{
											searches.map((s, i) => (
												<a href={`/profile/${s.username}`} key={i} className="text-decoration-none searchProfile searchForm w-100">
													<div className="searchForm w-100 d-flex flex-column gap-1">
														<h6 className="m-0 searchForm">{s.username}</h6>
														<span className="text-muted searchForm">{s.full_name} &#x2022; {s.followers_count} followers</span>
													</div>
												</a>
											))
										}
										</div>
								}
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