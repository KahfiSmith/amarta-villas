import * as THREE from "three";
import { SanctuaryMaterials } from "./materials";

export function computeGorgeElevation(x: number, z: number): number {
  const riverCurve = Math.sin(z * 0.65) * 0.45;
  const distFromRiver = Math.abs(x - riverCurve);
  const gorgeWall = Math.pow(Math.min(distFromRiver / 2.8, 1.25), 1.5) * 1.25;
  const ridgeUndulation =
    Math.sin(x * 1.4 + z * 0.9) * 0.14 +
    Math.cos(x * 2.2 - z * 1.3) * 0.08;
  const terraceStep = Math.round((gorgeWall + ridgeUndulation) * 8) / 8;
  return gorgeWall * 0.65 + terraceStep * 0.35 - 0.42;
}

export function createPalmTree(
  height: number,
  leanAngleX: number,
  leanAngleZ: number,
  scale = 1,
  materials: SanctuaryMaterials,
  disposables: (THREE.BufferGeometry | THREE.Material)[],
  isMobile: boolean
): THREE.Group {
  const treeGroup = new THREE.Group();

  const trunkSegments = 5;
  const segH = height / trunkSegments;
  let currX = 0;
  let currZ = 0;

  for (let s = 0; s < trunkSegments; s++) {
    const radiusBottom = (0.045 - s * 0.005) * scale;
    const radiusTop = (0.04 - s * 0.005) * scale;
    const segGeo = new THREE.CylinderGeometry(radiusTop, radiusBottom, segH, 7);
    disposables.push(segGeo);

    const segMesh = new THREE.Mesh(segGeo, materials.palmTrunkMat);
    segMesh.castShadow = !isMobile;
    segMesh.position.set(currX, s * segH + segH / 2, currZ);
    segMesh.rotation.x = leanAngleX * (s / trunkSegments);
    segMesh.rotation.z = leanAngleZ * (s / trunkSegments);
    treeGroup.add(segMesh);

    currX += Math.sin(leanAngleZ) * segH * 0.4;
    currZ += Math.sin(leanAngleX) * segH * 0.4;
  }

  const crownY = height * 0.98;
  const frondCount = 7;
  for (let f = 0; f < frondCount; f++) {
    const frondAngle = (f / frondCount) * Math.PI * 2;
    const frondGeo = new THREE.PlaneGeometry(0.18 * scale, 0.65 * scale, 3, 4);
    disposables.push(frondGeo);

    const fPos = frondGeo.attributes.position;
    for (let p = 0; p < fPos.count; p++) {
      const py = fPos.getY(p);
      const distFromBase = py + (0.65 * scale) / 2;
      fPos.setZ(p, -Math.pow(distFromBase, 1.8) * 0.55);
    }
    frondGeo.computeVertexNormals();

    const frondMesh = new THREE.Mesh(frondGeo, materials.foliageMat);
    frondMesh.position.set(currX, crownY, currZ);
    frondMesh.rotation.y = frondAngle;
    frondMesh.rotation.x = Math.PI / 3;
    frondMesh.castShadow = !isMobile;
    treeGroup.add(frondMesh);
  }

  return treeGroup;
}

export interface GorgeLandscapeResult {
  mistGeo: THREE.BufferGeometry;
  mistCount: number;
  mistBaseY: Float32Array;
  fireflyGeo: THREE.BufferGeometry;
  fireflyCount: number;
  fireflyBaseY: Float32Array;
}

