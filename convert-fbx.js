// Quick conversion script using three.js FBXLoader
import * as fs from 'fs';
import * as path from 'path';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import * as THREE from 'three';

const fbxPath = './src/components/marketing/assets/3d/Low Poly Bird Hummingbird/Character/Low Poly Hummingbird.fbx';
const outputPath = './public/models/hummingbird.glb';

const loader = new FBXLoader();
loader.load(fbxPath, (object) => {
  const exporter = new GLTFExporter();
  exporter.parse(
    object,
    (result) => {
      const buffer = result instanceof ArrayBuffer ? result : result;
      fs.writeFileSync(outputPath, Buffer.from(buffer));
      console.log(`✅ Converted: ${fbxPath} → ${outputPath}`);
    },
    { binary: true }
  );
});
