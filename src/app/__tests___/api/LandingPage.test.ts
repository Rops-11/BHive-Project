// import request from 'supertest';
// import app from '@/../app'; // Adjust the import based on your app structure

// describe('Landing Page API', () => {
//     it('should return a 200 status and the correct landing page content', async () => {
//         const response = await request(app).get('/api/landing-page');
//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty('title');
//         expect(response.body).toHaveProperty('description');
//         expect(response.body.title).toBe('Welcome to Our Landing Page');
//         expect(response.body.description).toBe('This is the landing page of our application.');
//     });

//     it('should return a 404 status for an invalid endpoint', async () => {
//         const response = await request(app).get('/api/invalid-endpoint');
//         expect(response.status).toBe(404);
//     });

//     it('should handle query parameters correctly', async () => {
//         const response = await request(app).get('/api/landing-page?lang=en');
//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty('language');
//         expect(response.body.language).toBe('en');
//     });

//     it('should return a 500 status if there is a server error', async () => {
//         jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress error logs
//         const mockApp = jest.fn((req, res) => res.status(500).send({ error: 'Server error' }));
//         const response = await request(mockApp).get('/api/landing-page');
//         expect(response.status).toBe(500);
//         expect(response.body).toHaveProperty('error', 'Server error');
//     });
// });