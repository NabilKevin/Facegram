import axios from 'axios';
import { useEffect, useState } from 'react';

const Home = ({setLoading}) => {
	axios.defaults.withCredentials = true;
	document.title = 'Home'
	const [users, setUsers] = useState([]);
	const [posts, setPosts] = useState([]);
	const [request, setRequest] = useState([]);
	const [like, setLike] = useState({like: [], withDoubleClick: []});
	const [comment, setComment] = useState({comment: [], data: null, index: null})
	let isload = false
	let page = 0
	const getPosts = async () => { 
			const response = await axios.get(`http://localhost:8000/api/v1/posts?page=${page}&size=10`)
			response.data.posts.forEach(i => {
					setPosts(prevPosts => [...prevPosts, i])
					setLike(prev => ({like: [...prev.like, 0], withDoubleClick: [...prev.withDoubleClick, false]}))
			})
	}
	const getUsers = async () => { 
			const response = await axios.get('http://localhost:8000/api/v1/users')
			setUsers(prev => [...prev, ...response.data.users])
	}
	const getRequest = async () => { 
			const response = await axios.get(`http://localhost:8000/api/v1/users/${localStorage.getItem('username')}/followers`)
			const data = response.data.followers.filter(r => r.is_requested === true)
			setRequest(prev => [...prev, ...data])
	}
	const scrollDown = e => {
			if(Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight) {
					if(!isload) {
							isload = true
							page += 1;
							getPosts();
							isload = false
					}
			}
	}
	useEffect(() => {
		console.log(like);
	}, [like])
	useEffect(() => {
		if(comment.data) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}
	}, [comment])
	useEffect(() => {
			const fetchData = async () => {
					await getUsers()
					await getRequest()
					await getPosts()
					setLoading(false)
			}

			fetchData();

			window.addEventListener('scroll', scrollDown)
	}, [])

	const openComment = (data, index) => {
		setComment({comment: [1], data, index})
	}

	const acceptRequest = async username => {
			try {
					const response = await axios.put(`http://localhost:8000/api/v1/users/${username}/accept`, {})
					setRequest(response => response.filter(r => r.username !== username))
			} catch(err) {
					console.error(err);
			}
			
	}
	const timeAgo = (dateString) => {
			const date = new Date(dateString);
			const now = new Date();
			const secondsPast = (now.getTime() - date.getTime()) / 1000;
		
			if (secondsPast < 60) {
				return `${Math.round(secondsPast)} seconds ago`;
			}
			if (secondsPast < 3600) {
				return `${Math.round(secondsPast / 60)} minutes ago`;
			}
			if (secondsPast <= 86400) {
				return `${Math.round(secondsPast / 3600)} hours ago`;
			}
			if (secondsPast > 86400) {
				const day = date.getDate();
				const month = date.toLocaleString('default', { month: 'short' });
				const year = date.getFullYear() === now.getFullYear() ? '' : ` ${date.getFullYear()}`;
				return `${day} ${month}${year}`;
			}
	};
	const likePost = async id => {
		const response = await axios.post(`http://localhost:8000/api/v1/posts/${id}/like`)
		if(response.status !== 200) {
			console.error(response);
		}
	}
	const unlikePost = async id => {
		const response = await axios.post(`http://localhost:8000/api/v1/posts/${id}/unlike`)
		if(response.status !== 200) {
			console.error(response);
		}
	}
	const handleHeartClick = (e, id, i) => {
		e.target.classList.toggle('heart')
		if(e.target.classList.contains('bi-heart')) {
			likePost(id);
			const temp = structuredClone(like)
			temp.like[i] += 1
			setLike(temp);
		} else {
			unlikePost(id);
			const temp = structuredClone(like)
			temp.like[i] -= 1
			setLike(temp);
		}
		setTimeout(() => {
			e.target.classList.toggle('bi-heart')
			e.target.classList.toggle('bi-heart-fill')
		}, 170)
		setTimeout(() => {
			e.target.classList.toggle('heart')
		}, 320)
	}
	const handleLike = (e, id, i) => {
		const heart = e.target.parentElement.nextSibling.children[0]
		const temp = structuredClone(like)
		if(heart.classList.contains('bi-heart')) {
			temp.like[i] += 1
			temp.withDoubleClick[i] = true
			setLike(prev => temp);
			heart.classList.toggle('heart')
			setTimeout(() => {
				heart.classList.replace('bi-heart', 'bi-heart-fill')
			}, 170)
			setTimeout(() => {
				likePost(id);
				heart.classList.toggle('heart')
			}, 320)
		} else {
			temp.withDoubleClick[i] = true
			setLike(temp);
			heart.classList.toggle('heartAlreadyLike')
			setTimeout(() => {
				heart.classList.toggle('heartAlreadyLike')
			}, 320)
		}
		setTimeout(() => {
			temp.withDoubleClick[i] = false
			setLike(prev => ({like: prev.like, withDoubleClick: temp.withDoubleClick}));
		}, 600)
	}
	
	return (
		<main className="mt-5">
			{
				comment.data && <div className="position-fixed detail d-flex gap-0">
				<div className="position-fixed xBtn pointer" onClick={() => setComment({comment: [], data: null})}>
					<svg aria-label="Close" className="x1lliihq x1n2onr6 x9bdzbf" fill="currentColor" height="18" role="img" viewBox="0 0 24 24" width="18">
						<title>Close</title>
						<polyline fill="none" points="20.643 3.357 12 12 3.353 20.647" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></polyline>
						<line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" x1="20.649" x2="3.354" y1="20.649" y2="3.354"></line>
						</svg>
				</div>
				<div className="detail-post d-flex gap-0 align-items-center justify-content-center w-100 m-auto">
					<div className='postImg'>
						<div className="h-100 w-100">
							<div className="card-body h-100">
								<div className="card-images mb-2 h-100">
									{
										comment.data.attachments.map((a, ii) => <img onDoubleClick={e => handleLike(e, comment.data.id, i)} key={ii} src={`http://localhost:8000/storage/${a.storage_path}`} alt="image" className='h-100 w-100 left-0'/>)
									}	
								</div>
							</div>
						</div>
					</div>
					<div className='postDescription d-flex flex-column'>
						<div className="profile position-relative top-0">
							<strong>{comment.data.user.username}</strong>
						</div>
						<div className="comments d-flex gap-2 align-items-center flex-column">
							<div className="commentss gap-3 d-flex flex-column">
								<div className="caption">
									<strong>{comment.data.user.username}</strong> {comment.data.caption}
								</div>
								<div className="comment d-flex flex-column">
									<div className="commentBody mb-1">
									<strong>nabilkevin07</strong> Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint ipsum dolore nam a cupiditate numquam quae tenetur nihil animi autem.
									</div>
									<div className="description d-flex gap-2">
										<small className='text-muted'>4d</small><small className='text-muted'>10,000 likes</small><small className='text-muted'>Reply</small>
									</div>
								</div>
							</div>
						</div>
						<div className="buttons">
							<div className="d-flex gap-4 p-3">
								<i className={`bi bi-heart${comment.data.you_liked || like.like[comment.index] > 0 ? '-fill' : ''} pointer scale-18`} onClick={e => handleHeartClick(e, comment.data.id, comment.index)}></i>
								<i className="bi bi-chat pointer scale-18"></i>
							</div>
							<div className="d-flex flex-column p-2 m-1 mt-0 pt-0 gap-0">
								<strong className='totalLikes'>{comment.data.total_like + like.like[comment.index]} likes</strong>
								<span className='text-muted time'>{timeAgo(comment.data.created_at)}</span>
							</div>
						</div>
						<div className="inputComment d-flex gap-0 align-items-center justify-content-center">
							<button className='h-100'>
								<svg aria-label="Emoji" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Emoji</title>
									<path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path>
								</svg>
							</button>
							<input type="text" className='w-100 h-100' placeholder='Add Comment...'/>
							<button className='h-100 text-info'>
								Post
							</button>
						</div>
					</div>
				</div>
			</div>}
			<div className="container py-5">
				<div className="row justify-content-between">
					<div className="col-md-8">
						<h5 className="mb-3">News Feed</h5>
						{posts.map((r, i) => <div className="card mb-2" key={i}>
							<div className="card mb-4">
								<div className="card-header d-flex align-items-center justify-content-between bg-transparent py-3">
									<h6 className="mb-0">{r.user.full_name}</h6>
									<small className="text-muted">{timeAgo(r.created_at)}</small>
								</div>
								<div className="card-body">
									<div className="card-images mb-2">
										{
											like.withDoubleClick[i] && <div className="position-absolute likeInImg z-3 d-flex adj-top start-50 translate-middle">
												<i className={`bi bi-heart-fill ${like.withDoubleClick[i] === true ? 'likeWithDoubleClick' : ''}`}></i>
											</div>
										}
										{
											r.attachments.map((a, ii) => <img onDoubleClick={e => handleLike(e, r.id, i)} key={ii} src={`http://localhost:8000/storage/${a.storage_path}`} alt="image" className="w-100"/>)
										}
									</div>
									<div className="d-flex gap-3 align-items-center my-2 mt-3">
										<i className={`bi bi-heart${r.you_liked ? '-fill' : ''} pointer scale-15`} onClick={e => handleHeartClick(e, r.id, i)}></i>
										<i className="bi bi-chat pointer scale-15" onClick={() => openComment(r, i)}></i>
									</div>
									<strong>{r.total_like + like.like[i]} likes</strong>
									<p className="mb-0 text-muted"><b><a href={`/profile/${r.user.username}`}>{r.user.username}</a></b> {r.caption}</p>
									<span className='text-muted pointer' onClick={() => openComment(r, i)}>View all 370 comments</span>
								</div>
							</div>
						</div>)}
					</div>
					<div className="col-md-4">
						<div className="request-follow mb-4">
							{
								request.length > 0 && (
									<>
									<h6 className="mb-3">Follow Requests</h6>
									<div className="request-follow-list">
										{
											request.map((r, i) => (
												<div className="card mb-2" key={i}>
													<div className="card-body d-flex align-items-center justify-content-between p-2">
														<a href="user-profile-private.html">@{r.username}</a>
														<button onClick={() => acceptRequest(r.username)} className="btn btn-primary btn-sm">
															Confirm
														</button>
													</div>
												</div>
											))
										}
									</div>
									</>
								)
							}
						</div>
						<div className="explore-people">
							{
								users.length > 0 && (
									<>
									<h6 className="mb-3">Explore People</h6>
									<div className="explore-people-list">
										{users.map((r, i) => (
											<div className="card mb-2" key={i}>
												<div className="card-body p-2">
													<a href={`/profile/${r.username}`}>@{r.username}</a>
												</div>
											</div>
										))}
									</div>
									</>
								)
							}
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}

export default Home