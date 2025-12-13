// Word Library for different skill levels
export class WordLibrary {
    constructor() {
        // Beginner words (A-J keys only)
        this.beginnerWords = {
            length3: [
                'age', 'bad', 'bag', 'big', 'cab', 'dad', 'dig', 'fad', 'gab', 'had',
                'jab', 'bid', 'bed', 'fig', 'gig', 'hid', 'jig', 'ace', 'ice', 'bee',
                'fee', 'gee', 'cage', 'edge', 'flag', 'bead', 'dead', 'head', 'jade',
                'fade', 'dice', 'face', 'hide', 'egg', 'add', 'dad', 'fed', 'hag'
            ],
            length4: [
                'aged', 'bald', 'cage', 'dice', 'edge', 'face', 'gave', 'head', 'idea',
                'jade', 'jack', 'cafe', 'beef', 'chef', 'deep', 'feed', 'good', 'high',
                'jeep', 'joke', 'flag', 'glad', 'huge', 'inch', 'each', 'badge', 'deck',
                'fake', 'game', 'hedge', 'image', 'judge', 'beam', 'deaf', 'gear'
            ],
            length5: [
                'badge', 'chief', 'field', 'grace', 'hedge', 'image', 'judge', 'beach',
                'bread', 'cheap', 'dream', 'faced', 'grade', 'aimed', 'aged', 'blade',
                'chair', 'death', 'eagle', 'fetch', 'giant', 'habit', 'ideal', 'dance'
            ],
            length6: [
                'beagle', 'beacon', 'bridge', 'charge', 'decide', 'facile', 'gadget',
                'haggle', 'fidget', 'jabbed', 'baggie', 'beaded', 'cabbage', 'dagger',
                'eagled', 'fabled', 'gabbed', 'headed', 'jacket', 'jigged'
            ],
            length7: [
                'baggage', 'cabbage', 'damaged', 'engaged', 'flagged', 'grabbed',
                'hedged', 'jabbed', 'beagled', 'decided', 'echoed', 'gadget',
                'hefted', 'indexed', 'jigging'
            ],
            length8: [
                'baggaged', 'cabbaged', 'decideed', 'echidna', 'feedback', 'hedgehog',
                'hijacked', 'defiance', 'befriend', 'caffeine', 'deceived', 'edged'
            ],
            length9: [
                'befriends', 'challenge', 'decidedly', 'edinburgh', 'facetious',
                'gatecrash', 'headfirst', 'hijacking', 'idealized', 'jabbering'
            ],
            length10: [
                'backfilled', 'challenged', 'deficiency', 'eighteenth', 'facilities',
                'heartfield', 'indefinite', 'jabberwock', 'background', 'deadheaded'
            ],
            length11: [
                'deficiencies', 'eighteenths', 'facetiously', 'headfirstly', 'indefinably',
                'established', 'checkerboard', 'beforehand', 'acknowledged'
            ],
            length12: [
                'acknowledged', 'backgrounded', 'checkerboard', 'deficiencies', 'eighteenthly',
                'headfirstest', 'indefinitely', 'acknowledges', 'backgrounder'
            ]
        };
        
        // Intermediate words (A-T keys) - organized by length
        this.intermediateWords = {
            length3: [
                'cat', 'bat', 'hat', 'mat', 'rat', 'sat', 'fat', 'pat', 'tap', 'map',
                'cap', 'gap', 'lap', 'nap', 'sap', 'top', 'pot', 'hot', 'not', 'got',
                'lot', 'dot', 'rot', 'cot', 'net', 'pet', 'set', 'bet', 'let', 'met',
                'kit', 'hit', 'sit', 'bit', 'fit', 'pit', 'act', 'ant', 'art', 'eat'
            ],
            length4: [
                'team', 'beat', 'heat', 'meat', 'neat', 'seat', 'chat', 'that', 'flat',
                'boat', 'coat', 'goat', 'note', 'hope', 'rope', 'tape', 'cape', 'game',
                'name', 'same', 'came', 'fame', 'tame', 'lane', 'mane', 'cane', 'pane',
                'kite', 'kept', 'kind', 'king', 'kick', 'kiss', 'knee', 'knew', 'knot'
            ],
            length5: [
                'track', 'stack', 'black', 'clock', 'thick', 'stick', 'trick', 'think',
                'thank', 'plant', 'spent', 'front', 'point', 'night', 'light', 'right',
                'heart', 'start', 'short', 'table', 'taken', 'state', 'least', 'catch'
            ],
            length6: [
                'basket', 'bottle', 'center', 'doctor', 'father', 'gather', 'health',
                'listen', 'matter', 'nature', 'office', 'people', 'report', 'street',
                'teacher', 'basket', 'castle', 'gentle', 'better', 'letter'
            ],
            length7: [
                'another', 'between', 'capital', 'certain', 'example', 'general',
                'history', 'kitchen', 'leather', 'machine', 'nothing', 'picture',
                'problem', 'section', 'station', 'student', 'teacher', 'through'
            ],
            length8: [
                'baseball', 'computer', 'distance', 'elephant', 'football', 'hospital',
                'interest', 'keyboard', 'language', 'material', 'national', 'politics',
                'question', 'standard', 'strength', 'together', 'training', 'platform'
            ],
            length9: [
                'beautiful', 'character', 'different', 'equipment', 'financial', 'knowledge',
                'listening', 'materials', 'nightmare', 'operation', 'political', 'statement',
                'technique', 'treatment', 'negotiate', 'basically'
            ],
            length10: [
                'basketball', 'commission', 'democratic', 'electronic', 'generation',
                'healthcare', 'literature', 'management', 'nationwide', 'operations',
                'reflection', 'technology', 'statistics', 'background'
            ],
            length11: [
                'application', 'competition', 'development', 'information', 'performance',
                'recognition', 'traditional', 'independent', 'representative', 'responsible'
            ],
            length12: [
                'appreciation', 'commissioner', 'construction', 'expectations', 'independence',
                'neighborhood', 'presentation', 'professional', 'relationship', 'technologies'
            ]
        };
        
        // Braille learning words - simple, common words for Braille introduction
        this.brailleWords = {
            length3: [
                'the', 'and', 'you', 'are', 'not', 'but', 'can', 'had', 'her', 'was',
                'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man',
                'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'end'
            ],
            length4: [
                'time', 'very', 'when', 'come', 'here', 'just', 'like', 'long', 'make',
                'many', 'over', 'such', 'take', 'than', 'them', 'well', 'were', 'will',
                'work', 'call', 'came', 'each', 'even', 'find', 'good', 'hand', 'high',
                'keep', 'kind', 'know', 'last', 'left', 'life', 'live', 'look', 'made'
            ],
            length5: [
                'about', 'after', 'again', 'before', 'being', 'could', 'every', 'first',
                'found', 'great', 'group', 'house', 'large', 'light', 'might', 'never',
                'often', 'other', 'place', 'right', 'small', 'sound', 'still', 'study',
                'their', 'there', 'these', 'thing', 'think', 'three', 'under', 'water'
            ],
            length6: [
                'always', 'around', 'became', 'before', 'between', 'called', 'change',
                'during', 'family', 'follow', 'friend', 'little', 'mother', 'number',
                'people', 'school', 'should', 'something', 'through', 'today', 'together',
                'until', 'where', 'world', 'write', 'system', 'thought', 'without'
            ],
            length7: [
                'another', 'because', 'country', 'example', 'general', 'government',
                'however', 'important', 'include', 'interest', 'perhaps', 'problem',
                'program', 'provide', 'service', 'several', 'special', 'through',
                'without', 'develop', 'education', 'support', 'community'
            ],
            length8: [
                'business', 'children', 'complete', 'continue', 'describe', 'different',
                'economic', 'increase', 'language', 'national', 'personal', 'physical',
                'political', 'possible', 'previous', 'question', 'research', 'resource',
                'response', 'security', 'standard', 'student', 'together', 'yourself'
            ],
            length9: [
                'community', 'condition', 'education', 'following', 'important',
                'including', 'knowledge', 'necessary', 'operation', 'president',
                'production', 'situation', 'sometimes', 'structure', 'treatment',
                'understand', 'available', 'beautiful', 'certainly', 'community'
            ],
            length10: [
                'additional', 'assumption', 'collection', 'commercial', 'commission',
                'comparison', 'complement', 'conclusion', 'conference', 'considered',
                'correspond', 'democratic', 'electronic', 'especially', 'experience',
                'generation', 'government', 'healthcare', 'individual', 'management'
            ],
            length11: [
                'application', 'association', 'development', 'environment', 'examination',
                'information', 'performance', 'possibility', 'preparation', 'recognition',
                'requirement', 'responsible', 'surrounding', 'temperature', 'traditional',
                'alternative', 'appropriate', 'competition', 'demonstrate', 'independent'
            ],
            length12: [
                'appreciation', 'contribution', 'demonstrated', 'encyclopedia', 'experimental',
                'geographical', 'headquarters', 'independence', 'introduction', 'neighborhood',
                'organization', 'professional', 'relationship', 'significance', 'technological',
                'understanding', 'achievements', 'applications', 'construction', 'presentation'
            ]
        };

        // Advanced words (Full A-Z alphabet) - organized by length
        this.advancedWords = {
            length3: [
                'fox', 'box', 'wax', 'zoo', 'zap', 'zip', 'vow', 'viz', 'wig', 'win',
                'why', 'yes', 'yet', 'you', 'joy', 'guy', 'buy', 'fly', 'try', 'sky'
            ],
            length4: [
                'quiz', 'java', 'lynx', 'zone', 'zero', 'wrap', 'walk', 'very', 'view',
                'wave', 'wild', 'wise', 'work', 'your', 'year', 'yoga', 'zoom', 'fizz'
            ],
            length5: [
                'quick', 'brown', 'jumps', 'lazy', 'wizard', 'quest', 'zephyr', 'voyage',
                'mystic', 'oxygen', 'puzzle', 'frozen', 'galaxy', 'vortex', 'wavy',
                'youth', 'yield', 'zebra'
            ],
            length6: [
                'quasar', 'neutron', 'photon', 'quantum', 'gravity', 'velocity', 'pulsar',
                'nebula', 'complex', 'oxygen', 'wizard', 'zephyr', 'voyeur', 'waxing'
            ],
            length7: [
                'universe', 'mystery', 'journey', 'quickly', 'analyze', 'maximize', 'qualify',
                'realize', 'utilize', 'optimize', 'visualize', 'synthesize', 'quartzite'
            ],
            length8: [
                'asteroid', 'blizzard', 'buzzword', 'cyclone', 'dazzling', 'expertly',
                'flexibly', 'gazelle', 'hexagon', 'jackpot', 'kazoo', 'lynxlike',
                'maximize', 'quizzical'
            ],
            length9: [
                'byzantium', 'excellent', 'exemplary', 'oxidizing', 'puzzling', 'quizzical',
                'vulcanize', 'waxworks', 'xylophone', 'youthful', 'zealously', 'zoological'
            ],
            length10: [
                'complexity', 'developing', 'exquisite', 'frequently', 'galvanized',
                'harmonized', 'jevonsite', 'keyboarded', 'luxurious', 'minimized',
                'normalized', 'overjoyed', 'privatized'
            ],
            length11: [
                'buxomness', 'complexify', 'exonumia', 'frequencies', 'galvanizing',
                'hypnotized', 'juvenility', 'KeyError', 'luxuriance', 'merchandise',
                'oxidizable', 'privatizing'
            ],
            length12: [
                'complexified', 'exonumiatist', 'galvanometer', 'hypnotizable',
                'juvenescence', 'luxuriously', 'merchandized', 'oxidizations',
                'privatization', 'synchronizer', 'vaporization', 'zygomorphous'
            ]
        };
    }
    
