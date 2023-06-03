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
  Vector3,
} from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { Buffer } from "buffer";

import * as FileSystem from "expo-file-system";

export default function TabTwoScreen() {
  const timeoutRef = useRef<number | null>(null);
  const gltfObjectRef = useRef<Mesh>();
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

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("/examples/jsm/libs/draco/");
        const gltfLoader = new GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader);

        const getUrl = async () => {
          const asset = Asset.fromModule(
            require("../../assets/models/numberOne.glb")
          );
          await asset.downloadAsync();
          return asset.localUri;
        };
        function base64ToArrayBuffer(base64: string): ArrayBuffer {
          const binaryString = Buffer.from(base64, "base64").toString("binary");
          const length = binaryString.length;
          const bytes = new Uint8Array(length);
          for (let i = 0; i < length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          return bytes.buffer;
        }
        const getBuffer = async (url: string) => {
          const glbData = await FileSystem.readAsStringAsync(url, {
            encoding: FileSystem.EncodingType.Base64,
          });
          const glbArrayBuffer = base64ToArrayBuffer(glbData);
          return glbArrayBuffer;
        };
        async function loadObjectModel() {
          try {
            let assetUrl = await getUrl();
            if (!assetUrl) throw new Error("url not loaded...");
            let glbArrayBuffer = await getBuffer(assetUrl);
            gltfLoader.parse(
              glbArrayBuffer,
              "",
              (gltf) => {
                let object = gltf.scene;
                gltfObjectRef.current = object;
                object.position.x += 0.8;
                object.position.y += 0;
                object.position.z -= 0.9;
                object.scale.set(0.5, 0.5, 0.5);
                scene.add(object);
              },
              (error) => {
                console.error("Error loading GLTF:", error);
              }
            );
          } catch (err) {
            console.log("error:", err);
          }
        }
        await loadObjectModel();

        //REPLACE cube with the gltf object
        const target = new Vector3(0, 0, 0); // Target position at (0, 0, 0)
        camera.lookAt(gltfObjectRef.current?.position || target);
        // camera.lookAt(target);

        //REPLACE cube with the gltf object
        function update() {
          if (gltfObjectRef.current) {
            gltfObjectRef.current.rotation.x += 0.05;
            gltfObjectRef.current.rotation.y += 0.025;
            // gltfObjectRef.current.position.x += 0.01;
          }
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
