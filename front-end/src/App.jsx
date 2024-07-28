import { useEffect, useState } from 'react'
import {Home, Navbar, Login, Register, Profile, CreatePost, Loading} from './element/Main'
import './css/main.css'
import {Routes, Route} from 'react-router-dom'
import axios from 'axios';

function App() {
  axios.defaults.withCredentials = true;
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const AuthController = async (e, method) => {
    e.preventDefault()
    try {
      const authdata = {}
      Array.from(e.target).forEach(e => {
        if(e.tagName.toLowerCase() !== 'button') {
          if(e.type.toLowerCase() === 'checkbox') {
            authdata[e.name] = e.checked
          } else {
            authdata[e.name] = e.value
          }
        }
      })
      const response = await axios.post(`http://localhost:8000/api/v1/auth/${method}`, authdata)
      const data = response.data;
      localStorage.setItem('username', data['user']['username'])
      location.replace('/')
    } catch(err) {
      setError(err.response.data);
    }
  }
  const logout = async () => {
    const response = await axios.post('http://localhost:8000/api/v1/auth/logout', {})
    if(response.status === 200) {
      location.replace('/login')
    }
  }
  
  useEffect(() => {
    const checkAuth = async () => {
      const path = location.pathname.split('/')
      try {
        const response = await axios.get('http://localhost:8000/api/v1/checkAuth', {})
        if(response.status === 200) {
          if(path[1] === 'login' || path[1] === 'register') {
            location.replace('/')
          }
        }
      } catch {
        if(path.length > 2 || (path[1] !== 'login' && path[1] !== 'register')) {
          location.replace('/login')
        }
        setLoading(false)
      }
    }
    checkAuth();
  }, []);
  return (
    <>
      {
        loading && <Loading />
      }
      <Navbar logout={logout} />
      <Routes>
        <Route path='/' element={<Home setLoading={setLoading} />} />
        <Route path='/login' element={<Login AuthController={AuthController} error={error} />} />
        <Route path='/register' element={<Register AuthController={AuthController} error={error} />} />
        <Route path='/profile/*' element={<Profile setLoading={setLoading} />} />
        <Route path='/create' element={<CreatePost error={error} setError={setError} setLoading={setLoading} />} />
      </Routes>
    </>
  )
}

export default App
