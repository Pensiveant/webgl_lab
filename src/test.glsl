#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float random (vec2 st) {
  return fract(sin(dot(st.xy,
      vec2(12.9898, 78.233)))
    * 43758.5453123);
}

float noise (vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x)
    + (d - b) * u.x * u.y;
}

float sphere (vec3 p, vec3 c, float r) {
  return length(p - c) - r;
}

float opUnion (float d1, float d2) {
  return min(d1, d2);
}

float opSubtraction (float d1, float d2) {
  return max(-d1, d2);
}

float opIntersection (float d1, float d2) {
  return max(d1, d2);
}

vec3 getNormal (vec3 p) {
  const float eps = 0.001;
  vec3 n = vec3(
    sphere(p + vec3(eps, 0.0, 0.0), vec3(0.0), 1.0)
      - sphere(p - vec3(eps, 0.0, 0.0), vec3(0.0), 1.0),
    sphere(p + vec3(0.0, eps, 0.0), vec3(0.0), 1.0)
      - sphere(p - vec3(0.0, eps, 0.0), vec3(0.0), 1.0),
    sphere(p + vec3(0.0, 0.0, eps), vec3(0.0), 1.0)
      - sphere(p - vec3(0.0, 0.0, eps), vec3(0.0), 1.0)
  );
  return normalize(n);
}


void main () {
  vec2 st = gl_FragCoord.xy / resolution.xy * 2.0 - 1.0;
  st.x *= resolution.x / resolution.y;
  vec3 ro = vec3(0.0, 0.0, 5.0);
  vec3 rd = normalize(vec3(st, -1.0));

  float t = 0.0;
  float d = 0.0;
  for (int i = 0; i < 32; i++) {
    vec3 p = ro + rd * t;
    d = opIntersection(d, sphere(p, vec3(0.0), 1.0));

    float n = noise(p.xy * 10.0 + time * 0.2);
    p += normalize(getNormal(p)) * n * 0.1;

    float pattern = abs(mod(p.z, 0.2) - 0.1) < 0.05 ? 1.0 : 0.0;
    pattern += abs(mod(p.y + 0.5, 1.0) - 0.5) < 0.1 ? 1.0 : 0.0;
    pattern += abs(mod(p.x + 0.5, 1.0) - 0.5) < 0.1 ? 1.0 : 0.0;
    pattern += abs(mod(p.y - 0.5, 1.0) - 0.5) < 0.1 ? 1.0 : 0.0;
    pattern += abs(mod(p.x - 0.5, 1.0) - 0.5) < 0.1 ? 1.0 : 0.0;

    if (pattern > 0.5) {
      d = -d;
    }

    t += d * 0.5;
    if (abs(d) < 0.01 || t > 100.0) {
      break;
    }
  }

  vec3 color = vec3(0.0);
  if (abs(d) < 0.01) {
    vec3 p = ro + rd * t;
    vec3 n = getNormal(p);
    vec3 lightDirection = normalize(vec3(1.0, 1.0, 1.0));
    float diffuse = max(0.0, dot(n, lightDirection));
    color = vec3(1.0, 0.5, 0.0) * diffuse;
  }

  gl_FragColor = vec4(color, 1.0);
}
