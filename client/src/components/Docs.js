import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { FaFolder } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/courses')
            .then((response) => {
                setCourses(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError('Erreur lors du chargement des cours');
                setLoading(false);
            });
    }, []);

    return (
        <div className="container mt-5" style={{paddingTop:'12vh'}}>
            <h2 className="text-center mb-4"><b>Liste des Cours</b></h2>

            {loading && <Spinner animation="border" variant="primary" />}
            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && courses.length === 0 && <p className="text-center">Aucun cours trouvé.</p>}

            {!loading && !error && courses.length > 0 && (
                <Row>
                    {courses.map((course) => (
                        <Col xs={12} sm={6} md={4} lg={3} key={course.id} className="mb-4">
                            <Card className="text-center shadow-sm">
                                <Link to={`/course/${course.id}`}  style={{textDecoration:'none'}}>
                                    <Card.Body>
                                        <FaFolder size={100} className="mb-3" color='#CAA17D' />
                                        <Card.Title  style={{color:"#1E293B"}} >{course.name}</Card.Title>
                                    </Card.Body>
                                </Link>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default Courses;
