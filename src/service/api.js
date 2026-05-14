import axios from "axios";
import { clearSession } from "../utils/session";

let isHandlingUnauthorized = false;

const api = axios.create({
    baseURL: "http://localhost:8080"
});

//baseURL: "https://rede-social-java-production.up.railway.app"

// adcionar token automaticamnte
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")

    // caso tenha o token, coloca na autorização
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }


    return config;
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const token = localStorage.getItem("token");

        if (status === 401 && token) {
            clearSession();

            if (!isHandlingUnauthorized) {
                isHandlingUnauthorized = true;
                window.dispatchEvent(
                    new CustomEvent("auth:expired", {
                        detail: {
                            message: "Sua sessao expirou. Faca login novamente.",
                        },
                    })
                );

                setTimeout(() => {
                    isHandlingUnauthorized = false;
                }, 0);
            }
        }

        return Promise.reject(error);
    }
);




export default api
