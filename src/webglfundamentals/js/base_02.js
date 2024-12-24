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
    attribute vec2 a_position;       // 屏幕像素坐标（单位为像素）
    uniform vec2 u_resolution;      //  画布的分辨率（canvas的宽度和高度）

    void main(){
      vec2 zeroToOne = a_position / u_resolution; // 归一化：像素坐标转换到 [0.0 , 1.0]
      vec2 zeroToTwo = zeroToOne * 2.0; // [0.0 , 1.0] 转换到 [0.0 , 2.0]
      vec2 clipSpace = zeroToTwo - 1.0; // [0.0 , 2.0] 转换为裁剪坐标[-1,1]
      gl_Position = vec4(clipSpace, 0, 1); // [x,y,z,w]
    }
  `;
  let vshader = createShader(gl, gl.VERTEX_SHADER, vshaderSource);

  let fshaderSource = `
    precision mediump float;

    void main(){
        gl_FragColor=vec4(1, 0, 0.5, 1);// 返回“红紫色”
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

  let positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); // 绑定数据源到gl.ARRAY_BUFFER 绑定点（）
  //
  var positions = [
    10, 20,      // 三角形1：点1（矩形左下角点）
    80, 20,      // 三角形1：点2（矩形右下角点）
    10, 30,      // 三角形1：点3（矩形左上角点）
    10, 30,      // 三角形2：点1（矩形左上角点）
    80, 20,      // 三角形2：点2（矩形右下角点）
    80, 30       // 三角形2：点3（矩形右上角点）
    ];
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

  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 6;
  gl.drawArrays(primitiveType, offset, count);
  //#endregion
}

window.onload = init;
