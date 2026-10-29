import * as THREE from "three";
import { SanctuaryMaterials } from "./materials";
import { VillaNodeConfig } from "./types";

export function buildCanopyVilla(
  materials: SanctuaryMaterials,
  disposables: (THREE.BufferGeometry | THREE.Material)[],
  isMobile: boolean
): THREE.Group {
  const root = new THREE.Group();

  const stiltGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.42, 6);
  disposables.push(stiltGeo);
  const stiltPositions: [number, number, number][] = [
    [-0.24, -0.15, -0.16],
    [0.24, -0.15, -0.16],
    [-0.24, -0.22, 0.18],
    [0.24, -0.22, 0.18],
  ];
  stiltPositions.forEach(([sx, sy, sz]) => {
    const stilt = new THREE.Mesh(stiltGeo, materials.darkSteelMat);
    stilt.position.set(sx, sy, sz);
    stilt.rotation.z = sx > 0 ? -0.15 : 0.15;
    root.add(stilt);
  });

  const deckGeo = new THREE.BoxGeometry(0.68, 0.05, 0.52);
  disposables.push(deckGeo);
  const deck = new THREE.Mesh(deckGeo, materials.teakMat);
  deck.position.set(0, 0.04, 0.02);
  deck.castShadow = !isMobile;
  deck.receiveShadow = !isMobile;
  root.add(deck);

  const poolCopingGeo = new THREE.BoxGeometry(0.54, 0.04, 0.18);
  const poolWaterGeo = new THREE.BoxGeometry(0.48, 0.03, 0.14);
  disposables.push(poolCopingGeo, poolWaterGeo);

  const poolCoping = new THREE.Mesh(poolCopingGeo, materials.basaltMat);
  poolCoping.position.set(0.02, 0.07, 0.16);
  root.add(poolCoping);

  const poolWater = new THREE.Mesh(poolWaterGeo, materials.poolWaterMat);
  poolWater.position.set(0.02, 0.08, 0.16);
  root.add(poolWater);

  const glassRailingGeo = new THREE.BoxGeometry(0.5, 0.08, 0.012);
  disposables.push(glassRailingGeo);
  const railing = new THREE.Mesh(glassRailingGeo, materials.glassMat);
  railing.position.set(0.02, 0.13, 0.24);
  root.add(railing);

  const glassWallGeo = new THREE.BoxGeometry(0.44, 0.18, 0.26);
  disposables.push(glassWallGeo);
  const glassWall = new THREE.Mesh(glassWallGeo, materials.glassMat);
  glassWall.position.set(-0.04, 0.15, -0.08);
  root.add(glassWall);

  const roomCoreGeo = new THREE.BoxGeometry(0.36, 0.15, 0.18);
  disposables.push(roomCoreGeo);
  const roomCore = new THREE.Mesh(roomCoreGeo, materials.warmInteriorMat);
  roomCore.position.set(-0.04, 0.14, -0.08);
  root.add(roomCore);

  const roofGeo = new THREE.BoxGeometry(0.56, 0.035, 0.38);
  disposables.push(roofGeo);
  const roof = new THREE.Mesh(roofGeo, materials.thatchRoofMat);
  roof.position.set(-0.04, 0.25, -0.08);
  roof.castShadow = !isMobile;
  root.add(roof);

  const screenGeo = new THREE.BoxGeometry(0.015, 0.17, 0.24);
  disposables.push(screenGeo);
  const screen = new THREE.Mesh(screenGeo, materials.teakMat);
  screen.position.set(-0.25, 0.15, -0.08);
  root.add(screen);

  const loungerGeo = new THREE.BoxGeometry(0.06, 0.02, 0.12);
  disposables.push(loungerGeo);
  [-0.14, -0.04].forEach((lx) => {
    const lounger = new THREE.Mesh(loungerGeo, materials.teakMat);
    lounger.position.set(lx, 0.08, 0.02);
    root.add(lounger);
  });

  const tubGeo = new THREE.CylinderGeometry(0.045, 0.038, 0.05, 12);
  disposables.push(tubGeo);
  const tub = new THREE.Mesh(tubGeo, materials.basaltMat);
  tub.position.set(0.22, 0.08, -0.02);
  root.add(tub);

  return root;
}

