import { useEffect, useRef } from "react";
import { Asset } from "expo-asset";
import { Renderer, TextureLoader } from "expo-three";
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import {
  AmbientLight,
  BoxGeometry,
  Fog,
  GridHelper,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SpotLight,
} from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as FileSystem from "expo-file-system";

export default function TabOneScreen() {
  const timeoutRef = useRef<number | null>(null);
  useEffect(() => {
    // Clear the animation loop when the component unmounts
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  return (
    <GLView
      style={{ flex: 1 }}
      onContextCreate={async (gl: ExpoWebGLRenderingContext) => {
        const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
        const sceneColor = 0x6ad6f0;

        // Create a WebGLRenderer without a DOM element
        const renderer = new Renderer({ gl });
        renderer.setSize(width, height);
        renderer.setClearColor(sceneColor);

        const camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
        camera.position.set(2, 5, 5);

        const scene = new Scene();
        scene.fog = new Fog(sceneColor, 1, 10000);
        scene.add(new GridHelper(10, 10));

        const ambientLight = new AmbientLight(0x101010);
        scene.add(ambientLight);

        const pointLight = new PointLight(0xffffff, 2, 1000, 1);
        pointLight.position.set(0, 200, 200);
        scene.add(pointLight);

        const spotLight = new SpotLight(0xffffff, 0.5);
        spotLight.position.set(0, 500, 100);
        spotLight.lookAt(scene.position);
        scene.add(spotLight);

        // Load and add a texture
        const cube = new IconMesh();
        scene.add(cube);

        const objLoader = new OBJLoader();
        const mtlLoader = new MTLLoader();
        async function loadObjectModel() {
          const mtlAsset = Asset.fromModule(
            require("../../assets/models/domino.mtl")
          );
          const objAsset = Asset.fromModule(
            require("../../assets/models/domino.obj")
          );
          await Promise.all([
            mtlAsset.downloadAsync(),
            objAsset.downloadAsync(),
          ]);
          const mtlUrl = mtlAsset.uri;
          const objUrl = objAsset.uri;
          return mtlLoader.load(mtlUrl, (materials) => {
            objLoader.setMaterials(materials);
            objLoader.load(objUrl, (object) => {
              object.position.x += 0.8;
              object.position.y += 0;
              object.position.z -= 0.9;
              object.scale.set(0.5, 0.5, 0.5);
              scene.add(object);
            });
          });
        }
        await loadObjectModel();

        camera.lookAt(cube.position);

        function update() {
          cube.rotation.y += 0.05;
          cube.rotation.x += 0.025;
        }

        // Setup an animation loop
        const render = () => {
          timeoutRef.current = requestAnimationFrame(render);
          update();
          renderer.render(scene, camera);
          gl.endFrameEXP();
        };
        render();
      }}
    />
  );
}

class IconMesh extends Mesh {
  constructor() {
    super(
      new BoxGeometry(1.0, 1.0, 1.0),
      new MeshStandardMaterial({
        map: new TextureLoader().load(
          require("../../assets/images/DOUBLE6.png")
        ),
        // color: 0xff0000
      })
    );
  }
}
