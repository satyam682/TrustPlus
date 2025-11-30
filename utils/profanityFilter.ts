// Profanity and inappropriate content detection utility
// Provides real-time warnings for users entering inappropriate feedback

const INAPPROPRIATE_WORDS = [
    // Common profanity (partial list for demonstration)
    'fuck', 'shit', 'damn', 'bitch', 'asshole', 'bastard', 'crap',
    'hell', 'piss', 'dick', 'cock', 'pussy', 'ass', 'whore', 'slut',

    // Offensive terms
    'stupid', 'idiot', 'moron', 'dumb', 'retard', 'loser',

    // Spam indicators
    'click here', 'buy now', 'free money', 'earn cash', 'make money fast',
    'viagra', 'casino', 'lottery', 'prize', 'winner',

    // Aggressive language
    'hate', 'kill', 'die', 'death', 'hurt', 'attack'
];

/**
 * Check if text contains inappropriate words or spam patterns
 * @param text - The text to analyze
 * @returns Object with detection results
 */
export function checkInappropriateContent(text: string): {
    hasInappropriate: boolean;
    severity: 'none' | 'mild' | 'severe';
    warning: string;
    detectedWords: string[];
} {
    if (!text || text.trim().length === 0) {
        return {
            hasInappropriate: false,
            severity: 'none',
            warning: '',
            detectedWords: []
        };
    }

    const lowerText = text.toLowerCase();
    const detectedWords: string[] = [];

    // Check for inappropriate words
    INAPPROPRIATE_WORDS.forEach(word => {
        // Use word boundaries to avoid false positives (e.g., "class" containing "ass")
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        if (regex.test(lowerText)) {
            detectedWords.push(word);
        }
    });

    // Check for excessive caps (spam indicator)
    const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
    if (capsRatio > 0.7 && text.length > 10) {
        detectedWords.push('EXCESSIVE CAPS');
    }

    // Check for excessive punctuation (spam indicator)
    const exclamationCount = (text.match(/!/g) || []).length;
    if (exclamationCount > 3) {
        detectedWords.push('excessive punctuation');
    }

    if (detectedWords.length === 0) {
        return {
            hasInappropriate: false,
            severity: 'none',
            warning: '',
            detectedWords: []
        };
    }

    // Determine severity
    const hasOffensive = detectedWords.some(w =>
        ['fuck', 'shit', 'bitch', 'asshole', 'whore', 'slut'].includes(w)
    );

    const severity = hasOffensive ? 'severe' : 'mild';

    const warning = severity === 'severe'
        ? 'Your feedback contains inappropriate language. Please be respectful.'
        : 'Your feedback may contain inappropriate or spam-like content. Please review before submitting.';

    return {
        hasInappropriate: true,
        severity,
        warning,
        detectedWords
    };
}

/**
 * Get a user-friendly message based on detection results
 */
export function getWarningMessage(severity: 'none' | 'mild' | 'severe'): string {
    switch (severity) {
        case 'severe':
            return 'Please remove inappropriate language and be respectful in your feedback.';
        case 'mild':
            return 'Your feedback may contain spam-like or inappropriate content. Please review.';
        default:
            return '';
    }
}
