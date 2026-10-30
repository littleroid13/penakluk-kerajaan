/**
 * PENAKHLUKAN KERAJAAN - Bank Soal Edukasi
 * Mendukung 5 tipe soal:
 * 1. multiple_choice (Pilihan Ganda)
 * 2. true_false (Benar/Salah)
 * 3. matching (Menjodohkan)
 * 4. drag_drop (Drag & Drop / Urutkan)
 * 5. short_answer (Isian Singkat)
 * Dilengkapi penyimpanan LocalStorage, Import/Export JSON, dan CRUD.
 */

const DEFAULT_QUESTIONS = [
    // 1. Pilihan Ganda (English)
    {
        id: 'q1',
        type: 'multiple_choice',
        category: 'English',
        question: 'What is the English word for a fortified medieval residence of a king or lord?',
        options: ['Castle', 'Dungeon', 'Barracks', 'Blacksmith'],
        correctIndex: 0,
        explanation: '"Castle" adalah istana berbenteng khas era pertengahan.'
    },
    // 2. Pilihan Ganda (General Knowledge)
    {
        id: 'q2',
        type: 'multiple_choice',
        category: 'General Knowledge',
        question: 'Siapakah penguasa wanita paling terkenal dari Kerajaan Majapahit yang bergelar Tribhuwana Tunggadewi?',
        options: ['Ratu Ken Dedes', 'Ratu Shima', 'Ratu Tribhuwana Tunggadewi', 'Ratu Gayatri'],
        correctIndex: 2,
        explanation: 'Tribhuwana Wijayatunggadewi memerintah Majapahit pada tahun 1328–1350 M bersama Mahapatih Gajah Mada.'
    },
    // 3. Benar / Salah (English Grammar)
    {
        id: 'q3',
        type: 'true_false',
        category: 'English',
        question: 'Determine whether this sentence is grammatically correct or false:',
        statement: '"The brave knights fights fiercely on the battlefield."',
        correctAnswer: false,
        explanation: 'Salah! Subjek jamak "knights" harus menggunakan kata kerja dasar "fight" (bukan "fights").'
    },
    // 4. Benar / Salah (General Knowledge)
    {
        id: 'q4',
        type: 'true_false',
        category: 'General Knowledge',
        question: 'Tentukan kebenaran dari pernyataan sejarah berikut:',
        statement: 'Sumpah Palapa yang diucapkan oleh Mahapatih Gajah Mada bertujuan menyatukan seluruh Nusantara.',
        correctAnswer: true,
        explanation: 'Benar! Sumpah Palapa diikrarkan pada pelantikan Gajah Mada sebagai Patih Amangkubhumi.'
    },
    // 5. Menjodohkan (English Vocabulary - Medieval Roles)
    {
        id: 'q5',
        type: 'matching',
        category: 'English & Vocab',
        question: 'Jodohkan gelar / profesi kerajaan medieval dalam Bahasa Inggris dengan maknanya:',
        pairs: [
            { id: 'p1', left: 'Blacksmith', right: 'Pandai besi pembuat pedang & zirah' },
            { id: 'p2', left: 'Archer', right: 'Pemanah jitu berbusur panjang' },
            { id: 'p3', left: 'Scholar', right: 'Cendekiawan pencatat naskah kuno' },
            { id: 'p4', left: 'Monarch', right: 'Raja atau ratu penguasa tahta' }
        ],
        explanation: 'Blacksmith = Pandai besi, Archer = Pemanah, Scholar = Cendekiawan, Monarch = Penguasa monarki.'
    },
    // 6. Menjodohkan (General Knowledge - Kerajaan Nusantara)
    {
        id: 'q6',
        type: 'matching',
        category: 'General Knowledge',
        question: 'Jodohkan nama kerajaan di Nusantara dengan peninggalan terkenalnya:',
        pairs: [
            { id: 'k1', left: 'Kerajaan Mataram Kuno', right: 'Candi Prambanan & Borobudur' },
            { id: 'k2', left: 'Kerajaan Sriwijaya', right: 'Prasasti Kedukan Bukit' },
            { id: 'k3', left: 'Kerajaan Tarumanegara', right: 'Prasasti Ciaruteun (Telapak Kaki Purnawarman)' },
            { id: 'k4', left: 'Kerajaan Kutai', right: 'Prasasti Yupa bertuliskan Pallawa' }
        ],
        explanation: 'Mataram Kuno membangun Prambanan & Borobudur; Sriwijaya meninggalkan Prasasti Kedukan Bukit; Kutai terkenal dengan Yupa.'
    },
    // 7. Drag & Drop (English Sentence Ordering)
    {
        id: 'q7',
        type: 'drag_drop',
        category: 'English',
        question: 'Susun urutan kata berikut menjadi kalimat bahasa Inggris yang benar dan padu:',
        instruction: 'Tarik & geser (atau klik panah) untuk menyusun dari kiri ke kanan / atas ke bawah:',
        items: ['The golden crown', 'shines brightly', 'upon', 'the royal throne'],
        correctOrder: ['The golden crown', 'shines brightly', 'upon', 'the royal throne'],
        explanation: 'Susunan yang benar: "The golden crown shines brightly upon the royal throne."'
    },
    // 8. Drag & Drop (Hierarki Kasta Feodal Medieval)
    {
        id: 'q8',
        type: 'drag_drop',
        category: 'General Knowledge',
        question: 'Urutkan tingkatan hierarki sosial feodal Eropa Abad Pertengahan dari posisi tertinggi ke terendah:',
        instruction: 'Urutkan dari yang memiliki kekuasaan tertinggi di paling atas hingga rakyat jelata:',
        items: ['King (Raja)', 'Nobles / Lords (Bangsawan)', 'Knights (Ksatria Berzirah)', 'Peasants (Petani Jelata)'],
        correctOrder: ['King (Raja)', 'Nobles / Lords (Bangsawan)', 'Knights (Ksatria Berzirah)', 'Peasants (Petani Jelata)'],
        explanation: 'Hierarki feodal: King (Raja) > Nobles/Lords > Knights (Ksatria) > Peasants (Petani/Rakyat Jelata).'
    },
    // 9. Isian Singkat (English Vocabulary)
    {
        id: 'q9',
        type: 'short_answer',
        category: 'English',
        question: 'Fill in the blank with one word:',
        prompt: 'A large fire-breathing mythical creature often guarding royal treasures is called a _______?',
        acceptedAnswers: ['dragon', 'a dragon', 'dragons'],
        explanation: 'Makhluk mitologi penyembur api penjaga harta karun adalah "Dragon" (Naga).'
    },
    // 10. Isian Singkat (General Knowledge)
    {
        id: 'q10',
        type: 'short_answer',
        category: 'General Knowledge',
        question: 'Jawab dengan singkat nama kerajaan maritim Buddha terbesar di Pulau Sumatera yang berdiri pada abad ke-7:',
        prompt: 'Nama kerajaan maritim tersebut adalah: _______',
        acceptedAnswers: ['sriwijaya', 'kerajaan sriwijaya', 'srivijaya'],
        explanation: 'Kerajaan Sriwijaya berpusat di Palembang dan menguasai jalur perdagangan Selat Malaka.'
    },
    // 11. Pilihan Ganda (English Idiom)
    {
        id: 'q11',
        type: 'multiple_choice',
        category: 'English',
        question: 'What does the English idiom "A knight in shining armor" mean?',
        options: [
            'A very wealthy museum collector',
            'Someone who arrives to rescue or help another person in trouble',
            'A warrior who never washes their armor',
            'A king without a kingdom'
        ],
        correctIndex: 1,
        explanation: '"A knight in shining armor" menggambarkan seorang penyelamat yang menolong seseorang yang sedang kesulitan.'
    },
    // 12. Pilihan Ganda (Geografi & Sejarah)
    {
        id: 'q12',
        type: 'multiple_choice',
        category: 'General Knowledge',
        question: 'Kastil Neuschwanstein yang terkenal di Jerman menginspirasi desain istana dongeng apa?',
        options: ['Istana Buckingham', 'Istana Cinderella / Sleeping Beauty Disney', 'Istana Versailles', 'Taj Mahal'],
        correctIndex: 1,
        explanation: 'Kastil Neuschwanstein di Bavaria dibangun oleh Raja Ludwig II dan menjadi inspirasi kastil ikonik Disney.'
    },
    // 13. Benar / Salah (English Spelling)
    {
        id: 'q13',
        type: 'true_false',
        category: 'English',
        question: 'Is the following spelling correct?',
        statement: '"The word \'Sovereign\' (meaning supreme ruler) is spelled with a silent G."',
        correctAnswer: true,
        explanation: 'Benar! Kata "Sovereign" dieja S-O-V-E-R-E-I-G-N dengan huruf \'g\' yang tidak berbunyi nyaring.'
    },
    // 14. Menjodohkan (English Synonyms)
    {
        id: 'q14',
        type: 'matching',
        category: 'English Vocab',
        question: 'Jodohkan kata sifat medieval berikut dengan sinonimnya:',
        pairs: [
            { id: 's1', left: 'Valiant', right: 'Brave & Courageous (Pemberani)' },
            { id: 's2', left: 'Majestic', right: 'Grand & Splendid (Megah/Agung)' },
            { id: 's3', left: 'Treacherous', right: 'Deceitful & Traitorous (Berkhianat)' },
            { id: 's4', left: 'Ancient', right: 'Very Old (Kuno Bersejarah)' }
        ],
        explanation: 'Valiant = Pemberani; Majestic = Megah; Treacherous = Berbahaya/Pengkhianat; Ancient = Kuno.'
    },
    // 15. Isian Singkat (Pengetahuan Alam & Sejarah)
    {
        id: 'q15',
        type: 'short_answer',
        category: 'General Knowledge',
        question: 'Besi yang ditempa bersama karbon untuk membuat pedang kuat zaman pertengahan menghasilkan paduan logam yang disebut?',
        prompt: 'Sebutkan nama logam paduan tersebut: _______ (Bahasa Indonesia atau Inggris)',
        acceptedAnswers: ['baja', 'steel', 'baja tempa', 'carbon steel'],
        explanation: 'Besi (iron) yang dipadukan dengan karbon menghasilkan "baja" (steel) yang jauh lebih keras dan tajam.'
    },
    // 16. Pilihan Ganda (Matematika KaTeX - Pecahan & Aljabar)
    {
        id: 'q16',
        type: 'multiple_choice',
        category: 'Matematika',
        question: 'Berapakah hasil operasi penjumlahan pecahan: $\\frac{3}{4} + \\frac{1}{2}$?',
        options: [
            '$\\frac{5}{4}$ atau $1\\frac{1}{4}$',
            '$\\frac{4}{6}$ atau $\\frac{2}{3}$',
            '$\\frac{3}{8}$',
            '$\\frac{5}{8}$'
        ],
        correctIndex: 0,
        explanation: 'Samakan penyebut menjadi 4: $\\frac{3}{4} + \\frac{2}{4} = \\frac{5}{4} = 1\\frac{1}{4}$.'
    },
    // 17. Pilihan Ganda (Sains Fisika KaTeX - Rumus Gaya Newton II)
    {
        id: 'q17',
        type: 'multiple_choice',
        category: 'Sains Fisika',
        question: 'Persamaan Hukum II Newton tentang hubungan gaya ($F$), massa ($m$), dan percepatan ($a$) dinyatakan dengan rumus:',
        options: [
            '$F = m \\cdot a$',
            '$F = \\frac{m}{a}$',
            '$F = m \\cdot v^2$',
            '$F = \\frac{1}{2}m v$'
        ],
        correctIndex: 0,
        explanation: 'Menurut Hukum II Newton, resultan gaya berbanding lurus dengan massa dan percepatan benda: $$F = m \\cdot a$$'
    },
    // 18. Pilihan Ganda (Sains Kimia KaTeX - Rumus Molekul Glukosa)
    {
        id: 'q18',
        type: 'multiple_choice',
        category: 'Sains Kimia',
        question: 'Manakah rumus kimia molekul glukosa yang dihasilkan dari reaksi fotosintesis: $6CO_2 + 6H_2O \\rightarrow ... + 6O_2$?',
        options: [
            '$C_6H_{12}O_6$',
            '$CH_4$',
            '$C_2H_5OH$',
            '$CaCO_3$'
        ],
        correctIndex: 0,
        explanation: 'Glukosa adalah karbohidrat sederhana dengan rumus molekul $C_6H_{12}O_6$.'
    }
];

