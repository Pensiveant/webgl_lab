import {
  requestFile,
  getWebgl,
  createShader,
  createProgram,
} from "../../core/index.js";

// 获取渲染上下文
let gl = getWebgl("canvas");

// 顶点着色器
let vertex = await requestFile("./glsl.vs");

// 片元着色器
let fragment = await requestFile("./glsl.fs");

// 上传代码并编译为着色器
let vertexShader = createShader(gl, "vs", vertex);
let fragmentShader = createShader(gl, "fs", fragment);

// 创建着色器程序，并链接着色器
let program = createProgram(gl, [vertexShader, fragmentShader]);

// 创建顶点缓冲
let posBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
var position = [
  // 三角形1
  0.0,0.0, // 顶点1
  0.0,250,
  250,250,
  // 三角形2
  0.0,0.0, // 顶点1
  250,250,
  250,0
];
// var position = [
//     // 三角形1
//     0.0,0.0, // 顶点1
//     250,0,
//     0,250,
//     // 三角形2
//     250,0.0, // 顶点1
//     250,250,
//     0,250
// ];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);


// 颜色缓冲设置数据
let colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

var r1 = 1.0;
var b1 = 0.0;
var g1 = 0.0;
var r2 = Math.random();
var b2 = Math.random();
var g2 = Math.random();
gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(
      [ r1, b1, g1, 1,
        r1, b1, g1, 1,
        r1, b1, g1, 1,
        r2, b2, g2, 1,
        r2, b2, g2, 1,
        r2, b2, g2, 1]),
    gl.STATIC_DRAW);


//#region 渲染阶段
gl.useProgram(program);

// 设置全局变量：分辨率
var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

// 顶点数据读取
let positionLoc = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(positionLoc);
gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
let size = 2;
gl.vertexAttribPointer(positionLoc, size, gl.FLOAT, false, 0, 0);

// 颜色数据绑定以及如何读取
let colorLoc = gl.getAttribLocation(program, "a_color");
gl.enableVertexAttribArray(colorLoc);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);


gl.drawArrays(gl.TRIANGLES, 0, 6);
//#endregion
