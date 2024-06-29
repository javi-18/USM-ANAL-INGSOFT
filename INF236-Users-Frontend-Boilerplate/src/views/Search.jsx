import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

cornerstoneWADOImageLoader.configure({
  beforeSend: function(xhr) {
    // Add custom headers here (e.g. auth tokens)
  }
});

export default function Search() {
  const [dicomFileName, setDicomFileName] = useState('');
  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setDicomFileName(e.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/dicom/searchByFileName/${dicomFileName}`);
      if (response.data && response.data.length > 0) {
        setFileData(response.data[0]);
        setError('');
      } else {
        setError('File not found');
        setFileData(null);
      }
    } catch (err) {
      console.error('Error fetching file data:', err);
      setError('Error searching for file');
      setFileData(null);
    }
  };

  useEffect(() => {
    if (fileData && fileData.dicomFilePath) {
      const imageId = `wadouri:http://localhost:8080/uploads/${fileData.dicomFilePath}`;
      const element = document.getElementById('dicomImage');
      cornerstone.enable(element);
      cornerstone.loadImage(imageId).then((image) => {
        cornerstone.displayImage(element, image);
      }).catch((err) => {
        console.error('Error loading DICOM image:', err);
      });
    }
  }, [fileData]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Buscador de Archivos</h1>
      <div style={{ margin: '20px 0' }}>
        <input
          type="text"
          placeholder="Ingrese el nombre del archivo DICOM..."
          value={dicomFileName}
          onChange={handleInputChange}
          style={{ margin: '0 10px', padding: '10px', width: '300px', fontSize: '16px' }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          Buscar
        </button>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {fileData && (
        <div style={{ marginTop: '20px', textAlign: 'left', display: 'inline-block' }}>
          <h2>Datos del Paciente</h2>
          <p><strong>Nombre:</strong> {fileData.patientName}</p>
          <p><strong>ID:</strong> {fileData.patientId}</p>
          <p><strong>Fecha de Nacimiento:</strong> {fileData.patientBirthDate}</p>
          <p><strong>Sexo:</strong> {fileData.patientSex}</p>
          <h2>Información del Estudio</h2>
          <p><strong>Fecha del Estudio:</strong> {fileData.studyDate}</p>
          <p><strong>Fecha de la Serie:</strong> {fileData.seriesDate}</p>
          <p><strong>Fecha de Adquisición:</strong> {fileData.acquisitionDate}</p>
          <p><strong>Hora del Estudio:</strong> {fileData.studyTime}</p>
          <p><strong>Hora de la Serie:</strong> {fileData.seriesTime}</p>
          <p><strong>Número de Acceso:</strong> {fileData.accessionNumber}</p>
          <p><strong>Modalidad:</strong> {fileData.modality}</p>
          <p><strong>Descripción del Estudio:</strong> {fileData.studyDescription}</p>
          <p><strong>Descripción de la Serie:</strong> {fileData.seriesDescription}</p>
          <h2>Información del Dispositivo</h2>
          <p><strong>Fabricante:</strong> {fileData.manufacturer}</p>
          <p><strong>Modelo del Dispositivo:</strong> {fileData.manufacturerModelName}</p>
          <p><strong>Nombre de la Estación:</strong> {fileData.stationName}</p>
          <p><strong>Número de Serie:</strong> {fileData.deviceSerialNumber}</p>
          <p><strong>Versiones del Software:</strong> {fileData.softwareVersions}</p>
          <h2>Parámetros Técnicos de la Imagen</h2>
          <p><strong>Espesor del Corte:</strong> {fileData.sliceThickness}</p>
          <p><strong>Tiempo de Repetición:</strong> {fileData.repetitionTime}</p>
          <p><strong>Tiempo de Eco:</strong> {fileData.echoTime}</p>
          <p><strong>Fuerza del Campo Magnético:</strong> {fileData.magneticFieldStrength}</p>
          <p><strong>Espaciado de Píxeles:</strong> {fileData.pixelSpacing}</p>
          <p><strong>Centro de la Ventana:</strong> {fileData.windowCenter}</p>
          <p><strong>Ancho de la Ventana:</strong> {fileData.windowWidth}</p>
          <h2>Otros Datos Relevantes</h2>
          <p><strong>Tipo de Imagen:</strong> {fileData.imageType}</p>
          <p><strong>Orientación de la Imagen:</strong> {fileData.imageOrientation}</p>
          <p><strong>Posición de la Imagen:</strong> {fileData.imagePosition}</p>
          <p><strong>Interpretación Fotométrica:</strong> {fileData.photometricInterpretation}</p>
          <div>
            <p><strong>Archivo DICOM:</strong></p>
            <div id="dicomImage" style={{ width: '512px', height: '512px', margin: 'auto', background: 'black' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}