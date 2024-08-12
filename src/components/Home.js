import React from 'react';
import Appbar from './Appbar';
import Student from './Student';

const Home = () => {
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

  return (
    <div className='Home'>
      <div style={backgroundStyle}></div>
      <div style={overlayStyle}>
        <Appbar />
        <Student />
      </div>
    </div>
  );
};

export default Home;
