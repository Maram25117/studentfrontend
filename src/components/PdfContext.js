import React, { createContext, useContext, useState } from 'react';

// Créez un contexte pour les fichiers PDF
const PdfContext = createContext();

export const PdfProvider = ({ children }) => {
  const [pdfFiles, setPdfFiles] = useState([]);

  const addPdfFiles = (files) => {
    setPdfFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const removePdfFile = (index) => {
    setPdfFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <PdfContext.Provider value={{ pdfFiles, addPdfFiles, removePdfFile }}>
      {children}
    </PdfContext.Provider>
  );
};

export const usePdfContext = () => useContext(PdfContext);
