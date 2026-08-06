pdfjsLib.GlobalWorkerOptions.workerSrc =
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const fileInput = document.getElementById("pdfFile");
const dropArea = document.getElementById("dropArea");
const loading = document.getElementById("loadingSection");
const preview = document.getElementById("previewSection");
const grid = document.getElementById("previewGrid");

const progress = document.getElementById("progressText");
const totalPages = document.getElementById("totalPages");

const downloadAll = document.getElementById("downloadAll");
const themeToggle = document.getElementById("themeToggle");

let images = [];

/* ================= THEME ================= */

const savedTheme = localStorage.getItem("theme");

if(savedTheme==="dark"){
    document.body.classList.add("dark");
    themeToggle.textContent="☀️";
}

themeToggle.onclick=()=>{

    document.body.classList.toggle("dark");

    const dark =
    document.body.classList.contains("dark");

    themeToggle.textContent =
    dark ? "☀️" : "🌙";

    localStorage.setItem(
        "theme",
        dark ? "dark" : "light"
    );

};

/* ================= FILE ================= */

fileInput.onchange=e=>{

    const file=e.target.files[0];

    if(file) convertPDF(file);

};

dropArea.ondragover=e=>{

    e.preventDefault();

    dropArea.classList.add("dragover");

};

dropArea.ondragleave=()=>{

    dropArea.classList.remove("dragover");

};

dropArea.ondrop=e=>{

    e.preventDefault();

    dropArea.classList.remove("dragover");

    const file=e.dataTransfer.files[0];

    if(file && file.type==="application/pdf"){

        convertPDF(file);

    }else{

        alert("Please choose a PDF file.");

    }

};

/* ================= CONVERT ================= */

async function convertPDF(file){

    try{

        images=[];

        grid.innerHTML="";

        loading.classList.remove("hidden");

        preview.classList.add("hidden");

        progress.textContent="Preparing...";

        const pdf =
        await pdfjsLib.getDocument({
            data:await file.arrayBuffer()
        }).promise;

        totalPages.textContent =
        `${pdf.numPages} Pages`;

        for(let i=1;i<=pdf.numPages;i++){

            progress.textContent =
            `Converting ${i}/${pdf.numPages}`;

            const page =
            await pdf.getPage(i);

            const viewport =
            page.getViewport({
                scale:2
            });

            const canvas =
            document.createElement("canvas");

            const ctx =
            canvas.getContext("2d");

            canvas.width =
            viewport.width;

            canvas.height =
            viewport.height;

            await page.render({
                canvasContext:ctx,
                viewport
            }).promise;

            const img =
            canvas.toDataURL(
                "image/jpeg",
                1
            );

            images.push({
                name:`page-${i}.jpg`,
                data:img
            });

            createCard(img,i);

        }

        loading.classList.add("hidden");

        preview.classList.remove("hidden");

        progress.textContent="Completed";

    }catch(err){

        console.error(err);

        loading.classList.add("hidden");

        alert("Failed to convert PDF.");

    }

}

/* ================= CARD ================= */

function createCard(img,page){

    const card =
    document.createElement("div");

    card.className =
    "preview-card";

    card.innerHTML=`

        <img src="${img}" alt="Page ${page}">

        <div class="preview-info">

            <h3>Page ${page}</h3>

            <button class="btn">
                Download JPG
            </button>

        </div>

    `;

    card.querySelector("button").onclick=()=>{

        downloadImage(
            img,
            `page-${page}.jpg`
        );

    };

    grid.appendChild(card);

}

/* ================= DOWNLOAD ================= */

function downloadImage(data,name){

    const a =
    document.createElement("a");

    a.href=data;

    a.download=name;

    a.click();

}

downloadAll.onclick=async()=>{

    if(images.length===0){

        alert("No JPG available.");

        return;

    }

    const zip =
    new JSZip();

    images.forEach(file=>{

        zip.file(
            file.name,
            file.data.split(",")[1],
            {
                base64:true
            }
        );

    });

    const blob =
    await zip.generateAsync({
        type:"blob"
    });

    const url =
    URL.createObjectURL(blob);

    downloadImage(
        url,
        "SimplePDF-JPG.zip"
    );

    setTimeout(()=>{

        URL.revokeObjectURL(url);

    },1000);

};
