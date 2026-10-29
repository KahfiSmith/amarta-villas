"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import * as THREE from "three";
import gsap from "gsap";
import { Pause, Play, RotateCcw } from "lucide-react";
import { VILLA_RESIDENCES } from "@/data/villa";

interface Sanctuary3DSceneProps {
  activeVillaId: string;
  onSelectVilla?: (villaId: string) => void;
}

interface VillaNodeConfig {
  id: string;
  label: string;
  elevationLabel: string;
  position: [number, number, number];
  cameraPos: [number, number, number];
  lookAt: [number, number, number];
}

const VILLA_NODES: VillaNodeConfig[] = [
  {
    id: "canopy-pool-villa",
    label: "01. Canopy",
    elevationLabel: "248m ASL • Upper Canopy Cantilever",
    position: [-1.45, 0.42, 0.35],
    cameraPos: [-2.6, 2.1, 3.6],
    lookAt: [-0.8, 0.2, 0.1],
  },
  {
    id: "riverbank-sanctuary",
    label: "02. Riverbank",
    elevationLabel: "212m ASL • Ayung Gorge Waterfront",
    position: [0.15, -0.22, 0.85],
    cameraPos: [0.4, 1.65, 3.8],
    lookAt: [0.1, -0.15, 0.4],
  },
  {
    id: "grand-ridge-estate",
    label: "03. Grand Ridge",
    elevationLabel: "276m ASL • Crest Panorama Axis",
    position: [1.55, 0.78, -0.45],
    cameraPos: [2.8, 2.4, 3.4],
    lookAt: [0.9, 0.45, -0.2],
  },
];

