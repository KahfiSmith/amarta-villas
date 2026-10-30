"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

interface Topography3DCanvasProps {
  activeStepIndex: number;
  onSelectStep: (idx: number) => void;
}

const WAYPOINTS = [
  {
    step: "01",
    label: "Sayan Ridge Descent (265m)",
    elevationMeters: "265m ASL",
    camPos: [-2.4, 2.2, 2.9],
    lookAt: [-0.6, 0.2, 0.2],
    markerPos: [-1.1, 0.48, 0.55],
  },
  {
    step: "02",
    label: "Travertine Pavilion (240m)",
    elevationMeters: "240m ASL",
    camPos: [0.1, 2.0, 3.2],
    lookAt: [0, 0.05, 0],
    markerPos: [0.0, 0.16, 0.05],
  },
  {
    step: "03",
    label: "Ayung Sanctuary (212m)",
    elevationMeters: "212m ASL",
    camPos: [2.3, 1.85, 2.8],
    lookAt: [0.65, -0.1, -0.2],
    markerPos: [1.05, -0.08, -0.45],
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

export default function Topography3DCanvas({
  activeStepIndex,
  onSelectStep,
}: Topography3DCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglSupported] = useState<boolean>(() => checkWebGLSupport());
  const sceneRef = useRef<{
    camera: THREE.PerspectiveCamera;
    targetLook: THREE.Vector3;
    markers: THREE.Mesh[];
  } | null>(null);

  useEffect(() => {
    if (!webglSupported) return;
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 280;
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
    scene.background = new THREE.Color(0x1b1916);

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 40);
    camera.position.set(...(WAYPOINTS[0].camPos as [number, number, number]));
    const targetLook = new THREE.Vector3(
      ...(WAYPOINTS[0].lookAt as [number, number, number])
    );
    camera.lookAt(targetLook);

    renderer.setSize(width, height);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2)
    );

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xf7f4ee, 0.85);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xc57d65, 1.8);
    keyLight.position.set(3, 6, 4);
    scene.add(keyLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];

    const gridGeo = new THREE.PlaneGeometry(
      4.4,
      3.2,
      isMobile ? 28 : 44,
      isMobile ? 20 : 32
    );
    gridGeo.rotateX(-Math.PI / 2);
    const pos = gridGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const slope = -x * 0.24 + Math.sin(z * 1.4 + x * 0.9) * 0.16;
      const stepped = Math.round(slope * 8) / 8;
      pos.setY(i, slope * 0.6 + stepped * 0.4);
    }
    gridGeo.computeVertexNormals();

    const surfaceMat = new THREE.MeshStandardMaterial({
      color: 0x26231f,
      roughness: 0.9,
      metalness: 0.1,
      flatShading: true,
    });
    const surfaceMesh = new THREE.Mesh(gridGeo, surfaceMat);
    rootGroup.add(surfaceMesh);

    const contourMat = new THREE.MeshBasicMaterial({
      color: 0xc57d65,
      wireframe: true,
      transparent: true,
      opacity: 0.26,
    });
    const contourMesh = new THREE.Mesh(gridGeo, contourMat);
    contourMesh.position.y = 0.005;
    rootGroup.add(contourMesh);

    geometries.push(gridGeo);
    materials.push(surfaceMat, contourMat);

    const curve = new THREE.CatmullRomCurve3(
      WAYPOINTS.map(
        (w) =>
          new THREE.Vector3(w.markerPos[0], w.markerPos[1] + 0.06, w.markerPos[2])
      )
    );
    const pathGeo = new THREE.TubeGeometry(curve, 36, 0.02, 8, false);
    const pathMat = new THREE.MeshBasicMaterial({
      color: 0xf7f4ee,
      transparent: true,
      opacity: 0.8,
    });
    const pathMesh = new THREE.Mesh(pathGeo, pathMat);
    rootGroup.add(pathMesh);
    geometries.push(pathGeo);
    materials.push(pathMat);

    const markers: THREE.Mesh[] = [];
    WAYPOINTS.forEach((wp, idx) => {
      const markerGeo = new THREE.OctahedronGeometry(0.11, 0);
      const markerMat = new THREE.MeshStandardMaterial({
        color: idx === 0 ? 0xc57d65 : 0xf7f4ee,
        emissive: 0xa2583e,
        emissiveIntensity: idx === 0 ? 0.8 : 0.2,
        roughness: 0.25,
        metalness: 0.5,
      });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.set(
        wp.markerPos[0],
        wp.markerPos[1] + 0.16,
        wp.markerPos[2]
      );
      rootGroup.add(marker);
      markers.push(marker);
      geometries.push(markerGeo);
      materials.push(markerMat);
    });

    sceneRef.current = { camera, targetLook, markers };

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 480;
      const h = container.clientHeight || 280;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    let reqId = 0;
    const startTime = performance.now();

    const renderLoop = () => {
      reqId = requestAnimationFrame(renderLoop);
      if (!isVisible) return;

      const t = (performance.now() - startTime) * 0.001;
      if (!prefersReducedMotion) {
        rootGroup.rotation.y = Math.sin(t * 0.3) * 0.08;
        markers.forEach((m, i) => {
          m.rotation.y = t * 0.9 + i;
        });
      }

      camera.lookAt(targetLook);
      renderer.render(scene, camera);
    };
    renderLoop();

    return () => {
      cancelAnimationFrame(reqId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      renderer.dispose();
    };
  }, [webglSupported]);

  useEffect(() => {
    const ctx = sceneRef.current;
    if (!ctx) return;
    const wp = WAYPOINTS[activeStepIndex] || WAYPOINTS[0];

    gsap.to(ctx.camera.position, {
      x: wp.camPos[0],
      y: wp.camPos[1],
      z: wp.camPos[2],
      duration: 1.2,
      ease: "power3.out",
      overwrite: "auto",
    });

    gsap.to(ctx.targetLook, {
      x: wp.lookAt[0],
      y: wp.lookAt[1],
      z: wp.lookAt[2],
      duration: 1.2,
      ease: "power3.out",
      overwrite: "auto",
    });

    ctx.markers.forEach((mesh, idx) => {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      const isAct = idx === activeStepIndex;
      gsap.to(mat, {
        emissiveIntensity: isAct ? 0.9 : 0.15,
        duration: 0.6,
      });
      gsap.to(mesh.scale, {
        x: isAct ? 1.35 : 0.9,
        y: isAct ? 1.35 : 0.9,
        z: isAct ? 1.35 : 0.9,
        duration: 0.6,
        ease: "back.out(1.7)",
      });
    });
  }, [activeStepIndex]);

  const currentWaypoint = WAYPOINTS[activeStepIndex] || WAYPOINTS[0];

  return (
    <div className="border border-[#E2DDD3] bg-[#1B1916] overflow-hidden">
      <div className="relative h-60 sm:h-68 w-full">
        {webglSupported ? (
          <div
            ref={mountRef}
            className="w-full h-full"
            role="img"
            aria-label="Interactive 3D arrival elevation profile from Sayan Ridge to Ayung Gorge"
          />
        ) : (
          <div className="w-full h-full flex flex-col justify-center px-6 bg-[#1B1916]">
            <svg
              viewBox="0 0 400 120"
              className="w-full h-28 stroke-[#C57D65] fill-none"
              aria-hidden="true"
            >
              <path
                d="M 20 25 Q 140 55, 200 65 T 380 100"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <circle
                cx={activeStepIndex === 0 ? 40 : activeStepIndex === 1 ? 200 : 360}
                cy={activeStepIndex === 0 ? 30 : activeStepIndex === 1 ? 65 : 96}
                r="7"
                className="fill-[#C57D65]"
              />
            </svg>
            <p className="text-[10px] tracking-[0.22em] uppercase text-[#A8A299] text-center">
              Elevation Datum: {currentWaypoint.elevationMeters}
            </p>
          </div>
        )}
        <div className="absolute top-3 left-3.5 bg-[#151412]/85 border border-white/15 px-3 py-1 text-[9px] tracking-[0.22em] uppercase text-[#F7F4EE]">
          3D Arrival Elevation &bull; {currentWaypoint.label}
        </div>
      </div>

      <div className="grid grid-cols-3 border-t border-white/15 bg-[#151412]">
        {WAYPOINTS.map((wp, idx) => {
          const isCurrent = idx === activeStepIndex;
          return (
            <button
              key={wp.step}
              type="button"
              onClick={() => onSelectStep(idx)}
              className={`min-h-[48px] px-3 py-2.5 text-left transition-colors border-r last:border-r-0 border-white/10 focus-visible:ring-2 focus-visible:ring-[#C57D65] focus:outline-hidden ${
                isCurrent
                  ? "bg-[#8D4A33] text-white"
                  : "text-[#A8A299] hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-[8px] tracking-[0.22em] uppercase block opacity-80">
                Waypoint {wp.step}
              </span>
              <span className="font-serif text-xs block truncate mt-0.5">
                {wp.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