    getWordsForMode(mode, wordLength) {
        const targetLength = `length${wordLength}`;
        
        switch(mode) {
            case 'beginner':
                return this.beginnerWords[targetLength] || [];
            case 'intermediate':
                return this.intermediateWords[targetLength] || [];
            case 'advanced':
                return this.advancedWords[targetLength] || [];
            case 'braille':
                return this.brailleWords[targetLength] || [];
            default:
                return [];
        }
    }
    
    getRandomWord(mode, currentLevel = 3) {
        const words = this.getWordsForMode(mode, currentLevel);
        return words[Math.floor(Math.random() * words.length)];
    }
    
    getMaxLevel(mode) {
        // Returns the maximum word length available for each mode
        switch(mode) {
            case 'beginner':
            case 'intermediate':
            case 'advanced':
                return 12;
            default:
                return 3;
        }
    }
}

// User Management System
export class UserManager {
    constructor() {
        this.currentUser = null;
        this.wordLibrary = new WordLibrary();
        this.loadUserData();
    }
    
    createGuestUser() {
        const guestId = 'guest_' + Date.now();
        this.currentUser = {
            id: guestId,
            name: 'Guest',
            isGuest: true,
            stats: {
                bestWPM: 0,
                gamesPlayed: 0,
                totalWordsTyped: 0,
                favoriteMode: null,
                modeProgress: {
                    beginner: { level: 3, wordsCompleted: 0, levelProgress: 0 },
                    intermediate: { level: 3, wordsCompleted: 0, levelProgress: 0 },
                    advanced: { level: 3, wordsCompleted: 0, levelProgress: 0 }
                }
            },
            createdAt: new Date().toISOString()
        };
        
        this.saveUserData();
        return this.currentUser;
    }
    
