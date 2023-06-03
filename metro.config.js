// const { getDefaultConfig } = require("metro-config");

// module.exports = async () => {
//   const defaultConfig = await getDefaultConfig();

//   return {
//     ...defaultConfig,
//     resolver: {
//       ...defaultConfig.resolver,
//       assetExts: [
//         ...defaultConfig.resolver.assetExts,
//         //   "db",
//         //   "mp3",
//         //   "ttf",
//         //   "obj",
//         //   "png",
//         //   "jpg",
//       ],
//     },
//   };
// };

// const { getDefaultConfig } = require("@expo/metro-config");
// const defaultConfig = getDefaultConfig(__dirname);
// defaultConfig.resolver.assetExts.push("cjs");
// defaultConfig.resolver.assetExts.push("png");
// defaultConfig.resolver.assetExts.push("jpg");
// defaultConfig.resolver.assetExts.push("obj");
// defaultConfig.resolver.assetExts.push("ttf");
// defaultConfig.resolver.assetExts.push("mp3");
// defaultConfig.resolver.assetExts.push("db");
// module.exports = defaultConfig;

const { getDefaultConfig } = require("metro-config");

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();

  return {
    resolver: {
      assetExts: [...assetExts, "mtl", "obj", "fbx", "glb", "gltf"],
    },
  };
})();
