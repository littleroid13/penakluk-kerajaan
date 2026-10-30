/**
 * PENAKHLUKAN KERAJAAN - Bank Tantangan DARE (Tantangan Kelas)
 * Didesain khusus untuk interaksi seru guru & siswa di dalam kelas.
 */

const CLASSROOM_DARES = [
    {
        id: 'dare_1',
        title: 'English Tongue Twister: Peter Piper',
        type: 'tongue_twister',
        badge: 'Tongue Twister',
        points: 70,
        timeLimit: 20,
        instruction: 'Ucapkan kalimat berikut dalam Bahasa Inggris sebanyak 2 KALI berturut-turut tanpa salah dan cepat!',
        promptText: '"Peter Piper picked a peck of pickled peppers. A peck of pickled peppers Peter Piper picked!"',
        tipForTeacher: 'Nilai kelancaran pengucapan dan keberanian siswa!'
    },
    {
        id: 'dare_2',
        title: 'English Tongue Twister: Woodchuck Challenge',
        type: 'tongue_twister',
        badge: 'Tongue Twister',
        points: 70,
        timeLimit: 20,
        instruction: 'Tantang lidahmu! Ucapkan kalimat terkenal ini dengan intonasi jelas dalam 15 detik:',
        promptText: '"How much wood would a woodchuck chuck if a woodchuck could chuck wood?"',
        tipForTeacher: 'Siswa harus berusaha mengucapkan dengan senyuman dan ritme cepat!'
    },
    {
        id: 'dare_3',
        title: 'Pantomim: Ksatria Berkuda Mogok',
        type: 'mime',
        badge: 'Roleplay / Pantomim',
        points: 80,
        timeLimit: 30,
        instruction: 'Peragakan seorang ksatria berzirah berat yang sedang menaiki kuda gagah, tetapi kudanya tiba-tiba mogok dan lapar!',
        promptText: 'Lakukan gerakan tubuh dan ekspresi wajah TANPA BERSUARA selama 15 detik sampai kelas tertawa!',
        tipForTeacher: 'Guru & teman-teman menilai kelucuan akting siswa!'
    },
    {
        id: 'dare_4',
        title: 'Royal Masquerade Dance',
        type: 'masquerade',
        badge: 'Tarian Istana',
        points: 80,
        timeLimit: 25,
        instruction: 'Berdirilah dan peragakan "Tarian Dansa Pesta Topeng Istana Kerajaan" yang anggun namun sangat kocak!',
        promptText: 'Bungkukkan badan dengan hormat bangsawan (curtsey / bow), lalu putar badan dengan langkah anggun!',
        tipForTeacher: 'Pastikan gerakan bangsawan tampak dramatis!'
    },
    {
        id: 'dare_5',
        title: 'Pidato Raja: Hari Libur Es Krim',
        type: 'speech',
        badge: 'Pidato Megah',
        points: 70,
        timeLimit: 25,
        instruction: 'Berdirilah tegak bak Baginda Raja/Ratu dan umumkan maklumat kerajaan dengan suara lantang dan berwibawa:',
        promptText: '"Dengarlah rakyatku! Atas titah tahta, hari ini seluruh prajurit dan rakyat wajib makan es krim rasa cokelat!"',
        tipForTeacher: 'Harus dengan suara lantang dan dada dibusungkan!'
    },
    {
        id: 'dare_6',
        title: 'Tantangan 5 Kosakata Kerajaan (English)',
        type: 'speed_vocab',
        badge: 'English Sprint',
        points: 90,
        timeLimit: 15,
        instruction: 'Sebutkan 5 kata benda / karakter yang ada di dalam kerajaan dalam Bahasa Inggris sebelum waktu habis!',
        promptText: 'Contoh: King, Queen, Sword, Castle, Shield, Crown, Horse, Gold, Knight, Dragon...',
        tipForTeacher: 'Siswa harus menyebutkan minimal 5 kata dalam waktu 15 detik!'
    },
    {
        id: 'dare_7',
        title: 'Auman Naga Kerajaan (Dragon Roar)',
        type: 'mime',
        badge: 'Pantomim Suara',
        points: 70,
        timeLimit: 15,
        instruction: 'Tunjukkan pose cakar naga dan tirukan suara auman naga penjaga takhta yang sedang membangunkan seisi istana!',
        promptText: 'Buka tangan lebar-lebar bagai sayap naga dan keluarkan auman naga terhebatmu!',
        tipForTeacher: 'Beri nilai jika aumannya cukup menghebohkan kelas!'
    },
    {
        id: 'dare_8',
        title: 'Mantra Penyihir Bahasa Inggris (Spell Casting)',
        type: 'roleplay',
        badge: 'Mantra Ajaib',
        points: 80,
        timeLimit: 20,
        instruction: 'Pegang pulpen / penggaris bagai tongkat sihir kerajaan, lalu lafalkan mantra berikut dengan gerakan dramatis:',
        promptText: '"Abracadabra, Hocus Pocus! By the light of the Moon, let our team conquer the Golden Throne!"',
        tipForTeacher: 'Gerakan mengayunkan tongkat sihir harus dramatis!'
    },
    {
        id: 'dare_9',
        title: 'Tongue Twister: Red Lorry, Yellow Lorry',
        type: 'tongue_twister',
        badge: 'Tongue Twister',
        points: 70,
        timeLimit: 15,
        instruction: 'Ucapkan frasa cepat ini sebanyak 4 KALI tanpa tersandung lidah:',
        promptText: '"Red lorry, yellow lorry, red lorry, yellow lorry!"',
        tipForTeacher: 'Semakin cepat dan jelas semakin baik!'
    },
    {
        id: 'dare_10',
        title: 'Hormat Ksatria Meja Bundar (Royal Oath)',
        type: 'speech',
        badge: 'Sumpah Ksatria',
        points: 80,
        timeLimit: 20,
        instruction: 'Berlutut dengan satu kaki, letakkan tangan kanan di dada kiri, dan ucapkan ikrar ksatria setia:',
        promptText: '"Demi kemuliaan kerajaan dan kehormatan faksi kami, pantang pulang sebelum tahta emas tertakhlukkan!"',
        tipForTeacher: 'Ekspresi harus khidmat dan penuh semangat!'
    }
];

