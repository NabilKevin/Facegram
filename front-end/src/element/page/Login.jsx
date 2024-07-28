const Login = ({AuthController, error}) => {
    document.title = 'Login'
    return (
        <main className="mt-5">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        {
                            error?.message && (
                            <div class="alert alert-danger" role="alert">
                                {error.message}
                            </div>
                            )
                        }
                        <div className="card">
                            <div className="card-header d-flex align-items-center justify-content-between bg-transparent py-3">
                                <h5 className="mb-0">Login</h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={e => AuthController(e, 'login')}>
                                    <div className="mb-2">
                                        <label htmlFor="username">Username</label>
                                        <input type="text" className={`form-control ${error?.errors?.username ? 'is-invalid' : ''}`} id="username" name="username"/>
                                        {
                                            error?.errors?.username && 
                                            <div id="validationServerUsernameFeedback" className="invalid-feedback">
                                                {error.errors.username[0]}
                                            </div>
                                        }
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="password">Password</label>
                                        <input type="password" className={`form-control ${error?.errors?.password ? 'is-invalid' : ''}`} id="password" name="password"/>
                                        {
                                            error?.errors?.password && 
                                            <div id="validationServerUsernameFeedback" className="invalid-feedback">
                                                {error.errors.password[0]}
                                            </div>
                                        }
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100" >
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