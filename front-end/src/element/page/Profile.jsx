import axios from "axios";
import { useEffect, useState } from "react"

const Profile = ({setLoading}) => {
	axios.defaults.withCredentials = true;
	const [user, setUser] = useState({
			username: '',
			full_name: '',
			posts_count: '',
			followings_count: '',
			following_status: '',
			followers_count: '',
			is_your_account: '',
			posts: []
	});
	const [followers, setFollowers] = useState([]);
	const [followings, setFollowings] = useState([]);
	const [isFollow, setIsFollow] = useState({
			button: '',
			isFollow: false,
			followers_count: 0
	})
	const [comment, setComment] = useState({comment: [], data: null})
	const [commentBody, setCommentBody] = useState('');
	const [like, setLike] = useState({like: 0, withDoubleClick: false});
	const getFollower = async () => {
			const response = await axios.get(`http://localhost:8000/api/v1/users/${path[path.length-1]}/followers`)
			setFollowers(response.data.followers)
	}
	const getFollowing = async () => {
			const response = await axios.get(`http://localhost:8000/api/v1/users/${path[path.length-1]}/following`)
			setFollowings(response.data.following)
	}
	const getPost = async (id) => {
			const response = await axios.get(`http://localhost:8000/api/v1/posts/${id}`)
			return response.data.post
	}
	const getDetailUser = async () => {
		const response = await axios.get(`http://localhost:8000/api/v1/users/${path[path.length-1]}`)
		setUser(response.data[0]);
		const text = response.data[0].following_status === 'not-following' ? 'Follow' : response.data[0].following_status
		setIsFollow({
				button: text[0].toUpperCase() + text.slice(1, text.length),
				isFollow:  response.data[0].following_status === 'not-following' ? false : true,
				followers_count: response.data[0].followers_count
		})
	}
	
	const path = location.pathname.split('/');
	useEffect(() => {
		document.title = `@${path[path.length-1]} - Profile`
		const fetchData = async () => {
			await getFollower();
			await getFollowing();
			await getDetailUser();
			setLoading(false)
		}
		fetchData();
	}, [])

	const follow = async () => {
			const response = await axios.post(`http://localhost:8000/api/v1/users/${user.username}/follow`, {})
			const data = response.data;
			const text = data.status === 'not-following' ? 'Follow' : data.status
			setIsFollow(prev => ({button: text[0].toUpperCase() + text.slice(1, text.length), isFollow: true, followers_count: prev.followers_count + 1}))
			setFollowers(prev => [...prev, {username: localStorage.getItem('username')}])
	}
	const unFollow = async () => {
			const response = await axios.delete(`http://localhost:8000/api/v1/users/${user.username}/unfollow`)
			if(response.status === 204) {
					setIsFollow(prev => ({button: 'Follow', isFollow: false, followers_count: prev.followers_count - 1}))
					const follower = followers
					follower.pop();
					setFollowers(follower)
			}
	}

	const timeAgo = (dateString, comment) => {
		const date = new Date(dateString);
		const now = new Date();
		const secondsPast = (now - date) / 1000;
		if (secondsPast < 60) {
			return `${Math.round(secondsPast)} ${comment ? 's' : 'seconds ago'}`;
		}
		if (secondsPast < 3600) {
			return `${Math.round(secondsPast / 60)} ${comment ? 'm' : 'minutes ago'}`;
		}
		if (secondsPast <= 86400) {
			return `${Math.round(secondsPast / 3600)} ${comment ? 'h' : 'hours ago'}`;
		}
		if (secondsPast > 86400) {
			const day = date.getDate();
			const month = date.toLocaleString('default', { month: 'short' });
			const year = date.getFullYear() === now.getFullYear() ? '' : ` ${date.getFullYear()}`;
			return `${day} ${month}${year}`;
		}
};
	const openComment = async (id, index) => {
		setCommentBody('')
		const data = await getPost(id);
		const response = await axios.get(`http://localhost:8000/api/v1/posts/${id}/comment`)
		const comments = []
		for(const comment in response.data.comments) {
			comments.push(response.data.comments[comment])
		}
		console.log(data);
		setComment({comment: comments, data, index})
	}
	const storeComment = async (e, data, id, index) => {
		e.preventDefault()
		const response = await axios.post(`http://localhost:8000/api/v1/posts/${id}/comment`, {comment_body: commentBody})
		console.log('panggil');
		if(response.status === 200) {
			openComment(data, index)
		}
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
										comment.data.attachments.map((a, ii) => <img key={ii} src={`http://localhost:8000/storage/${a.storage_path}`} alt="image" className='h-100 w-100 left-0'/>)
									}	
								</div>
							</div>
						</div>
					</div>
					<div className='postDescription d-flex flex-column'>
						<div className="profile position-relative top-0">
							<strong>{comment.data.user.username}</strong>
						</div>
						<div className="comments d-flex gap-2 align-items-start flex-column">
							<div className="commentss gap-3 d-flex flex-column">
								<div className="caption">
									<strong>{comment.data.user.username}</strong> {comment.data.caption}
								</div>
								{
									comment.comment.map((comment, i) => (
										<div className="comment d-flex flex-column" key={i}>
											<div className="commentBody mb-1">
											<strong>{comment.user.username}</strong> {comment.comment_body}
											</div>
											<div className="description d-flex gap-2">
												<small className='text-muted'>{timeAgo(comment.created_at, true)}</small><small className='text-muted'>0 like</small><small className='text-muted'>Reply</small>
											</div>
										</div>))
								}
							</div>
						</div>
						<div className="buttons">
							<div className="d-flex gap-4 p-3">
								{/* <i className={`bi bi-heart${like.like !== -1 && (like.like === 1 || comment.data.you_liked)  ? '-fill' : ''} pointer scale-18`} onClick={e => handleHeartClickComment(e, comment.data.id, comment)}></i> */}
								<i className="bi bi-chat pointer scale-18"></i>
							</div>
							<div className="d-flex flex-column p-2 m-1 mt-0 pt-0 gap-0">
								<strong className='totalLikes'>{comment.data.total_like + like.like} like{comment.data.total_like + like.like <= 1 ? '' : 's'}</strong>
								<span className='text-muted time'>{timeAgo(comment.data.created_at)}</span>
							</div>
						</div>
							<form onSubmit={e => storeComment(e, comment.data, comment.data.id)} className="inputComment d-flex gap-0 align-items-center justify-content-center">
								<button className='h-100'>
									<svg aria-label="Emoji" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Emoji</title>
										<path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path>
									</svg>
								</button>
								<input type="text" className='w-100 h-100' placeholder='Add Comment...' value={commentBody} onChange={e => setCommentBody(prev => e.target.value)}/>
								<button className={`h-100 text-${commentBody.length === 0 ? 'info' : 'primary'}`} disabled={commentBody.length === 0 ? true: false} type='submit'>
									Post
								</button>
							</form>
						</div>
					</div>
			</div>}
			<div className="container py-5">
				<div className="px-5 py-4 bg-light mb-4 d-flex align-items-center justify-content-between">
					<div>
						<div className="d-flex align-items-center gap-2 mb-2">
							<h5 className="mb-0">{user.full_name}</h5>
							<span>@{user.username}</span>
						</div>
						<small className="mb-0 text-muted">
							{user.bio}
						</small>
					</div>
					<div>
						{
							user.is_your_account ? (
								<a href="/create" className="btn btn-primary w-100 mb-2">
									+ Create new post
								</a>
							) : (
								<button className={`btn w-100 mb-2 btn-${isFollow.isFollow ? 'secondary' : 'primary'}`} onClick={async () => {
									!isFollow.isFollow ? follow() : unFollow()
								}}>
									{isFollow.button}
								</button>
							)
						}
						<div className="d-flex gap-3">
							<div>
								<div className="profile-label"><b>{user.posts_count}</b> posts</div>
							</div>
							<div className="profile-dropdown">
								<div className="profile-label"><b>{isFollow.followers_count}</b> followers</div>
								<div className="profile-list">
									<div className="card">
										<div className="card-body">
											{
												followers.map((r, i) => (
													<div key={i} className="profile-user">
															<a href={`/profile/${r.username}`}>@{r.username}</a>
													</div>
												))
											}
										</div>
									</div>
								</div>
							</div>
							<div className="profile-dropdown">
								<div className="profile-label"><b>{user.followings_count}</b> following</div>
								<div className="profile-list">
									<div className="card">
										<div className="card-body">
											{
												followings.map((r, i) => (
														<div key={i} className="profile-user">
																<a href={`/profile/${r.username}`}>@{r.username}</a>
														</div>
												))
											}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{
				user.is_private && (user.following_status === 'not-following' || user.following_status === 'requested') && !user.is_your_account ? <div className="card py-4">
					<div className="card-body text-center">
						&#128274; This account is private
					</div>
				</div> :
				<div className="row justify-content-center">
					{
						user.posts.map((p, i) => (
							<div className="col-md-4 pointer" key={i} onClick={() => openComment(p.id, i)}>
								<div className="card mb-4">
									<div className="card-body">
										<div className="card-images mb-2">
											{
												p.attachments.map((a, ii) => <img key={ii} src={`http://localhost:8000/storage/${a.storage_path}`} alt="image" className="w-100"/>)
											}
										</div>
										<p className="mb-0 text-muted">{p.caption}</p>
									</div>
								</div>
							</div>
						))
					}
				</div>
				}
			</div>
		</main>
	)
}

export default Profile