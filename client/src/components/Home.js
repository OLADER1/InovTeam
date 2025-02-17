import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Home() {
    return (
        <center>
            <Container className="mt-5" style={{paddingTop:"10vh"}}>
                <h1>Bienvenue sur VocalSwitch Documents 📄</h1>
                <p>Utilisez les options ci-dessous pour explorer vos fichiers.</p>

                <Button variant="primary" as={Link} to="/docs">
                    📂 Voir les fichiers
                </Button>
            </Container>
        </center>
    );
}

export default Home;
