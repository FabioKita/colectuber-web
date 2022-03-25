import axios from "axios";

const API = axios.create({
    baseURL:"https://colectuber-backend.azurewebsites.net/api"
})

export default API;