export function buildGorgeLandscape(
  worldGroup: THREE.Group,
  materials: SanctuaryMaterials,
  disposables: (THREE.BufferGeometry | THREE.Material)[],
  isMobile: boolean,
  mistTexture: THREE.CanvasTexture | null
): GorgeLandscapeResult {
  const segments = isMobile ? 44 : 64;
  const terrainGeo = new THREE.PlaneGeometry(5.8, 5.8, segments, segments);
  terrainGeo.rotateX(-Math.PI / 2);
  const posAttr = terrainGeo.attributes.position;
  const colors: number[] = [];
  const colorLow = new THREE.Color(0x1e1c19);
  const colorMid = new THREE.Color(0x35302a);
  const colorHigh = new THREE.Color(0x6e4838);

  for (let i = 0; i < posAttr.count; i++) {
    const vx = posAttr.getX(i);
    const vz = posAttr.getZ(i);
    const vy = computeGorgeElevation(vx, vz);
    posAttr.setY(i, vy);

    const normalizedH = THREE.MathUtils.clamp((vy + 0.45) / 1.4, 0, 1);
    const vertexColor = colorLow
      .clone()
      .lerp(colorMid, Math.min(normalizedH * 1.35, 1))
      .lerp(colorHigh, Math.max(0, (normalizedH - 0.5) * 1.5));
    colors.push(vertexColor.r, vertexColor.g, vertexColor.b);
  }
  terrainGeo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  terrainGeo.computeVertexNormals();

  const terrainMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.9,
    metalness: 0.08,
    flatShading: true,
  });
  const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
  terrainMesh.receiveShadow = !isMobile;
  worldGroup.add(terrainMesh);

  const wireGeo = terrainGeo.clone();
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xc57d65,
    wireframe: true,
    transparent: true,
    opacity: 0.14,
  });
  const wireMesh = new THREE.Mesh(wireGeo, wireMat);
  wireMesh.position.y = 0.005;
  worldGroup.add(wireMesh);

  const riverGeo = new THREE.PlaneGeometry(
    1.18,
    5.8,
    isMobile ? 18 : 28,
    isMobile ? 36 : 56
  );
  riverGeo.rotateX(-Math.PI / 2);
  const riverPos = riverGeo.attributes.position;
  for (let i = 0; i < riverPos.count; i++) {
    const rx = riverPos.getX(i);
    const rz = riverPos.getZ(i);
    const curveOffset = Math.sin(rz * 0.65) * 0.45;
    riverPos.setX(i, rx * 0.52 + curveOffset);
    riverPos.setY(i, -0.34 + Math.sin(rz * 2.6 + rx * 3.2) * 0.012);
  }
  riverGeo.computeVertexNormals();

  const riverMat = new THREE.MeshStandardMaterial({
    color: 0x374a38,
    emissive: 0x1b281d,
    roughness: 0.22,
    metalness: 0.6,
    transparent: true,
    opacity: 0.9,
  });
  const riverMesh = new THREE.Mesh(riverGeo, riverMat);
  worldGroup.add(riverMesh);

  const boulderGeo = new THREE.DodecahedronGeometry(0.12, 1);
  const boulderPositions: [number, number, number][] = [
    [-0.1, -0.33, 1.2],
    [0.25, -0.32, 0.4],
    [0.08, -0.33, -0.3],
    [-0.22, -0.32, -1.1],
    [0.35, -0.33, -1.8],
    [0.12, -0.33, 1.9],
    [-0.28, -0.32, 0.8],
  ];

  boulderPositions.forEach(([bx, by, bz]) => {
    const boulder = new THREE.Mesh(boulderGeo, materials.basaltMat);
    boulder.position.set(bx, by, bz);
    boulder.scale.set(
      0.8 + Math.random() * 0.6,
      0.6 + Math.random() * 0.4,
      0.8 + Math.random() * 0.6
    );
    boulder.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    worldGroup.add(boulder);
  });

  const palmPlacements: [number, number, number, number, number, number][] = [
    [-1.9, 0.9, 0.72, 0.15, -0.25, 1.05],
    [-1.15, 0.85, 0.64, -0.1, -0.15, 0.9],
    [-1.8, -0.2, 0.78, 0.2, -0.18, 1.15],
    [-0.7, 1.1, 0.58, 0.12, 0.22, 0.85],
    [-0.45, -0.8, 0.65, -0.15, -0.1, 0.95],
    [0.6, 1.35, 0.68, 0.15, -0.2, 1.0],
    [0.85, 0.5, 0.75, -0.1, 0.15, 1.05],
    [1.1, -0.95, 0.8, 0.2, -0.1, 1.1],
    [2.1, 0.2, 0.85, -0.18, 0.22, 1.2],
    [1.95, -1.2, 0.82, 0.12, -0.15, 1.1],
    [0.05, -1.6, 0.55, 0.1, 0.1, 0.85],
    [-1.3, -1.4, 0.68, -0.2, 0.15, 0.95],
  ];

  palmPlacements.forEach(([px, pz, h, lx, lz, scale]) => {
    const py = computeGorgeElevation(px, pz);
    const palm = createPalmTree(
      h,
      lx,
      lz,
      scale,
      materials,
      disposables,
      isMobile
    );
    palm.position.set(px, py, pz);
    worldGroup.add(palm);
  });

  const bushGeo = new THREE.IcosahedronGeometry(0.14, 1);
  disposables.push(bushGeo);
  const bushPositions: [number, number][] = [
    [-1.6, 0.6],
    [-1.25, 0.1],
    [-0.9, 0.7],
    [-0.1, 0.8],
    [0.45, 0.9],
    [0.7, 0.1],
    [1.3, -0.1],
    [1.7, 0.4],
    [1.9, -0.7],
    [0.5, -1.1],
    [-0.8, -0.9],
    [-1.5, -0.8],
  ];

  bushPositions.forEach(([bx, bz]) => {
    const by = computeGorgeElevation(bx, bz);
    const bush = new THREE.Mesh(bushGeo, materials.foliageMat);
    bush.position.set(bx, by + 0.05, bz);
    bush.scale.set(
      0.8 + Math.random() * 0.5,
      0.5 + Math.random() * 0.3,
      0.8 + Math.random() * 0.5
    );
    bush.rotation.set(0, Math.random() * Math.PI, 0);
    worldGroup.add(bush);
  });

  const mistCount = isMobile ? 36 : 96;
  const mistPositions = new Float32Array(mistCount * 3);
  const mistBaseY = new Float32Array(mistCount);
  for (let i = 0; i < mistCount; i++) {
    const mz = (Math.random() - 0.5) * 5.0;
    const riverCenter = Math.sin(mz * 0.65) * 0.45;
    const mx = riverCenter + (Math.random() - 0.5) * 2.4;
    const my = -0.22 + Math.random() * 0.75;
    mistPositions[i * 3] = mx;
    mistPositions[i * 3 + 1] = my;
    mistPositions[i * 3 + 2] = mz;
    mistBaseY[i] = my;
  }
  const mistGeo = new THREE.BufferGeometry();
  mistGeo.setAttribute("position", new THREE.BufferAttribute(mistPositions, 3));
  const mistMat = new THREE.PointsMaterial({
    size: isMobile ? 0.38 : 0.48,
    map: mistTexture ?? undefined,
    transparent: true,
    opacity: 0.46,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const mistPoints = new THREE.Points(mistGeo, mistMat);
  worldGroup.add(mistPoints);

  const fireflyCount = isMobile ? 18 : 42;
  const fireflyPositions = new Float32Array(fireflyCount * 3);
  const fireflyBaseY = new Float32Array(fireflyCount);
  for (let i = 0; i < fireflyCount; i++) {
    fireflyPositions[i * 3] = (Math.random() - 0.5) * 4.4;
    const fy = 0.1 + Math.random() * 1.2;
    fireflyPositions[i * 3 + 1] = fy;
    fireflyPositions[i * 3 + 2] = (Math.random() - 0.5) * 4.4;
    fireflyBaseY[i] = fy;
  }
  const fireflyGeo = new THREE.BufferGeometry();
  fireflyGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(fireflyPositions, 3)
  );
  const fireflyMat = new THREE.PointsMaterial({
    size: 0.07,
    color: 0xffd17a,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const fireflyPoints = new THREE.Points(fireflyGeo, fireflyMat);
  worldGroup.add(fireflyPoints);

  disposables.push(
    terrainGeo,
    terrainMat,
    wireGeo,
    wireMat,
    riverGeo,
    riverMat,
    boulderGeo,
    mistGeo,
    mistMat,
    fireflyGeo,
    fireflyMat
  );

  return {
    mistGeo,
    mistCount,
    mistBaseY,
    fireflyGeo,
    fireflyCount,
    fireflyBaseY,
  };
}
