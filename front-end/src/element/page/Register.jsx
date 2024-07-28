const Register = ({AuthController, error}) => {
    document.title = 'Register'
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
                                <h5 className="mb-0">Register</h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={e => AuthController(e, 'register')}>
                                    <div className="mb-2">
                                        <label htmlFor="full_name">Full Name</label>
                                        <input type="text" className={`form-control ${error?.errors?.full_name ? 'is-invalid' : ''}`} id="full_name" name="full_name"/>
                                        {
                                            error?.errors?.full_name && 
                                            <div id="validationServerUsernameFeedback" className="invalid-feedback">
                                                {error.errors.full_name[0]}
                                            </div>
                                        }
                                    </div>

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

                                    <div className="mb-3">
                                        <label htmlFor="bio">Bio</label>
                                        <textarea name="bio" id="bio" cols="30" rows="3" className={`form-control ${error?.errors?.bio ? 'is-invalid' : ''}`}></textarea>
                                        {
                                            error?.errors?.bio && 
                                            <div id="validationServerUsernameFeedback" className="invalid-feedback">
                                                {error.errors.bio[0]}
                                            </div>
                                        }
                                    </div>

                                    <div className="mb-3 d-flex align-items-center gap-2">
                                        <input type="checkbox" id="is_private" name="is_private"/>
                                        <label htmlFor="is_private">Private Account</label>
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100">
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