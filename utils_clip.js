// Import the necessary module from Xenova
import {
    pipeline,
    AutoTokenizer,
    CLIPTextModelWithProjection,
} from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2";

export async function getTextEmbeds(text) {
    // Load tokenizer and text model
    const tokenizer = await AutoTokenizer.from_pretrained(
        "Xenova/clip-vit-base-patch32"
    );
    const text_model = await CLIPTextModelWithProjection.from_pretrained(
        "Xenova/clip-vit-base-patch32"
    );

    // Run tokenization
    const text_inputs = tokenizer(text, { padding: true, truncation: true });

    // Compute embeddings
    const { text_embeds } = await text_model(text_inputs);
    const textEmbeddingArray = text_embeds.data;

    const norm = Math.sqrt(
        textEmbeddingArray.reduce((sum, val) => sum + val * val, 0)
    );
    const normalizedTextEmbeds = textEmbeddingArray.map((val) => val / norm);

    return normalizedTextEmbeds;
}
