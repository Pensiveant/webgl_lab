// <修改> 返回 0 到 range 范围内的随机整数
function randomInt(range) {
  return Math.floor(Math.random() * range);
}

/**
 * 按屏幕坐标系，生成绘制矩形对应的两个三角形坐标点
 * @param {WebGLContext} gl
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 */
function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      x1,y1, // 三角形1：点1 （左上角点）
      x2,y1, // 三角形1：点2 （右上角点）
      x1,y2, // 三角形1：点3 （左下角点）
      x1,y2, // 三角形2：点1 （左下角点）
      x2,y1, // 三角形2：点2 （右上角点）
      x2,y2, // 三角形2：点3 （右下角点）
    ]),
    gl.STATIC_DRAW
  );
}

function getWebgl() {
  let canvas = document.querySelector("#canvas");
  let gl = canvas.getContext("webgl");
  return gl;
}

function createShader(gl, type, source) {
  let shader = gl.createShader(type); // 创建着色器对象
  gl.shaderSource(shader, source); // 提供数据源
  gl.compileShader(shader); // // 编译 -> 生成着色器
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  gl.deleteShader(shader);
}

// 将两个着色器链接到一个 program（着色程序）
function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  gl.deleteProgram(program);
}

function init() {
  /**@type WebGLContext*/
  let gl = getWebgl();
  if (!gl) {
    return;
  }

  let vshaderSource = `
    attribute vec2 a_position; //   屏幕像素坐标
    uniform vec2 u_resolution;

    void main(){
      vec2 zeroToOne = a_position / u_resolution; // 归一化：像素坐标转换到 [0.0 , 1.0]
      vec2 zeroToTwo = zeroToOne * 2.0; // [0.0 , 1.0] 转换到 [0.0 , 2.0]
      vec2 clipSpace = zeroToTwo - 1.0; // [0.0 , 2.0] 转换为裁剪坐标[-1,1]
      gl_Position = vec4(clipSpace* vec2(1, -1), 0, 1); // [x,y,z,w]
    }
  `;
  let vshader = createShader(gl, gl.VERTEX_SHADER, vshaderSource);

  let fshaderSource = `
    precision mediump float;

    uniform vec4 u_color; // <修改>
    void main(){
      gl_FragColor = u_color; // <修改>
    }
  `;
  let fshader = createShader(gl, gl.FRAGMENT_SHADER, fshaderSource);
  let program = createProgram(gl, vshader, fshader);

  // 提供数据
  let positionAttributeLocation = gl.getAttribLocation(program, "a_position"); // 获取顺序值的位置
  var resolutionUniformLocation = gl.getUniformLocation(
    program,
    "u_resolution"
  );
  var colorUniformLocation = gl.getUniformLocation(program, "u_color"); // <修改>

  let positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); // 绑定数据源到gl.ARRAY_BUFFER 绑定点（）
  //
  var positions = [10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  //#region 绘制场景（每次要渲染或者绘制时执行）
  webglUtils.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  // 清空画布
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 告诉它用我们之前写好的着色程序（一个着色器对）
  gl.useProgram(program);

  gl.enableVertexAttribArray(positionAttributeLocation); // 开启a_position属性
  // 将绑定点绑定到缓冲数据（positionBuffer）
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // 设置全局变量 分辨率
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  // 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)
  var size = 2; // 每次迭代运行提取两个单位数据
  var type = gl.FLOAT; // 每个单位的数据类型是32位浮点型
  var normalize = false; // 不需要归一化数据
  var stride = 0; // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
  // 每次迭代运行运动多少内存到下一个数据开始点
  var offset = 0; // 从缓冲起始位置开始读取
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  // <修改> 绘制50个随机颜色矩形
  for (var ii = 0; ii < 50; ++ii) {
    // 创建一个随机矩形
    // 并将写入位置缓冲
    // 因为位置缓冲是我们绑定在
    // `ARRAY_BUFFER`绑定点上的最后一个缓冲
    setRectangle(
      gl,
      randomInt(300),
      randomInt(300),
      randomInt(300),
      randomInt(300)
    );

    // 设置一个随机颜色
    gl.uniform4f(
      colorUniformLocation,
      Math.random(),
      Math.random(),
      Math.random(),
      1
    );

    // 绘制矩形
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  // // 绘制一个矩形
  // setRectangle(gl, 250, 250, 100, 100);
  // gl.uniform4f(
  //   colorUniformLocation,
  //   Math.random(),
  //   Math.random(),
  //   Math.random(),
  //   1
  // );
  // gl.drawArrays(gl.TRIANGLES, 0, 6);

  //#endregion
}

window.onload = init;
