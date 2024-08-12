import React from 'react';                                   /*Cette ligne importe la bibliothèque React, nécessaire pour créer des composants React et utiliser la syntaxe JSX.*/
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';                  /*Cette ligne importe des composants spécifiques de la bibliothèque react-router-dom, utilisés pour gérer le routage dans une application React.*/
import Home from './components/Home';                        /*Ces lignes importent les composants Home, PageOne et PageTwo à partir de leurs fichiers respectifs dans le dossier components. Ces composants représentent les différentes pages de l'application.*/
import Classe from './components/Classe';
import Delete from './components/Delete';
import Document from './components/Document';
import Login from './components/Login';
import SignUp from './components/SignUp';

function App() {                       /*Cette ligne définit le composant fonctionnel principal App en utilisant une fonction fléchée. Ce composant va rendre le contenu spécifié dans son corps.*/
  return (
    <Router>                           {/*Le composant App retourne du JSX. Le composant Router englobe toute l'application pour gérer le routage.*/}
      <div className="App">            {/*Le contenu de l'application est contenu dans une div avec la classe CSS App.*/}
        <Routes>                       {/*Le composant Routes englobe toutes les définitions de routes dans l'application.*/}
        <Route path="/" element={<SignUp />} /> 
        <Route path="/Login" element={<Login />} /> 
          <Route path="/Home" element={<Home />} />           {/*Cette ligne définit une route pour le chemin racine /, qui rend le composant Home.*/}
          <Route path="/Classe" element={<Classe />} />      {/*Cette ligne définit une route pour le chemin /page-one, qui rend le composant PageOne.*/}
          <Route path="/Home" element={<Home />} />
          <Route path="/Delete" element={<Delete/>} />
          <Route path="/Document" element={<Document/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;/*Cette ligne exporte le composant App pour qu'il puisse être importé et utilisé dans d'autres fichiers de l'application.*/