export function buildRiverbankVilla(
  materials: SanctuaryMaterials,
  disposables: (THREE.BufferGeometry | THREE.Material)[],
  isMobile: boolean
): THREE.Group {
  const root = new THREE.Group();

  const lowerPlinthGeo = new THREE.BoxGeometry(0.82, 0.09, 0.54);
  const upperPlinthGeo = new THREE.BoxGeometry(0.72, 0.08, 0.44);
  disposables.push(lowerPlinthGeo, upperPlinthGeo);

  const lowerPlinth = new THREE.Mesh(lowerPlinthGeo, materials.basaltMat);
  lowerPlinth.position.set(0, 0.04, 0.02);
  lowerPlinth.receiveShadow = !isMobile;
  root.add(lowerPlinth);

  const upperPlinth = new THREE.Mesh(upperPlinthGeo, materials.basaltMat);
  upperPlinth.position.set(-0.02, 0.11, -0.04);
  root.add(upperPlinth);

  const suiteGeo = new THREE.BoxGeometry(0.3, 0.16, 0.24);
  disposables.push(suiteGeo);
  const suite = new THREE.Mesh(suiteGeo, materials.warmInteriorMat);
  suite.position.set(-0.2, 0.22, -0.06);
  root.add(suite);

  const suiteGlass = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.17, 0.26),
    materials.glassMat
  );
  suiteGlass.position.copy(suite.position);
  root.add(suiteGlass);

  const suiteRoofGeo = new THREE.ConeGeometry(0.28, 0.16, 4);
  suiteRoofGeo.rotateY(Math.PI / 4);
  disposables.push(suiteRoofGeo);
  const suiteRoof = new THREE.Mesh(suiteRoofGeo, materials.thatchRoofMat);
  suiteRoof.position.set(-0.2, 0.36, -0.06);
  suiteRoof.castShadow = !isMobile;
  root.add(suiteRoof);

  const baleGeo = new THREE.BoxGeometry(0.28, 0.14, 0.22);
  disposables.push(baleGeo);
  const bale = new THREE.Mesh(baleGeo, materials.warmInteriorMat);
  bale.position.set(0.18, 0.21, -0.06);
  root.add(bale);

  const baleRoofGeo = new THREE.ConeGeometry(0.26, 0.15, 4);
  baleRoofGeo.rotateY(Math.PI / 4);
  disposables.push(baleRoofGeo);
  const baleRoof = new THREE.Mesh(baleRoofGeo, materials.thatchRoofMat);
  baleRoof.position.set(0.18, 0.34, -0.06);
  baleRoof.castShadow = !isMobile;
  root.add(baleRoof);

  const breezewayRoofGeo = new THREE.BoxGeometry(0.16, 0.025, 0.12);
  disposables.push(breezewayRoofGeo);
  const breezewayRoof = new THREE.Mesh(breezewayRoofGeo, materials.teakMat);
  breezewayRoof.position.set(-0.01, 0.27, -0.06);
  root.add(breezewayRoof);

  const poolGeo = new THREE.BoxGeometry(0.68, 0.04, 0.15);
  const poolWaterGeo = new THREE.BoxGeometry(0.62, 0.03, 0.11);
  disposables.push(poolGeo, poolWaterGeo);

  const poolCoping = new THREE.Mesh(poolGeo, materials.basaltMat);
  poolCoping.position.set(0.01, 0.09, 0.18);
  root.add(poolCoping);

  const poolWater = new THREE.Mesh(poolWaterGeo, materials.poolWaterMat);
  poolWater.position.set(0.01, 0.1, 0.18);
  root.add(poolWater);

  const stoneGeo = new THREE.BoxGeometry(0.06, 0.018, 0.06);
  disposables.push(stoneGeo);
  [-0.12, 0, 0.12].forEach((sx) => {
    const stone = new THREE.Mesh(stoneGeo, materials.basaltMat);
    stone.position.set(sx, 0.11, 0.18);
    root.add(stone);
  });

  const shalaDeckGeo = new THREE.BoxGeometry(0.18, 0.03, 0.18);
  disposables.push(shalaDeckGeo);
  const shalaDeck = new THREE.Mesh(shalaDeckGeo, materials.teakMat);
  shalaDeck.position.set(0.35, 0.06, 0.14);
  root.add(shalaDeck);

  return root;
}

