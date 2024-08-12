import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom'; // Utiliser useNavigate pour la navigation
import Appbar from './Appbar';



export default function Modification() {
  const paperStyle = { padding: '50px 20px', width: 600, margin: '20px auto' };

  // États pour les champs de formulaire
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [classe, setClasse] = useState('');
  const [message, setMessage] = useState(''); // État pour le message de succès

  const navigate = useNavigate(); // Utiliser useNavigate pour la navigation

  const handleUpdate = async () => {
    // Construire l'objet à envoyer uniquement avec les champs non vides
    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (address) updatedFields.address = address;
    if (classe) updatedFields.classe = classe;

    if (Object.keys(updatedFields).length === 0) {
      setMessage('Veuillez remplir au moins un champ');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8082/student/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFields),
      });

      if (response.ok) {
        setMessage('Modification terminée');

        // Réinitialiser les champs du formulaire après la modification réussie
        setId('');
        setName('');
        setAddress('');
        setClasse('');
      } else {
        setMessage('Erreur lors de la modification');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('Erreur lors de la modification');
    }
  };

  return (
    <div className='Modification'>
    <Appbar/>
    <Container style={{ marginTop: '100px' }}>
      <Paper elevation={3} style={paperStyle}>
        <h1 style={{ color: 'blue', textAlign: 'center' }}>Modifier un Étudiant</h1>
        <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 1 },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="student-id"
            label="ID de l'étudiant"
            variant="outlined"
            fullWidth
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <TextField
            id="student-name"
            label="Nom de l'étudiant"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            id="student-address"
            label="Adresse de l'étudiant"
            variant="outlined"
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <TextField
            id="student-classe"
            label="Classe de l'étudiant"
            variant="outlined"
            fullWidth
            value={classe}
            onChange={(e) => setClasse(e.target.value)}
          />
          <div style={{ display: 'grid', placeItems: 'center' }}>
            <Button variant="contained" onClick={handleUpdate}>
              Modifier
            </Button>
          </div>
        </Box>
        {message && <p style={{ textAlign: 'center', color: 'green' }}>{message}</p>}
      </Paper>
    </Container>
    </div>
  );
}
