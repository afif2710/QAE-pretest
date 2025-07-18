// utils/apiUtils.js
const axios = require('axios');
require('dotenv').config(); // Pastikan ini ada di atas untuk memuat .env

const BASE_URL = 'https://gorest.co.in/public-api';
const API_TOKEN = process.env.GOREST_API_TOKEN;

if (!API_TOKEN) {
    console.error('ERROR: GOREST_API_TOKEN is not set in .env file!');
    console.error('Please ensure your .env file exists and contains GOREST_API_TOKEN="YOUR_TOKEN_HERE"');
    process.exit(1); // Keluar dari proses jika token tidak ada
}

const headers = {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

// Fungsi helper untuk melakukan permintaan API
async function makeRequest(method, url, data = null) {
    try {
        const config = { headers };
        if (data) {
            config.data = data; // Untuk POST/PUT, data dimasukkan ke properti 'data'
        }

        let response;
        if (method === 'post') {
            response = await axios.post(url, data, config);
        } else if (method === 'get') {
            response = await axios.get(url, config);
        } else if (method === 'put') {
            response = await axios.put(url, data, config);
        } else if (method === 'delete') {
            response = await axios.delete(url, config);
        } else {
            throw new Error(`Unsupported HTTP method: ${method}`);
        }
        return response;
    } catch (error) {
        // ---- PERUBAHAN DI SINI ----
        // Cukup lemparkan kembali error asli dari Axios.
        // AxiosError akan memiliki properti .response jika ada respons dari server.
        // Jika tidak ada respons (misalnya masalah jaringan), .response akan undefined
        // dan kita akan menanganinya di test/user.test.js dengan console.log(error).
        throw error;
    }
}

async function createUser(userData) {
    return makeRequest('post', `${BASE_URL}/users`, userData);
}

async function getUser(userId) {
    return makeRequest('get', `${BASE_URL}/users/${userId}`);
}

async function updateUser(userId, userData) {
    return makeRequest('put', `${BASE_URL}/users/${userId}`, userData);
}

async function deleteUser(userId) {
    return makeRequest('delete', `${BASE_URL}/users/${userId}`);
}

module.exports = {
    createUser,
    getUser,
    updateUser,
    deleteUser,
    BASE_URL // Ekspor BASE_URL agar bisa digunakan di test/user.test.js
};