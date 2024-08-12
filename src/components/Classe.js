import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import axios from 'axios';
import Appbar from './Appbar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import QRCode from 'qrcode.react';

export default function Student() {
  const paperStyle = { padding: '50px 20px', width: 600, margin: '20px auto' };
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [students, setStudents] = useState([]);
  const [editStudent, setEditStudent] = useState(null);
  const [deleteStudent, setDeleteStudent] = useState(null);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [classe, setClasse] = useState('');
  const [cin, setCin] = useState('');
  const [error, setError] = useState('');

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

  const handleSearch = (e) => {
    e.preventDefault();

    if (firstName && lastName) {
      axios.get(`http://localhost:8082/student/name/${firstName}/${lastName}`)
        .then(response => {
          setStudents(response.data);
        })
        .catch(error => {
          console.error("There was an error fetching the students!", error);
        });
    }
  };

  const handleEdit = (student) => {
    setEditStudent(student);
    setAddress(student.address);
    setPhone(student.phone);
    setEmail(student.email);
    setClasse(student.classe);
    setCin(student.cin);
  };

  const handleUpdate = () => {
    if (editStudent.firstName.length < 5 || address.length < 3 || phone.length !== 8 || !email.includes('@')) {
      setError("First name must be at least 5 characters long, address must be at least 3 characters long, phone number must be 8 digits, and email must contain '@'");
      return;
    }

    axios.put(`http://localhost:8082/student/update/${editStudent.id}`, {
      ...editStudent,
      address,
      phone,
      email,
      classe,
      cin
    })
    .then(() => {
      setEditStudent(null);
      fetchStudents();
    })
    .catch(error => {
      console.error("There was an error updating the student!", error);
    });
  };

  const confirmDelete = () => {
    axios.delete(`http://localhost:8082/student/delete/${deleteStudent.id}`)
    .then(() => {
      setDeleteStudent(null);
      fetchStudents();
    })
    .catch(error => {
      console.error("There was an error deleting the student!", error);
    });
  };

  const fetchStudents = () => {
    if (firstName && lastName) {
      axios.get(`http://localhost:8082/student/name/${firstName}/${lastName}`)
        .then(response => {
          setStudents(response.data);
        })
        .catch(error => {
          console.error("There was an error fetching the students!", error);
        });
    }
  };

  const formatVCard = (student) => {
    return `BEGIN:VCARD
VERSION:3.0
FN:${student.firstName} ${student.lastName}
TEL:${student.phone || ''}
EMAIL:${student.email || ''}
ADR:;;${student.address};;;
END:VCARD`;
  };

  const handleSendEmail = (student) => {
    const mailtoLink = `mailto:${student.email}`;
    window.location.href = mailtoLink;
  };

  return (
    <div>
      <div style={backgroundStyle}></div>
      <div style={overlayStyle}></div>
      <Appbar />
      <Container style={{ marginTop: '100px' }}>
        <Paper elevation={3} style={paperStyle}>
          <h1 style={{ color: "blue", textAlign: "center" }}>Recherche d'Étudiants</h1>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TextField
              id="student-firstname"
              label="Prénom de l'étudiant"
              variant="outlined"
              fullWidth
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={{ marginBottom: '20px' }}
            />
            <TextField
              id="student-lastname"
              label="Nom de l'étudiant"
              variant="outlined"
              fullWidth
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={{ marginBottom: '20px' }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
            >
              Chercher
            </Button>
          </Box>
        </Paper>
        <Paper elevation={3} style={paperStyle}>
          <h2 style={{ textAlign: "center", color: "blue" }}>Résultats de la recherche</h2>
          {students.length > 0 ? (
            students.map(student => (
              <Paper elevation={6} style={{ margin: "10px", padding: "15px", textAlign: "left", display: "flex", justifyContent: "space-between" }} key={student.id}>
                <div>
                  <div><strong>ID:</strong> {student.id}</div>
                  <div><strong>Prénom:</strong> {student.firstName}</div>
                  <div><strong>Nom:</strong> {student.lastName}</div>
                  <div><strong>Adresse:</strong> {student.address}</div>
                  <div><strong>Classe:</strong> {student.classe}</div>
                  <div><strong>Numéro de téléphone:</strong> {student.phone}</div>
                  <div><strong>Email:</strong> {student.email}</div>
                  <div><strong>CIN:</strong> {student.cin}</div>
                  <br/>
                  <Button variant="outlined" color="primary" onClick={() => handleEdit(student)}>
                    Modifier
                  </Button>
                  <Button variant="outlined" color="secondary" style={{ marginLeft: '10px' }} onClick={() => setDeleteStudent(student)}>
                    Supprimer
                  </Button>
                  <Button variant="outlined" color="success" style={{ marginLeft: '10px' }} onClick={() => handleSendEmail(student)}>
                    Envoyer Email
                  </Button>
                </div>
                <QRCode value={formatVCard(student)} />
              </Paper>
            ))
          ) : (
            <p style={{ textAlign: "center" }}>Aucun étudiant trouvé.</p>
          )}
        </Paper>

        {/* Dialogue pour modifier un étudiant */}
        <Dialog open={!!editStudent} onClose={() => setEditStudent(null)}>
          <DialogTitle>Modifier l'étudiant</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Prénom"
              fullWidth
              value={editStudent?.firstName || ''}
              onChange={(e) => setEditStudent({ ...editStudent, firstName: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Nom"
              fullWidth
              value={editStudent?.lastName || ''}
              onChange={(e) => setEditStudent({ ...editStudent, lastName: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Adresse"
              fullWidth
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Numéro de téléphone"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Classe"
              fullWidth
              value={classe}
              onChange={(e) => setClasse(e.target.value)}
            />
            <TextField
              margin="dense"
              label="CIN"
              fullWidth
              value={cin}
              onChange={(e) => setCin(e.target.value)}
            />
            {error && <Typography color="error">{error}</Typography>}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditStudent(null)} color="primary">
              Annuler
            </Button>
            <Button onClick={handleUpdate} color="primary">
              Mettre à jour
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialogue pour confirmer la suppression */}
        <Dialog open={!!deleteStudent} onClose={() => setDeleteStudent(null)}>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Êtes-vous sûr de vouloir supprimer l'étudiant {deleteStudent?.firstName} {deleteStudent?.lastName} ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteStudent(null)} color="primary">
              Annuler
            </Button>
            <Button onClick={confirmDelete} color="secondary">
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
}
