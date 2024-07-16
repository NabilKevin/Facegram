import { useEffect, useState } from 'react'
import {Home, Navbar, Login, Register, Profile, CreatePost, Loading} from './element/Main'
import './css/main.css'
import {Routes, Route} from 'react-router-dom'
import axios from 'axios';

function App() {
  const [authData, setAuthData] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const AuthController = method => {
    axios.post(`http://localhost:8000/api/v1/auth/${method}`, authData)
      .then(res => {
        const data = res.data;
        localStorage.setItem('token', data['token'])
        localStorage.setItem('username', data['user']['username'])
        location.replace('/')
      })
      .catch(err => {
        setError(err.response.data.errors);
      })
  }
  const logout = () => {
    axios.post('http://localhost:8000/api/v1/auth/logout', {},
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token') 
        }
      }
    )
      .then(res => {
        localStorage.clear()
        location.replace('/login')
      })
  }
  const changeInput = (e, setData, data) => {
    setData({...data, [e.target.name]: e.target.value})
  }
  useEffect(() => {
    setLoading(true)
    const token = localStorage.getItem('token');
    const path = location.pathname.split('/');
    if((path[1] === 'login' || path[1] === 'register') && token) {
      location.replace('/')
    }
    if((path.length > 2 || (path[1] !== 'login' && path[1] !== 'register')) && !token) {
      location.replace('/login')
    }
  }, []);
  return (
    <>
      {
        loading && <Loading />
      }
      <Navbar logout={logout} />
      <Routes>
        <Route path='/' element={<Home setLoading={setLoading} />} />
        <Route path='/login' element={<Login authData={authData} AuthController={AuthController} setAuthData={setAuthData} changeInput={changeInput} error={error} setLoading={setLoading} />} />
        <Route path='/register' element={<Register authData={authData} AuthController={AuthController} setAuthData={setAuthData} changeInput={changeInput} error={error} setLoading={setLoading} />} />
        <Route path='/profile/*' element={<Profile setLoading={setLoading} />} />
        <Route path='/create' element={<CreatePost changeInput={changeInput} error={error} setError={setError} setLoading={setLoading} />} />
      </Routes>
    </>
  )
}

export default App
