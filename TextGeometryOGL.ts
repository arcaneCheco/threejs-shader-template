import * as THREE from "three";
import Text, { TextProps } from "./Text";

export default class TextGeometryOGL extends THREE.BufferGeometry {
  text: Text;
  constructor() {
    super();
  }

  setText(opt: TextProps) {
    this.text = new Text(opt);
    this.setAttribute(
      "position",
      new THREE.BufferAttribute(this.text.buffers["position"], 3)
    );
    this.setAttribute(
      "uv",
      new THREE.BufferAttribute(this.text.buffers["uv"], 2)
    );
    this.setAttribute(
      "id",
      new THREE.BufferAttribute(this.text.buffers["id"], 1)
    );
    this.setIndex(new THREE.BufferAttribute(this.text.buffers["index"], 1));
  }

  updateTextSize(size, lineWidth = undefined) {
    this.text.updateSize(size, lineWidth);
    this.attributes.position.needsUpdate = true;
  }
}

// let upperX, lowerX, upperY, lowerY;
// for (let index = 0; index < text.buffers.position.length / 3; index++) {
//   const x = text.buffers.position[index * 3];
//   const y = text.buffers.position[index * 3 + 1];
//   if (index === 0) {
//     upperX = x;
//     lowerX = x;
//     upperY = y;
//     lowerY = y;
//     continue;
//   }
//   if (x < lowerX) lowerX = x;
//   if (x > upperX) upperX = x;
//   if (y < lowerY) lowerY = y;
//   if (y > upperY) upperY = y;
// }
// console.log(lowerX, upperX, lowerY, upperY);
// const width = upperX - lowerX;
// const height = upperY - lowerY;
// const toScale = (1 * text.numLines) / height;
// console.log(width, height);
// const center = new THREE.Vector3(
//   width / 2 + lowerX,
//   height / 2 + lowerY,
//   0
// ).multiplyScalar(toScale);
// console.log(center);
// mesh.position.y = -center.y;
// mesh.position.x = -center.x;
// console.log(mesh.position);
// mesh.scale.multiplyScalar(toScale);

// const dummy = new THREE.Mesh(
//   new THREE.PlaneGeometry(1, 1),
//   new THREE.MeshBasicMaterial()
// );
// this.scene.add(dummy);
