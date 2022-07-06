import * as THREE from "three";
import { clamp } from "three/src/math/MathUtils";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";
import fragmentShader from "./shaders/text/fragment.glsl";
import vertexShader from "./shaders/text/vertex.glsl";
import descFragment from "./shaders/descriptionPlane/fragment.glsl";
import descVertex from "./shaders/descriptionPlane/vertex.glsl";
import font from "./Audiowide-Regular.json";
import TextGeometryOGL from "./TextGeometryOGL";

class World {
  constructor() {
    this.time = 0;
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
    this.renderer.setClearColor(0x444444);
    this.container.appendChild(this.renderer.domElement);
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.z = 2;
    this.debug = new Pane();
    this.textureLoader = new THREE.TextureLoader();
    window.addEventListener("resize", this.resize.bind(this));
    window.addEventListener("wheel", this.onScroll.bind(this));

    this.settings = {
      screenWidth: 600,
      screenHeight: 300,
      paddingLeftRight: 40,
      paddingTopBottom: 40,
      size: 30,
    };

    this.setGeometry();
    this.setMaterial();
    this.setMesh();
    this.setRenderTarget();
    this.setScreen();

    this.addObject();
    this.setDebug();
    this.resize();
    this.render();
  }

  setGeometry() {
    this.geometry = new TextGeometryOGL();
    this.geometry.setText({
      font,
      text: `
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy
        text ever since the 1500s, when an unknown printer took a galley
        of type and scrambled it to make a type specimen book. It has
        survived not only five centuries, but also the leap into electronic
        typesetting, remaining essentially unchanged. It was popularised in
        the 1960s with the release of Letraset sheets containing Lorem
        Ipsum passages, and more recently with desktop publishing
        software like Aldus PageMaker including versions of Lorem Ipsum.
        `,
      align: "left",
    });
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        tMap: { value: this.textureLoader.load("fontMap.png") },
      },
      transparent: true,
    });
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  setRenderTarget() {
    const mapResolution = 512;
    this.renderTarget = new THREE.WebGLRenderTarget(
      this.settings.screenWidth,
      this.settings.screenHeight,
      {
        depthBuffer: false,
        stencilBuffer: false,
      }
    );

    this.otherScene = new THREE.Scene();
    this.otherScene.add(this.mesh);
  }

  setScreen() {
    this.screenMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uMap: { value: this.renderTarget.texture },
      },
      vertexShader: descVertex,
      fragmentShader: descFragment,
    });

    this.screen = new THREE.Mesh(
      new THREE.PlaneGeometry(4, 2),
      this.screenMaterial
    );
    this.scene.add(this.screen);
  }

  resetTextdimensions() {
    const widthRatio = 2 / this.settings.screenWidth;
    const screenAspect = this.settings.screenWidth / this.settings.screenHeight;
    const paddingTopBottom = this.settings.paddingTopBottom * screenAspect;
    const size = this.settings.size * widthRatio;
    const lineWidth =
      (this.settings.screenWidth - this.settings.paddingLeftRight * 2) *
      widthRatio;
    const positionX = -1 + this.settings.paddingLeftRight * widthRatio;
    const positionYTop = 1 - 0.5 * size - paddingTopBottom * widthRatio;
    this.geometry.updateTextSize(size, lineWidth);
    const positionYBottom =
      positionYTop +
      this.geometry.text.height +
      2 * paddingTopBottom * widthRatio -
      2 -
      (this.geometry.text.lineHeight - 1) * size;

    return {
      posX: positionX,
      posYmin: positionYTop,
      posYmax: positionYBottom,
    };
  }

  addObject() {
    this.t = this.resetTextdimensions();
    this.mesh.position.x = this.t.posX;
    this.mesh.position.y = clamp(
      this.mesh.position.y,
      this.t.posYmin,
      this.t.posYmax
    );
    window.setTimeout(() => {
      this.createTexture();
    }, 50);
  }

  onScroll(ev) {
    this.mesh.position.y = clamp(
      this.mesh.position.y + ev.deltaY / 1000,
      this.t.posYmin,
      this.t.posYmax
    );
    this.createTexture();
  }

  setDebug() {
    this.debug
      .addInput(this.settings, "size", {
        min: 1,
        max: 80,
        step: 0.01,
      })
      .on("change", () => {
        this.addObject();
      });
    this.debug
      .addInput(this.settings, "screenWidth", {
        min: 200,
        max: 1800,
        step: 0.01,
      })
      .on("change", () => {
        this.addObject();
      });
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    this.camera.updateProjectionMatrix();
  }

  createTexture() {
    this.renderer.setRenderTarget(this.renderTarget);
    this.renderer.render(this.otherScene, this.camera);
    this.renderer.setRenderTarget(null);
    this.renderer.clear();
  }

  update() {}

  render() {
    this.time += 0.01633;
    this.update();
    this.renderer.render(this.scene, this.camera);
    // this.renderer.render(this.otherScene, this.camera);

    window.requestAnimationFrame(this.render.bind(this));
  }
}

new World();
