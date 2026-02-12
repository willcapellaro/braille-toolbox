const BRAILLE = {
    'a': [1], 'b': [1, 2], 'c': [1, 4], 'd': [1, 4, 5], 'e': [1, 5], 'f': [1, 2, 4], 'g': [1, 2, 4, 5], 'h': [1, 2, 5], 'i': [2, 4], 'j': [2, 4, 5],
    'k': [1, 3], 'l': [1, 2, 3], 'm': [1, 3, 4], 'n': [1, 3, 4, 5], 'o': [1, 3, 5], 'p': [1, 2, 3, 4], 'q': [1, 2, 3, 4, 5], 'r': [1, 2, 3, 5],
    's': [2, 3, 4], 't': [2, 3, 4, 5], 'u': [1, 3, 6], 'v': [1, 2, 3, 6], 'w': [2, 4, 5, 6], 'x': [1, 3, 4, 6], 'y': [1, 3, 4, 5, 6], 'z': [1, 3, 5, 6]
};

const DOTS_KEY = { 'f': 1, 'd': 2, 's': 3, 'j': 4, 'k': 5, 'l': 6 };

const COLORS = ['#e9ff70', '#ffd670', '#ff9770', '#ff70a6', '#70d6ff', '#b9fbc0'];

const CHAINS = [
    ["STARTLING", "STARTING", "STARING", "STRING", "STING", "SING", "SIN", "IN", "I", ""],
    ["PLANTS", "PLANT", "PANTS", "PANT", "PAN", "AN", "A", ""],
    ["FRIEND", "FIEND", "FIND", "FIN", "IN", "I", ""],
    ["BEARD", "BARD", "BAD", "AD", "A", ""],
    ["HEART", "HEAT", "HAT", "AT", "A", ""],
    ["BLINK", "LINK", "INK", "IN", "I", ""],
    ["HOARD", "HARD", "HAD", "AD", "A", ""],
    ["PLATE", "LATE", "ATE", "AT", "A", ""],
    ["WHEAT", "HEAT", "EAT", "AT", "A", ""],
    ["THINK", "THIN", "TIN", "IN", "I", ""],
    ["TRAIN", "RAIN", "RAN", "AN", "A", ""],
    ["SHARK", "HARK", "ARK", "AR", "A", ""],
    ["SPINE", "PINE", "PIN", "IN", "I", ""],
    ["FLOAT", "FLAT", "FAT", "AT", "A", ""],
    ["SPLIT", "SLIT", "LIT", "IT", "I", ""],
    ["CHART", "CART", "CAT", "AT", "A", ""],
    ["STAND", "SAND", "AND", "AN", "A", ""],
    ["PLACE", "LACE", "ACE", "AC", "A", ""],
    ["PRICE", "RICE", "ICE", "IC", "I", ""],
    ["SPACE", "PACE", "ACE", "AC", "A", ""],
    ["BLOCK", "LOCK", "LACK", "LAC", "LA", "A", ""],
    ["BRAND", "BAND", "AND", "AN", "A", ""],
    ["CROWD", "CROW", "COW", "OW", "O", ""],
    ["STORM", "TORM", "TOM", "TO", "O", ""],
    ["GRIND", "RIND", "RID", "ID", "I", ""],
    ["GHOST", "HOST", "HOT", "HO", "O", ""],
    ["BRING", "RING", "LIG", "IG", "I", ""],
    ["CLEAN", "LEAN", "LEA", "LA", "A", ""],
    ["SMALL", "MALL", "ALL", "AL", "A", ""],
    ["THORN", "TORN", "TON", "TO", "O", ""],
    ["SPICE", "PICE", "ICE", "IC", "I", ""]
];

// Alternate paths for words. 
// Format: "CURRENT_WORD": ["ALT_TARGET_1", "ALT_TARGET_2"]
// Note: The main targets from CHAINS are automatically added at runtime.
const ALTERNATES = {
    "BEARD": ["BEAR", "BEAD"],
    "BEAR": ["EAR", "BAR"],
    "BEAD": ["BAD", "BED"],
    "EAR": ["AR"],
    "BED": ["ED"],
    "ED": ["D"], // Assuming single letters are valid checks logic
    "STARTING": ["STARING", "STATING"],
    "STATING": ["SATING"],
    "SATING": ["STING", "SING"],
    "FRIEND": ["FRIED"],
    "FRIED": ["FRED", "FIRED"],
    "FRED": ["RED", "FED"],
    "FED": ["ED"],
    "RED": ["ED", "RE"],
    "RE": ["E"], // If E is valid
    "PLANTS": ["PANTS", "PLATS"],
    "PANTS": ["PANS"  ],
    "PLATS": ["PATS", "PLAT"],
    "PATS": ["PAT", "PAS"],
    "PAT": ["AT", "PA"],
    "PA": ["A"],
    "SHARK": ["HARK", "SHAR"], // SHAR? maybe not
    "HEART": ["HEAR"],
    "HEAR": ["EAR", "HER"],
    "HER": ["HE"],
    "HE": ["E"], // E is valid in Braille list
    "TRAIN": ["RAIN", "TAIN"], // Tain?
    "SPLIT": ["SPIT"],
    "SPIT": ["PIT", "SIT"],
    "PIT": ["IT", "PI"],
    "PI": ["I"],
    "SIT": ["IT"],
    "STAND": ["SAND"],
    "PRICE": ["RICE", "PICE"], // PICE is in main chain for SPICE
    // Add common 2-letter connectors
    "AT": ["A", "T"],
    "AN": ["A", "N"],
    "IN": ["I", "N"],
    "IT": ["I", "T"],
    "OF": ["O", "F"],
    "TO": ["O", "T"],
    "ON": ["O", "N"],
    "UP": ["U", "P"],
    "US": ["U", "S"],
    "MY": ["M", "Y"],
    "BY": ["B", "Y"],
    "DO": ["D", "O"],
    "GO": ["G", "O"],
    "NO": ["N", "O"],
    "SO": ["S", "O"],
    "HE": ["H", "E"],
    "WE": ["W", "E"],
    "BE": ["B", "E"],
    "ME": ["M", "E"]
};
