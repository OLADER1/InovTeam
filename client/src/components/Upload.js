import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Container, Card, Col, Row } from 'react-bootstrap';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [courses, setCourses] = useState([]);
    const [courseId, setCourseId] = useState('');

    // Charger la liste des cours lors du montage du composant
    useEffect(() => {
        axios.get('http://localhost:5000/courses')
            .then(response => {
                setCourses(response.data);
            })
            .catch(error => {
                console.error('Erreur lors du chargement des cours', error);
            });
    }, []);

    const onFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const onCourseChange = (e) => {
        setCourseId(e.target.value);
    };

    const onUpload = () => {
        if (file && courseId) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('course_id', courseId);

            axios.post('http://localhost:5000/upload', formData)
                .then(response => {
                    alert('Fichier téléchargé avec succès');
                })
                .catch(error => {
                    console.error('Erreur lors du téléchargement', error);
                    alert('Erreur lors du téléchargement');
                });
        } else {
            alert('Veuillez sélectionner un fichier et un cours');
        }
    };

    return (
        <Container fluid className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <Row className="justify-content-center w-100">
                <Col xs={12} sm={10} md={8} lg={6} xl={5} className="px-3">
                    <Card className="shadow-lg p-4 rounded">
                        <Card.Body>
                            <h2 className="text-center mb-4" style={{color:"#CAA17D"}}>Uploader un fichier</h2>
                            <Form>
                                <Form.Group>
                                    <Form.Label>Choisir un fichier</Form.Label>
                                    <Form.Control
                                        type="file"
                                        onChange={onFileChange}
                                        className="mb-3"
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Choisir un cours</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={courseId}
                                        onChange={onCourseChange}
                                        className="mb-3"
                                    >
                                        <option value="">Sélectionner un cours</option>
                                        {courses.map(course => (
                                            <option key={course.id} value={course.id}>
                                                {course.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Button
                                    style={{backgroundColor:"#CAA17D", border:"none"}}
                                    className="w-100 py-2"
                                    onClick={onUpload}
                                >
                                    Uploader
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Upload;
