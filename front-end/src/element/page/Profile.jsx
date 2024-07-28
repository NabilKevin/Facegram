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
	const getFollower = async () => {
			const response = await axios.get(`http://localhost:8000/api/v1/users/${path[path.length-1]}/followers`)
			setFollowers(response.data.followers)
	}
	const getFollowing = async () => {
			const response = await axios.get(`http://localhost:8000/api/v1/users/${path[path.length-1]}/following`)
			setFollowings(response.data.following)
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
	return (
		<main className="mt-5">
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
							<div className="col-md-4" key={i}>
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