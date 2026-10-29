import * as THREE from "three";

export function createWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#6e4b37";
  ctx.fillRect(0, 0, 512, 512);

  const plankHeight = 32;
  for (let y = 0; y < 512; y += plankHeight) {
    const variation = Math.sin(y * 1.5) * 12;
    ctx.fillStyle = `rgb(${110 + variation}, ${75 + variation * 0.7}, ${55 + variation * 0.5})`;
    ctx.fillRect(0, y, 512, plankHeight - 2);

    ctx.fillStyle = "rgba(45, 28, 18, 0.16)";
    for (let x = 0; x < 512; x += 16) {
      ctx.fillRect(x + (y % 64), y, 8, plankHeight - 2);
    }

    ctx.fillStyle = "#382317";
    ctx.fillRect(0, y + plankHeight - 2, 512, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

export function createStoneTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#2c2925";
  ctx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const r = Math.random() * 2 + 1;
    ctx.fillStyle =
      Math.random() > 0.5 ? "rgba(20, 18, 16, 0.4)" : "rgba(80, 75, 68, 0.25)";
    ctx.fillRect(x, y, r, r);
  }

  ctx.strokeStyle = "rgba(18, 16, 14, 0.6)";
  ctx.lineWidth = 2;
  for (let x = 0; x < 256; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 256);
    ctx.stroke();
  }
  for (let y = 0; y < 256; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

export function createMistTexture(): THREE.CanvasTexture | null {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 32);
  grad.addColorStop(0, "rgba(245, 242, 235, 0.65)");
  grad.addColorStop(0.35, "rgba(220, 214, 202, 0.3)");
  grad.addColorStop(0.7, "rgba(180, 175, 165, 0.08)");
  grad.addColorStop(1, "rgba(24, 22, 20, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

export interface SanctuaryMaterials {
  teakMat: THREE.MeshStandardMaterial;
  basaltMat: THREE.MeshStandardMaterial;
  glassMat: THREE.MeshStandardMaterial;
  warmInteriorMat: THREE.MeshStandardMaterial;
  thatchRoofMat: THREE.MeshStandardMaterial;
  poolWaterMat: THREE.MeshStandardMaterial;
  foliageMat: THREE.MeshStandardMaterial;
  palmTrunkMat: THREE.MeshStandardMaterial;
  darkSteelMat: THREE.MeshStandardMaterial;
}

export function createSanctuaryMaterials(
  woodTexture: THREE.CanvasTexture,
  stoneTexture: THREE.CanvasTexture,
  disposables: (THREE.BufferGeometry | THREE.Material)[]
): SanctuaryMaterials {
  const teakMat = new THREE.MeshStandardMaterial({
    map: woodTexture,
    roughness: 0.58,
    metalness: 0.12,
    color: 0x93654d,
  });
  const basaltMat = new THREE.MeshStandardMaterial({
    map: stoneTexture,
    roughness: 0.88,
    metalness: 0.1,
    color: 0x2b2825,
    flatShading: true,
  });
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xdaf2ee,
    roughness: 0.1,
    metalness: 0.6,
    transparent: true,
    opacity: 0.68,
  });
  const warmInteriorMat = new THREE.MeshStandardMaterial({
    color: 0xffdfb0,
    emissive: 0xca6f43,
    emissiveIntensity: 0.75,
    roughness: 0.35,
  });
  const thatchRoofMat = new THREE.MeshStandardMaterial({
    color: 0x483e35,
    roughness: 0.95,
    metalness: 0.05,
    flatShading: true,
  });
  const poolWaterMat = new THREE.MeshStandardMaterial({
    color: 0x3abfb0,
    emissive: 0x1d7065,
    emissiveIntensity: 0.55,
    roughness: 0.15,
    metalness: 0.75,
    transparent: true,
    opacity: 0.88,
  });
  const foliageMat = new THREE.MeshStandardMaterial({
    color: 0x2e462a,
    roughness: 0.8,
    metalness: 0.05,
    flatShading: true,
    side: THREE.DoubleSide,
  });
  const palmTrunkMat = new THREE.MeshStandardMaterial({
    color: 0x54473d,
    roughness: 0.9,
  });
  const darkSteelMat = new THREE.MeshStandardMaterial({
    color: 0x1f2022,
    roughness: 0.45,
    metalness: 0.85,
  });

  disposables.push(
    teakMat,
    basaltMat,
    glassMat,
    warmInteriorMat,
    thatchRoofMat,
    poolWaterMat,
    foliageMat,
    palmTrunkMat,
    darkSteelMat
  );

  return {
    teakMat,
    basaltMat,
    glassMat,
    warmInteriorMat,
    thatchRoofMat,
    poolWaterMat,
    foliageMat,
    palmTrunkMat,
    darkSteelMat,
  };
}
