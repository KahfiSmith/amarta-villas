export interface VillaNodeConfig {
  id: string;
  label: string;
  elevationLabel: string;
  elevationMeters: number;
  sqm: number;
  poolLength: number;
  architecturalType: string;
  position: [number, number, number];
  cameraPos: [number, number, number];
  lookAt: [number, number, number];
}

export const VILLA_NODES: VillaNodeConfig[] = [
  {
    id: "canopy-pool-villa",
    label: "01. Canopy",
    elevationLabel: "248m ASL • Upper Canopy Cantilever",
    elevationMeters: 248,
    sqm: 280,
    poolLength: 14,
    architecturalType: "Suspended Ironwood Cantilever Pavilion",
    position: [-1.45, 0.44, 0.35],
    cameraPos: [-2.6, 2.05, 3.5],
    lookAt: [-1.1, 0.35, 0.3],
  },
  {
    id: "riverbank-sanctuary",
    label: "02. Riverbank",
    elevationLabel: "212m ASL • Ayung Gorge Waterfront",
    elevationMeters: 212,
    sqm: 420,
    poolLength: 18,
    architecturalType: "Twin Volcanic Stone Pavilions & Water Gardens",
    position: [0.18, -0.22, 0.95],
    cameraPos: [0.35, 1.55, 3.75],
    lookAt: [0.18, -0.15, 0.75],
  },
  {
    id: "grand-ridge-estate",
    label: "03. Grand Ridge",
    elevationLabel: "276m ASL • Crest Panorama Axis",
    elevationMeters: 276,
    sqm: 650,
    poolLength: 22,
    architecturalType: "Tri-Pavilion Compound & 22m Springboard Pool",
    position: [1.6, 0.82, -0.42],
    cameraPos: [2.85, 2.35, 3.3],
    lookAt: [1.3, 0.65, -0.25],
  },
];
