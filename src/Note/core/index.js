import m4 from "./m4.js";

async function requestFile(filePath) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", filePath, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let shaderSource = xhr.responseText;
        resolve(shaderSource);
      }
    };
    xhr.send();
  });
}

/**
 * 获取WebGLRenderingContext对象
 * @param {string} id canvas元素的id
 * @returns
 */
function getWebgl(id) {
  /** @type {HTMLCanvasElement} */
  let canvas = document.getElementById(id);
  let gl = canvas.getContext("webgl");
  return gl;
}

/**
 * 创建着色器
 * @param {WebGLRenderingContext} gl
 * @param {'vs'|'fs'} type  着色器类型
 * @param {string} source   着色器源码
 * @returns
 */
function createShader(gl, type, source) {
  let shaderType = {
    vs: gl.VERTEX_SHADER,
    fs: gl.FRAGMENT_SHADER,
  };
  let shader = gl.createShader(shaderType[type]);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

/**
 * 创建渲染程序
 * @param {WebGLRenderingContext} gl
 * @param {Array<Shader>} shaders
 * @returns
 */
function createProgram(gl, shaders) {
  let program = gl.createProgram();
  for (let i = 0, len = shaders.length; i < len; i++) {
    const item = shaders[i];
    gl.attachShader(program, item);
  }
  gl.linkProgram(program);
  return program;
}

export { requestFile, getWebgl, createShader, createProgram, m4 };
