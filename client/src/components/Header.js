import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

function Header() {
    const [searchTerm] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/search?query=${searchTerm}`);
        }
    };

    return (
        <nav style={{ backgroundColor: "#D56E6C", padding: "15px 0", fontSize: "22px", fontWeight: "bold", position:"fixed", width:"100%", top:"0", zIndex:"1" }}>
            <Container>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    
                    <Link to="/" style={{ fontSize: "28px", fontWeight: "bold", textDecoration: "none", color: "white", paddingRight:"25px" }}>
                        VocalSwitch/Doc.
                    </Link>
                    
                    {/* Barre de navigation */}
                    <ul style={{ 
                        listStyle: "none", 
                        display: "flex", 
                        gap: "20px", 
                        margin: 0, 
                        padding: 0 
                    }}>
                        {["Home", "Docs", "Upload"].map((item, index) => (
                            <li key={index} style={{ display: "inline-block" }}>
                                <Link 
                                    to={`/${item.toLowerCase()}`} 
                                    style={{ 
                                        color: "white", 
                                        textDecoration: "none", 
                                        padding: "8px 20px",
                                        borderRadius: "5px",
                                        border: "2px dotted transparent",
                                        transition: "0.3s ease-in-out"
                                    }}
                                    onMouseEnter={(e) => e.target.style.borderBottom = "2px solid #F9D35A"}
                                    onMouseLeave={(e) => e.target.style.borderBottom = "2px dotted transparent"}
                                >
                                    {item}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Bouton de recherche */}
                    <Link to="/search" style={{ paddingLeft: "20px" }}>
                        <Button 
                            variant="outline-light" 
                            onClick={handleSearch} 
                            style={{ 
                                borderRadius: "50%", 
                                padding: "8px 10px", 
                                marginLeft: "10px",
                                borderColor: "#F9D35A" 
                            }}
                        >
                            <FaSearch color="#F9D35A" />
                        </Button>
                    </Link>
                    
                </div>
            </Container>
        </nav>
    );
}

export default Header;