export function buildGrandRidgeVilla(
  materials: SanctuaryMaterials,
  disposables: (THREE.BufferGeometry | THREE.Material)[],
  isMobile: boolean
): THREE.Group {
  const root = new THREE.Group();

  const terrace1Geo = new THREE.BoxGeometry(0.96, 0.11, 0.62);
  const terrace2Geo = new THREE.BoxGeometry(0.78, 0.09, 0.48);
  disposables.push(terrace1Geo, terrace2Geo);

  const terrace1 = new THREE.Mesh(terrace1Geo, materials.basaltMat);
  terrace1.position.set(0, 0.05, 0.04);
  terrace1.receiveShadow = !isMobile;
  root.add(terrace1);

  const terrace2 = new THREE.Mesh(terrace2Geo, materials.teakMat);
  terrace2.position.set(-0.06, 0.14, -0.04);
  root.add(terrace2);

  const mainPavilionGeo = new THREE.BoxGeometry(0.42, 0.19, 0.28);
  disposables.push(mainPavilionGeo);
  const mainPavilion = new THREE.Mesh(
    mainPavilionGeo,
    materials.warmInteriorMat
  );
  mainPavilion.position.set(0.04, 0.24, -0.06);
  root.add(mainPavilion);

  const mainGlass = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.2, 0.3),
    materials.glassMat
  );
  mainGlass.position.copy(mainPavilion.position);
  root.add(mainGlass);

  const grandRoofGeo = new THREE.BoxGeometry(0.58, 0.04, 0.4);
  disposables.push(grandRoofGeo);
  const grandRoof = new THREE.Mesh(grandRoofGeo, materials.thatchRoofMat);
  grandRoof.position.set(0.04, 0.35, -0.06);
  grandRoof.rotation.z = -0.04;
  grandRoof.castShadow = !isMobile;
  root.add(grandRoof);

  const masterWingGeo = new THREE.BoxGeometry(0.26, 0.16, 0.22);
  disposables.push(masterWingGeo);
  const masterWing = new THREE.Mesh(
    masterWingGeo,
    materials.warmInteriorMat
  );
  masterWing.position.set(-0.32, 0.22, -0.04);
  root.add(masterWing);

  const masterRoofGeo = new THREE.BoxGeometry(0.34, 0.035, 0.28);
  disposables.push(masterRoofGeo);
  const masterRoof = new THREE.Mesh(masterRoofGeo, materials.thatchRoofMat);
  masterRoof.position.set(-0.32, 0.31, -0.04);
  masterRoof.castShadow = !isMobile;
  root.add(masterRoof);

  const lapPoolCopingGeo = new THREE.BoxGeometry(0.24, 0.05, 0.72);
  const lapPoolWaterGeo = new THREE.BoxGeometry(0.18, 0.04, 0.66);
  disposables.push(lapPoolCopingGeo, lapPoolWaterGeo);

  const lapPoolCoping = new THREE.Mesh(lapPoolCopingGeo, materials.basaltMat);
  lapPoolCoping.position.set(0.32, 0.12, 0.16);
  lapPoolCoping.castShadow = !isMobile;
  root.add(lapPoolCoping);

  const lapPoolWater = new THREE.Mesh(lapPoolWaterGeo, materials.poolWaterMat);
  lapPoolWater.position.set(0.32, 0.13, 0.16);
  root.add(lapPoolWater);

  const firePitDeckGeo = new THREE.BoxGeometry(0.24, 0.04, 0.24);
  disposables.push(firePitDeckGeo);
  const firePitDeck = new THREE.Mesh(firePitDeckGeo, materials.teakMat);
  firePitDeck.position.set(-0.16, 0.11, 0.22);
  root.add(firePitDeck);

  const fireEmberGeo = new THREE.CylinderGeometry(0.035, 0.03, 0.02, 8);
  disposables.push(fireEmberGeo);
  const fireEmberMat = new THREE.MeshBasicMaterial({ color: 0xff6b35 });
  disposables.push(fireEmberMat);
  const fireEmber = new THREE.Mesh(fireEmberGeo, fireEmberMat);
  fireEmber.position.set(-0.16, 0.14, 0.22);
  root.add(fireEmber);

  const bridgeGeo = new THREE.BoxGeometry(0.14, 0.02, 0.08);
  disposables.push(bridgeGeo);
  const bridge = new THREE.Mesh(bridgeGeo, materials.teakMat);
  bridge.position.set(-0.16, 0.16, -0.05);
  root.add(bridge);

  return root;
}

export function buildVillaCompound(
  node: VillaNodeConfig,
  materials: SanctuaryMaterials,
  disposables: (THREE.BufferGeometry | THREE.Material)[],
  isMobile: boolean,
  initialActiveId: string
): {
  group: THREE.Group;
  hitBox: THREE.Mesh;
  ringMat: THREE.MeshBasicMaterial;
  villaModel: THREE.Group;
} {
  const group = new THREE.Group();
  group.position.set(...node.position);

  let villaModel: THREE.Group;
  if (node.id === "canopy-pool-villa") {
    villaModel = buildCanopyVilla(materials, disposables, isMobile);
  } else if (node.id === "riverbank-sanctuary") {
    villaModel = buildRiverbankVilla(materials, disposables, isMobile);
  } else {
    villaModel = buildGrandRidgeVilla(materials, disposables, isMobile);
  }
  group.add(villaModel);

  const ringGeo = new THREE.RingGeometry(0.48, 0.52, 36);
  ringGeo.rotateX(-Math.PI / 2);
  disposables.push(ringGeo);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xc57d65,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: node.id === initialActiveId ? 0.95 : 0.25,
  });
  disposables.push(ringMat);
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.y = 0.02;
  group.add(ring);

  const linePoints = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0.85, 0),
  ];
  const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
  disposables.push(lineGeo);
  const lineMat = new THREE.LineBasicMaterial({
    color: 0xc57d65,
    transparent: true,
    opacity: 0.65,
  });
  disposables.push(lineMat);
  const datumLine = new THREE.Line(lineGeo, lineMat);
  group.add(datumLine);

  const hitBoxGeo = new THREE.BoxGeometry(0.95, 0.65, 0.85);
  disposables.push(hitBoxGeo);
  const hitBoxMat = new THREE.MeshBasicMaterial({
    visible: false,
  });
  disposables.push(hitBoxMat);
  const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
  hitBox.position.y = 0.25;
  hitBox.userData = { villaId: node.id };
  group.add(hitBox);

  group.userData = { ringMat, ring, villaModel };

  return { group, hitBox, ringMat, villaModel };
}
