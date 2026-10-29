"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import * as THREE from "three";
import gsap from "gsap";
import { Pause, Play, RotateCcw, Sparkles } from "lucide-react";
import { VILLA_RESIDENCES } from "@/data/villa";
import { VILLA_NODES } from "./sanctuary-3d/types";
import {
  createWoodTexture,
  createStoneTexture,
  createMistTexture,
  createSanctuaryMaterials,
} from "./sanctuary-3d/materials";
import { buildGorgeLandscape } from "./sanctuary-3d/environment";
import { buildVillaCompound } from "./sanctuary-3d/villa-models";

interface Sanctuary3DSceneProps {
  activeVillaId: string;
  onSelectVilla?: (villaId: string) => void;
}

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
  const [hoveredVillaId, setHoveredVillaId] = useState<string | null>(null);
  const isPausedRef = useRef(isPaused);
  const initialVillaIdRef = useRef(activeVillaId);
  const onSelectVillaRef = useRef(onSelectVilla);

  useEffect(() => {
    onSelectVillaRef.current = onSelectVilla;
  }, [onSelectVilla]);

  const sceneObjectsRef = useRef<{
    camera: THREE.PerspectiveCamera;
    targetLookAt: THREE.Vector3;
    villaGroups: Record<string, THREE.Group>;
    villaHitBoxes: Record<string, THREE.Mesh>;
    monolithGroup: THREE.Group;
    raycaster: THREE.Raycaster;
    scene: THREE.Scene;
  } | null>(null);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    if (!webglSupported) return;
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 540;
    const height = container.clientHeight || 640;
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

    renderer.setSize(width, height);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2)
    );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = !isMobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x151412);
    scene.fog = new THREE.FogExp2(0x151412, 0.095);

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 55);
    camera.position.set(-2.6, 2.15, 3.8);
    const targetLookAt = new THREE.Vector3(-0.3, 0.15, 0.1);
    camera.lookAt(targetLookAt);

    // Textures & Materials
    const disposables: (THREE.BufferGeometry | THREE.Material)[] = [];
    const woodTexture = createWoodTexture();
    const stoneTexture = createStoneTexture();
    const mistTexture = createMistTexture();
    const materials = createSanctuaryMaterials(
      woodTexture,
      stoneTexture,
      disposables
    );

    // Cinematic Lighting
    const ambientLight = new THREE.AmbientLight(0xf2ede4, 0.72);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffe2bf, 2.1);
    sunLight.position.set(5.5, 8.5, 4.2);
    sunLight.castShadow = !isMobile;
    if (sunLight.castShadow) {
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      sunLight.shadow.camera.near = 1;
      sunLight.shadow.camera.far = 18;
      sunLight.shadow.camera.left = -4;
      sunLight.shadow.camera.right = 4;
      sunLight.shadow.camera.top = 4;
      sunLight.shadow.camera.bottom = -4;
      sunLight.shadow.bias = -0.0006;
    }
    scene.add(sunLight);

    const terracottaFill = new THREE.PointLight(0xc57d65, 2.6, 9.5);
    terracottaFill.position.set(-2.8, 2.4, -1.8);
    scene.add(terracottaFill);

    const riverValleyGlow = new THREE.PointLight(0x4e6b52, 1.8, 8.5);
    riverValleyGlow.position.set(0.2, -0.6, 1.2);
    scene.add(riverValleyGlow);

    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // Sayan Gorge Environment & Landscape
    const landscape = buildGorgeLandscape(
      worldGroup,
      materials,
      disposables,
      isMobile,
      mistTexture
    );

    // Villa Compounds
    const villaGroups: Record<string, THREE.Group> = {};
    const villaHitBoxes: Record<string, THREE.Mesh> = {};

    VILLA_NODES.forEach((node) => {
      const { group, hitBox } = buildVillaCompound(
        node,
        materials,
        disposables,
        isMobile,
        initialVillaIdRef.current
      );
      villaGroups[node.id] = group;
      villaHitBoxes[node.id] = hitBox;
      worldGroup.add(group);
    });

    // Compass Datum
    const compassGroup = new THREE.Group();
    const outerRingGeo = new THREE.RingGeometry(2.48, 2.5, 64);
    outerRingGeo.rotateX(-Math.PI / 2);
    disposables.push(outerRingGeo);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x8a847a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.26,
    });
    disposables.push(outerRingMat);
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.position.y = 0.72;
    compassGroup.add(outerRing);
    worldGroup.add(compassGroup);

    const raycaster = new THREE.Raycaster();
    sceneObjectsRef.current = {
      camera,
      targetLookAt,
      villaGroups,
      villaHitBoxes,
      monolithGroup: worldGroup,
      raycaster,
      scene,
    };

    // User Interaction Handlers
    let pointerX = 0;
    let pointerY = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let userYawOffset = 0;
    let userPitchOffset = 0;
    let hasDraggedMeaningfully = false;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      pointerX = nx;
      pointerY = ny;

      raycaster.setFromCamera(new THREE.Vector2(nx, ny), camera);
      const hitObjects = Object.values(villaHitBoxes);
      const intersects = raycaster.intersectObjects(hitObjects);

      if (intersects.length > 0) {
        const hitId = intersects[0].object.userData.villaId as string;
        container.style.cursor = "pointer";
        setHoveredVillaId(hitId);
      } else {
        container.style.cursor = isDragging ? "grabbing" : "grab";
        setHoveredVillaId(null);
      }

      if (isDragging) {
        const deltaX = e.clientX - dragStartX;
        const deltaY = e.clientY - dragStartY;
        if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
          hasDraggedMeaningfully = true;
        }
        userYawOffset += deltaX * 0.0055;
        userPitchOffset += deltaY * 0.003;
        userPitchOffset = THREE.MathUtils.clamp(userPitchOffset, -0.3, 0.4);
        dragStartX = e.clientX;
        dragStartY = e.clientY;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      hasDraggedMeaningfully = false;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      container.style.cursor = "grabbing";
    };

    const handlePointerUp = (e: PointerEvent) => {
      isDragging = false;
      container.style.cursor = "grab";

      if (!hasDraggedMeaningfully) {
        const rect = container.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(new THREE.Vector2(nx, ny), camera);
        const hitObjects = Object.values(villaHitBoxes);
        const intersects = raycaster.intersectObjects(hitObjects);

        if (intersects.length > 0) {
          const hitId = intersects[0].object.userData.villaId as string;
          onSelectVillaRef.current?.(hitId);
        }
      }
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
      const newW = container.clientWidth || 540;
      const newH = container.clientHeight || 640;
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
          userYawOffset + pointerX * 0.24 + Math.sin(elapsed * 0.22) * 0.08,
          0.05
        );
        worldGroup.rotation.x = THREE.MathUtils.lerp(
          worldGroup.rotation.x,
          userPitchOffset + pointerY * 0.1,
          0.05
        );
        compassGroup.rotation.y = elapsed * 0.05;

        const mistAttr = landscape.mistGeo.attributes
          .position as THREE.BufferAttribute;
        for (let i = 0; i < landscape.mistCount; i++) {
          mistAttr.setY(
            i,
            landscape.mistBaseY[i] + Math.sin(elapsed * 0.55 + i * 0.6) * 0.06
          );
        }
        mistAttr.needsUpdate = true;

        const fireflyAttr = landscape.fireflyGeo.attributes
          .position as THREE.BufferAttribute;
        for (let j = 0; j < landscape.fireflyCount; j++) {
          fireflyAttr.setY(
            j,
            landscape.fireflyBaseY[j] + Math.sin(elapsed * 1.2 + j * 1.5) * 0.08
          );
        }
        fireflyAttr.needsUpdate = true;

        Object.entries(villaGroups).forEach(([, grp]) => {
          const ring = grp.userData.ring as THREE.Mesh;
          if (ring) {
            const scale = 1 + Math.sin(elapsed * 2.2) * 0.04;
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
      woodTexture.dispose();
      stoneTexture.dispose();
      if (mistTexture) mistTexture.dispose();
      disposables.forEach((item) => item.dispose());
      renderer.dispose();
    };
  }, [webglSupported]);

  // Cinematic Camera Transitions
  useEffect(() => {
    const ctx = sceneObjectsRef.current;
    if (!ctx) return;

    const targetNode =
      VILLA_NODES.find((n) => n.id === activeVillaId) || VILLA_NODES[0];

    const destCam = overviewMode ? [0, 3.4, 4.8] : targetNode.cameraPos;
    const destLook = overviewMode ? [0, 0.1, 0] : targetNode.lookAt;

    gsap.to(ctx.camera.position, {
      x: destCam[0],
      y: destCam[1],
      z: destCam[2],
      duration: 1.45,
      ease: "power3.out",
      overwrite: "auto",
    });

    gsap.to(ctx.targetLookAt, {
      x: destLook[0],
      y: destLook[1],
      z: destLook[2],
      duration: 1.45,
      ease: "power3.out",
      overwrite: "auto",
    });

    Object.entries(ctx.villaGroups).forEach(([id, group]) => {
      const isSelected = id === activeVillaId && !overviewMode;
      const { ringMat, villaModel } = group.userData as {
        ringMat: THREE.MeshBasicMaterial;
        villaModel: THREE.Group;
      };

      gsap.to(ringMat, {
        opacity: isSelected ? 0.95 : 0.22,
        duration: 0.8,
      });

      gsap.to(group.position, {
        y:
          (VILLA_NODES.find((n) => n.id === id)?.position[1] ?? 0) +
          (isSelected ? 0.06 : 0),
        duration: 0.85,
        ease: "power2.out",
      });

      gsap.to(villaModel.scale, {
        x: isSelected ? 1.04 : 1,
        y: isSelected ? 1.04 : 1,
        z: isSelected ? 1.04 : 1,
        duration: 0.8,
        ease: "power2.out",
      });
    });
  }, [activeVillaId, overviewMode]);

  const activeNode =
    VILLA_NODES.find((n) => n.id === activeVillaId) || VILLA_NODES[0];
  const fallbackVilla =
    VILLA_RESIDENCES.find((v) => v.id === activeVillaId) || VILLA_RESIDENCES[0];

  const handleSelectVillaInternal = useCallback(
    (id: string) => {
      setOverviewMode(false);
      if (onSelectVilla) {
        onSelectVilla(id);
      }
    },
    [onSelectVilla]
  );

  if (!webglSupported) {
    return (
      <div className="relative w-full h-full bg-[#151412] overflow-hidden">
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
                onClick={() => handleSelectVillaInternal(node.id)}
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
    <div className="relative w-full h-full select-none bg-[#151412]">
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        aria-label="High-fidelity 3D architectural model of AMARTA Sayan Gorge and three private pool residences"
        role="img"
      />

      {/* Top Telemetry & Controls HUD */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none gap-2">
        <div className="bg-[#151412]/90 backdrop-blur-md border border-white/15 px-3 py-2 text-[8.5px] sm:text-[9px] tracking-[0.2em] uppercase text-[#F7F4EE] shadow-lg flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C57D65] animate-pulse" />
          <span className="text-[#C57D65] font-semibold">Sayan Gorge 3D</span>
          <span className="hidden sm:inline text-white/30">&bull;</span>
          <span className="hidden sm:inline text-[#E2DDD3]">
            PBR Shadow &amp; Terrain
          </span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={() => setOverviewMode((prev) => !prev)}
            aria-label="Switch between Valley Axis overview and Residence focus"
            className={`min-h-[42px] px-2.5 sm:px-3 py-1.5 border text-[8.5px] sm:text-[9px] tracking-[0.16em] uppercase transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#C57D65] focus:outline-hidden ${
              overviewMode
                ? "bg-[#8D4A33] border-[#C57D65] text-white font-medium"
                : "bg-[#151412]/90 hover:bg-[#8D4A33] text-[#F7F4EE] border-white/20"
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#C57D65]" />
            <span>{overviewMode ? "Focus Villa" : "Valley Axis"}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            aria-label={isPaused ? "Resume 3D motion" : "Pause 3D motion"}
            className="min-h-[42px] min-w-[42px] p-2 bg-[#151412]/90 hover:bg-[#8D4A33] text-[#F7F4EE] border border-white/20 transition-colors flex items-center justify-center focus-visible:ring-2 focus-visible:ring-[#C57D65] focus:outline-hidden"
          >
            {isPaused ? (
              <Play className="w-3.5 h-3.5 text-[#C57D65]" />
            ) : (
              <Pause className="w-3.5 h-3.5 text-[#C57D65]" />
            )}
          </button>
        </div>
      </div>

      {/* Hover Tooltip when cursor hovers over a 3D villa */}
      {hoveredVillaId && hoveredVillaId !== activeVillaId && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 pointer-events-none bg-[#151412]/95 border border-[#C57D65]/60 px-3 py-1.5 text-[8.5px] tracking-[0.2em] uppercase text-[#F7F4EE] shadow-xl animate-fade-in flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#C57D65]" />
          <span>Click to Inspect {hoveredVillaId.replace(/-/g, " ")}</span>
        </div>
      )}

      {/* Bottom Architectural Specification Card & Node Selector */}
      <div className="absolute bottom-3 left-3 right-3 space-y-2 pointer-events-auto">
        <div className="grid grid-cols-3 gap-1 bg-[#151412]/95 backdrop-blur-md p-1 border border-white/15">
          {VILLA_NODES.map((node) => {
            const isSelected = node.id === activeVillaId && !overviewMode;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => handleSelectVillaInternal(node.id)}
                className={`min-h-[42px] py-1.5 px-2 text-left transition-all text-[8.5px] sm:text-[9px] tracking-[0.14em] uppercase focus-visible:ring-2 focus-visible:ring-[#C57D65] focus:outline-hidden ${
                  isSelected
                    ? "bg-[#8D4A33] text-white font-medium shadow-xs"
                    : "bg-transparent text-[#E2DDD3] hover:bg-white/10"
                }`}
              >
                <span className="block truncate font-mono text-[8px] text-[#C57D65]">
                  {node.elevationMeters}M
                </span>
                <span className="block truncate">{node.label}</span>
              </button>
            );
          })}
        </div>

        <div className="bg-[#151412]/95 backdrop-blur-md border border-white/15 p-2.5 sm:p-3 text-[#F7F4EE] shadow-xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[8px] tracking-[0.26em] uppercase text-[#C57D65] font-mono">
                  {overviewMode
                    ? "Sayan Gorge Axis • 240m Datum"
                    : activeNode.elevationLabel}
                </span>
                {!overviewMode && (
                  <span className="inline-block text-[7.5px] tracking-[0.18em] uppercase text-[#A39E93] border border-white/15 px-1.5 py-0.2">
                    {activeNode.sqm} m² • {activeNode.poolLength}m Pool
                  </span>
                )}
              </div>
              <p className="font-serif text-sm sm:text-base text-white font-light mt-0.5">
                {overviewMode
                  ? "Ayung River Gorge & 3 Monolithic Residences"
                  : fallbackVilla.name}
              </p>
              <p className="text-[9.5px] text-[#A39E93] line-clamp-1 mt-0.5">
                {overviewMode
                  ? "Drag to orbit valley • Click any villa compound to inspect"
                  : activeNode.architecturalType}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[8px] tracking-[0.2em] uppercase text-[#C57D65] block font-mono">
                {overviewMode ? "3D PANORAMA" : "ARCHITECTURAL"}
              </span>
              <span className="text-[9px] tracking-[0.16em] uppercase text-[#E2DDD3] border border-white/20 px-2 py-0.5 inline-block mt-1">
                WebGL PBR
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
