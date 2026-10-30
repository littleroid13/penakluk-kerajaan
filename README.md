# 👑 PENAKHLUKAN KERAJAAN
> **Game Edukasi Web Interaktif Berbasis HTML5 Canvas & Vanilla JavaScript**  
> Gaya Board Game 3D Isometris dengan Atmosfer Medieval Fantasy & Visual 3D Low-Poly yang Lucu & Berwarna.

---

## 🏰 Struktur Halaman Baru
Game kini telah dipisahkan menjadi dua halaman terpisah:
1. **[`index.html`](file:///d:/Project/Media%20Belajar/Penakhlukan%20Kerajaan/index.html) (Halaman Lobby & Setup)**:
   - Pemilihan faksi untuk 4 Tim dari 6 pilihan Faksi Medieval unik.
   - Kustomisasi nama tim (masing-masing mengendalikan 4 prajurit/pion).
   - Modul Bank Soal Edukasi (Tambah Soal, Import/Export JSON).
   - Tombol "Masuk ke Arena Penakhlukan" untuk menyimpan konfigurasi dan meluncurkan gameplay.
2. **[`game.html`](file:///d:/Project/Media%20Belajar/Penakhlukan%20Kerajaan/game.html) (Halaman Gameplay Fullscreen)**:
   - Layar penuh (*Edge-to-Edge Canvas 100vw x 100vh*).
   - HUD Transparan (*Glassmorphism*) sehingga tidak menutupi visual papan game 3D.
   - Tombol kontrol minimalis berupa **logo/ikon saja tanpa teks** (`📜` Aturan, `🔊` Suara, `🏰` Kembali ke Lobby).
   - Tombol soal telah dihilangkan dari HUD (soal muncul otomatis saat menginjak petak TRUTH).

---

## 🎲 Sistem Jalur Ludo & Mekanik Putaran Penuh (1 Lap)
- **44 Petak Kastil Kuno**: Dibuat proporsional dan agak lebih ringkas dari papan ludo 52 petak standar dengan belokan-belokan benteng khas kerajaan medieval.
- **4 Pion per Tim**: Total 16 pion prajurit mungil di arena.
- **Titik Masuk Finish Tepat Sebelum Base**:
  - Tim 1 (Keluar petak 0) $\to$ Masuk jalur finish di petak 43 (tepat sebelum 0).
  - Tim 2 (Keluar petak 11) $\to$ Masuk jalur finish di petak 10 (tepat sebelum 11).
  - Tim 3 (Keluar petak 22) $\to$ Masuk jalur finish di petak 21 (tepat sebelum 22).
  - Tim 4 (Keluar petak 33) $\to$ Masuk jalur finish di petak 32 (tepat sebelum 33).
- **Syarat Memutari 1 Kali Penuh**: Pion wajib menempuh 1 putaran penuh mengitari jalur sirkuit kerajaan sebelum berbelok menaiki tangga 5 tingkat menuju Tahta Besi Emas di pusat peta.
- **Ruler of the Realm**: Kemenangan diraih oleh tim yang pertama kali berhasil membawa **seluruh 4 pionnya** menduduki Tahta Pusat!

Setiap petak menyajikan kejutan edukatif dan taktis: menjawab soal (TRUTH), tantangan kelas seru (DARE), peti harta karun (TREASURE), kekuatan dadu taktis (SPECIAL DICE), peristiwa misterius (WEIRD DICE), serta sensasi kompetitif menendang pion musuh kembali ke markas (KICK TO BASE)!

---

## 🛡️ 6 Pilihan Faksi Kerajaan
Di lobi permainan, masing-masing dari 4 tim dapat memilih faksi unik:
1. **House of the Dragon** (Merah) — *Prajurit Mini Naga Berzirah*  
   *Motto: "Api Abadi Menguasai Takhta!"*
2. **Iron Citadel** (Baja / Abu-abu) — *Prajurit Mini Ksatria Zirah Penuh*  
   *Motto: "Kukuh Bagai Dinding Baja Kuno!"*
3. **Woodland Elves** (Hijau Zamrud) — *Prajurit Mini Pemanah Elf*  
   *Motto: "Mata Panah Cepat Bagai Angin Hutan!"*
4. **Arcane Order** (Ungu Royal) — *Prajurit Mini Penyihir Berjubah*  
   *Motto: "Pengetahuan Misterius Membuka Takhta!"*
5. **Northern Wolves** (Biru Es) — *Prajurit Mini Prajurit Serigala*  
   *Motto: "Dinginnya Salju Menempa Keberanian!"*
6. **Golden Crown** (Emas / Kuning) — *Prajurit Mini Mahkota Emas*  
   *Motto: "Hanya Darah Raja yang Memimpin!"*

---

## 🎲 Fitur & Mekanik Permainan

### 1. Board Isometris 3D (Diamond Loop)
- **32 Petak Jalur Luar**: Mengitari pusat peta dengan koordinat isometris dan orientasi diagonal (Diamond Loop).
- **4 Jalur Menuju Tahta (Finish Lanes)**: 4 cabang tangga batu bertingkat yang menanjak ke arah Tahta Pusat.
- **Pusat Papan (Tahta Besi Emas)**: Singgasana emas megah dihiasi kipas pedang besi kuno, karpet merah bertingkat, dan aura sinar emas berpendar.

### 2. Jenis Petak Khusus
- 📜 **TRUTH (Kitab Kuno)**: Membuka modal soal edukasi.  
  - *Benar*: +100 poin dan pion tetap di tempat.  
  - *Salah*: Pion mundur ke petak sebelum lemparan dadu.
- 🎭 **DARE (Topeng Istana)**: Tantangan kelas interaktif (Tongue Twister bahasa Inggris, pantomim ksatria, pidato raja, tarian masquerade).  
  - *Guru / Kelas Klik "Berhasil"*: +70 poin.  
  - *Klik "Gagal"*: 0 poin.
- 🎲 **SPECIAL DICE (Dadu Emas)**: Item taktis kerajaan:
  - *Langkah Ksatria Cepat*: Maju 2 petak ekstra.
  - *Sihir Tukar Posisi*: Bertukar posisi dengan pion lawan di depan.
  - *Perisai Suci Aegis*: Kebal dari 1 kali tendangan lawan ke base.
  - *Komando Ekstra*: Lempar dadu 1 kali lagi.
  - *Peti Koin Kerajaan*: Bonus instan +100 poin.
- 🌀 **WEIRD DICE (Dadu Misteri)**: Peristiwa tak terduga:
  - *Badai Salju Kuno*: Mundur 2 petak.
  - *Panggilan Mahaguru*: Ditarik ke petak TRUTH terdekat.
  - *Kutukan Naga Tidur*: Giliran berikutnya dilewati (*Skip Turn*).
  - *Portal Kekacauan*: Bertukar posisi dengan pion paling belakang.
  - *Terpeleset Kulit Pisang*: Kehilangan 30 poin.
- 💎 **TREASURE (Peti Emas)**: Bonus instan +150 poin!
- 🛡️ **BLANK (Petak Batu Kosong)**: Aman tanpa efek.

### 3. Mekanik Tendang (*Kick to Base*)
Jika sebuah tim mendarat di petak luar yang sedang ditempati pion musuh:
- Jika pion musuh memiliki **Perisai Aegis**: Perisai hancur, pion musuh selamat.
- Jika tidak memiliki perisai: Pion musuh **terlempar kembali ke Markas (Base Camp)**, dan tim penendang mendapat bonus **+50 poin kehormatan**!

### 4. Dadu 3D Interaktif & Animasi Melompat
- Dadu 3D kubus bergaya medieval yang berputar secara realistis di ruang 3D dengan fisika pantulan dan suara benturan kayu/batu.
- Perpindahan pion menggunakan **animasi parabola melengkung (*arc hop*)** yang mulus lengkap dengan bayangan dinamis dan partikel debu saat mendarat.

### 5. Penentuan Pemenang (*Ruler of the Realm*)
- Setiap pion yang berhasil masuk ke Tahta Pusat memberikan **+200 poin**.
- Tim pertama yang berhasil mengantar **seluruh prajuritnya** ke Tahta Pusat dinobatkan sebagai **"Ruler of the Realm"** dan memperoleh bonus **+500 poin**, sekaligus memicu akhir permainan!

---

## 📚 Bank Soal Edukasi (5 Tipe Interaktif)
Game ini mendukung 5 jenis soal interaktif lengkap:
1. **Pilihan Ganda (*Multiple Choice*)**: Pilihan A, B, C, D dengan radio card interaktif.
2. **Benar / Salah (*True / False*)**: Tombol pilihan visual besar.
3. **Menjodohkan (*Matching Pairs*)**: Klik item kolom kiri lalu pasangkan dengan kolom kanan secara visual.
4. **Drag & Drop / Urutkan (*Reordering*)**: Mengurutkan tingkatan kasta feodal atau kata kalimat menggunakan tombol naik/turun interaktif.
5. **Isian Singkat (*Short Answer*)**: Form ketik teks dengan validasi kata kunci tidak peka huruf besar/kecil (*case-insensitive*).

> **Fitur Tambahan Bank Soal:**
> - Tambah soal baru dengan formulir dinamis sesuai tipe.
> - Simpan otomatis ke `localStorage`.
> - **Export JSON**: Unduh seluruh bank soal ke file `.json`.
> - **Import JSON**: Muat soal kustom buatan guru dari teks JSON.

---

## 📊 End-Game Report & Ekspor Data
- **Piagam Kerajaan Kuno (*Ancient Royal Parchment*)**: Menampilkan peringkat Juara 1–4, total skor, rasio jawaban benar/salah, jumlah dare yang berhasil, dan jumlah pion yang finish.
- **Tombol "Export to CSV / Excel"**: Mengunduh rekap hasil belajar seluruh tim secara otomatis dalam format CSV siap buka di Microsoft Excel atau Google Sheets.

---

## 🚀 Cara Menjalankan
Game ini **100% Client-Side Vanilla JavaScript & HTML5 Canvas** tanpa dependensi luar (bahkan seluruh efek suara menggunakan *Web Audio API* sintetis sehingga berjalan lancar offline tanpa butuh koneksi internet).

## 🚀 Cara Menjalankan di Localhost

Telah disediakan modul server bawaan berbasis Node.js yang ringan, bebas dependensi eksternal, dan langsung membuka browser otomatis.

### Cara 1: Menggunakan Script Klik Ganda (Paling Praktis di Windows)
Cukup klik ganda (double-click) file:
👉 **`start-server.bat`**  
Browser default akan otomatis terbuka di `http://localhost:3000`.

---

### Cara 2: Menggunakan Node.js / NPM Terminal
Buka terminal / PowerShell di folder proyek ini dan jalankan salah satu perintah:
```bash
# Menggunakan npm
npm start

# Atau langsung menggunakan node
node server.js
```

> **Fitur Modul Server (`server.js`):**
> - **Auto-open Browser**: Otomatis membuka game di browser saat server menyala.
> - **Akses Mobile / Tablet**: Menampilkan IP jaringan lokal (contoh: `http://192.168.x.x:3000`) agar siswa/guru dapat mengakses game dari HP atau tablet di jaringan Wi-Fi yang sama.
> - **Deteksi Port Otomatis**: Jika port `3000` sedang dipakai aplikasi lain, server otomatis berpindah ke `3001`, `3002`, dst.
> - **Opsi Kustom Port**: Jalankan dengan `node server.js --port=8080`.
> - **Opsi Tanpa Auto-Open**: Jalankan dengan `node server.js --no-open`.

---

### Cara 3: Buka Langsung File HTML (Offline Tanpa Server)
Game ini dibangun dengan Vanilla JavaScript dan Web Audio API prosedural sehingga Anda juga dapat langsung membuka file **`index.html`** di browser apa pun tanpa memerlukan server.
