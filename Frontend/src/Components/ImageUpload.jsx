import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase-config";

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [downloadURL, setDownloadURL] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      console.log("No file selected!");
      return;
    }

    // Save the file in the "peopleFirst" folder in Firebase Storage
    const storageRef = ref(storage, `peopleFirst/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.error("Error uploading file:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log("File available at:", url);
          setDownloadURL(url);
        });
      }
    );
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Image</button>

      {downloadURL && (
        <div>
          <p>Image successfully uploaded! Access it here:</p>
          <a href={downloadURL} target="_blank" rel="noopener noreferrer">
            {downloadURL}
          </a>
          <div>
            <p>Preview:</p>
            <img src={downloadURL} alt="Uploaded" style={{ width: "300px", marginTop: "10px" }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
