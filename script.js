pdfjsLib.GlobalWorkerOptions.workerSrc =
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const fileInput = document.getElementById("pdfFile");
const dropArea = document.getElementById("dropArea");
const loading = document.getElementById("loadingSection");
const previewSection = document.getElementById("previewSection");
const previewGrid = document.getElementById("previewGrid");

const progressText = document.getElementById("progressText");
const totalPagesText = document.getElementById("totalPages");
const downloadAllBtn = document.getElementById("downloadAll");

let jpgFiles = [];

fileInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if(file) convertPDF(file);
});

dropArea.addEventListener("dragover", e=>{
    e.preventDefault();
    dropArea.classList.add("dragover");
});

dropArea.addEventListener("dragleave", ()=>{
    dropArea.classList.remove("dragover");
});

dropArea.addEventListener("drop", e=>{
    e.preventDefault();

    dropArea.classList.remove("dragover");

    const file = e.dataTransfer.files[0];

    if(file && file.type==="application/pdf"){
        convertPDF(file);
    }else{
        alert("Please select a PDF file.");
    }
});

async function convertPDF(file){

    jpgFiles=[];

    previewGrid.innerHTML="";

    loading.classList.remove("hidden");

    previewSection.classList.add("hidden");

    const pdf = await pdfjsLib.getDocument({
        data: await file.arrayBuffer()
    }).promise;

    totalPagesText.textContent =
        `${pdf.numPages} Pages`;

    for(let i=1;i<=pdf.numPages;i++){

        progressText.textContent =
        `Converting page ${i} of ${pdf.numPages}...`;

        const page = await pdf.getPage(i);

pdfjsLib.GlobalWorkerOptions.workerSrc =
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const fileInput = document.getElementById("pdfFile");
const dropArea = document.getElementById("dropArea");
const loading = document.getElementById("loadingSection");
const previewSection = document.getElementById("previewSection");
const previewGrid = document.getElementById("previewGrid");

const progressText = document.getElementById("progressText");
const totalPagesText = document.getElementById("totalPages");
const downloadAllBtn = document.getElementById("downloadAll");
const themeToggle = document.getElementById("themeToggle");

let jpgFiles = [];

/* ===================== THEME ===================== */

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    themeToggle.textContent =
        document.body.classList.contains("dark")
            ? "☀️"
            : "🌙";

});

/* ===================== FILE INPUT ===================== */

fileInput.addEventListener("change", e => {

    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
        alert("Please select a PDF file.");
        return;
    }

    convertPDF(file);

});

/* ===================== DRAG & DROP ===================== */

dropArea.addEventListener("dragover", e => {

    e.preventDefault();

    dropArea.classList.add("dragover");

});

dropArea.addEventListener("dragleave", () => {

    dropArea.classList.remove("dragover");

});

dropArea.addEventListener("drop", e => {

    e.preventDefault();

    dropArea.classList.remove("dragover");

    const file = e.dataTransfer.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {

        alert("Please select a PDF file.");
        return;

    }

    convertPDF(file);

});

/* ===================== CONVERT PDF ===================== */

async function convertPDF(file) {

    try {

        jpgFiles = [];

        previewGrid.innerHTML = "";

        loading.classList.remove("hidden");

        previewSection.classList.add("hidden");

        progressText.textContent = "Preparing...";

        const pdf = await pdfjsLib.getDocument({
            data: await file.arrayBuffer()
        }).promise;

        totalPagesText.textContent = `${pdf.numPages} Pages`;

        for (let i = 1; i <= pdf.numPages; i++) {

            progressText.textContent =
                `Converting page ${i} of ${pdf.numPages}...`;

            const page = await pdf.getPage(i);

            const viewport = page.getViewport({
                scale: 2
            });

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({
                canvasContext: ctx,
                viewport
            }).promise;

            const image = canvas.toDataURL("image/jpeg", 1);

            jpgFiles.push({
                name: `page-${i}.jpg`,
                data: image
            });

            createCard(image, i);

        }

        progressText.textContent = "Completed.";

        loading.classList.add("hidden");

        previewSection.classList.remove("hidden");

        fileInput.value = "";

    } catch (err) {

        console.error(err);

        loading.classList.add("hidden");

        alert("Failed to convert PDF.");

    }

}

/* ===================== CREATE PREVIEW ===================== */

function createCard(image, page) {

    const card = document.createElement("div");

    card.className = "preview-card";

    card.innerHTML = `
        <img src="${image}" alt="Page ${page}">
        <div class="preview-info">
            <h3>Page ${page}</h3>
            <button class="btn">Download JPG</button>
        </div>
    `;

    card.querySelector("button").addEventListener("click", () => {

        const a = document.createElement("a");

        a.href = image;
        a.download = `page-${page}.jpg`;

        document.body.appendChild(a);

        a.click();

        a.remove();

    });

    previewGrid.appendChild(card);

}

/* ===================== DOWNLOAD ALL ===================== */

downloadAllBtn.addEventListener("click", async () => {

    if (jpgFiles.length === 0) {

        alert("No JPG available.");

        return;

    }

    const zip = new JSZip();

    jpgFiles.forEach(file => {

        zip.file(
            file.name,
            file.data.split(",")[1],
            {
                base64: true
            }
        );

    });

    const content = await zip.generateAsync({
        type: "blob"
    });

    const url = URL.createObjectURL(content);

    const a = document.createElement("a");

    a.href = url;

    a.download = "SimplePDF-JPG.zip";

    document.body.appendChild(a);

    a.click();

    a.remove();

    URL.revokeObjectURL(url);

});
