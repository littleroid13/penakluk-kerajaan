/**
 * PENAKHLUKAN KERAJAAN - Localhost Development Server
 * Server HTTP mandiri berbasis Node.js murni (Zero Dependencies)
 * Dilengkapi deteksi IP Lokal (untuk testing via Smartphone/Tablet di Wi-Fi yang sama)
 * dan pembukaan browser otomatis.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

// Konfigurasi Server
const DEFAULT_PORT = 3000;
const PUBLIC_DIR = __dirname;

// Mapping MIME Types
const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.csv': 'text/csv; charset=UTF-8'
};

// Ambil IP Lokal perangkat di jaringan Wi-Fi / LAN
function getLocalNetworkIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';
}

// Buka browser secara otomatis sesuai OS
function openBrowser(url) {
    const platform = process.platform;
    let cmd = '';

    if (platform === 'win32') {
        cmd = `start "" "${url}"`;
    } else if (platform === 'darwin') {
        cmd = `open "${url}"`;
    } else {
        cmd = `xdg-open "${url}"`;
    }

    exec(cmd, (err) => {
        if (err) {
            console.log(`ℹ️ Silakan buka tautan berikut di browser Anda: ${url}`);
        }
    });
}

// Handler HTTP Request
function handleRequest(req, res) {
    const startTime = Date.now();
    let reqUrl = decodeURI(req.url.split('?')[0]);

    // Default ke index.html
    if (reqUrl === '/' || reqUrl === '') {
        reqUrl = '/index.html';
    }

    // Resolusi path file
    const safePath = path.normalize(reqUrl).replace(/^(\.\.[\/\\])+/, '');
    let filePath = path.join(PUBLIC_DIR, safePath);

    // Mencegah Directory Traversal
    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end('403 Terlarang: Akses direktori tidak diizinkan.');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Coba arahkan jika direktori
            if (stats && stats.isDirectory()) {
                filePath = path.join(filePath, 'index.html');
            } else {
                res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
                res.end(`
                    <!DOCTYPE html>
                    <html lang="id">
                    <head><title>404 - File Tidak Ditemukan</title></head>
                    <body style="font-family: sans-serif; text-align: center; padding: 50px; background: #1a1c29; color: #fff;">
                        <h1>👑 404 - Halaman / File Tidak Ditemukan</h1>
                        <p>File <code>${reqUrl}</code> tidak ditemukan di server kerajaan.</p>
                        <a href="/" style="color: #ffd700; text-decoration: underline;">Kembali ke Gerbang Permainan</a>
                    </body>
                    </html>
                `);
                console.log(`\x1b[31m[404]\x1b[0m ${req.method} ${reqUrl} - ${Date.now() - startTime}ms`);
                return;
            }
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        // Headers
        const headers = {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Access-Control-Allow-Origin': '*'
        };

        res.writeHead(200, headers);
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);

        stream.on('finish', () => {
            console.log(`\x1b[32m[200 OK]\x1b[0m ${req.method} ${reqUrl} (${contentType}) - ${Date.now() - startTime}ms`);
        });

        stream.on('error', (streamErr) => {
            if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
            }
            res.end(`500 Error Server: ${streamErr.message}`);
        });
    });
}

// Cari Port yang tersedia secara dinamis
function startServer(port) {
    const server = http.createServer(handleRequest);

    server.listen(port, () => {
        const localIP = getLocalNetworkIP();
        const localUrl = `http://localhost:${port}`;
        const networkUrl = `http://${localIP}:${port}`;

        console.log('\n' + '='.repeat(62));
        console.log('   👑  SERVER PENAKHLUKAN KERAJAAN TELAH BERJALAN  👑');
        console.log('='.repeat(62));
        console.log(`\n  📍 Akses di Komputer ini : \x1b[36m${localUrl}\x1b[0m`);
        console.log(`  📱 Akses di HP / Tablet    : \x1b[33m${networkUrl}\x1b[0m`);
        console.log(`     (Pastikan HP terhubung ke Wi-Fi yang sama)\n`);
        console.log('  ⏹️  Tekan \x1b[31mCtrl + C\x1b[0m untuk menghentikan server.');
        console.log('='.repeat(62) + '\n');

        // Buka browser secara otomatis jika bukan flag --no-open
        if (!process.argv.includes('--no-open')) {
            openBrowser(localUrl);
        }
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`⚠️ Port ${port} sedang digunakan, mencoba port ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error('Terjadi kesalahan pada server:', err);
        }
    });
}

// Mulai Server
const portArg = process.argv.find(arg => arg.startsWith('--port='));
const initialPort = portArg ? parseInt(portArg.split('=')[1], 10) : DEFAULT_PORT;

startServer(initialPort || DEFAULT_PORT);
