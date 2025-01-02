attribute vec2 a_position;// 屏幕坐标
uniform vec2 u_resolution;// canvas分辨率[width,height]
attribute vec4 a_color; // 颜色
varying vec4 v_color;

void main(){
    vec2 zeroToOne=a_position/u_resolution;// 将屏幕坐标转换为[0,1]
    vec2 zeroToTwo=zeroToOne*2.0;// 范围调整为[0,1]
    vec2 clipSpace=zeroToTwo-1.0;// 调整到裁剪空间[-1,1]
    // gl_Position=vec4(clipSpace,0,1);
    gl_Position=vec4(clipSpace* vec2(1, -1),0,1); // 将webgl坐标系，调整为屏幕坐标系
    v_color=a_color;
}