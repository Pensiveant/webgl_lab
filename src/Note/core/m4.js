/**
 * 正射投影
 * @param {*} left
 * @param {*} right
 * @param {*} bottom
 * @param {*} top
 * @param {*} near
 * @param {*} far
 */
function orthographic(left, right, bottom, top, near, far) {}

/**
 * 透视投影
 * @param {number} fov       视场角
 * @param {number} aspect    宽高比
 * @param {number} near      近端面
 * @param {number} far       远端面
 */
function perspective(fov, aspect, near, far) {}

/**
 * 平移
 * @param {*} m     初始矩阵
 * @param {number} tx    x偏移量
 * @param {number} ty    y偏移量
 * @param {number} tz    z偏移量
 */
function translate(m, tx, ty, tz) {}

/**
 * 绕x轴旋转
 * @param {*} angleInRadians
 */
function xRotation(angleInRadians) {}

/**
 * 绕y轴旋转
 * @param {*} angleInRadians
 */
function yRotation(angleInRadians) {}

/**
 * 绕z轴旋转
 * @param {*} angleInRadians
 */
function zRotation(angleInRadians) {}

/**
 * 缩放
 * @param {*} m
 * @param {*} sx
 * @param {*} sy
 * @param {*} sz
 */
function scale(m, sx, sy, sz) {}

/**
 * 叉乘
 * @param {*} a 
 * @param {*} b 
 */
function multiply(a, b) {

}

const m4 = {
  orthographic,
  perspective,
  translate,
  xRotation,
  yRotation,
  zRotation,
  scale,
  multiply
};

export default m4;
