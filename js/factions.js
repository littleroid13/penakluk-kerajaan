/**
 * PENAKHLUKAN KERAJAAN - Factions Data & Definitions
 * 6 Medieval Factions with distinct visual palettes, traits, and low-poly art guides
 */

const FACTIONS = [
    {
        id: 'dragon',
        name: 'House of the Dragon',
        shortName: 'Dragon',
        title: 'Wangsa Naga Berapi',
        unitName: 'Prajurit Mini Naga Berzirah',
        color: '#e63946',
        secondaryColor: '#9d0208',
        highlightColor: '#ffb703',
        shieldColor: '#6a040f',
        accentColor: '#ffe6a7',
        glowColor: 'rgba(230, 57, 70, 0.45)',
        icon: '🐉',
        motto: '"Api Abadi Menguasai Takhta!"',
        description: 'Prajurit mungil berpenampilan naga bersisik merah dengan tanduk emas mengkilap dan zirah magma perkasa.',
        pawnType: 'dragon'
    },
    {
        id: 'iron',
        name: 'Iron Citadel',
        shortName: 'Citadel',
        title: 'Benteng Besi Baja',
        unitName: 'Prajurit Mini Ksatria Zirah Penuh',
        color: '#6c757d',
        secondaryColor: '#343a40',
        highlightColor: '#adb5bd',
        shieldColor: '#495057',
        accentColor: '#f8f9fa',
        glowColor: 'rgba(108, 117, 125, 0.45)',
        icon: '🛡️',
        motto: '"Kukuh Bagai Dinding Baja Kuno!"',
        description: 'Ksatria berpelindung baja utuh dari ujung kepala hingga kaki dengan helm bersayap dan perisai singa perak.',
        pawnType: 'knight'
    },
    {
        id: 'elves',
        name: 'Woodland Elves',
        shortName: 'Elves',
        title: 'Penjaga Hutan Zamrud',
        unitName: 'Prajurit Mini Pemanah Elf',
        color: '#2a9d8f',
        secondaryColor: '#1b4332',
        highlightColor: '#52b788',
        shieldColor: '#2d6a4f',
        accentColor: '#d8f3dc',
        glowColor: 'rgba(42, 157, 143, 0.45)',
        icon: '🏹',
        motto: '"Mata Panah Cepat Bagai Angin Hutan!"',
        description: 'Pemanah lincah bertelinga runcing dengan jubah hijau dedaunan, busur kayu kuno, dan anak panah bercahaya.',
        pawnType: 'elf'
    },
    {
        id: 'arcane',
        name: 'Arcane Order',
        shortName: 'Arcane',
        title: 'Ordo Sihir Rahasia',
        unitName: 'Prajurit Mini Penyihir Berjubah',
        color: '#7209b7',
        secondaryColor: '#3a0ca3',
        highlightColor: '#b5179e',
        shieldColor: '#480ca8',
        accentColor: '#f72585',
        glowColor: 'rgba(114, 9, 183, 0.45)',
        icon: '🔮',
        motto: '"Pengetahuan Misterius Membuka Takhta!"',
        description: 'Penyihir cilik dengan topi kerucut berbintang emas, jubah ungu mistis bertabur rune, dan tongkat kristal bercahaya.',
        pawnType: 'wizard'
    },
    {
        id: 'wolves',
        name: 'Northern Wolves',
        shortName: 'Wolves',
        title: 'Kawanan Serigala Utara',
        unitName: 'Prajurit Mini Prajurit Serigala',
        color: '#0077b6',
        secondaryColor: '#03045e',
        highlightColor: '#00b4d8',
        shieldColor: '#023e8a',
        accentColor: '#caf0f8',
        glowColor: 'rgba(0, 119, 182, 0.45)',
        icon: '🐺',
        motto: '"Dinginnya Salju Menempa Keberanian!"',
        description: 'Petarung gagah berbulu serigala es dengan zirah kristal beku dan kapak kembar bertatahkan permata kutub.',
        pawnType: 'wolf'
    },
    {
        id: 'crown',
        name: 'Golden Crown',
        shortName: 'Crown',
        title: 'Keluarga Mahkota Emas',
        unitName: 'Prajurit Mini Mahkota Emas',
        color: '#e09f3e',
        secondaryColor: '#9e2a2b',
        highlightColor: '#fff3b0',
        shieldColor: '#540b0e',
        accentColor: '#ffd166',
        glowColor: 'rgba(224, 159, 62, 0.45)',
        icon: '👑',
        motto: '"Hanya Darah Raja yang Memimpin!"',
        description: 'Pangeran cilik agung mengenakan mahkota emas bertatahkan rubi, jubah merah berbulu cerpelai, dan tongkat kuasa.',
        pawnType: 'crown'
    }
];

// Helper to find faction by ID
function getFactionById(id) {
    return FACTIONS.find(f => f.id === id) || FACTIONS[0];
}

window.FACTIONS = FACTIONS;
window.getFactionById = getFactionById;
