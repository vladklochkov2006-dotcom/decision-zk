export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export const validateContent = (text: string, options: {
    minLength?: number;
    fieldName?: string;
    checkCaps?: boolean;
    checkRepetition?: boolean;
    checkGibberish?: boolean;
} = {}): ValidationResult => {
    const {
        minLength = 20,
        fieldName = 'Content',
        checkCaps = true,
        checkRepetition = true,
        checkGibberish = true
    } = options;

    const trimmed = text.trim();

    // 1. Empty/Too short
    if (trimmed.length === 0) {
        return { isValid: false, error: `${fieldName} cannot be empty.` };
    }
    if (trimmed.length < minLength) {
        return { isValid: false, error: `${fieldName} must be at least ${minLength} characters long.` };
    }

    // 2. Meaningfulness (Min words)
    const words = trimmed.split(/\s+/).filter(w => w.length > 0);
    if (words.length < 3) {
        return { isValid: false, error: `${fieldName} must contain at least 3 words to be meaningful.` };
    }

    // 3. Caps Abuse (e.g., "HELLO WORLD I AM SHOUTING")
    if (checkCaps && trimmed.length > 10) {
        const capsCount = (trimmed.match(/[A-ZА-Я]/g) || []).length;
        const letterCount = (trimmed.match(/[a-zA-Zа-яА-Я]/g) || []).length;
        if (letterCount > 0 && (capsCount / letterCount) > 0.7) {
            return { isValid: false, error: "Please disable Caps Lock. High percentage of uppercase letters detected." };
        }
    }

    // 4. Excessive Repetition (e.g., "aaaaaaa" or "!!!!!!!!!!")
    if (checkRepetition) {
        const repetitionRegex = /(.)\1{4,}/; // Same character 5+ times (4+ in a row)
        if (repetitionRegex.test(trimmed)) {
            return { isValid: false, error: "Content contains excessive character repetition (4+ identical characters)." };
        }
    }

    // 5. Gibberish/Keyboard Smashing (e.g., "asdfghjk" or "qwerty")
    if (checkGibberish && trimmed.length > 5) {
        const gibberishPatterns = [
            /^[asdfghjkl]+$/i,
            /^[qwertyuiop]+$/i,
            /^[zxcvbnm]+$/i,
            /^[1234567890]+$/i
        ];

        // Simple heuristic: if it's one single word that matches horizontal row on keyboard
        for (const word of words) {
            if (word.length > 4) {
                for (const pattern of gibberishPatterns) {
                    if (pattern.test(word)) {
                        return { isValid: false, error: "Meaningless 'keyboard smash' pattern detected." };
                    }
                }
            }
        }
    }

    return { isValid: true };
};
