const { default: axios } = require("axios");

export const BASE_URL="https://connectifyy-974y.onrender.com"

export const clientServer=axios.create({
    baseURL:BASE_URL,
})