import axios from "axios";

const BASE_API_ROUTER = axios.create({
    baseURL: "/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});

export default BASE_API_ROUTER;