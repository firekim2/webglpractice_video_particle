varying vec2 vUv;
uniform sampler2D t;
uniform float opacity;
uniform float progress;
uniform float size;
uniform float time;

void main(){
    vec4 image = texture2D(t, vUv);
    vec4 col = vec4(vec3(1.0), opacity);
    vec4 res = mix(image, col, clamp((progress - 0.1) * 10.0, 0.0, 1.0));
    float rOpacity = clamp((image.r + image.g + image.b) * opacity, 0.0, 1.0);
    gl_FragColor = vec4(image.rgb, rOpacity);
}