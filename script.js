// Ganti dengan ID spreadsheet Anda dan API key
const SPREADSHEET_ID = '1c6hI658kbp_S3a3C8oWRXiPI00qqSckYGJn8boQkPdE'; // ID spreadsheet (ambil dari URL Google Sheets)
const API_KEY = 'AIzaSyBB8BvD1DFag4NCCzdWFk1V42EeiNuWahk'; // API Key yang sudah dibuat
const RANGE = 'Sheet1!A2:D'; // Mengambil data dari Sheet1, kolom A sampai D

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
}

function deleteSelectedSongs() {
    const tbody = document.querySelector('#songList tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    rows.forEach(row => {
        const checkbox = row.querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) {
            tbody.removeChild(row);
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
window.onload = fetchSongs;
