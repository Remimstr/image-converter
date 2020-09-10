import React, { useState } from "react";
import "./App.css";

const API_BASE_URL = process.env.API_BASE_URL || "http://127.0.0.1:5000"

function App() {
	const [uploadedImage, setUploadedImage] = useState();
	const [targetFileType, setTargetFileType] = useState("GIF");
	const [pending, setPending] = useState(false);


	const handleImageChange = (e) => {
		if (e.target.files.length === 1) {
			setUploadedImage(e.target.files[0])
		}
	}

	const handleTargetSelectionChange = (e) => {
	  if (e.target.value) {
	  	setTargetFileType(e.target.value);
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!uploadedImage) {
			throw new Error("Please upload an image");
		}
		if (!targetFileType) {
			throw new Error("Please choose a target file type");
		}

		setPending(true);
		let formData = new FormData();
		formData.append("file", uploadedImage);
		formData.append("target_file_type", targetFileType);

		let response;
		try {
			response = await fetch(
				API_BASE_URL + "/image/convert",
				{
					method: "post",
					body: formData,
				}
			)
		} catch (e) {
			alert("Unable to connect to the server, are you sure it's running?");
		}

		if (response) {
			if (response.ok) {
				try {
					const blob = await response.blob();
					let reader = new FileReader();
					reader.onload = function() {
						let a = document.createElement('a');
						document.body.appendChild(a);
						a.download = uploadedImage.name.replace(/\.[^/.]+$/, "");
						a.href = typeof this.result === "string" ?
							this.result : this.result.toString();
						a.click();
					}
					reader.readAsDataURL(blob);
				} catch (e) {
					alert("Unable to convert file, something went wrong");
				}
			} else {
				const responseText = await response.text();
				// In this case we trust the server's error messages
				alert(responseText);
			}
		}

		setPending(false);
	};

  return (
  	<div className="App-header">
  		<h1>Upload an Image To Convert</h1>
  		<form onSubmit={handleSubmit} className="form">
				<div>
					<input type="file"
								 name="file-to-convert"
								 accept="image/png, image/jpeg, image/bmp, image/gif"
								 onChange={handleImageChange}
								 required
					/>
				</div>
        <div>
					Choose a conversion target&nbsp;
					<select onChange={handleTargetSelectionChange}>
						<option value="GIF">GIF</option>
						<option value="BMP">BMP</option>
						<option value="PNG">PNG</option>
						<option value="JPEG">JPEG</option>
					</select>
				</div>
				<div id="submit-container">
					<input type="submit"
								 id="submit-button"
								 disabled={pending || !uploadedImage || !targetFileType}
					/>
				</div>
  		</form>
  	</div>
	)
}

export default App;
