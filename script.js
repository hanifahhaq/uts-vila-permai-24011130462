// Data Vila (Array Objek)
const dataVila = [
    {
        id: 1,
        nama: "Vila Anggrek Asri",
        tipe: "3 Kamar Tidur + Kolam Renang",
        lokasi: "Puncak Pass, Bogor",
        harga: 1250000,
        fasilitas: "AC, WiFi, Kolam Renang Pribadi, Alat BBQ, TV Layar Datar",
        status: "Tersedia"
    },
    {
        id: 2,
        nama: "Vila Pinus Panorama",
        tipe: "2 Kamar Tidur + Pemandangan Lembah",
        lokasi: "Cisarua, Bogor",
        harga: 850000,
        fasilitas: "Water Heater, WiFi, Balkon Luas, Dapur Lengkap",
        status: "Tersedia"
    },
    {
        id: 3,
        nama: "Vila Mawar Lestari",
        tipe: "4 Kamar Tidur + Halaman Bermain",
        lokasi: "Megamendung, Bogor",
        harga: 1750000,
        fasilitas: "AC, WiFi, Halaman Luas, Karaoke, Meja Biliar",
        status: "Tersedia"
    }
];

// Elemen DOM
const villaContainer = document.getElementById('villaContainer');
const pilihVilaSelect = document.getElementById('pilihVila');
const searchInput = document.getElementById('searchInput');
const bookingForm = document.getElementById('bookingForm');
const checkInInput = document.getElementById('checkIn');
const checkOutInput = document.getElementById('checkOut');
const jumlahTamuInput = document.getElementById('jumlahTamu');
const durasiMalamSpan = document.getElementById('durasiMalam');
const displayHargaSatuan = document.getElementById('displayHargaSatuan');
const totalBiayaSpan = document.getElementById('totalBiaya');
const btnCek = document.getElementById('btnCek');
const successMessage = document.getElementById('successMessage');

// Fungsi Render Daftar Vila menggunakan createElement & appendChild
function renderVila(listVila) {
    villaContainer.innerHTML = '';
    
    if (listVila.length === 0) {
        villaContainer.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Vila tidak ditemukan.</p>';
        return;
    }

    listVila.forEach(villa => {
        const article = document.createElement('article');
        article.className = 'villa-card';

        const bodyDiv = document.createElement('div');
        bodyDiv.className = 'villa-card_body';

        const title = document.createElement('h3');
        title.className = 'villa-card_title';
        title.textContent = villa.nama;

        const tipeP = document.createElement('p');
        tipeP.textContent = `Tipe: ${villa.tipe} (${villa.lokasi})`;

        const priceP = document.createElement('p');
        priceP.className = 'villa-card_price';
        priceP.textContent = `Rp ${villa.harga.toLocaleString('id-ID')} / malam`;

        const fasP = document.createElement('p');
        fasP.style.fontSize = '0.9rem';
        fasP.style.color = '#666';
        fasP.textContent = `Fasilitas: ${villa.fasilitas}`;

        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = villa.status;

        bodyDiv.appendChild(title);
        bodyDiv.appendChild(tipeP);
        bodyDiv.appendChild(priceP);
        bodyDiv.appendChild(fasP);
        bodyDiv.appendChild(badge);
        article.appendChild(bodyDiv);

        villaContainer.appendChild(article);
    });
}

// Render Dropdown Pilihan Vila
function renderDropdown() {
    dataVila.forEach(villa => {
        const option = document.createElement('option');
        option.value = villa.id;
        option.textContent = `${villa.nama} - Rp ${villa.harga.toLocaleString('id-ID')}/malam`;
        pilihVilaSelect.appendChild(option);
    });
}

// Fungsi Perhitungan Total Harga Otomatis
function hitungTotalHarga() {
    const selectedId = pilihVilaSelect.value;
    const checkInDate = new Date(checkInInput.value);
    const checkOutDate = new Date(checkOutInput.value);

    if (!selectedId || isNaN(checkInDate) || isNaN(checkOutDate)) {
        durasiMalamSpan.textContent = '0';
        displayHargaSatuan.textContent = 'Rp 0';
        totalBiayaSpan.textContent = 'Rp 0';
        return 0;
    }

    const villaDipilih = dataVila.find(v => v.id == selectedId);
    const selisihWaktu = checkOutDate.getTime() - checkInDate.getTime();
    const jumlahMalam = Math.ceil(selisihWaktu / (1000 * 3600 * 24));

    if (jumlahMalam <= 0) {
        durasiMalamSpan.textContent = '0';
        displayHargaSatuan.textContent = `Rp ${villaDipilih.harga.toLocaleString('id-ID')}`;
        totalBiayaSpan.textContent = 'Rp 0';
        return 0;
    }

    const total = villaDipilih.harga * jumlahMalam;
    
    durasiMalamSpan.textContent = jumlahMalam;
    displayHargaSatuan.textContent = `Rp ${villaDipilih.harga.toLocaleString('id-ID')}`;
    totalBiayaSpan.textContent = `Rp ${total.toLocaleString('id-ID')}`;

    return total;
}

