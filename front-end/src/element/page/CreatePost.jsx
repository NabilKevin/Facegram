import { useEffect, useState } from "react"
import axios from "axios";

const CreatePost = ({error, setError, setLoading}) => {
	useEffect(() => {
		document.title = 'Create Post'
		setLoading(false)
	})
	let isUploading = false;
	const create = async e => {
		e.preventDefault()
		if(!isUploading) {
			isUploading = true	
			const formData = {}
			Array.from(e.target).forEach(e => {
				if(e.tagName.toLowerCase() !== 'button') {
					if(e.name !== 'attachments') {
						formData[e.name] = e.value
					} else {
						formData[e.name] = []
						Array.from(e.files).forEach (image => {
							formData[e.name] = [...formData[e.name], image]
						})
					}
				}
			})
			try {
				await axios.post('http://localhost:8000/api/v1/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true });
				location.replace('/')
			} catch(err) {
				console.log(err);
				setError(err.response.data.errors);
			}
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
														<form onSubmit={create}>
																<div className="mb-2">
																		<label htmlFor="caption">Caption</label>
																		<textarea className={`form-control ${error?.caption ? 'is-invalid' : ''}`}  name="caption" id="caption" cols="30" rows="3"></textarea>
																		{
																				error?.caption && 
																				<div id="validationServerUsernameFeedback" className="invalid-feedback">
																						{error.caption[0]}
																				</div>
																		}
																</div>

																<div className="mb-3">
																		<label htmlFor="attachments">Image(s)</label>
																		<input type="file" className={`form-control ${error?.attachments ? 'is-invalid' : ''}`} id="attachments" name="attachments" multiple/>
																		{
																				error?.attachments && 
																				<div id="validationServerUsernameFeedback" className="invalid-feedback">
																						{error.attachments[0]}
																				</div>
																		}
																</div>

																<button type="submit" className="btn btn-primary w-100">
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