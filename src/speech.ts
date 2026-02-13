import {TimelineKeyframe} from "./vrm";

/**
 * Speech utilities for converting between TTS engine formats and the Timeline API.
 *
 * @example
 * ```typescript
 * import { speech, Vrm } from "@homunculus/api";
 *
 * // Convert VoiceVox audio query to timeline keyframes
 * const query = await fetchVoiceVoxAudioQuery("こんにちは", 0);
 * const keyframes = speech.voicevoxToTimeline(query);
 * const vrm = await Vrm.findByName("MyAvatar");
 * await vrm.speakWithTimeline(wavData, keyframes);
 * ```
 */
export namespace speech {

    /**
     * VoiceVox AudioQuery structure (subset of fields used for timeline conversion).
     */
    export interface VoiceVoxAudioQuery {
        accent_phrases: VoiceVoxAccentPhrase[];
        speedScale: number;
        prePhonemeLength: number;
        postPhonemeLength: number;
    }

    export interface VoiceVoxAccentPhrase {
        moras: VoiceVoxMora[];
        pause_mora?: VoiceVoxMora;
    }

    export interface VoiceVoxMora {
        vowel: string;
        vowel_length: number;
        consonant_length?: number;
    }

    const VOWEL_MAP: Record<string, string> = {
        "a": "aa", "b": "aa", "h": "aa", "l": "aa", "m": "aa", "p": "aa",
        "i": "ih", "d": "ih", "f": "ih", "n": "ih", "r": "ih", "t": "ih", "v": "ih",
        "u": "ou",
        "e": "ee", "j": "ee", "s": "ee", "x": "ee", "y": "ee", "z": "ee",
        "o": "oh", "g": "oh", "q": "oh", "w": "oh",
    };

    /**
     * Converts a VoiceVox AudioQuery into Timeline keyframes.
     *
     * This mirrors the Rust `AudioQuery::to_moras()` logic, including the
     * vowel-to-expression mapping used by the VoiceVox integration.
     *
     * @param query - A VoiceVox AudioQuery response.
     * @returns An array of timeline keyframes.
     *
     * @example
     * ```typescript
     * const query = await fetchVoiceVoxAudioQuery("こんにちは", 0);
     * const keyframes = speech.voicevoxToTimeline(query);
     * ```
     */
    export function voicevoxToTimeline(query: VoiceVoxAudioQuery): TimelineKeyframe[] {
        const keyframes: TimelineKeyframe[] = [];

        // Pre-phoneme silence
        keyframes.push({duration: query.prePhonemeLength * query.speedScale});

        for (const phrase of query.accent_phrases) {
            for (const mora of phrase.moras) {
                const duration = (mora.vowel_length + (mora.consonant_length ?? 0)) * query.speedScale;
                const expression = VOWEL_MAP[mora.vowel];
                if (expression) {
                    keyframes.push({duration, targets: {[expression]: 1.0}});
                } else {
                    keyframes.push({duration});
                }
            }
            if (phrase.pause_mora) {
                const pm = phrase.pause_mora;
                const duration = pm.vowel_length * query.speedScale;
                const expression = VOWEL_MAP[pm.vowel];
                if (expression) {
                    keyframes.push({duration, targets: {[expression]: 1.0}});
                } else {
                    keyframes.push({duration});
                }
            }
        }

        // Post-phoneme silence
        keyframes.push({duration: query.postPhonemeLength * query.speedScale});

        return keyframes;
    }

    /**
     * Creates timeline keyframes from a simple phoneme list.
     *
     * Each entry is a tuple of [expression_name | null, duration_seconds].
     * A null expression name creates a silent keyframe.
     *
     * @param phonemes - Array of [expression_name, duration] tuples.
     * @returns An array of timeline keyframes.
     *
     * @example
     * ```typescript
     * const keyframes = speech.fromPhonemes([
     *   ["aa", 0.1],
     *   [null, 0.05],
     *   ["oh", 0.12],
     * ]);
     * ```
     */
    export function fromPhonemes(phonemes: Array<[string | null, number]>): TimelineKeyframe[] {
        return phonemes.map(([name, duration]) => {
            if (name) {
                return {duration, targets: {[name]: 1.0}};
            }
            return {duration};
        });
    }
}