class QuestionBank {
    constructor() {
        this.storageKey = 'penakhlukan_kerajaan_questions_v1';
        this.questions = [];
        this.load();
    }

    load() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    // Pastikan default questions baru (seperti rumus matematika KaTeX) juga tersedia
                    const existingIds = new Set(parsed.map(q => q.id));
                    let added = false;
                    DEFAULT_QUESTIONS.forEach(defQ => {
                        if (!existingIds.has(defQ.id)) {
                            parsed.push(JSON.parse(JSON.stringify(defQ)));
                            added = true;
                        }
                    });
                    this.questions = parsed;
                    if (added) this.save();
                    return;
                }
            }
        } catch (e) {
            console.warn('Gagal memuat soal dari localStorage, menggunakan default:', e);
        }
        this.questions = JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
        this.save();
    }

    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.questions));
        } catch (e) {
            console.warn('Gagal menyimpan soal ke localStorage:', e);
        }
    }

    resetToDefault() {
        this.questions = JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
        this.save();
        return this.questions;
    }

    getAll() {
        return this.questions;
    }

    getRandomQuestion(excludeIds = []) {
        const available = this.questions.filter(q => !excludeIds.includes(q.id));
        if (available.length === 0) {
            // Jika semua sudah terpakai, ambil acak dari keseluruhan
            const idx = Math.floor(Math.random() * this.questions.length);
            return this.questions[idx];
        }
        const idx = Math.floor(Math.random() * available.length);
        return available[idx];
    }

    addQuestion(q) {
        if (!q.id) {
            q.id = 'custom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
        }
        this.questions.push(q);
        this.save();
        return q;
    }

    deleteQuestion(id) {
        const before = this.questions.length;
        this.questions = this.questions.filter(q => q.id !== id);
        this.save();
        return this.questions.length < before;
    }

    exportJSON() {
        return JSON.stringify(this.questions, null, 2);
    }

    importJSON(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            if (!Array.isArray(parsed)) {
                throw new Error('Data JSON harus berupa Array soal.');
            }
            if (parsed.length === 0) {
                throw new Error('Data JSON kosong.');
            }
            // Validasi ringkas
            parsed.forEach((item, idx) => {
                if (!item.type || !item.question) {
                    throw new Error(`Soal baris ke-${idx + 1} tidak memiliki 'type' atau 'question'.`);
                }
                if (!item.id) {
                    item.id = 'imported_' + Date.now() + '_' + idx;
                }
            });
            this.questions = parsed;
            this.save();
            return { success: true, count: parsed.length };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }
}

window.questionBank = new QuestionBank();
