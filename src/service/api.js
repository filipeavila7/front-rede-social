import axios from "axios";


const api = axios.create({
    baseURL: "http://localhost:8080"
});

// adcionar token automaticamnte
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")

    // caso tenha o token, coloca na autorização
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }


    return config;
})




export default api