import { getTextEmbeds } from "./utils_clip.js";

let isImageMode = true;

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

        document.getElementById("imgContainer").classList.remove("hidden");

        const server = "https://vord-server.onrender.com";

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
                    console.log(data);
                    data.forEach((item, i) => {
                        const li = document.createElement("li");
                        li.textContent = capitalize(item.artwork_name);
                        li.classList.add(
                            "cursor-pointer",
                            "hover:bg-blue-400",
                            "hover:text-white",
                            "hover:shadow-lg",
                            // "text-blue-700",
                            // "bg-white",
                            // "border",
                            // "border-blue-400",
                            "rounded-full",
                            "p-2",
                            "px-5"
                        );

                        function capitalize(str) {
                            return str.charAt(0).toUpperCase() + str.slice(1);
                        }

                        function placeImage(item) {
                            const img =
                                document.getElementById("selectedImage");

                            img.src = item.image_url || "";

                            if (img.src === "") {
                                img.alt = "No image found";
                            } else {
                                img.alt = item.artwork_name;
                            }
                            img.classList.remove("hidden");
                        }

                        li.addEventListener("click", () => {
                            placeImage(item);
                        });

                        li.addEventListener("mouseover", () => {
                            placeImage(item);
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
    const imgContainer = document.getElementById("imgContainer");

    const height = imgContainer.offsetHeight;
    imgContainer.style.width = `${height}px`;
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