// Fungsi Validasi Formulir
function validasiForm() {
    let isValid = true;
    const namaTamu = document.getElementById('namaTamu').value.trim();
    const pilihVila = pilihVilaSelect.value;
    const checkIn = checkInInput.value;
    const checkOut = checkOutInput.value;
    const jumlahTamu = parseInt(jumlahTamuInput.value);
    
    // Reset pesan error
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');

    const hariIni = new Date();
    hariIni.setHours(0,0,0,0);

    if (!namaTamu) {
        document.getElementById('errorNama').textContent = 'Nama tamu wajib diisi.';
        isValid = false;
    }

    if (!pilihVila) {
        document.getElementById('errorVila').textContent = 'Silakan pilih unit vila.';
        isValid = false;
    }

    if (!checkIn) {
        document.getElementById('errorCheckIn').textContent = 'Tanggal check-in wajib diisi.';
        isValid = false;
    } else if (new Date(checkIn) < hariIni) {
        document.getElementById('errorCheckIn').textContent = 'Tanggal check-in tidak boleh di masa lalu.';
        isValid = false;
    }

    if (!checkOut) {
        document.getElementById('errorCheckOut').textContent = 'Tanggal check-out wajib diisi.';
        isValid = false;
    } else if (checkIn && new Date(checkOut) <= new Date(checkIn)) {
        document.getElementById('errorCheckOut').textContent = 'Tanggal check-out harus setelah tanggal check-in.';
        isValid = false;
    }

    if (isNaN(jumlahTamu) || jumlahTamu < 1 || jumlahTamu > 10) {
        document.getElementById('errorJumlahTamu').textContent = 'Jumlah tamu harus antara 1 sampai 10 orang.';
        isValid = false;
    }

    return isValid;
}

// Event Listeners untuk Perhitungan Real-Time
pilihVilaSelect.addEventListener('change', hitungTotalHarga);
checkInInput.addEventListener('change', hitungTotalHarga);
checkOutInput.addEventListener('change', hitungTotalHarga);

// Tombol Cek Ketersediaan
btnCek.addEventListener('click', () => {
    try {
        if (validasiForm()) {
            alert('Ketersediaan Terkonfirmasi: Unit vila tersedia untuk tanggal yang Anda pilih!');
        } else {
            alert('Mohon lengkapi formulir dengan benar terlebih dahulu.');
        }
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
    }
});

// Penanganan Submit Formulir & LocalStorage
bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    try {
        if (validasiForm()) {
            const namaTamu = document.getElementById('namaTamu').value.trim();
            const villaDipilih = dataVila.find(v => v.id == pilihVilaSelect.value);
            const total = hitungTotalHarga();

            // Simpan nama tamu terakhir ke localStorage
            localStorage.setItem('namaTamuTerakhir', namaTamu);

            successMessage.style.display = 'block';
            successMessage.innerHTML = `<strong>Pemesanan Berhasil!</strong> Terima kasih Bapak/Ibu <strong>${namaTamu}</strong>. Pesanan untuk <strong>${villaDipilih.nama}</strong> telah dicatat. Total estimasi: <strong>Rp ${total.toLocaleString('id-ID')}</strong>. Pak Hendra akan segera menghubungi Anda melalui WhatsApp.`;
            
            bookingForm.reset();
            hitungTotalHarga();
        }
    } catch (error) {
        console.error("Gagal memproses pesanan:", error);
    }
});

// Fitur Pencarian / Filter Vila
searchInput.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    const filtered = dataVila.filter(v => 
        v.nama.toLowerCase().includes(keyword) || 
        v.fasilitas.toLowerCase().includes(keyword) ||
        v.lokasi.toLowerCase().includes(keyword)
    );
    renderVila(filtered);
});

// Inisialisasi Saat Halaman Dimuat
document.addEventListener('DOMContentLoaded', () => {
    renderVila(dataVila);
    renderDropdown();

    // Muat data terakhir dari localStorage jika ada
    const savedName = localStorage.getItem('namaTamuTerakhir');
    if (savedName) {
        document.getElementById('namaTamu').value = savedName;
    }
});