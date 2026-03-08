document.addEventListener("DOMContentLoaded",()=>{

const stages=[
{pdb:"1GRL",positions:[17,49,62,199],word:"LILY"},
{pdb:"1CRN",positions:[12,7,18,23],word:"NILE"},
{pdb:"1UBQ",positions:[1,3,42,51],word:"MIRE"}
]

let stage=0
let sequence=""
let selected=[]

const intro=document.getElementById("intro")
const game=document.getElementById("game")
const final=document.getElementById("final")

document.getElementById("startBtn").onclick=()=>{

intro.style.display="none"
game.style.display="flex"

clearInterval(matrixInterval)
document.getElementById("matrix").style.display="none"

loadStage()

}

function updateProgress(){

let percent=(stage/stages.length)*100

document.getElementById("bar").style.width=percent+"%"

}

function loadStage(){

updateProgress()

let s=stages[stage]

document.getElementById("stageTitle").textContent="STAGE "+(stage+1)

document.getElementById("pdb").textContent="Find in RCSB → "+s.pdb

document.getElementById("positions").textContent="Positions: "+s.positions.join(",")

selected=[]
document.getElementById("letters").textContent=""
document.getElementById("sequence").innerHTML=""

}

document.getElementById("fileInput").addEventListener("change",e=>{

let file=e.target.files[0]

let reader=new FileReader()

reader.onload=function(event){

let text=event.target.result

sequence=text
.split("\n")
.filter(l=>!l.startsWith(">"))
.join("")
.trim()

renderSequence()

}

reader.readAsText(file)

})

function renderSequence(){

let container=document.getElementById("sequence")

container.innerHTML=""

let lineLength=20

for(let i=0;i<sequence.length;i+=lineLength){

let line=sequence.substring(i,i+lineLength)

let div=document.createElement("div")

let num=document.createElement("span")

num.textContent=(i+1).toString().padStart(4," ")+" "

div.appendChild(num)

for(let j=0;j<line.length;j++){

let pos=i+j+1

let span=document.createElement("span")

span.textContent=line[j]

span.className="aa"

span.dataset.pos=pos

span.onclick=()=>clickResidue(span)

div.appendChild(span)

}

container.appendChild(div)

}

}

function clickResidue(el){

let s=stages[stage]

let pos=parseInt(el.dataset.pos)

if(pos===s.positions[selected.length]){

selected.push(el.textContent)

el.classList.add("hit")

document.getElementById("letters").textContent=selected.join(" ")

if(selected.length===s.positions.length){

decode()

}

}else{

selected=[]
renderSequence()

}

}

function decode(){

let word=selected.join("")

let overlay=document.createElement("div")

overlay.className="decodeOverlay"

overlay.innerHTML="AI ANALYZING..."

document.body.appendChild(overlay)

setTimeout(()=>{
overlay.innerHTML="EXTRACTING RESIDUES<br>"+selected.join(" ")
},800)

setTimeout(()=>{
overlay.innerHTML="DECODED<br>"+word
},1600)

setTimeout(()=>{

overlay.remove()

stage++

if(stage<stages.length){
loadStage()
}else{
game.style.display="none"
final.style.display="flex"
}

},2600)

}

document.getElementById("submitBtn").onclick=()=>{

let ans=document.getElementById("answer").value.toUpperCase()

if(ans==="LOTUS"){

document.getElementById("result").textContent="ACCESS GRANTED"

createLotus()

}else{

document.getElementById("result").textContent="ACCESS DENIED"

}

}

const lines=[
"> scanning biological database...",
"> decoding protein structures...",
"> searching hidden residues...",
"> system ready"
]

const terminal=document.getElementById("terminal")

let line=0
let char=0

function type(){

if(line>=lines.length)return

let span=document.createElement("span")

terminal.appendChild(span)

let text=lines[line]

function typeChar(){

if(char<text.length){

span.innerHTML=text.substring(0,char)+"<span class='cursor'>█</span>"
char++

setTimeout(typeChar,30)

}else{

span.innerHTML=text
line++
char=0

setTimeout(type,500)

}

}

typeChar()

}

type()

const canvas=document.getElementById("matrix")
const ctx=canvas.getContext("2d")

canvas.height=window.innerHeight
canvas.width=window.innerWidth

const letters="ATCG"
const fontSize=16
const columns=canvas.width/fontSize

const drops=[]

for(let i=0;i<columns;i++)drops[i]=1

function draw(){

ctx.fillStyle="rgba(0,0,0,0.05)"
ctx.fillRect(0,0,canvas.width,canvas.height)

ctx.fillStyle="#00ff9c"
ctx.font=fontSize+"px monospace"

for(let i=0;i<drops.length;i++){

let text=letters[Math.floor(Math.random()*letters.length)]

ctx.fillText(text,i*fontSize,drops[i]*fontSize)

if(drops[i]*fontSize>canvas.height)
drops[i]=0

drops[i]++

}

}

let matrixInterval=setInterval(draw,35)

})