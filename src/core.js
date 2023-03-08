/**
 * 通过canvas ID 获取webgl context
 * @param {*} id
 * @returns
 */

export function getWebgl(id) {
  const canvas = document.getElementById(id);
  const gl = canvas.getContext("webgl");
  // 确认 WebGL 支持性
  if (!gl) {
    throw new Error(
      "无法初始化 WebGL，你的浏览器、操作系统或硬件等可能不支持 WebGL。"
    );
  }
  return gl;
}

/**
 * 创建指定类型的着色器，上传 source 源码并编译
 * @param {*} gl
 * @param {*} type
 * @param {*} source
 */
export function loadShader(gl, type, source) {
  const shader = gl.createShader(type); // 创建shader
  gl.shaderSource(shader, source); // 设置源码
  gl.compileShader(shader); // 编译
  // 判断是否成功，否则报错
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    throw new Error(`编译shader时出差：${gl.getShaderInfoLog(shader)}`);
  }
  return shader;
}

/**
 * 初始化着色器程序
 * @param {*} gl
 * @param {*} vsSource
 * @param {*} fsSource
 */
export function initShaderProgram(gl, vsSource, fsSource) {
  const shaderProgram=gl.createProgram(); // 创建着色器程序 
  // 创建着色器
  const vShader=loadShader(gl,gl.VERTEX_SHADER,vsSource);
  const fShader=loadShader(gl,gl.FRAGMENT_SHADER,fsSource);
  gl.attachShader(shaderProgram,vShader);
  gl.attachShader(shaderProgram,fShader);
  //
  gl.linkProgram(shaderProgram); // 连接
   // 判断是否成功，否则报错
   if (!gl.getProgramParameter(shaderProgram,  gl.LINK_STATUS)) {
    throw new Error(`链接着色器程序出错：${gl.getProgramInfoLog(shaderProgram)}`);
  }
  return shaderProgram;
}
