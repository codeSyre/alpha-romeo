export enum FeatureFlag {
    TRANSCRIPTION = "transcribe",
    IMAGE_GENERATION = "generate-image",
    ANALYZE_VIDEO = "analyse-video",
    TITLE_GENERATION = "generate-title",
    SCRIPT_GENERATION = "script-generation"
}

export const featureFlagEvents: Record<FeatureFlag, {event: string}> = {
    [FeatureFlag.TRANSCRIPTION]: {
        event: "transcription"
    },
    [FeatureFlag.IMAGE_GENERATION]: {
        event: "image-generation"
    },
    [FeatureFlag.ANALYZE_VIDEO]: {
        event: "analyse-video"
    },
    [FeatureFlag.TITLE_GENERATION]: {
        event: "title-generations"
    },
    [FeatureFlag.SCRIPT_GENERATION]: {
        event: ""
    }
}