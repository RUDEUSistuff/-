let mode='math';
let buttonsContainer=document.getElementById('buttonsContainer');
let inputsContainer=document.getElementById('inputsContainer');
let threeContainer=document.getElementById('threeContainer');

function startApp(){
    document.getElementById('startScreen').style.display='none';
    document.getElementById('container').style.display='block';
}

function setMode(m){
    mode=m;
    buttonsContainer.innerHTML='';
    inputsContainer.innerHTML='';
    threeContainer.innerHTML='';
    document.getElementById('calcInput').value='';

    if(m==='math'){
        ['+','-','×','÷','%','^','sin','cos','tan','log','ln','π','e'].forEach(b=>{
            let btn=document.createElement('button');
            btn.innerText=b;
            btn.onclick=()=>document.getElementById('calcInput').value += b;
            buttonsContainer.appendChild(btn);
        });
    }

    else if(m==='physics'){
        ['F=ma','v=d/t','a=v/t','KE','PE','Pressure','Density','Work','Power','Momentum','Heat','Voltage','Resistance','Energy','Area','Volume'].forEach(b=>{
            let btn=document.createElement('button');
            btn.innerText=b;
            btn.onclick=()=>setupPhysics(b);
            buttonsContainer.appendChild(btn);
        });
    }

    else if(m==='shapes'){
        ['Cube','Sphere','Cylinder'].forEach(b=>{
            let btn=document.createElement('button');
            btn.innerText=b;
            btn.onclick=()=>drawShape(b);
            buttonsContainer.appendChild(btn);
        });
    }

    else if(m==='atoms'){
        ['Solid','Liquid','Gas','Plasma'].forEach(b=>{
            let btn=document.createElement('button');
            btn.innerText=b;
            btn.onclick=()=>simulateAtoms(b);
            buttonsContainer.appendChild(btn);
        });
    }

    else if(m==='puzzle'){
        ['Puzzle'].forEach(b=>{
            let btn=document.createElement('button');
            btn.innerText=b;
            btn.onclick=()=>generatePuzzle();
            buttonsContainer.appendChild(btn);
        });
    }
}

// Safe eval to support 30 digits
function safeEval(expr){
    return Function('"use strict"; return (' + expr + ')')();
}

// General calculation
function calculate(){
    let input=document.getElementById('calcInput').value.replace(/×/g,'*').replace(/÷/g,'/');
    try{
        let result=safeEval(input);
        document.getElementById('result').innerText='Result: '+result;
        document.getElementById('steps').innerText='Steps: '+input+' = '+result;
    }catch(e){
        document.getElementById('result').innerText='Error';
        document.getElementById('steps').innerText='';
    }
}

// Physics setup
function setupPhysics(law){
    inputsContainer.innerHTML='';
    let labels=[];
    switch(law){
        case 'F=ma': labels=['Mass (m)','Acceleration (a)']; break;
        case 'v=d/t': labels=['Distance (d)','Time (t)']; break;
        case 'a=v/t': labels=['Velocity (v)','Time (t)']; break;
        case 'KE': labels=['Mass (m)','Velocity (v)']; break;
        case 'PE': labels=['Mass (m)','Height (h)']; break;
        case 'Pressure': labels=['Force (F)','Area (A)']; break;
        case 'Density': labels=['Mass (m)','Volume (V)']; break;
        case 'Work': labels=['Force (F)','Distance (d)']; break;
        case 'Power': labels=['Work (W)','Time (t)']; break;
        case 'Momentum': labels=['Mass (m)','Velocity (v)']; break;
        case 'Heat': labels=['Mass (m)','Temperature change (ΔT)']; break;
        case 'Voltage': labels=['Current (I)','Resistance (R)']; break;
        case 'Resistance': labels=['Voltage (V)','Current (I)']; break;
        case 'Energy': labels=['Mass (m)','Velocity (v)']; break;
        case 'Area': labels=['Length (L)']; break;
        case 'Volume': labels=['Length (L)']; break;
    }
    labels.forEach(l=>{
        let input=document.createElement('input');
        input.placeholder=l;
        inputsContainer.appendChild(input);
    });
}

function val(placeholder){
    let inputs=inputsContainer.querySelectorAll('input');
    for(let i=0;i<inputs.length;i++){
        if(inputs[i].placeholder===placeholder) return parseFloat(inputs[i].value)||0;
    }
    return 0;
}

function drawShape(type){
    threeContainer.innerHTML='';
    let sizeInput=document.createElement('input');
    sizeInput.type='range';
    sizeInput.min=1;
    sizeInput.max=5;
    sizeInput.value=2;
    threeContainer.appendChild(sizeInput);

    let scene=new THREE.Scene();
    let camera=new THREE.PerspectiveCamera(75,1,0.1,1000);
    let renderer=new THREE.WebGLRenderer();
    renderer.setSize(300,200);
    threeContainer.appendChild(renderer.domElement);

    let mesh;
    function createShape(size){
        if(mesh) scene.remove(mesh);
        let geo;
        if(type==='Cube') geo=new THREE.BoxGeometry(size,size,size);
        if(type==='Sphere') geo=new THREE.SphereGeometry(size,32,32);
        if(type==='Cylinder') geo=new THREE.CylinderGeometry(size,size,size*2);
        mesh=new THREE.Mesh(geo,new THREE.MeshNormalMaterial());
        scene.add(mesh);
    }
    createShape(2);
    sizeInput.oninput=()=>createShape(sizeInput.value);
    camera.position.z=5;

    function animate(){
        requestAnimationFrame(animate);
        if(mesh){mesh.rotation.x+=0.01; mesh.rotation.y+=0.01;}
        renderer.render(scene,camera);
    }
    animate();
}

function simulateAtoms(type){
    threeContainer.innerHTML='';
    let canvas=document.createElement('canvas');
    canvas.width=300;
    canvas.height=200;
    threeContainer.appendChild(canvas);
    let ctx=canvas.getContext('2d');
    let atoms=[];
    for(let i=0;i<30;i++){
        atoms.push({x:Math.random()*300,y:Math.random()*200,vx:Math.random()*2,vy:Math.random()*2});
    }
    function animate(){
        ctx.clearRect(0,0,300,200);
        atoms.forEach(a=>{
            if(type==='Solid'){a.vx=0.2;a.vy=0.2;}
            if(type==='Liquid'){a.vx=Math.random()*2;a.vy=Math.random()*2;}
            if(type==='Gas'){a.vx=Math.random()*4;a.vy=Math.random()*4;}
            if(type==='Plasma'){a.vx=Math.random()*6;a.vy=Math.random()*6;}
            a.x+=a.vx;a.y+=a.vy;
            ctx.fillRect(a.x,a.y,3,3);
        });
        requestAnimationFrame(animate);
    }
    animate();
}

// Puzzle
function generatePuzzle(){
    document.getElementById('result').innerText='';
    document.getElementById('steps').innerText='';
    inputsContainer.innerHTML='';

    let a=Math.floor(Math.random()*20);
    let b=Math.floor(Math.random()*20);
    let correct=a+b;
    let choices=[correct,correct+1,correct-1,correct+2];
    choices.sort(()=>Math.random()-0.5);

    let q=document.createElement('div');
    q.innerText=`What is ${a} + ${b}?`;
    inputsContainer.appendChild(q);

    choices.forEach(c=>{
        let btn=document.createElement('button');
        btn.innerText=c;
        btn.onclick=()=>document.getElementById('result').innerText=(c===correct?'✅ Correct':'❌ Wrong');
        inputsContainer.appendChild(btn);
    });
}
