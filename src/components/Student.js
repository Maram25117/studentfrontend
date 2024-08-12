import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

export default function Student() {
  const paperStyle = { padding: '50px 20px', width: 600, margin: '20px auto' };
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [cin, setCin] = useState('');
  const [classe, setClasse] = useState('');
  const [students, setStudents] = useState([]);
  const [showList, setShowList] = useState(false);
  const [error, setError] = useState('');
  const [editStudent, setEditStudent] = useState(null);
  const [deleteStudent, setDeleteStudent] = useState(null);

  const validateFields = () => {
    if (!firstName || !lastName || !address || !phone || !email || !cin || !classe) {
      setError('Tous les champs sont obligatoires');
      return false;
    }
    if (firstName.length < 2 || lastName.length < 2) {
      setError('Prénom et nom doivent avoir au moins 2 caractères');
      return false;
    }
    if (address.length < 3) {
      setError('Adresse doit avoir au moins 3 caractères');
      return false;
    }
    if (phone.length !== 8 || isNaN(phone)) {
      setError('Le numéro de téléphone doit contenir exactement 8 chiffres');
      return false;
    }
    if (!email.includes('@')) {
      setError('L\'adresse email doit contenir un @');
      return false;
    }
    if (cin.length !== 8 || isNaN(cin)) {
      setError('Le CIN doit contenir exactement 8 chiffres');
      return false;
    }
    setError('');
    return true;
  };

  const handleClick = (e) => {
    e.preventDefault();

    if (!validateFields()) return;

    const student = { firstName, lastName, address, phone, email, cin, classe };
    fetch("http://localhost:8082/student/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    }).then(() => {
      console.log("Nouvel étudiant ajouté");
      setFirstName('');
      setLastName('');
      setAddress('');
      setPhone('');
      setEmail('');
      setCin('');
      setClasse('');
      fetchStudents();
    });
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:8082/student/getAll");
      if (response.ok) {
        const result = await response.json();
        setStudents(result);
      } else {
        console.error('Erreur lors de la récupération des étudiants');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleShowList = () => {
    setShowList(!showList);
    if (!showList) {
      fetchStudents();
    }
  };

  const handleDelete = (student) => {
    setDeleteStudent(student);
  };

  const confirmDelete = () => {
    fetch(`http://localhost:8082/student/delete/${deleteStudent.id}`, {
      method: 'DELETE',
    }).then(() => {
      setDeleteStudent(null);
      fetchStudents();
    });
  };

  const handleEdit = (student) => {
    setEditStudent(student);
  };

  const confirmEdit = () => {
    if (!validateFields()) return;

    fetch(`http://localhost:8082/student/update/${editStudent.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editStudent),
    }).then(() => {
      setEditStudent(null);
      fetchStudents();
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container>
      <Paper elevation={3} style={paperStyle}>
        <h1 style={{ color: "blue", textAlign: "center" }}>Ajouter Étudiant</h1>
        <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 1 },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="student-first-name"
            label="Prénom"
            variant="outlined"
            fullWidth
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            id="student-last-name"
            label="Nom"
            variant="outlined"
            fullWidth
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            id="student-address"
            label="Adresse"
            variant="outlined"
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <TextField
            id="student-phone"
            label="Numéro de téléphone"
            variant="outlined"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <TextField
            id="student-email"
            label="Adresse e-mail"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            id="student-cin"
            label="CIN"
            variant="outlined"
            fullWidth
            value={cin}
            onChange={(e) => setCin(e.target.value)}
          />
          <TextField
            id="student-class"
            label="Classe"
            variant="outlined"
            fullWidth
            value={classe}
            onChange={(e) => setClasse(e.target.value)}
          />
          {error && <Typography color="error">{error}</Typography>}
          <div style={{ display: 'grid', placeItems: 'center' }}>
            <Button variant="contained" onClick={handleClick}>
              Ajouter
            </Button>
          </div>
        </Box>
      </Paper>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button variant="contained" onClick={handleShowList}>
          {showList ? 'Cacher Liste' : 'Afficher Liste'}
        </Button>
      </div>

      {showList && (
        <Paper elevation={3} style={paperStyle}>
          <h1 style={{ color: "blue", textAlign: "center" }}>Liste des Étudiants</h1>
          {students.map(student => (
            <Paper
              elevation={6}
              style={{ margin: "10px", padding: "15px", textAlign: "left" }}
              key={student.id}
            >
              ID: {student.id}<br />
              Prénom: {student.firstName}<br />
              Nom: {student.lastName}<br />
              Adresse: {student.address}<br />
              Numéro de téléphone: {student.phone}<br />
              Adresse e-mail: {student.email}<br />
              CIN: {student.cin}<br />
              Classe: {student.classe}<br />
              <br/>
              <Button variant="outlined" color="primary" onClick={() => handleEdit(student)}>
                Modifier
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => handleDelete(student)} style={{ marginLeft: '10px' }}>
                Supprimer
              </Button>
            </Paper>
          ))}
        </Paper>
      )}

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
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!editStudent} onClose={() => setEditStudent(null)}>
        <DialogTitle>Modifier l'étudiant</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Prénom"
            type="text"
            fullWidth
            value={editStudent?.firstName || ''}
            onChange={(e) => setEditStudent({ ...editStudent, firstName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Nom"
            type="text"
            fullWidth
            value={editStudent?.lastName || ''}
            onChange={(e) => setEditStudent({ ...editStudent, lastName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Adresse"
            type="text"
            fullWidth
            value={editStudent?.address || ''}
            onChange={(e) => setEditStudent({ ...editStudent, address: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Numéro de téléphone"
            type="text"
            fullWidth
            value={editStudent?.phone || ''}
            onChange={(e) => setEditStudent({ ...editStudent, phone: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Adresse e-mail"
            type="text"
            fullWidth
            value={editStudent?.email || ''}
            onChange={(e) => setEditStudent({ ...editStudent, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="CIN"
            type="text"
            fullWidth
            value={editStudent?.cin || ''}
            onChange={(e) => setEditStudent({ ...editStudent, cin: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Classe"
            type="text"
            fullWidth
            value={editStudent?.classe || ''}
            onChange={(e) => setEditStudent({ ...editStudent, classe: e.target.value })}
          />
          {error && <Typography color="error">{error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditStudent(null)} color="primary">
            Annuler
          </Button>
          <Button onClick={confirmEdit} color="primary">
            Modifier
          </Button>
        </DialogActions>
      </Dialog>

      {/* Fixed Scroll to Top Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={scrollToTop}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
        }}
      >
        Haut de Page ⇑
      </Button>
    </Container>
  );
}

