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

export function drawRoundedImage(ctx, img, x, y, width, height, radius = 20) {
    // Save context state
    ctx.save();

    // Optional: Add shadow like a div
    // if (shadow) {
    //     ctx.shadowColor = "rgba(0, 0, 0, 1)";
    //     ctx.shadowBlur = 15;
    //     ctx.shadowOffsetX = 5;
    //     ctx.shadowOffsetY = 5;
    // }

    // Create rounded rect path
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();

    // Clip to rounded rect
    ctx.clip();

    // Draw the image inside
    ctx.drawImage(img, x, y, width, height);

    // Restore context state (removes shadow/clipping)
    ctx.restore();
}

export function toggleActive(el, btnResults) {
    btnResults.forEach((b) =>
        b.classList.remove("bg-blue-500", "text-white", "shadow-lg")
    );
    el.classList.add("bg-blue-500", "text-white", "shadow-lg");
}