class DareManager {
    constructor() {
        this.dares = [];
        this.load();
    }

    load() {
        try {
            const raw = localStorage.getItem('penakhlukan_dares_custom');
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    this.dares = parsed;
                    return;
                }
            }
        } catch (e) {}
        this.dares = JSON.parse(JSON.stringify(CLASSROOM_DARES));
    }

    save() {
        try {
            localStorage.setItem('penakhlukan_dares_custom', JSON.stringify(this.dares));
        } catch (e) {}
    }

    getAllDares() {
        return this.dares;
    }

    getDareById(id) {
        return this.dares.find(d => d.id === id);
    }

    addDare(dare) {
        if (!dare.id) dare.id = 'dare_' + Date.now();
        if (!dare.points) dare.points = 70;
        if (!dare.timeLimit) dare.timeLimit = 20;
        this.dares.push(dare);
        this.save();
        return dare;
    }

    updateDare(id, updatedData) {
        const idx = this.dares.findIndex(d => d.id === id);
        if (idx !== -1) {
            this.dares[idx] = { ...this.dares[idx], ...updatedData };
            this.save();
            return this.dares[idx];
        }
        return null;
    }

    deleteDare(id) {
        this.dares = this.dares.filter(d => d.id !== id);
        if (this.dares.length === 0) {
            this.dares = JSON.parse(JSON.stringify(CLASSROOM_DARES));
        }
        this.save();
    }

    resetDefault() {
        this.dares = JSON.parse(JSON.stringify(CLASSROOM_DARES));
        this.save();
        return this.dares;
    }

    getRandomDare(excludeIds = []) {
        const available = this.dares.filter(d => !excludeIds.includes(d.id));
        if (available.length === 0) {
            return this.dares[Math.floor(Math.random() * this.dares.length)];
        }
        return available[Math.floor(Math.random() * available.length)];
    }
}

window.dareManager = new DareManager();
