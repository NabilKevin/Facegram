import { useState } from "react"
import axios from "axios";

const CreatePost = ({changeInput, error, setError, setLoading}) => {
    let isUploading = false;
    setLoading(false)
    const [formData, setFormData] = useState({
        caption: '',
        attachments: []
    });
    const handleFileChange = (e) => {
        for(const image in e.target.files) {
            console.log(image);
            setFormData(prev => ({...prev, attachments: [...prev.attachments ,e.target.files[image]]}))
        }
    };
    const create = () => {
        if(!isUploading) {
            console.log(formData);
            isUploading = true
            axios.post('http://localhost:8000/api/v1/posts', formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: 'Bearer ' + localStorage.getItem('token') 
                  }
                }
              )
                .then(res => {
                  location.replace('/')
                })
                .catch(err => {
                    setError(err.response.data.errors);
                })
        }
    }
    return (
        <main className="mt-5">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="card">
                            <div className="card-header d-flex align-items-center justify-content-between bg-transparent py-3">
                                <h5 className="mb-0">Create new post</h5>
                            </div>
                            <div className="card-body">
                                <form action="my-profile.html">
                                    <div className="mb-2">
                                        <label htmlFor="caption">Caption</label>
                                        <textarea className={`form-control ${error?.caption && 'is-invalid'}`}  name="caption" id="caption" cols="30" rows="3" onChange={e => changeInput(e, setFormData, formData)}></textarea>
                                        {
                                            error?.caption && 
                                            <div id="validationServerUsernameFeedback" class="invalid-feedback">
                                                {error.caption[0]}
                                            </div>
                                        }
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="attachments">Image(s)</label>
                                        <input type="file" className={`form-control ${error?.attachments && 'is-invalid'}`} id="attachments" name="attachments" multiple onChange={handleFileChange}/>
                                        {
                                            error?.attachments && 
                                            <div id="validationServerUsernameFeedback" class="invalid-feedback">
                                                {error.attachments[0]}
                                            </div>
                                        }
                                    </div>

                                    <button type="button" onClick={create} className="btn btn-primary w-100">
                                        Share
                                    </button>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    )
}

export default CreatePost