    getCurrentUser() {
        return this.currentUser;
    }
    
    updateUserStats(gameData) {
        if (!this.currentUser) return;
        
        const stats = this.currentUser.stats;
        
        // Update basic stats
        stats.gamesPlayed++;
        stats.totalWordsTyped += gameData.wordsTyped;
        
        if (gameData.wpm > stats.bestWPM) {
            stats.bestWPM = gameData.wpm;
        }
        
        // Update mode-specific progress
        const mode = gameData.mode;
        const progress = stats.modeProgress[mode];
        
        if (progress) {
            const oldLevel = progress.level;
            progress.wordsCompleted += gameData.wordsTyped;
            progress.levelProgress += gameData.wordsTyped;
            
            console.log(`Updating stats - Mode: ${mode}, Words typed: ${gameData.wordsTyped}, Level progress: ${progress.levelProgress}`);
            
            // Level progression logic - advance every 15 words completed at current level
            const wordsNeededForNext = 15;
            const maxLevel = this.wordLibrary.getMaxLevel(mode);
            
            if (progress.levelProgress >= wordsNeededForNext && progress.level < maxLevel) {
                progress.level += 1;
                progress.levelProgress = 0; // Reset progress for new level
                
                console.log(`Level up! ${mode} mode: ${oldLevel} → ${progress.level}`);
                
                // Return level up information
                gameData.leveledUp = true;
                gameData.newLevel = progress.level;
            }
        }
        
        this.saveUserData();
    }
    
    getProgressForMode(mode) {
        if (!this.currentUser) return null;
        
        return this.currentUser.stats.modeProgress[mode] || null;
    }
    
    loadUserData() {
        try {
            const userData = localStorage.getItem('astrotype_user');
            if (userData) {
                this.currentUser = JSON.parse(userData);
            }
        } catch (error) {
            console.warn('Failed to load user data:', error);
            this.currentUser = null;
        }
    }
    
    saveUserData() {
        try {
            localStorage.setItem('astrotype_user', JSON.stringify(this.currentUser));
        } catch (error) {
            console.warn('Failed to save user data:', error);
        }
    }
    
    clearUserData() {
        this.currentUser = null;
        localStorage.removeItem('astrotype_user');
    }
}