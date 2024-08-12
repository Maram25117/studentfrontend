import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import Bar from './Bar';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validation des champs
    if (!username || !password || !confirmPassword) {
      setError('Les champs sont vides');
      return;
    }

    if (username.length < 5) {
      setError('Le chapms nom doit etre au moins de 5 caractéres');
      return;
    }

    if (password.length < 5) {
      setError('Le chapms mot de passe doit etre au moins de 5 caractéres');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne sont pas egaux');
      return;
    }

    try {
      const response = await fetch('http://localhost:8082/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, confirmPassword }),
      });

      const textResponse = await response.text(); // Lire la réponse en tant que texte

      if (response.ok) {
        navigate('/login');
      } else {
        try {
          const result = JSON.parse(textResponse);
          setError(result.message || 'Registration failed');
        } catch (e) {
          setError('Registration failed: ' + textResponse);
        }
      }
    } catch (error) {
      setError('An error occurred: ' + error.message);
    }
  };

  return (
    <div className='SignUp'>
      <Bar />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Box
          sx={{
            flex: 1,
            backgroundImage: 'url(etude.jpg)', // Chemin vers votre image de fond
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Container component="main" maxWidth="xs">
            <Paper elevation={3} style={{ padding: '20px', marginTop: '1px' }}>
              <Typography variant="h5" component="h1" align="center" style={{ color: "#1976d2" }}>
                Enregistrez
              </Typography>
              <form noValidate onSubmit={handleSignUp}>
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
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirmer mot de passe"
                    type="password"
                    id="confirmPassword"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {error && <Typography color="error" align="center">{error}</Typography>}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={{ marginTop: '20px' }}
                  >
                    Enregistrez-Vous
                  </Button>
                  <Button
                    onClick={() => navigate('/login')}
                    fullWidth
                    variant="outlined"
                    color="primary"
                    style={{ marginTop: '10px' }}
                  >
                    Avez-Vous un compte? Connectez-Vous
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
