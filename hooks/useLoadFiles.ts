import { Asset } from "expo-asset";
import { useState, useEffect } from "react";
import { ImageSourcePropType, Image } from "react-native";

function cacheImages(images: ImageSourcePropType[]) {
  return images.map((image) => {
    if (typeof image === "number") {
      return Asset.fromModule(image).downloadAsync();
    }
    return Image.prefetch(image as string);
  });
}

const _loadAssetsAsync = async () => {

  try {
    const imageAssets = cacheImages([require("../assets/images/DOUBLE6.png")]);
    const loadedAssets = await Promise.all([...imageAssets]);
    // Filter out any boolean values from loaded assets
    const filteredAssets = loadedAssets.filter((asset) => !(typeof asset === "boolean"));
    return filteredAssets as Asset[];
  } catch (e) {
    throw new Error("FILES DIDNT LOAD in useLoadFiles.ts")
  }

};

export function useLoadFiles() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false);

  useEffect(() => {
    const loadAssetsAsync = async () => {
      const loadedAssets = await _loadAssetsAsync();
      setAssets(loadedAssets);
      setIsAssetsLoaded(true);
    };
    loadAssetsAsync();
  }, []);

  return [
    assets,
    isAssetsLoaded,
  ];
}