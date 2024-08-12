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
import { jsPDF } from 'jspdf';

export default function Student() {
  const paperStyle = { padding: '50px 20px', width: 600, margin: '20px auto' };
  const [classe, setClasse] = useState('');
  const [students, setStudents] = useState([]);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [error, setError] = useState('');

  const backgroundStyle = {
    backgroundImage: 'url("/etudiant.png")', // Remplacez par le chemin vers votre image
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(8px)', // Applique un effet de flou à l'image de fond
    position: 'fixed', // Fixe l'image de fond
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1, // Place l'image de fond derrière tout le contenu
  };

  const overlayStyle = {
    position: 'relative',
    zIndex: 1, // Place le contenu au-dessus de l'image de fond
  };

  const handleSearch = (e) => {
    e.preventDefault(); // Empêcher le rechargement de la page lors de la soumission du formulaire

    if (classe) {
      axios.get(`http://localhost:8082/student/classe/${classe}`)
        .then(response => {
          setStudents(response.data);
          setError(''); // Clear any previous errors
        })
        .catch(error => {
          console.error("There was an error fetching the students!", error);
          setError("Erreur lors de la récupération des étudiants.");
        });
    } else {
      setError('Le champ de classe est vide.');
    }
  };

  const generatePDF = () => {
    if (!classe) {
      setError('Le champ de classe est vide.');
      return;
    }

    const doc = new jsPDF();

    // Set font to bold, color to blue, and font size to 16 for the title
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 255); // Blue color
    doc.setFontSize(18); // Increase font size for title

    // Title text
    const title = `Classe ${classe}`;
    
    // Center title
    const titleWidth = doc.getStringUnitWidth(title) * doc.internal.scaleFactor;
    const pageWidth = doc.internal.pageSize.getWidth();
    const xPosition = (pageWidth - titleWidth) / 2;
    
    doc.text(title, xPosition, 20); // Title at the top center

    // Reset font to normal and color to black for the rest of the text
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0); // Black color

    // Add student details
    students.forEach((student, index) => {
      const yPosition = 30 + (index * 20); // Position each entry
      doc.text(`${index + 1}. ${student.firstName} ${student.lastName}`, 10, yPosition);
    });

    doc.save(`Classe_${classe}.pdf`);
  };

  const handleGeneratePDF = () => {
    if (!classe) {
      setError('Le champ de classe est vide.');
    } else {
      setConfirmationOpen(true);
    }
  };

  const handleConfirmationClose = () => {
    setConfirmationOpen(false);
  };

  const handlePDFConfirm = () => {
    generatePDF();
    handleConfirmationClose();
  };

  return (
    <div>
      <div style={backgroundStyle}></div>
      <div style={overlayStyle}></div>
      <Appbar />
      <Container style={{ marginTop: '100px' }}>
        <Paper elevation={3} style={paperStyle}>
          <h1 style={{ color: "blue", textAlign: "center" }}>Liste des étudiants par classe</h1>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TextField
              id="student-classe"
              label="Classe de l'étudiant"
              variant="outlined"
              fullWidth
              value={classe}
              onChange={(e) => setClasse(e.target.value)}
              style={{ marginBottom: '20px' }}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={handleSearch}
            >
              Chercher
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleGeneratePDF}
              style={{ marginTop: '20px' }}
            >
              Télécharger PDF
            </Button>
            {error && <Typography color="error" style={{ textAlign: 'center' }}>{error}</Typography>}
          </Box>
        </Paper>
        <Paper elevation={3} style={paperStyle}>
          <h2 style={{ textAlign: "center", color: "blue" }}>Résultats de la recherche</h2>
          {students.length > 0 ? (
            students.map(student => (
              <Paper elevation={6} style={{ margin: "10px", padding: "15px", textAlign: "left" }} key={student.id}>
                <div><strong>ID:</strong> {student.id}</div>
                <div><strong>Prénom:</strong> {student.firstName}</div>
                <div><strong>Nom:</strong> {student.lastName}</div>
                <div><strong>Adresse:</strong> {student.address}</div>
                <div><strong>Classe:</strong> {student.classe}</div>
                <div><strong>CIN:</strong> {student.cin}</div>
                <div><strong>Email:</strong> {student.email}</div>
                <div><strong>Numéro de téléphone:</strong> {student.phone}</div>  
              </Paper>
            ))
          ) : (
            <p style={{ textAlign: "center" }}>Aucun étudiant trouvé.</p>
          )}
        </Paper>

        {/* Dialogue de confirmation pour le PDF */}
        <Dialog open={confirmationOpen} onClose={handleConfirmationClose}>
          <DialogTitle>Confirmer la génération du PDF</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Êtes-vous sûr de vouloir générer le PDF pour la classe {classe} ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirmationClose} color="primary">
              Annuler
            </Button>
            <Button onClick={handlePDFConfirm} color="secondary">
              Confirmer
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
}
