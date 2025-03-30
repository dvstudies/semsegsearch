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

export function drawRoundedImage(
    ctx,
    img,
    x,
    y,
    width,
    height,
    mask = undefined,
    alpha = 1,
    radius = 20
) {
    ctx.globalAlpha = alpha;
    ctx.save();

    let x1, y1, h1, w1;

    if (mask !== undefined) {
        x1 = mask[0];
        w1 = mask[1];
        y1 = mask[2];
        h1 = mask[3];
    } else {
        x1 = x;
        w1 = width;
        y1 = y;
        h1 = height;
    }

    // Create rounded rect path
    ctx.beginPath();
    ctx.moveTo(x1 + radius, y1);
    ctx.lineTo(x1 + w1 - radius, y1);
    ctx.quadraticCurveTo(x1 + w1, y1, x1 + w1, y1 + radius);
    ctx.lineTo(x1 + w1, y1 + h1 - radius);
    ctx.quadraticCurveTo(x1 + w1, y1 + h1, x1 + w1 - radius, y1 + h1);
    ctx.lineTo(x1 + radius, y1 + h1);
    ctx.quadraticCurveTo(x1, y1 + h1, x1, y1 + h1 - radius);
    ctx.lineTo(x1, y1 + radius);
    ctx.quadraticCurveTo(x1, y1, x1 + radius, y1);
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
