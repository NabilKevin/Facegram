import { useEffect } from "react"

const Register = ({authData, AuthController, setAuthData, changeInput, error, setLoading}) => {
    useEffect(() => {
        setLoading(false)
        setAuthData({
            'full_name': '',
            'bio': '',
            'is_private': false,
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
                                <h5 className="mb-0">Register</h5>
                            </div>
                            <div className="card-body">
                                <form action="homepage.html">
                                    <div className="mb-2">
                                        <label htmlFor="full_name">Full Name</label>
                                        <input type="text" className={`form-control ${error?.full_name && 'is-invalid'}`} id="full_name" name="full_name" onChange={e => changeInput(e, setAuthData, authData)}/>
                                        {
                                            error?.full_name && 
                                            <div id="validationServerUsernameFeedback" class="invalid-feedback">
                                                {error.full_name[0]}
                                            </div>
                                        }
                                    </div>

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

                                    <div className="mb-3">
                                        <label htmlFor="bio">Bio</label>
                                        <textarea name="bio" id="bio" cols="30" rows="3" className={`form-control ${error?.bio && 'is-invalid'}`} onChange={e => changeInput(e, setAuthData, authData)}></textarea>
                                        {
                                            error?.bio && 
                                            <div id="validationServerUsernameFeedback" class="invalid-feedback">
                                                {error.bio[0]}
                                            </div>
                                        }
                                    </div>

                                    <div className="mb-3 d-flex align-items-center gap-2">
                                        <input type="checkbox" id="is_private" name="is_private" onChange={e => changeInput({
                                            target: {
                                                name: 'is_private',
                                                value: !authData.is_private
                                            }
                                        }, setAuthData, authData)}/>
                                        <label htmlFor="is_private">Private Account</label>
                                    </div>

                                    <button type="button" onClick={() => AuthController('register')} className="btn btn-primary w-100">
                                        Register
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="text-center mt-4">
                            Already have an account? <a href="/login">Login</a>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    )
}

export default Register