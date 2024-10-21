// Ganti dengan ID spreadsheet Anda dan API key
const SPREADSHEET_ID = '1c6hI658kbp_S3a3C8oWRXiPI00qqSckYGJn8boQkPdE'; // ID spreadsheet (ambil dari URL Google Sheets)
const API_KEY = 'AIzaSyBB8BvD1DFag4NCCzdWFk1V42EeiNuWahk'; // API Key yang sudah dibuat
const RANGE = 'Sheet1!A2:D'; // Mengambil data dari Sheet1, kolom A sampai D

function fetchSongs() {
    const url = https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY};
    
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
        tbody.appendChild(row);
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
window.onload = fetchSongs;
