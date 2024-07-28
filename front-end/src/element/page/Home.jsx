import axios from 'axios';
import { useEffect, useState } from 'react';

const Home = ({setLoading}) => {
	axios.defaults.withCredentials = true;
	document.title = 'Home'
	const [users, setUsers] = useState([]);
	const [posts, setPosts] = useState([]);
	const [request, setRequest] = useState([]);
	const [like, setLike] = useState({like: [], withDoubleClick: []});
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
			const fetchData = async () => {
					await getUsers()
					await getRequest()
					await getPosts()
					setLoading(false)
			}

			fetchData();

			window.addEventListener('scroll', scrollDown)
	}, [])
	const acceptRequest = async username => {
			try {
					const response = await axios.put(`http://localhost:8000/api/v1/users/${username}/accept`, {})
					setRequest(request => request.filter(r => r.username !== username))
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
		e.target.classList.toggle('heartDisappear')
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
		e.target.classList.toggle('bi-heart')
		e.target.classList.toggle('bi-heart-fill')
		setTimeout(() => {
			e.target.classList.toggle('heartAppear')
			setTimeout(() => {
				e.target.classList.toggle('heartDisappear')
				e.target.classList.toggle('heartAppear')
			}, 320)
		}, 320)
	}
	const handleLike = (e, id, i) => {
		const heart = e.target.parentElement.nextSibling.children[0]
		const temp = structuredClone(like)
		if(heart.classList.contains('bi-heart')) {
			temp.like[i] += 1
			temp.withDoubleClick[i] = true
			setLike(prev => temp);
			heart.classList.toggle('heartDisappear')
			heart.classList.replace('bi-heart', 'bi-heart-fill')
			setTimeout(() => {
				likePost(id);
				heart.classList.toggle('heartAppear')
				setTimeout(() => {
					heart.classList.toggle('heartDisappear')
					heart.classList.toggle('heartAppear')
				}, 320)
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
			<div className="position-absolute detail d-flex gap-0 align-items-center justify-content-center">
				<div className="detail-post d-flex gap-0 align-items-center justify-content-center">
					<div className='postImg'>
						<img src="http://localhost:8000/storage/posts/IMG_1281.JPG" width="100%" height="100%" alt="" />	
					</div>
					<div className='postDescription d-flex flex-column'>
						<div className="profile position-relative top-0">
							<strong>nabilkevin07</strong>
						</div>
						<div className="comments d-flex gap-2 align-items-center justify-content-center flex-column">
							<div className="caption">
								<strong>nabilkevin07</strong> Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint ipsum dolore nam a cupiditate numquam quae tenetur nihil animi autem.
							</div>
							<div className="comment">
								<strong>nabilkevin07</strong> Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint ipsum dolore nam a cupiditate numquam quae tenetur nihil animi autem.
							</div>
							<div className="comment">
								<strong>nabilkevin07</strong> Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint ipsum dolore nam a cupiditate numquam quae tenetur nihil animi autem.
							</div>
							<div className="comment">
								<strong>nabilkevin07</strong> Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint ipsum dolore nam a cupiditate numquam quae tenetur nihil animi autem.
							</div>
							<div className="comment">
								<strong>nabilkevin07</strong> Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint ipsum dolore nam a cupiditate numquam quae tenetur nihil animi autem.
							</div>
							<div className="comment">
								<strong>nabilkevin07</strong> Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint ipsum dolore nam a cupiditate numquam quae tenetur nihil animi autem.
							</div>
							<div className="comment">
								<strong>nabilkevin07</strong> Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint ipsum dolore nam a cupiditate numquam quae tenetur nihil animi autem.
							</div>
						</div>
						<div className="buttons">
						</div>
						<div className="inputComment">
						</div>
					</div>
				</div>
			</div>
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
												<i class={`bi bi-heart-fill ${like.withDoubleClick[i] === true ? 'likeWithDoubleClick' : ''}`}></i>
											</div>
										}
										{
											r.attachments.map((a, ii) => <img onDoubleClick={e => handleLike(e, r.id, i)} key={ii} src={`http://localhost:8000/storage/${a.storage_path}`} alt="image" className="w-100"/>)
										}
									</div>
									<div className="d-flex gap-3 align-items-center my-2 mt-3">
										<i class={`bi bi-heart${r.you_liked ? '-fill' : ''} pointer scale-15`} onClick={e => handleHeartClick(e, r.id, i)}></i>
										<i class="bi bi-chat pointer scale-15"></i>
									</div>
									<strong>{r.total_like + like.like[i]} likes</strong>
									<p className="mb-0 text-muted"><b><a href={`/profile/${r.user.username}`}>{r.user.username}</a></b> {r.caption}</p>
									<span className='text-muted pointer'>View all 370 comments</span>
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