import axios from "axios";

const httpDomain = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
});

export default httpDomain;