import axios from "axios";
import { useEffect, useState } from "react"

const Profile = ({setLoading}) => {
    const [user, setUser] = useState();
    const [followers, setFollowers] = useState();
    const [followings, setFollowings] = useState();
    const [isFollow, setIsFollow] = useState({
        button: '',
        isFollow: false,
        followers_count: 0
    })
    const path = location.pathname.split('/');
    useEffect(() => {
        setLoading(true)
        axios.get(`http://localhost:8000/api/v1/users/${path[path.length-1]}/followers`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                setFollowers(res.data.followers)
            })
        axios.get(`http://localhost:8000/api/v1/users/${path[path.length-1]}/following`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                setFollowings(res.data.following)
            })
        axios.get(`http://localhost:8000/api/v1/users/${path[path.length-1]}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                setUser(res.data[0]);
                console.log(res.data[0]);
                const text = res.data[0].following_status === 'not-following' ? 'Follow' : res.data[0].following_status
                setIsFollow({
                    button: text[0].toUpperCase() + text.slice(1, text.length),
                    isFollow:  res.data[0].following_status === 'not-following' ? false : true,
                    followers_count: res.data[0].followers_count
                })
                setLoading(false)
            })
    }, [])

    const follow = () => {
        console.log('follow');
        axios.post(`http://localhost:8000/api/v1/users/${user.username}/follow`, {},
            {
                headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token') 
                }
            }
        )
            .then(res => {
                const data = res.data;
                const text = data.status === 'not-following' ? 'Follow' : data.status
                setIsFollow(prev => ({button: text[0].toUpperCase() + text.slice(1, text.length), isFollow: true, followers_count: prev.followers_count + 1}))
                setFollowers(prev => [...prev, {username: localStorage.getItem('username')}])
            })
    }
    const unFollow = () => {
        console.log('unfollow');
        axios.delete(`http://localhost:8000/api/v1/users/${user.username}/unfollow`,
            {
                headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token') 
                }
            }
        )
            .then(res => {
                if(res.status === 204) {
                    setIsFollow(prev => ({button: 'Follow', isFollow: false, followers_count: prev.followers_count - 1}))
                    const follower = followers
                    follower.pop();
                    setFollowers(follower)
                }
            })
    }
    if(user) {
        return (
            <main class="mt-5">
                <div class="container py-5">
                    <div class="px-5 py-4 bg-light mb-4 d-flex align-items-center justify-content-between">
                        <div>
                            <div class="d-flex align-items-center gap-2 mb-2">
                                <h5 class="mb-0">{user.full_name}</h5>
                                <span>@{user.username}</span>
                            </div>
                            <small class="mb-0 text-muted">
                                {user.bio}
                            </small>
                        </div>
                        <div>
                            {
                                user.is_your_account ? (
                                    <a href="/create" class="btn btn-primary w-100 mb-2">
                                        + Create new post
                                    </a>
                                ) : (
                                    <button class={`btn w-100 mb-2 btn-${isFollow.isFollow ? 'secondary' : 'primary'}`} onClick={() => {
                                        !isFollow.isFollow ? follow() : unFollow()
                                    }}>
                                        {isFollow.button}
                                    </button>
                                )

                            }
                            
                            <div class="d-flex gap-3">
                                <div>
                                    <div class="profile-label"><b>{user.posts_count}</b> posts</div>
                                </div>
                                <div class="profile-dropdown">
                                    <div class="profile-label"><b>{isFollow.followers_count}</b> followers</div>
                                    <div class="profile-list">
                                        <div class="card">
                                            <div class="card-body">
                                               {
                                                    followers.map(r => (
                                                        <div class="profile-user">
                                                            <a href={`/profile/${r.username}`}>@{r.username}</a>
                                                        </div>
                                                    ))
                                               }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="profile-dropdown">
                                    <div class="profile-label"><b>{user.followings_count}</b> following</div>
                                    <div class="profile-list">
                                        <div class="card">
                                            <div class="card-body">
                                                {
                                                    followings.map(r => (
                                                        <div class="profile-user">
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
                        user.is_private && (user.following_status === 'not-following' || user.following_status === 'requested') && !user.is_your_account ? <div class="card py-4">
                            <div class="card-body text-center">
                                &#128274; This account is private
                            </div>
                        </div> :
                        <div class="row justify-content-center">
                            {
                                user.posts.map(p => (
                                    <div class="col-md-4">
                                        <div class="card mb-4">
                                            <div class="card-body">
                                                <div class="card-images mb-2">
                                                    {
                                                        p.attachments.map(a => <img src={`http://localhost:8000/storage/${a.storage_path}`} alt="image" class="w-100"/>)
                                                    }
                                                </div>
                                                <p class="mb-0 text-muted">{p.caption}</p>
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
}

export default Profile