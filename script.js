// Ganti dengan ID spreadsheet Anda dan API key
const SPREADSHEET_ID = '1c6hI658kbp_S3a3C8oWRXiPI00qqSckYGJn8boQkPdE'; // ID spreadsheet (ambil dari URL Google Sheets)
const CLIENT_ID = '73957004662-v266t39u9mrri33fojin7hcl6u1rqr0p.apps.googleusercontent.com'; // Ganti dengan Client ID Anda
const API_KEY = 'AIzaSyBB8BvD1DFag4NCCzdWFk1V42EeiNuWahk'; // API Key yang sudah dibuat
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets'; // Scopes untuk akses Sheets API
const RANGE = 'Sheet1!A2:D'; // Mengambil data dari Sheet1, kolom A sampai D
let token;

// Inisialisasi OAuth 2.0
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

async function initClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        scope: SCOPES
    });
    token = gapi.auth.getToken(); // Ambil token
    fetchSongs(); // Ambil data lagu setelah inisialisasi
}

function fetchSongs() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => displaySongs(data.values))
        .catch(error => console.error('Error:', error));
}

function displaySongs(songs) {
    const tbody = document.querySelector('#songList tbody');
    tbody.innerHTML = ''; // Hapus data lama

    songs.forEach(song => {
        const row = document.createElement('tr');
        song.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            row.appendChild(td);
        });

        // Tambahkan checkbox untuk memilih lagu yang akan dihapus
        const checkboxTd = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkboxTd.appendChild(checkbox);
        row.appendChild(checkboxTd);

        tbody.appendChild(row);
    });
}

function addSong() {
    const title = document.getElementById('titleInput').value.trim();
    const artist = document.getElementById('artistInput').value.trim();
    const category = document.getElementById('categoryInput').value.trim();
    const key = document.getElementById('keyInput').value.trim();

    if (!title || !artist || !category || !key) {
        alert('Semua kolom harus diisi!');
        return;
    }

    const tbody = document.querySelector('#songList tbody');
    const row = document.createElement('tr');

    [title, artist, category, key].forEach(text => {
        const td = document.createElement('td');
        td.textContent = text;
        row.appendChild(td);
    });

    // Tambahkan checkbox untuk memilih lagu yang akan dihapus
    const checkboxTd = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkboxTd.appendChild(checkbox);
    row.appendChild(checkboxTd);

    tbody.appendChild(row);

    // Kosongkan input setelah menambah lagu
    document.getElementById('titleInput').value = '';
    document.getElementById('artistInput').value = '';
    document.getElementById('categoryInput').value = '';
    document.getElementById('keyInput').value = '';

    // Tambahkan lagu ke Google Sheets
    addSongToSheet(title, artist, category, key);
}

function addSongToSheet(title, artist, category, key) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;
    const newRow = [[title, artist, category, key]]; // Data yang akan ditambahkan

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.access_token}` // Tambahkan token akses
        },
        body: JSON.stringify({ values: newRow })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Berhasil menambahkan lagu ke Google Sheets:', data);
    })
    .catch(error => {
        console.error('Error saat menambahkan lagu ke Google Sheets:', error);
    });
}

function deleteSongFromSheet(rowIndex) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}:clear?key=${API_KEY}`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.access_token}` // Tambahkan token akses
        },
        body: JSON.stringify({
            range: `Sheet1!A${rowIndex + 2}:D${rowIndex + 2}`
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Berhasil menghapus lagu dari Google Sheets:', data);
    })
    .catch(error => {
        console.error('Error saat menghapus lagu dari Google Sheets:', error);
    });
}

function deleteSelectedSongs() {
    const tbody = document.querySelector('#songList tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.forEach((row, index) => {
        const checkbox = row.querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) {
            // Hapus baris dari tabel
            tbody.removeChild(row);

            // Hapus baris dari Google Sheets
            deleteSongFromSheet(index);
        }
    });
}

function shuffleSongs() {
    const tbody = document.querySelector('#songList tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    for (let i = rows.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        tbody.appendChild(rows[j]);
    }
}

// Memuat data lagu saat halaman dimuat
window.onload = handleClientLoad; // Menginisialisasi OAuth 2.0
