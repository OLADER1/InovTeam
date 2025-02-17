import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

// Exemple de fonction pour uploader un fichier
export const uploadFile = (formData) => {
    return api.post('/upload', formData);
};



export default api;
