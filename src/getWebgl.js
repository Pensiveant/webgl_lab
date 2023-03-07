/**
 * 通过canvas ID 获取webgl context
 * @param {*} id 
 * @returns 
 */

function getWebgl(id) {
  const canvas = document.getElementById(id);
  const gl = canvas.getContext("webgl");
  // 确认 WebGL 支持性
  if (!gl) {
    throw new Error(
      "无法初始化 WebGL，你的浏览器、操作系统或硬件等可能不支持 WebGL。"
    );
    return;
  }
  return gl;
}

export default getWebgl;
