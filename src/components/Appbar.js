import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import axios from 'axios';

export default function Appbar() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false); // État pour vérifier si l'utilisateur est connecté
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem('authToken'); // Supposons que vous stockez le token dans le localStorage
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      // Déconnexion
      setIsLoggedIn(false);
      localStorage.removeItem('authToken'); // Supprimez le token de session
      localStorage.removeItem('userId'); // Supprimez l'ID de l'utilisateur
      navigate('/');
    } else {
      // Connexion
      const userId = '123'; // ID de l'utilisateur récupéré après authentification
      localStorage.setItem('authToken', 'yourToken'); // Définir le token de session
      localStorage.setItem('userId', userId); // Définir l'ID de l'utilisateur
      setIsLoggedIn(true);
      navigate('/');
    }
  };

  const fetchUserData = () => {
    const userId = localStorage.getItem('userId');

    axios.post('http://localhost:8081/endpoint', {
      userId: userId,
      otherData: 'value'
    })
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <img src="etudiant.png" alt="Logo" style={{ height: 40, marginRight: 16 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} style={{ textAlign: "left", fontWeight: "bold" }}>
            Gestion des etudiants
          </Typography>
          <Button color="inherit">
            <Link to="/Home" style={{ color: "white", fontWeight: "bold", textDecoration: "none" }}>Ajout et Liste</Link>
          </Button>
          <Button color="inherit">
            <Link to="/Classe" style={{ color: "white", fontWeight: "bold", textDecoration: "none" }}>Recherche</Link>
          </Button>
          <Button color="inherit">
            <Link to="/Delete" style={{ color: "white", fontWeight: "bold", textDecoration: "none" }}>Classe</Link>
          </Button>
          <Button color="inherit">
            <Link to="/Document" style={{ color: "white", fontWeight: "bold", textDecoration: "none" }}>Document</Link>
          </Button>
          <Button
            variant="outlined"
            onClick={handleLoginLogout}
            sx={{
              backgroundColor: 'white',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white',
              },
            }}
          >
            {isLoggedIn ? 'DéConnexion' : 'Connexion'}
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
