import * as THREE from 'three';
import {gsap} from 'gsap';

export default class Video{
    constructor(options){        
        this.src = options.src;
        this.context = options.context;

        let code = `<video id="video${options.index}">
                        <source src="${this.src}" type="video/mp4">
                    </video>`
        
        document.querySelector("#vid-container").insertAdjacentHTML('afterbegin', code);
        this.domElement = document.querySelector(`#vid-container #video${options.index}`);

        let that = this;

        this.domElement.addEventListener( "loadedmetadata", function (e) {
            that.ratio = this.videoHeight / this.videoWidth;
        }, false );

        this.domElement.addEventListener('ended', (event) => {
            this.context.clickEvent();
        });
        
        this.video = new THREE.VideoTexture( this.domElement );
    }

    activate(currentTime){
        // this.context.material.uniforms.t.value = this.video;
        // gsap.to(this.context.material.uniforms.uOpacity, {
        //     value: 1,
        //     duration: 0.5
        // })

        this.context.material.uniforms.t.value = this.video;

        this.domElement.currentTime = 0;
        this.domElement.play();
        // this.domElement.pause();
        
        setTimeout(() => {
            gsap.fromTo(this.context.material.uniforms.progress, {
                value: 1.0
            }, {value: 0.0, duration: 1.5, ease: "Power1.easeIn"});
    
            gsap.fromTo(this.context.material.uniforms.size, {value: 0},{
                value: 1,
                duration: 0.5,
                delay: 1.5
            })
            
            gsap.fromTo(this.context.material.uniforms.opacity, {
                value: 1.0            
            }, {
                value: 0.0,
                duration: 0.5,
                delay: 1.5
            });

            gsap.fromTo(this.context.bloomPass, {
                strength: 5.0
            }, {strength: 0.0, duration: 0.5, delay: 1.5, ease: "Power1.easeIn"});
    
            setTimeout(() => {
                this.domElement.style.display = "block";
                this.domElement.play();
                this.context.playing = false;
            }, 1000);
        }, 1000); 
    }

    deactivate(){
        this.context.material.uniforms.t.value = this.video;
        this.domElement.style.display = "none";

        gsap.fromTo(this.context.material.uniforms.size, {value: 1},{
            value: 0,
            duration: 1,
            delay: 0.5,
            ease: "Power1.easeIn"
        });

        gsap.fromTo(this.context.material.uniforms.opacity, {value: 0},{
            value: 1,
            duration: 0.5,
        });

        gsap.fromTo(this.context.material.uniforms.progress, {
            value: 0.0
        }, {value: 1.0, duration: 2.0, delay: 2.0, ease: "Power1.easeIn"});
        
        gsap.fromTo(this.context.bloomPass, {
            strength: 0.0
        }, {strength: 5.0, duration: 0.5, delay: 1.5, ease: "Power1.easeIn"});
        

        setTimeout(() => {
            this.domElement.pause();
        }, 4000)
        return this.domElement.currentTime;
    }
}

