import { getTextEmbeds, drawRoundedImage, toggleActive } from "./utils.js";

let isImageMode = true;
let canvasDims = { width: 0, height: 0 };
const canvas = document.getElementById("imgCanvas");
const scoreDiv = document.getElementById("scoreDiv");

// Function to handle the button click event
function onRunButtonClick() {
    console.log("run sim");

    const inputField = document.getElementById("textInput");
    const inputText = inputField.value;

    resultsList.innerHTML = "";

    if (inputText != "") {
        const textEmbeds = getTextEmbeds(inputText).catch((err) =>
            console.error(err)
        );

        const server = "https://vord-server.onrender.com";
        // const server = "http://localhost:5000";

        textEmbeds.then((text) => {
            fetch(`${server}/semsegsearch`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    index: isImageMode ? "paintings" : "masks",
                    embedding: Array.from(text),
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    const btnResults = [];
                    data.forEach((item, i) => {
                        const li = document.createElement("li");

                        li.textContent = `  ${item.artist_full_name
                            .split(" ")
                            .map(capitalize)
                            .join(" ")} - ${capitalize(item.artwork_name)}`;
                        li.classList.add(
                            "cursor-pointer",
                            "rounded-full",
                            "p-2",
                            "px-5"
                        );

                        btnResults.push(li);

                        function capitalize(str) {
                            return str.charAt(0).toUpperCase() + str.slice(1);
                        }

                        function placeImage(item) {
                            const ctx = canvas.getContext("2d");
                            const padding = 10;

                            ctx.reset();

                            const img = new Image();

                            img.onload = () => {
                                ctx.reset();

                                // Rescale image based on canvas dimensions, leaving 10 px padding
                                const scale = Math.min(
                                    (canvasDims.width - padding * 2) /
                                        img.width,
                                    (canvasDims.height - padding * 2) /
                                        img.height
                                );
                                const scaledWidth = img.width * scale;
                                const scaledHeight = img.height * scale;

                                const x = (canvasDims.width - scaledWidth) / 2;
                                const y =
                                    (canvasDims.height - scaledHeight) / 2;

                                drawRoundedImage(
                                    ctx,
                                    img,
                                    x,
                                    y,
                                    scaledWidth,
                                    scaledHeight
                                );

                                ctx.shadowColor = "rgb(0, 0, 0)";
                                ctx.shadowOffsetX = 20;
                                ctx.shadowOffsetY = 20;
                            };

                            img.onerror = () => {
                                ctx.reset();

                                ctx.font = "24px sans-serif";
                                ctx.fillStyle = "gray";
                                ctx.textAlign = "center";
                                ctx.textBaseline = "middle";
                                ctx.fillText(
                                    "Image not found",
                                    canvas.width / 2,
                                    canvas.height / 2
                                );
                            };

                            img.src = item.image_url || "";
                        }

                        if (i === 0) {
                            placeImage(item);
                            toggleActive(li, btnResults);

                            scoreDiv.classList.remove("hidden");
                            scoreDiv.innerHTML = `${(item.score * 100).toFixed(
                                2
                            )} %`;
                        }

                        li.addEventListener("mouseover", () => {
                            placeImage(item);
                            toggleActive(li, btnResults);

                            scoreDiv.classList.remove("hidden");
                            scoreDiv.innerHTML = `${(item.score * 100).toFixed(
                                2
                            )} %`;
                        });

                        resultsList.appendChild(li);
                    });
                });
        });
    } else {
        alert("Please enter an input text to run the analysis");
    }
}

document.getElementById("runBtn").addEventListener("click", onRunButtonClick);

// Load layout
function onLoad() {
    const height = canvas.offsetHeight;
    canvas.style.width = `${height}px`;

    canvas.width = `${height}`;
    canvas.height = `${height}`;

    canvasDims.width = canvas.offsetWidth;
    canvasDims.height = canvas.offsetHeight;

    console.log("canvas dimensions:", canvas.offsetWidth, canvas.offsetHeight);
}
window.addEventListener("load", onLoad);

// Init toggle
document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();

    const toggleBtn = document.getElementById("toggleMode");

    toggleBtn.addEventListener("click", () => {
        isImageMode = !isImageMode;

        toggleIcon.innerHTML = "";
        toggleIcon.setAttribute(
            "data-lucide",
            isImageMode ? "image" : "fullscreen"
        );

        // Re-render icon
        lucide.createIcons();
    });
});
