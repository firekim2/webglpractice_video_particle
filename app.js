import * as THREE from 'three';

import fragment from './shader/fragment.glsl';
import vertex from './shader/vertex.glsl';
import vertexParticle from './shader/vertexParticle.glsl';

import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass';

import * as dat from "dat.gui";

import Video from './video.js';

export default class Sketch{
    constructor(){
        this.camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -1000, 1000 );
        // this.camera = new THREE.PerspectiveCamera(50, window.innerHeight / window.innerWidth, 0.1, 5000);
        // this.camera.position.z = 2000;
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        
        this.videos = [
            new Video({
                src: require('./vid/1.mp4'),
                context: this,
                index: 0
            }),
            new Video({
                src: require('./vid/3.mp4'),
                context: this,
                index: 1
            })
        ]

        this.index = 0;

        document.querySelector("#container").appendChild( this.renderer.domElement );
        
        this.time = 0;
        this.playing = false;

        this.addMesh();
        this.addPost();
        this.render();    

        window.addEventListener('click', this.clickEvent);
    }

    render = () => {   
        this.time++;
        this.renderer.setClearColor( 0x000000, 0 );
    
        this.renderer.render( this.scene, this.camera );
        if(this.material.uniforms.opacity.value >0) this.composer.render()

        this.material.uniforms.time.value = this.time;
        
        window.requestAnimationFrame(this.render.bind());
    }

    addPost(){
        this.renderScene = new RenderPass(this.scene, this.camera);
        this.renderScene.clear = true;
        this.bloomPass = new UnrealBloomPass( new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        this.bloomPass.threshold = 0;
        this.bloomPass.strength = 0;
        this.bloomPass.radius = 0;

        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(this.renderScene);
        this.composer.addPass(this.bloomPass);
    }

    addMesh() {
        this.size = 200;
        this.geometry = new THREE.PlaneBufferGeometry(1, 1, this.size - 1, this.size - 1);

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                time: {type: "f", value: 0},
                t: {type: "t", value: this.videos[this.index].video},
                size: {type: "f", value: 1.0},
                opacity : {type: "f", value: 1.0},
                progress: {type: "f", value: 0.0},
            },
            transparent: true,
            fragmentShader: fragment,
            vertexShader: vertexParticle,
            side: THREE.DoubleSide
        });

        function rand(a, b){
            return a + (b-a) * Math.random();
        }

        this.plane = new THREE.Points(this.geometry, this.material);
        this.plane.scale.set(1200, 667, 1);

        this.scene.add(this.plane);
    }

    clickEvent = () => {
        if(!this.playing){
            let _currentTime = this.videos[this.index].deactivate();
            this.playing = true;
            this.index = (this.index + 1) % this.videos.length;
            
            setTimeout(() => {
                this.videos[this.index].activate(_currentTime);
            }, 4000);
        }        
    }
}


new Sketch();


