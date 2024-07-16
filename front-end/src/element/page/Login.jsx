import { useEffect } from "react"

const Login = ({authData, AuthController, setAuthData, changeInput, error, setLoading}) => {
    useEffect(() => {
        setLoading(false)
        setAuthData({
            'username': '',
            'password': ''
        })
    }, [])
    return (
        <main className="mt-5">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="card">
                            <div className="card-header d-flex align-items-center justify-content-between bg-transparent py-3">
                                <h5 className="mb-0">Login</h5>
                            </div>
                            <div className="card-body">
                                <form action="homepage.html">
                                    <div className="mb-2">
                                        <label htmlFor="username">Username</label>
                                        <input type="text" className={`form-control ${error?.username && 'is-invalid'}`} id="username" name="username" onChange={e => changeInput(e, setAuthData, authData)}/>
                                        {
                                            error?.username && 
                                            <div id="validationServerUsernameFeedback" class="invalid-feedback">
                                                {error.username[0]}
                                            </div>
                                        }
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="password">Password</label>
                                        <input type="password" className={`form-control ${error?.password && 'is-invalid'}`} id="password" name="password" onChange={e => changeInput(e, setAuthData, authData)}/>
                                        {
                                            error?.password && 
                                            <div id="validationServerUsernameFeedback" class="invalid-feedback">
                                                {error.password[0]}
                                            </div>
                                        }
                                    </div>

                                    <button type="button" className="btn btn-primary w-100" onClick={() => AuthController('login')}>
                                        Login
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="text-center mt-4">
                            Don't have account? <a href="/register">Register</a>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    )
}

export default Login