import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Container, Table, Spinner, Modal, Alert } from 'react-bootstrap';
import { FaSearch, FaDownload, FaFileAlt, FaEye } from 'react-icons/fa'; // Icône ajoutée
import { Worker, Viewer } from '@react-pdf-viewer/core';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalFile, setModalFile] = useState(null); // Pour gérer le fichier dans le modal
    const [fileName, setFileName] = useState('');

    const onSearch = () => {
        if (query.trim() === '') {
            alert('Veuillez entrer un nom de fichier à rechercher');
            return;
        }

        setLoading(true);
        setError('');

        // Log pour vérifier la requête envoyée
        console.log(`Requête envoyée pour rechercher : ${query}`);

        axios.get(`http://localhost:5000/files/search?query=${query}`)
            .then(response => {
                // Log pour vérifier la réponse
                console.log('Réponse de l\'API : ', response);

                if (response.data && response.data.length > 0) {
                    setResults(response.data);
                } else {
                    setResults([]);
                    alert('Aucun fichier trouvé pour cette recherche');
                }

                setLoading(false);
            })
            .catch(error => {
                console.error('Erreur lors de la recherche', error);
                setError('Erreur lors de la recherche');
                setLoading(false);
            });
    };

    // Fonction pour télécharger le fichier
    const handleFileDownload = (fileId, filename) => {
        axios.get(`http://localhost:5000/files/view/${fileId}`, { responseType: 'blob' })
            .then((response) => {
                const fileBlob = response.data;
                const fileUrl = URL.createObjectURL(fileBlob);

                // Créer un lien de téléchargement pour le fichier
                const link = document.createElement('a');
                link.href = fileUrl;
                link.download = filename; // Télécharge le fichier avec son nom d'origine
                link.click();
            })
            .catch((err) => {
                console.error('Erreur lors du téléchargement du fichier:', err);
            });
    };

    const handleViewFile = (fileId, filename) => {
        axios.get(`http://localhost:5000/files/view/${fileId}`, { responseType: 'blob' })
            .then((response) => {
                const fileBlob = response.data;
                const fileUrl = URL.createObjectURL(fileBlob);
                setModalFile(fileUrl);
                setFileName(decodeURIComponent(filename));
                setShowModal(true);
            })
            .catch((err) => {
                console.error('Erreur lors du chargement du fichier:', err);
                setError('Erreur lors du chargement du fichier');
            });
    };

    const handleCloseModal = () => setShowModal(false);

    return (
        <Container className="mt-5" style={{ paddingTop: "10vh" }}>
            <h2 className="text-center mb-4" style={{ color: '#343a40', fontWeight: 'bold' }}>
                <FaSearch /> Rechercher des fichiers
            </h2>

            <Form className="d-flex mb-4">
                <Form.Control
                    type="text"
                    placeholder="Entrez le nom d'un fichier"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="me-2"
                    style={{
                        borderRadius: '25px',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                        padding: '10px 20px',
                        backgroundColor: '#f8f9fa',
                        borderColor: '#ddd',
                    }}
                />
                <Button
                    variant="primary"
                    onClick={onSearch}
                    style={{
                        borderRadius: '25px',
                        padding: '10px 20px',
                        fontWeight: 'bold',
                        backgroundColor: '#CAA17D',
                        borderColor: '#CAA17D', 
                    }}
                >
                    Rechercher
                </Button>
            </Form>

            {loading && (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <p>Chargement...</p>
                </div>
            )}

            {error && (
                <Alert variant="danger" className="text-center" style={{ backgroundColor: '#f8d7da', color: '#721c24' }}>
                    {error}
                </Alert>
            )}

            {results.length === 0 && !loading && !error && (
                <p className="text-center">Aucun fichier trouvé.</p>
            )}

            {results.length > 0 && !loading && !error && (
                <Table striped hover responsive className="shadow-sm" style={{ backgroundColor: '#ffffff' }}>
                    <thead className="bg-primary text-white">
                        <tr>
                            <th></th>
                            <th>Nom du fichier</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map(file => (
                            <tr key={file.id}>
                                <td className="text-center">
                                    <FaFileAlt size={20} />
                                </td>
                                <td>{decodeURIComponent(escape(file.filename.length > 50 ? file.filename.substring(0, 36) + '...' : file.filename))}</td>
                                <td className="d-flex">
                                    <Button
                                        variant="outline-success"
                                        onClick={() => handleViewFile(file.id, file.filename)}
                                        style={{
                                            padding: '5px 15px',
                                            borderRadius: '20px',
                                            border: '1px solid #28a745',
                                            color: '#28a745', // Couleur du texte et bordure
                                        }}
                                    >
                                        <FaEye />
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        onClick={() => handleFileDownload(file.id, file.filename)}
                                        className="d-flex align-items-center gap-2"
                                        style={{
                                            padding: '5px 15px',
                                            borderRadius: '20px',
                                            border: '1px solid #dc3545',
                                            color: '#dc3545', // Couleur du texte et bordure
                                        }}
                                    >
                                        <FaDownload />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            {/* Modal pour visualiser le fichier */}
            <Modal show={showModal} onHide={handleCloseModal} size="xl">
                <Modal.Header closeButton style={{ backgroundColor: '#343a40', color: 'white' }}>
                    <Modal.Title>{decodeURIComponent(escape(fileName))}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: '#f8f9fa' }}>
                    {modalFile && (
                        <Worker workerUrl={`/pdf.worker.min.js`}>
                            <Viewer fileUrl={modalFile} />
                        </Worker>
                    )}
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: '#f8f9fa' }}>
                    <Button variant="secondary" onClick={handleCloseModal}>Fermer</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Search;
