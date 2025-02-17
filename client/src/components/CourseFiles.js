import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Spinner, Alert, Modal, Card, Row, Col } from 'react-bootstrap';
import { FaDownload, FaEye, FaFilePdf } from 'react-icons/fa'; 
import { Link, useParams } from 'react-router-dom';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const CourseFiles = () => {
    const { courseId } = useParams();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalFile, setModalFile] = useState(null);
    const [fileName, setFileName] = useState(''); 

    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:5000/files/course/${courseId}`)
            .then((response) => {
                setFiles(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError('Erreur lors du chargement des fichiers pour ce cours');
                setLoading(false);
            });
    }, [courseId]);

    const handleDownloadFile = (fileId, filename) => {
        axios.get(`http://localhost:5000/files/view/${fileId}`, { responseType: 'blob' })
            .then((response) => {
                const fileBlob = response.data;
                const fileUrl = URL.createObjectURL(fileBlob);
                const link = document.createElement('a');
                link.href = fileUrl;
                link.download = decodeURIComponent(filename);
                link.click();
            })
            .catch((err) => {
                console.error('Erreur lors du téléchargement du fichier:', err);
                setError('Erreur lors du téléchargement du fichier');
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
// style={{paddingTop:'12vh', width:"100%", border:"2px solid black"}}
    return (
        <div className="container mt-5" style={{paddingTop:'8vh'}}>
            <h2 className="text-center mb-4"><b>Fichiers du Cours</b></h2>

            <Link to="/Docs">
                <Button  variant="outline-danger" className="mb-4"><b>{"<<----"}</b></Button>
            </Link>

            {loading && <Spinner animation="border" variant="primary" />}
            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && files.length === 0 && <p className="text-center">Aucun fichier trouvé pour ce cours.</p>}

            {!loading && !error && files.length > 0 && (
                <div>
                    <Row>
                        {files.map((file) => (
                            <Col xs={12} sm={6} md={4} lg={3} key={file.id} className="mb-4" >
                                <Card className="text-center shadow-sm" style={{height:"300px", display:"flex", flexDirection:"column", padding:"15px"}}>
                                    <Card.Body style={{ flexGrow:"1", display:"flex", flexDirection:"column", alignItems:"center"}}>
                                        <FaFilePdf color="#CAA17D" size={120} className="mb-3" />
                                        <Card.Title style={{flexGrow:"1", whiteSpace:"nowrap", overflow:"hidden",  textOverflow:"ellipsis", maxWidth:"100%"}}>{decodeURIComponent(escape(file.filename.length > 20 ? file.filename.substring(0, 36) + '...' : file.filename))}</Card.Title>
                                        <Card.Text style={{ fontSize: '16px', fontStyle:"bold" }}>
                                            {new Date(file.upload_date).toLocaleDateString()}
                                        </Card.Text>
                                        
                                        <div style={{ marginTop:"auto", display:"flex",justifyContent:"center", gap:"10px" }}>
                                            <Button
                                                style={{backgroundColor:"#CAA17D", border:"none"}}
                                                size="sm"
                                                onClick={() => handleDownloadFile(file.id, file.filename)}
                                                className="mr-2"
                                            >
                                                <FaDownload />
                                            </Button>
                                            <Button
                                                style={{backgroundColor:"#abacad", border:"none"}}
                                                size="sm"
                                                onClick={() => handleViewFile(file.id, file.filename)}
                                            >
                                                <FaEye />
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            )}

            {/* Modal pour visualiser le fichier */}
            <Modal show={showModal} onHide={handleCloseModal} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>{decodeURIComponent(escape(fileName))}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                    {modalFile && (
                        <Worker workerUrl={`/pdf.worker.min.js`}>
                            <Viewer fileUrl={modalFile} />
                        </Worker>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Fermer</Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default CourseFiles;
