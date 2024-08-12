import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button'; // Import Button component
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteIcon from '@mui/icons-material/Delete';
import Paper from '@mui/material/Paper';
import Appbar from './Appbar';
import axios from 'axios';

// Define your styles
const paperStyle = { padding: '50px 20px', width: 600, margin: '20px auto' };
const backgroundStyle = {
  backgroundImage: 'url("/etudiant.png")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  filter: 'blur(8px)',
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: -1,
};
const overlayStyle = {
  position: 'relative',
  zIndex: 1,
};

const Document = () => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null); // State for the PDF preview
  const [viewingFile, setViewingFile] = useState(null); // State to keep track of the file being viewed
  const fileInputRef = useRef(null); // Ref to access the file input element

  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://localhost:8082/file');
      setPdfFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  /*const handleFileChange = async (event) => {
    const files = event.target.files;
    if (files.length === 0) return;

    const formData = new FormData();
    for (let file of files) {
      formData.append('files', file);
    }

    try {
      await axios.post('http://localhost:8082/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchFiles(); // Refresh file list after upload
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };*/
  const handleFileChange = async (event) => {
    const files = event.target.files;
    const formData = new FormData();
    Array.from(files).forEach(file => {
        formData.append('files', file);
    });

    try {
        await axios.post('http://localhost:8082/file/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        // Affichez un message de succès ou mettez à jour l'état
        console.log('Fichiers téléchargés avec succès');
    } catch (error) {
        console.error('Erreur lors du téléversement des fichiers:', error);
        // Affichez un message d'erreur à l'utilisateur
    }
};



  const handleDownload = (id, name) => {
    axios({
      url: `http://localhost:8082/file/${id}`,
      method: 'GET',
      responseType: 'blob',
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up link element
    }).catch(error => {
      console.error('Error downloading file:', error);
    });
  };

  const handlePreview = (id) => {
    axios({
      url: `http://localhost:8082/file/${id}`,
      method: 'GET',
      responseType: 'blob',
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      setPreviewUrl(url); // Set the URL for the PDF preview
      setViewingFile(id); // Set the ID of the file being viewed
    }).catch(error => {
      console.error('Error previewing file:', error);
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Voulez-vous supprimer ce document ?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8082/file/${id}`);
        fetchFiles(); // Refresh file list after deletion
        if (viewingFile === id) {
          setPreviewUrl(null); // Clear the preview if the deleted file was being viewed
          setViewingFile(null);
        }
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  };

  const handleBack = () => {
    setPreviewUrl(null);
    setViewingFile(null); // Hide the PDF and show the list
  };

  const handleImportClick = () => {
    fileInputRef.current.click(); // Trigger the file input click event
  };

  useEffect(() => {
    fetchFiles(); // Fetch files when component mounts
  }, []);

  return (
    <div>
      <div style={backgroundStyle}></div>
      <div style={overlayStyle}></div>
      <Appbar />
      <Box sx={{ marginTop: '100px', textAlign: 'center' }}>
        <Paper elevation={3} style={paperStyle}>
          {previewUrl ? (
            <div>
              <Button
                color="primary"
                variant="outlined"
                onClick={handleBack}
                style={{ marginBottom: '20px' }}
              >
                Retour à la Liste
              </Button>
              <iframe
                src={previewUrl}
                title="PDF Preview"
                style={{ width: '100%', height: '600px', border: 'none' }}
              />
            </div>
          ) : (
            <div>
              <h2 style={{ textAlign: 'center', color: 'blue' }}>Importer un Document PDF</h2>
              <Button
                color="primary"
                variant="outlined"
                onClick={handleImportClick}
                style={{ marginBottom: '20px' }}
              >
                Importer un Document PDF
              </Button>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }} // Hide the file input
                ref={fileInputRef}
                multiple
              />
              {pdfFiles.length > 0 && (
                <Paper elevation={3} style={{ padding: '20px', textAlign: 'left' }}>
                  <ul>
                    {pdfFiles.map((file) => (
                      <li key={file.id} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                        <span style={{ flexGrow: 1 }}>{file.name}</span>
                        <IconButton
                          style={{ marginLeft: '10px' }}
                          onClick={() => handlePreview(file.id)}
                        >
                          <OpenInNewIcon />
                        </IconButton>
                        <IconButton
                          style={{ marginLeft: '10px' }}
                          onClick={() => handleDownload(file.id, file.name)}
                        >
                          <DownloadIcon />
                        </IconButton>
                        <IconButton
                          style={{ marginLeft: '10px' }}
                          onClick={() => handleDelete(file.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </li>
                    ))}
                  </ul>
                </Paper>
              )}
            </div>
          )}
        </Paper>
      </Box>
    </div>
  );
};

export default Document;
