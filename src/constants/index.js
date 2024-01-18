import axios from "axios";

export const Api = axios.create({
    baseUrl: "https://localhost:7261/api"
});