// ======================================================
// CYBER HAND TRACKING
// Part 1
// ======================================================

const video = document.getElementById("webcam");
const canvas = document.getElementById("output");
const ctx = canvas.getContext("2d");

const loading = document.getElementById("loading");
const fpsLabel = document.getElementById("fps");

let handLandmarker;
let runningMode = "VIDEO";
let lastVideoTime = -1;

let fps = 0;
let lastFrame = performance.now();

let particles = [];

// ======================================================
// Resize Canvas
// ======================================================

function resizeCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


// ======================================================
// Start Camera
// ======================================================

async function startCamera(){

    const stream = await navigator.mediaDevices.getUserMedia({

        video:{
            width:1280,
            height:720
        }

    });

    video.srcObject = stream;

    return new Promise(resolve=>{

        video.onloadedmetadata=()=>{

            resolve();

        }

    });

}


// ======================================================
// Load MediaPipe
// ======================================================

async function createHandLandmarker(){

    const vision = await FilesetResolver.forVisionTasks(

        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm"

    );

    handLandmarker = await HandLandmarker.createFromOptions(

        vision,

        {

            baseOptions:{

                modelAssetPath:

                "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"

            },

            numHands:2,

            runningMode:"VIDEO"

        }

    );

}


// ======================================================
// Particle
// ======================================================

class Particle{

    constructor(x,y){

        this.x=x;
        this.y=y;

        this.size=Math.random()*3+1;

        this.speedX=(Math.random()-.5)*2;
        this.speedY=(Math.random()-.5)*2;

        this.life=80;

    }

    update(){

        this.x+=this.speedX;
        this.y+=this.speedY;

        this.life--;

    }

    draw(){

        ctx.beginPath();

        ctx.fillStyle="rgba(0,255,255,"+(this.life/80)+")";

        ctx.arc(this.x,this.y,this.size,0,Math.PI*2);

        ctx.fill();

    }

}

function addParticles(x,y){

    for(let i=0;i<6;i++){

        particles.push(new Particle(x,y));

    }

}

function drawParticles(){

    for(let i=particles.length-1;i>=0;i--){

        particles[i].update();

        particles[i].draw();

        if(particles[i].life<=0){

            particles.splice(i,1);

        }

    }

}