function checkWebGLSupport(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

function createMistTexture(): THREE.CanvasTexture | null {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const grad = ctx.createRadialGradient(16, 16, 1, 16, 16, 16);
  grad.addColorStop(0, "rgba(247, 244, 238, 0.55)");
  grad.addColorStop(0.45, "rgba(215, 208, 196, 0.22)");
  grad.addColorStop(1, "rgba(24, 22, 20, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 32, 32);
  return new THREE.CanvasTexture(canvas);
}

function computeGorgeElevation(x: number, z: number): number {
  const riverCurve = Math.sin(z * 0.65) * 0.45;
  const distFromRiver = Math.abs(x - riverCurve);
  const gorgeWall = Math.pow(Math.min(distFromRiver / 2.8, 1.2), 1.45) * 1.15;
  const ridgeUndulation =
    Math.sin(x * 1.3 + z * 0.9) * 0.14 +
    Math.cos(x * 2.1 - z * 1.4) * 0.08;
  const terraceStep = Math.round((gorgeWall + ridgeUndulation) * 7) / 7;
  return gorgeWall * 0.65 + terraceStep * 0.35 - 0.38;
}

export default function Sanctuary3DScene({
  activeVillaId,
  onSelectVilla,
}: Sanctuary3DSceneProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglSupported] = useState<boolean>(() => checkWebGLSupport());
  const [isPaused, setIsPaused] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );
  const [overviewMode, setOverviewMode] = useState(false);
  const isPausedRef = useRef(isPaused);
  const initialVillaIdRef = useRef(activeVillaId);

  const sceneObjectsRef = useRef<{
    camera: THREE.PerspectiveCamera;
    targetLookAt: THREE.Vector3;
    villaGroups: Record<string, THREE.Group>;
    monolithGroup: THREE.Group;
  } | null>(null);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    if (!webglSupported) return;
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 520;
    const height = container.clientHeight || 620;
    const isMobile = width < 640;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x181614);
    scene.fog = new THREE.FogExp2(0x181614, 0.105);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(-2.4, 2.15, 4.1);
    const targetLookAt = new THREE.Vector3(0, 0.1, 0);
    camera.lookAt(targetLookAt);

    renderer.setSize(width, height);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2)
    );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xf7f4ee, 0.7);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffdfb8, 1.9);
    sunLight.position.set(5, 8, 4);
    scene.add(sunLight);

    const terracottaRim = new THREE.PointLight(0xc57d65, 2.4, 9);
    terracottaRim.position.set(-2.5, 2.2, -1.5);
    scene.add(terracottaRim);

    const riverMistLight = new THREE.PointLight(0x5f6e56, 1.4, 7);
    riverMistLight.position.set(0.2, -0.5, 1.2);
    scene.add(riverMistLight);

    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    const segments = isMobile ? 36 : 56;
    const terrainGeo = new THREE.PlaneGeometry(5.6, 5.6, segments, segments);
    terrainGeo.rotateX(-Math.PI / 2);
    const posAttr = terrainGeo.attributes.position;
    const colors: number[] = [];
    const colorLow = new THREE.Color(0x211e1b);
    const colorMid = new THREE.Color(0x3a342e);
    const colorHigh = new THREE.Color(0x7d4c38);

    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vz = posAttr.getZ(i);
      const vy = computeGorgeElevation(vx, vz);
      posAttr.setY(i, vy);

      const normalizedH = THREE.MathUtils.clamp((vy + 0.45) / 1.35, 0, 1);
      const vertexColor = colorLow
        .clone()
        .lerp(colorMid, Math.min(normalizedH * 1.4, 1))
        .lerp(colorHigh, Math.max(0, (normalizedH - 0.55) * 1.6));
      colors.push(vertexColor.r, vertexColor.g, vertexColor.b);
    }
    terrainGeo.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.86,
      metalness: 0.14,
      flatShading: true,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    worldGroup.add(terrainMesh);

    const wireGeo = terrainGeo.clone();
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xc57d65,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    wireMesh.position.y = 0.006;
    worldGroup.add(wireMesh);

    const riverGeo = new THREE.PlaneGeometry(
      1.15,
      5.6,
      isMobile ? 16 : 24,
      isMobile ? 32 : 48
    );
    riverGeo.rotateX(-Math.PI / 2);
    const riverPos = riverGeo.attributes.position;
    for (let i = 0; i < riverPos.count; i++) {
      const rx = riverPos.getX(i);
      const rz = riverPos.getZ(i);
      const curveOffset = Math.sin(rz * 0.65) * 0.45;
      riverPos.setX(i, rx * 0.55 + curveOffset);
      riverPos.setY(i, -0.32 + Math.sin(rz * 2.5 + rx * 3) * 0.012);
    }
    riverGeo.computeVertexNormals();

    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x3d4838,
      emissive: 0x1c2419,
      roughness: 0.2,
      metalness: 0.65,
      transparent: true,
      opacity: 0.88,
    });
    const riverMesh = new THREE.Mesh(riverGeo, riverMat);
    worldGroup.add(riverMesh);

    // Subtle Valley Rainforest Mist Particles over the Ayung Gorge
    const mistCount = isMobile ? 32 : 84;
    const mistPositions = new Float32Array(mistCount * 3);
    const mistBaseY = new Float32Array(mistCount);
    for (let i = 0; i < mistCount; i++) {
      const mz = (Math.random() - 0.5) * 4.8;
      const riverCenter = Math.sin(mz * 0.65) * 0.45;
      const mx = riverCenter + (Math.random() - 0.5) * 2.2;
      const my = -0.18 + Math.random() * 0.65;
      mistPositions[i * 3] = mx;
      mistPositions[i * 3 + 1] = my;
      mistPositions[i * 3 + 2] = mz;
      mistBaseY[i] = my;
    }
    const mistGeo = new THREE.BufferGeometry();
    mistGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(mistPositions, 3)
    );
    const mistTexture = createMistTexture();
    const mistMat = new THREE.PointsMaterial({
      size: isMobile ? 0.28 : 0.34,
      map: mistTexture ?? undefined,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const mistPoints = new THREE.Points(mistGeo, mistMat);
    worldGroup.add(mistPoints);

    const villaGroups: Record<string, THREE.Group> = {};
    const disposableGeometries: THREE.BufferGeometry[] = [
      terrainGeo,
      wireGeo,
      riverGeo,
      mistGeo,
    ];
    const disposableMaterials: THREE.Material[] = [
      terrainMat,
      wireMat,
      riverMat,
      mistMat,
    ];

    VILLA_NODES.forEach((node, index) => {
      const group = new THREE.Group();
      group.position.set(...node.position);

      const plinthGeo = new THREE.BoxGeometry(
        0.58 + index * 0.1,
        0.16,
        0.44 + index * 0.06
      );
      const plinthMat = new THREE.MeshStandardMaterial({
        color: 0x2c2824,
        roughness: 0.7,
        metalness: 0.2,
      });
      const plinth = new THREE.Mesh(plinthGeo, plinthMat);
      plinth.position.y = 0.08;
      group.add(plinth);

      const pavilionGeo = new THREE.BoxGeometry(
        0.46 + index * 0.08,
        0.14,
        0.34 + index * 0.05
      );
      const pavilionMat = new THREE.MeshStandardMaterial({
        color: 0xf7f4ee,
        emissive: 0xa2583e,
        emissiveIntensity: node.id === initialVillaIdRef.current ? 0.55 : 0.12,
        roughness: 0.35,
        metalness: 0.3,
      });
      const pavilion = new THREE.Mesh(pavilionGeo, pavilionMat);
      pavilion.position.set(0.04, 0.23, 0.02);
      group.add(pavilion);

      const poolGeo = new THREE.BoxGeometry(0.42, 0.03, 0.14);
      const poolMat = new THREE.MeshStandardMaterial({
        color: 0x7ab3a8,
        emissive: 0x3b6e65,
        emissiveIntensity: 0.45,
        roughness: 0.1,
        metalness: 0.8,
      });
      const pool = new THREE.Mesh(poolGeo, poolMat);
      pool.position.set(0, 0.17, 0.24);
      group.add(pool);

      const ringGeo = new THREE.RingGeometry(0.34, 0.38, 32);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xc57d65,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: node.id === initialVillaIdRef.current ? 0.95 : 0.28,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = 0.02;
      group.add(ring);

      const linePoints = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0.68, 0),
      ];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0xc57d65,
        transparent: true,
        opacity: 0.75,
      });
      const datumLine = new THREE.Line(lineGeo, lineMat);
      group.add(datumLine);

      group.userData = { pavilionMat, ringMat, ring };
      villaGroups[node.id] = group;
      worldGroup.add(group);

      disposableGeometries.push(
        plinthGeo,
        pavilionGeo,
        poolGeo,
        ringGeo,
        lineGeo
      );
      disposableMaterials.push(
        plinthMat,
        pavilionMat,
        poolMat,
        ringMat,
        lineMat
      );
    });

    const compassGroup = new THREE.Group();
    const outerRingGeo = new THREE.RingGeometry(2.38, 2.4, 64);
    outerRingGeo.rotateX(-Math.PI / 2);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x8a847a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.position.y = 0.65;
    compassGroup.add(outerRing);
    worldGroup.add(compassGroup);

    disposableGeometries.push(outerRingGeo);
    disposableMaterials.push(outerRingMat);

    sceneObjectsRef.current = {
      camera,
      targetLookAt,
      villaGroups,
      monolithGroup: worldGroup,
    };

    let pointerX = 0;
    let pointerY = 0;
    let isDragging = false;
    let dragStartX = 0;
    let userYawOffset = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      pointerX = nx;
      pointerY = ny;

      if (isDragging) {
        const deltaX = e.clientX - dragStartX;
        userYawOffset += deltaX * 0.005;
        dragStartX = e.clientX;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      dragStartX = e.clientX;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);

    let isInViewport = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewport = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 520;
      const newH = container.clientHeight || 620;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    let reqId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (!isInViewport) return;

      const elapsed = clock.getElapsedTime();

      if (!isPausedRef.current) {
        worldGroup.rotation.y = THREE.MathUtils.lerp(
          worldGroup.rotation.y,
          userYawOffset + pointerX * 0.28 + Math.sin(elapsed * 0.25) * 0.08,
          0.05
        );
        worldGroup.rotation.x = THREE.MathUtils.lerp(
          worldGroup.rotation.x,
          pointerY * 0.1,
          0.05
        );
        compassGroup.rotation.y = elapsed * 0.06;

        // Drift valley mist gently along the gorge contour
        const mistAttr = mistGeo.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < mistCount; i++) {
          mistAttr.setY(
            i,
            mistBaseY[i] + Math.sin(elapsed * 0.55 + i * 0.7) * 0.06
          );
        }
        mistAttr.needsUpdate = true;

        Object.entries(villaGroups).forEach(([, grp]) => {
          const ring = grp.userData.ring as THREE.Mesh;
          if (ring) {
            const scale = 1 + Math.sin(elapsed * 2.2) * 0.05;
            ring.scale.set(scale, scale, 1);
          }
        });
      }

      camera.lookAt(targetLookAt);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointerup", handlePointerUp);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerdown", handlePointerDown);
      if (mistTexture) mistTexture.dispose();
      disposableGeometries.forEach((g) => g.dispose());
      disposableMaterials.forEach((m) => m.dispose());
      renderer.dispose();
    };
  }, [webglSupported]);

  useEffect(() => {
    const ctx = sceneObjectsRef.current;
    if (!ctx) return;

    const targetNode =
      VILLA_NODES.find((n) => n.id === activeVillaId) || VILLA_NODES[0];

    const destCam = overviewMode ? [0, 3.25, 4.75] : targetNode.cameraPos;
    const destLook = overviewMode ? [0, 0.05, 0] : targetNode.lookAt;

    gsap.to(ctx.camera.position, {
      x: destCam[0],
      y: destCam[1],
      z: destCam[2],
      duration: 1.35,
      ease: "power3.out",
      overwrite: "auto",
    });

    gsap.to(ctx.targetLookAt, {
      x: destLook[0],
      y: destLook[1],
      z: destLook[2],
      duration: 1.35,
      ease: "power3.out",
      overwrite: "auto",
    });

    Object.entries(ctx.villaGroups).forEach(([id, group]) => {
      const isSelected = id === activeVillaId && !overviewMode;
      const { pavilionMat, ringMat } = group.userData as {
        pavilionMat: THREE.MeshStandardMaterial;
        ringMat: THREE.MeshBasicMaterial;
      };

      gsap.to(pavilionMat, {
        emissiveIntensity: isSelected ? 0.65 : 0.14,
        duration: 0.8,
      });
      gsap.to(ringMat, {
        opacity: isSelected ? 0.95 : 0.25,
        duration: 0.8,
      });
      gsap.to(group.position, {
        y:
          (VILLA_NODES.find((n) => n.id === id)?.position[1] ?? 0) +
          (isSelected ? 0.08 : 0),
        duration: 0.9,
        ease: "power2.out",
      });
    });
  }, [activeVillaId, overviewMode]);

  const activeNode =
    VILLA_NODES.find((n) => n.id === activeVillaId) || VILLA_NODES[0];
  const fallbackVilla =
    VILLA_RESIDENCES.find((v) => v.id === activeVillaId) || VILLA_RESIDENCES[0];

  if (!webglSupported) {
    return (
      <div className="relative w-full h-full bg-[#181614] overflow-hidden">
        <Image
          src={fallbackVilla.heroImage}
          alt={`${fallbackVilla.name} architectural elevation`}
          fill
          sizes="(max-width: 1024px) 100vw, 42vw"
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#151412] via-[#151412]/35 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <div className="grid grid-cols-3 gap-1.5 bg-[#151412]/90 p-1.5 border border-white/15">
            {VILLA_NODES.map((node) => (
              <button
                key={node.id}
                type="button"
                onClick={() => onSelectVilla?.(node.id)}
                className={`min-h-[44px] px-2 text-left text-[9px] tracking-[0.15em] uppercase transition-colors focus-visible:ring-2 focus-visible:ring-[#C57D65] focus:outline-hidden ${
                  node.id === activeVillaId
                    ? "bg-[#8D4A33] text-white font-medium"
                    : "text-[#E2DDD3] hover:bg-white/10"
                }`}
              >
                {node.label}
              </button>
            ))}
          </div>
          <div className="bg-[#151412]/90 border border-white/15 p-3 text-[#F7F4EE]">
            <span className="text-[8px] tracking-[0.26em] uppercase text-[#C57D65] block">
              {activeNode.elevationLabel}
            </span>
            <p className="font-serif text-base text-white font-light">
              {fallbackVilla.name}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full select-none bg-[#181614]">
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        aria-label="Interactive 3D topographic model of AMARTA Sayan Gorge and three private pool residences"
        role="img"
      />

      {/* Top HUD Telemetry */}
      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none gap-2">
        <div className="bg-[#151412]/85 backdrop-blur-xs border border-white/15 px-3 py-2 text-[9px] tracking-[0.22em] uppercase text-[#F7F4EE]">
          <span className="text-[#C57D65] font-medium">3D Gorge Relief</span>
          <span className="hidden sm:inline mx-1.5 text-white/30">&bull;</span>
          <span className="hidden sm:inline">Drag to Orbit</span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={() => setOverviewMode((prev) => !prev)}
            aria-label="Reset 3D valley camera overview"
            className="min-h-[44px] px-3 py-2 bg-[#151412]/85 hover:bg-[#8D4A33] text-[#F7F4EE] border border-white/20 text-[9px] tracking-[0.18em] uppercase transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#C57D65] focus:outline-hidden"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#C57D65]" />
            <span>{overviewMode ? "Focus Villa" : "Valley Axis"}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            aria-label={isPaused ? "Resume 3D motion" : "Pause 3D motion"}
            className="min-h-[44px] min-w-[44px] p-2 bg-[#151412]/85 hover:bg-[#8D4A33] text-[#F7F4EE] border border-white/20 transition-colors flex items-center justify-center focus-visible:ring-2 focus-visible:ring-[#C57D65] focus:outline-hidden"
          >
            {isPaused ? (
              <Play className="w-3.5 h-3.5 text-[#C57D65]" />
            ) : (
              <Pause className="w-3.5 h-3.5 text-[#C57D65]" />
            )}
          </button>
        </div>
      </div>

      {/* Interactive 3D Node Switcher Overlay */}
      <div className="absolute bottom-4 left-4 right-4 space-y-2 pointer-events-auto">
        <div className="grid grid-cols-3 gap-1.5 bg-[#151412]/90 backdrop-blur-xs p-1.5 border border-white/15">
          {VILLA_NODES.map((node) => {
            const isSelected = node.id === activeVillaId && !overviewMode;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => {
                  setOverviewMode(false);
                  if (onSelectVilla) {
                    onSelectVilla(node.id);
                  }
                }}
                className={`min-h-[44px] py-2 px-2 text-left transition-all text-[9px] tracking-[0.15em] uppercase focus-visible:ring-2 focus-visible:ring-[#C57D65] focus:outline-hidden ${
                  isSelected
                    ? "bg-[#8D4A33] text-white font-medium"
                    : "bg-transparent text-[#E2DDD3] hover:bg-white/10"
                }`}
              >
                <span className="block truncate">{node.label}</span>
              </button>
            );
          })}
        </div>

        <div className="bg-[#151412]/90 backdrop-blur-xs border border-white/15 px-3.5 py-2.5 flex items-center justify-between text-[#F7F4EE]">
          <div>
            <span className="text-[8px] tracking-[0.26em] uppercase text-[#C57D65] block">
              {overviewMode
                ? "Full Sayan Ridge Contour • 240m Datum"
                : activeNode.elevationLabel}
            </span>
            <p className="font-serif text-sm sm:text-base text-white font-light">
              {overviewMode
                ? "Ayung River Gorge & 3 Monolith Compounds"
                : fallbackVilla.name}
            </p>
          </div>
          <span className="text-[9px] tracking-[0.2em] uppercase text-[#E2DDD3] border border-white/20 px-2 py-0.5 shrink-0">
            WebGL 3D
          </span>
        </div>
      </div>
    </div>
  );
}
