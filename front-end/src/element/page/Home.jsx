import axios from 'axios';
import { useEffect, useState } from 'react';

const Home = ({setLoading}) => {
    document.title = 'Home'
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [request, setRequest] = useState([]);
    let isload = false
    let page = 0
    let size = 10;
    const getPosts = () => { 
        axios.get(`http://localhost:8000/api/v1/posts?page=${page}&size=10`, {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token') 
            }
        })
            .then(res => { 
                if(page === 0 && res.data.size < 10) {
                    size = res.data.size
                }
                res.data.posts.forEach(i => {
                    setPosts(prevPosts => {
                        if (prevPosts.length < size) {
                                return [...prevPosts, i];
                            }
                        return prevPosts
                    })
                })
                setLoading(false)
            })
    }
    const getUsers = () => { 
        axios.get('http://localhost:8000/api/v1/users', {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token') 
            }
        })
            .then(res => {
                setUsers([]);
                setUsers(prev => [...prev, ...res.data.users])
            })
    }
    const getRequest = () => { 
        axios.get(`http://localhost:8000/api/v1/users/${localStorage.getItem('username')}/followers`, {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token') 
            }
        })
            .then(res => {
                setRequest([]);
                const data = res.data.followers.filter(r => r.is_requested === true)
                setRequest(prev => [...prev, ...data])
            })
    }
    const scrollDown = e => {
        if(Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight) {
            if(!isload) {
                isload = true
                page += 1;
                size += 10
                getPosts();
                isload = false
            }
        }
    }
    useEffect(() => {
        setLoading(true)
        getUsers()
        getRequest()
        getPosts()
        window.addEventListener('scroll', scrollDown)
    }, [])
    const acceptRequest = username => {
        axios.put(`http://localhost:8000/api/v1/users/${username}/accept`, {}, {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token') 
            }
        })
            .then(() => {
                setRequest(request => request.filter(r => r.username !== username))
            })
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
    
    return (
        <main class="mt-5">
            <div class="container py-5">
                <div class="row justify-content-between">
                    <div class="col-md-8">
                        <h5 class="mb-3">News Feed</h5>
                        {posts.map(r => <div class="card mb-2">
                            <div class="card mb-4">
                                <div class="card-header d-flex align-items-center justify-content-between bg-transparent py-3">
                                    <h6 class="mb-0">{r.user.full_name}</h6>
                                    <small class="text-muted">{timeAgo(r.created_at)}</small>
                                </div>
                                <div class="card-body">
                                    <div class="card-images mb-2">
                                        {
                                            r.attachments.map(a => <img src={`http://localhost:8000/storage/${a.storage_path}`} alt="image" class="w-100"/>)
                                        }
                                    </div>
                                    <p class="mb-0 text-muted"><b><a href="user-profile.html">{r.user.username}</a></b> {r.caption}</p>
                                </div>
                            </div>
                        </div>)}
                    </div>
                    <div class="col-md-4">
                        <div class="request-follow mb-4">
                            {
                                request.length > 0 && (
                                    <>
                                    <h6 class="mb-3">Follow Requests</h6>
                                    <div class="request-follow-list">
                                            {
                                                request.map(r => (
                                                    <div class="card mb-2">
                                                        <div class="card-body d-flex align-items-center justify-content-between p-2">
                                                            <a href="user-profile-private.html">@{r.username}</a>
                                                            <button onClick={() => acceptRequest(r.username)} class="btn btn-primary btn-sm">
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
                        <div class="explore-people">
                            {
                                users.length > 0 && (
                                    <>
                                    <h6 class="mb-3">Explore People</h6>
                                    <div class="explore-people-list">
                                        {users.map(r => (
                                            <div class="card mb-2">
                                                <div class="card-body p-2">
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