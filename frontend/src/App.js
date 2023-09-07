import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    fetchUploadedFiles();
  },[]);

  const fetchUploadedFiles = async () => {
    try {
      const response = await axios.get('/api/files/');
      setUploadedFiles(response.data);
      console.log(response.data)
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(file);

    const form_data = new FormData();
    form_data.append('file', file, file.name);

    const url = '/api/files/';
    axios.post(url, form_data, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
    .then(response => {
      console.log(response.data);
      fetchUploadedFiles();
    })
    .catch(error => console.log(error));
  };

  const downloadFiles = (url, fileName) => {
    axios({
      method: 'get',
      url,
      responseType: 'blob'
    })
    .then(response => {
      const href = window.URL.createObjectURL(response.data);
      const anchorElement = document.createElement('a');
      anchorElement.href = href;
      anchorElement.download = fileName;

      document.body.appendChild(anchorElement);
      anchorElement.click();

      document.body.removeChild(anchorElement);
      window.URL.revokeObjectURL(href);
    })
    .catch(error => console.log(error));
  };

  const deleteFiles = (url, id) => {
    axios.delete(`/api/files/${id}`)
    .then(response => {
      console.log('File delete');
      fetchUploadedFiles();
    })
    .catch(error => console.log(error));
  };
  
  const renderUploadedFiles = () => {
    return uploadedFiles.map(file => (
      <tr key={file.id}>
        <td>{file.file}</td>
        <td>
          <button onClick={() => downloadFiles(file.file, file.id)} className="btn btn-success">Download</button>
        </td>
        <td>
          <button onClick={() => deleteFiles(file.file, file.id)} className="btn btn-danger">Delete</button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="container-fluid">
      <h1 className="text-center alert alert-danger mt-2">Upload Rosbag</h1>
      <div className="row">
        <div className="col-md-7">
          <h2 className="alert alert-success">Files I have uploaded:</h2>
          <table className="table table-bordered mt-4">
            <thead>
              <tr>
                <th scope="col">File Title</th>
                <th scope="col">Download</th>
                <th scope="col">Delete</th>
              </tr>
            </thead>
            <tbody>
              {renderUploadedFiles()}
            </tbody>
          </table>
        </div>
        <div className="col-md-4">
          <h2 className="alert alert-success">File Upload Section</h2>
          <form onSubmit={handleSubmit}>
            <input type="file" id="file" onChange={handleFileChange} className="form-control" required />
            <button className="btn btn-primary float-left mt-2">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;
