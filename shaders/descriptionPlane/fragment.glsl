uniform sampler2D uMap;

varying vec2 vUv;

void main() {
    vec2 nUv = vUv;
    // nUv -= vec2(0.5);
    // nUv.x *= 1.05;
    // nUv.y *= 1.1;
    // nUv += vec2(0.5);
    vec4 text = texture2D(uMap, nUv);
    gl_FragColor = text + 0.2;
}