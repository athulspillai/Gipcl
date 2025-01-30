const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 8000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Common SQL Server configuration
const baseConfig = {
    user: 'sa',
    password: 'sa@123',
    server: 'LAPTOP-NC8CQM15\\SQLEXPRESS01',
    options: {
        encrypt: false, // Set to false for local dev
        trustServerCertificate: true,
        trustedConnection: true,
    },
};

// API endpoint for fetching data from the database
app.get('/EMS_Network/WebData', async (req, res) => {
    try {
        const config = { ...baseConfig, database: 'EMS_Network' };
        await sql.connect(config);
        const query = `SELECT * FROM WebData`;
        console.log('Executing query WebData:', query);
        const result = await sql.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error('Database error (EMS_Network WebData):', err);
        res.status(500).send(`Error fetching data: ${err.message}`);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});
