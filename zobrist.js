const zobristTable = Array(65).fill().map(() => Array(15).fill().map(() => generateRandom64BitNumber()));

const transposition_table = new Map();



function get_zobrist_hash() {
    let hash = 0;
    for (let i = 0; i < 64; i++) {
        if (board[i] != null) {
            const piece = board[i];
            const zobrist_key = zobristTable[i][piece]
            hash ^= zobrist_key;
        }
    }
    hash ^= zobristTable[64][turn];
    return hash;
}

function store_in_transposition_table(hash, depth, score, flag) {
    transposition_table.set(hash, [depth, score, flag]);
}





function generateRandom64BitNumber() {
    const high = Math.floor(Math.random() * 0x100000000); // Generate random 32-bit number for the high bits
    const low = Math.floor(Math.random() * 0x100000000); // Generate random 32-bit number for the low bits
    return (high << 32) | low; // Combine the two 32-bit numbers into a 64-bit number
}
