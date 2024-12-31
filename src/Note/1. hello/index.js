import {requestFile} from "../core/index.js"


// 获取渲染上下文
/** @type {HTMLCanvasElement} */
let canvas = document.getElementById("canvas");
let gl = canvas.getContext("webgl");

// 顶点着色器
let vertex = await requestFile('./hello.vs');

// 片元着色器
let fragment = await requestFile('./hello.fs');;

// 上传代码并编译为着色器
let vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertex);
gl.compileShader(vertexShader);

let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragment);
gl.compileShader(fragmentShader);

// 创建着色器程序，并链接着色器
let program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

// 创建缓冲
let posBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
var position=[
    -0.5,0.0, // 顶点1
    0.5,0.0,  // 顶点2
    0,0.5,    // 顶点3
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);

//#region 渲染阶段
gl.useProgram(program);

let positionLoc=gl.getAttribLocation(program,'a_position');
gl.enableVertexAttribArray(positionLoc);
gl.bindBuffer(gl.ARRAY_BUFFER,posBuffer);
let size=2;
gl.vertexAttribPointer(positionLoc,size,gl.FLOAT,false,0,0);

gl.drawArrays(gl.TRIANGLES, 0, 3);
//#endregion

