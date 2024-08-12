import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import Bar from './Bar';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8082/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // Redirect to home page or dashboard after successful login
        navigate('/home');
      } else {
        // Handle login error
        const result = await response.json();
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      setError('Erreur');
    }
  };

  return (
    <div className='Login'>
      <Bar/>
    <Box
      sx={{ display: 'flex', height: '100vh' }}
    >
      <Box
        sx={{
          flex: 1,
          backgroundImage: 'url(etude.jpg)', // Chemin vers votre image de fond
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center', // Ajustez la position de l'image si nécessaire
        }}
      />
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container component="main" maxWidth="xs">
          <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
            <Typography variant="h5" component="h1" align="center" style={{color:'#1976d2'}}>
              Connectez
            </Typography>
            <form noValidate onSubmit={handleLogin}>
              <Box mt={2}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Nom"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Mot de passe"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error && <Typography color="error" align="center">{error}</Typography>}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  style={{ marginTop: '20px' }}
                >
                 Connectez-Vous
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  fullWidth
                  variant="outlined"
                  color="primary"
                  style={{ marginTop: '10px' }}
                >
                  Créer un compte
                </Button>
              </Box>
            </form>
          </Paper>
        </Container>
      </Box>
    </Box>
    </div>
  );
}
