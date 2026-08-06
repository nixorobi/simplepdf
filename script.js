pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const fileInput=document.getElementById('pdfFile');
const dropArea=document.getElementById('dropArea');
const loading=document.getElementById('loadingSection');
const previewSection=document.getElementById('previewSection');
const previewGrid=document.getElementById('previewGrid');

fileInput.addEventListener('change',e=>{
 const file=e.target.files[0];
 if(file) convertPDF(file);
});

dropArea.addEventListener('dragover',e=>{
 e.preventDefault();
 dropArea.classList.add('dragover');
});

dropArea.addEventListener('dragleave',()=>dropArea.classList.remove('dragover'));

dropArea.addEventListener('drop',e=>{
 e.preventDefault();
 dropArea.classList.remove('dragover');
 const file=e.dataTransfer.files[0];
 if(file && file.type==='application/pdf'){
   convertPDF(file);
 }else{
   alert('Please select a PDF file.');
 }
});

async function convertPDF(file){
 previewGrid.innerHTML='';
 loading.classList.remove('hidden');
 previewSection.classList.add('hidden');

 const pdf=await pdfjsLib.getDocument({data:await file.arrayBuffer()}).promise;

 for(let i=1;i<=pdf.numPages;i++){
   const page=await pdf.getPage(i);
   const viewport=page.getViewport({scale:2});
   const canvas=document.createElement('canvas');
   const ctx=canvas.getContext('2d');
   canvas.width=viewport.width;
   canvas.height=viewport.height;
   await page.render({canvasContext:ctx,viewport}).promise;
   createCard(canvas.toDataURL('image/jpeg',1),i);
 }

 loading.classList.add('hidden');
 previewSection.classList.remove('hidden');
}

function createCard(img,page){
 const card=document.createElement('div');
 card.className='preview-card';
 card.innerHTML=`<img src="${img}"><div class="preview-info"><h3>Page ${page}</h3><button class="btn">Download JPG</button></div>`;
 card.querySelector('button').onclick=()=>{
   const a=document.createElement('a');
   a.href=img;
   a.download=`page-${page}.jpg`;
   a.click();
 };
 previewGrid.appendChild(card);
}
