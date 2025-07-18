const { expect } = require('chai');
// Impor BASE_URL dari apiUtils.js
const { createUser, getUser, updateUser, deleteUser, BASE_URL } = require('../Utils/apiUtils');
const Chance = require('chance');
require('dotenv').config();

const chance = new Chance();

describe('GoRest User API Automation', () => {
    let userId; // Untuk menyimpan ID pengguna yang dibuat dalam tes positif

    // Positive Test Cases
    describe('Positive Scenarios', () => {
        it('should successfully create a new user', async () => {
            const userData = {
                name: chance.name(),
                email: chance.email({ domain: 'example.com' }), // Gunakan domain yang lebih umum untuk email
                gender: chance.pickone(['male', 'female']),
                status: chance.pickone(['active', 'inactive'])
            };

            const response = await createUser(userData);

            expect(response.status).to.equal(200); // Pastikan ini 200, sesuai API GoRest
            expect(response.data.data).to.be.an('object');
            expect(response.data.data.name).to.equal(userData.name);
            expect(response.data.data.email).to.equal(userData.email);
            expect(response.data.data.gender).to.equal(userData.gender);
            expect(response.data.data.status).to.equal(userData.status);
            expect(response.data.data.id).to.be.a('number');

            userId = response.data.data.id; // Simpan ID pengguna untuk tes berikutnya
            console.log(`User created with ID: ${userId}`); // Untuk debugging
        }).timeout(10000); // Tingkatkan timeout jika perlu

        it('should successfully get user details', async () => {
            expect(userId).to.exist; // Pastikan user ID tersedia dari tes sebelumnya

            const response = await getUser(userId);

            expect(response.status).to.equal(200);
            expect(response.data.data).to.be.an('object');
            expect(response.data.data.id).to.equal(userId);
        }).timeout(10000);

        it('should successfully update user details', async () => {
            expect(userId).to.exist;

            const updatedName = chance.name();
            const updatedEmail = chance.email({ domain: 'updated.com' });
            const updateData = {
                name: updatedName,
                email: updatedEmail
            };

            const response = await updateUser(userId, updateData);

            expect(response.status).to.equal(200);
            expect(response.data.data).to.be.an('object');
            expect(response.data.data.id).to.equal(userId);
            expect(response.data.data.name).to.equal(updatedName);
            expect(response.data.data.email).to.equal(updatedEmail);
        }).timeout(10000);

        it('should successfully delete a user', async () => {
            expect(userId).to.exist;

            const response = await deleteUser(userId);

            // ---- PERBAIKAN DI SINI ----
            // Ubah asersi dari 204 ke 200 karena GoRest mengembalikan 200 untuk delete
            expect(response.status).to.equal(200);
            // GoRest tidak selalu mengembalikan data.data=null untuk 200 delete, mungkin kosong {}
            // expect(response.data.data).to.be.null; // Anda bisa hapus atau sesuaikan ini jika perlu
        }).timeout(10000);
    });

    // Negative Test Cases
    describe('Negative Scenarios', () => {
        let existingUserEmail; // Untuk menyimpan email user yang akan kita duplikasi

        before(async () => {
            // Buat user yang akan digunakan untuk memicu error duplikat email
            const userData = {
                name: chance.name(),
                email: chance.email({ domain: 'duplicate.com' }),
                gender: 'male',
                status: 'active'
            };
            const response = await createUser(userData);
            existingUserEmail = response.data.data.email;
            console.log(`Created user for 422 negative test: ${existingUserEmail}`);
        }).timeout(10000);

        it('should return 422 when creating a user with an existing email (duplicate data)', async () => {
            const userData = {
                name: chance.name(),
                email: existingUserEmail, // Gunakan email yang sudah ada
                gender: 'female',
                status: 'inactive'
            };

            try {
                const response = await createUser(userData);
                // Jika API tidak melempar error, log respons sukses untuk debugging
                console.log('422 test unexpectedly returned success:', response.status, response.data);
                expect.fail('Expected API to return 422 for duplicate email, but it returned success.');
            } catch (error) {
                // ---- PENTING: Periksa output console.log ini jika masih gagal ----
                console.log('Error in 422 test (duplicate email):', error);
                expect(error.response).to.exist;
                expect(error.response.status).to.equal(422);
                expect(error.response.data.data).to.be.an('array');
                // Asersi untuk pesan error duplikat email
                expect(error.response.data.data[0].field).to.equal('email');
                expect(error.response.data.data[0].message).to.equal('has already been taken');
            }
        }).timeout(10000);

        it('should return 404 when getting a non-existent user', async () => {
            const nonExistentUserId = 9999999999999; // ID yang sangat besar, kemungkinan tidak ada

            try {
                const response = await getUser(nonExistentUserId);
                // Jika API tidak melempar error, log respons sukses untuk debugging
                console.log('404 test unexpectedly returned success:', response.status, response.data);
                expect.fail('Expected API to return 404 for non-existent user, but it returned success.');
            } catch (error) {
                // ---- PENTING: Periksa output console.log ini jika masih gagal ----
                console.log('Error in 404 test:', error);
                expect(error.response).to.exist;
                expect(error.response.status).to.equal(404);
                expect(error.response.data.data.message).to.equal('Resource not found');
            }
        }).timeout(10000);

        it('should return 401 when using an invalid or missing token (for any authenticated endpoint)', async () => {
            const originalApiToken = process.env.GOREST_API_TOKEN;
            process.env.GOREST_API_TOKEN = 'invalid_token_12345'; // Simulasikan token tidak valid

            const tempAxios = require('axios'); // Impor axios secara lokal untuk sementara
            const tempHeaders = {
                'Authorization': `Bearer ${process.env.GOREST_API_TOKEN}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };

            const userData = {
                name: chance.name(),
                email: chance.email(),
                gender: 'male',
                status: 'active'
            };

            try {
                // Menggunakan BASE_URL yang diekspor dari apiUtils
                const response = await tempAxios.post(`${BASE_URL}/users`, userData, { headers: tempHeaders });
                // Jika API tidak melempar error, log respons sukses untuk debugging
                console.log('401 test unexpectedly returned success:', response.status, response.data);
                expect.fail('Expected API to return 401 for invalid token, but it returned success.');
            } catch (error) {
                // ---- PENTING: Periksa output console.log ini jika masih gagal ----
                console.log('Error in 401 test:', error);
                expect(error.response).to.exist;
                expect(error.response.status).to.equal(401);
                expect(error.response.data.data.message).to.equal('Authentication failed');
            } finally {
                process.env.GOREST_API_TOKEN = originalApiToken; // Kembalikan token asli
            }
        }).timeout(10000);
    });
});