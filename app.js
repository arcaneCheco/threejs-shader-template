import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";
import fragmentShader from "./fragment.glsl";
import vertexShader from "./vertex.glsl";

class World {
  constructor() {
    this.container = document.querySelector("#canvas");
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      65,
      this.width / this.height,
      0.1,
      200
    );
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // this.renderer.setClearColor(0x000000);
    this.container.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.z = 1;
    this.debug = new Pane();
    window.addEventListener("resize", this.resize.bind(this));
    this.addObject();
    this.render();
  }

  addObject() {
    this.geometry = new THREE.PlaneGeometry(1, 1);

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
      },
      transparent: true,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    /** fullscreen */
    // this.camera.fov =
    //   (360 / Math.PI) * Math.atan(this.height / (2 * this.camera.position.z));
    // this.mesh.scale.set(this.width, this.height, 1);

    this.camera.updateProjectionMatrix();
  }

  update() {}

  render() {
    this.time += 0.01633;
    this.update();
    this.material.uniforms.uTime.value = this.time;
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));
  }
}

new World();
