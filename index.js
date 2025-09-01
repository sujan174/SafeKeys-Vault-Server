const express = require('express');
const fs = require('fs-extra'); 
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();
const cors = require('cors'); 


const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;
const DB_PATH = path.join(__dirname, 'secrets-db.json.enc'); 
const API_KEY = process.env.VAULT_API_KEY;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!API_KEY) {
    console.error('[Vault Server] FATAL ERROR: VAULT_API_KEY is not set.');
    process.exit(1);
}
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
    console.error('[Vault Server] FATAL ERROR: ENCRYPTION_KEY must be set and be 32 characters long.');
    process.exit(1);
}

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; 

function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

async function readDb() {
    try {
        const fileExists = await fs.pathExists(DB_PATH);
        if (!fileExists) {
            return {}; 
        }
        const encryptedData = await fs.readFile(DB_PATH, 'utf8');
        if (!encryptedData) {
            return {};
        }
        const decryptedData = decrypt(encryptedData);
        return JSON.parse(decryptedData);
    } catch (error) {
        console.error('[Vault Server] Error reading or decrypting database:', error);
        return {};
    }
}

async function writeDb(data) {
    const jsonData = JSON.stringify(data, null, 2);
    const encryptedData = encrypt(jsonData);
    await fs.writeFile(DB_PATH, encryptedData);
}

const apiKeyAuth = (req, res, next) => {
    const providedKey = req.headers['x-api-key'];
    if (providedKey !== API_KEY) {
        return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
    }
    next();
};


app.get('/secrets', apiKeyAuth, async (req, res) => {
    const db = await readDb();
    res.status(200).json(db);
});

app.post('/secrets', apiKeyAuth, async (req, res) => {
    const secretData = req.body;
    if (!secretData || !secretData.Secret) {
        return res.status(400).json({ error: 'Invalid secret data provided' });
    }

    const db = await readDb();
    const id = crypto.randomBytes(8).toString('hex');
    db[id] = { ...secretData, receivedAt: new Date().toISOString() };

    await writeDb(db);
    console.log(`[Vault Server] Secret ${id} stored successfully.`);
    res.status(201).json({ message: 'Secret stored', id });
});

app.get('/secrets/:id', apiKeyAuth, async (req, res) => {
    const db = await readDb();
    const secret = db[req.params.id];

    if (!secret) {
        return res.status(404).json({ error: 'Secret not found' });
    }
    res.status(200).json(secret);
});

app.delete('/secrets/:id', apiKeyAuth, async (req, res) => {
    const db = await readDb();
    const { id } = req.params;

    if (!db[id]) {
        return res.status(404).json({ error: 'Secret not found' });
    }

    delete db[id];
    await writeDb(db);
    console.log(`[Vault Server] Secret ${id} deleted successfully.`);
    res.status(200).json({ message: 'Secret deleted' });
});

app.listen(PORT, () => {
    console.log(`[Vault Server] Self-hosted vault running on http://localhost:${PORT}`);
});