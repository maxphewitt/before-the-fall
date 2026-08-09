/**
 * rosaryScene — three.js scene for the 3D Rosary walker, built around a
 * real modeled rosary (GLB) instead of procedural primitives.
 *
 * Model: "Rosary" (https://skfb.ly/otUUn) by Carlos.Maciel, licensed
 * CC BY 4.0 (http://creativecommons.org/licenses/by/4.0/). Served from
 * /models/rosary.glb (textures downsized to 1024/WebP, 35MB → 4.6MB).
 * The visible credit is rendered by the walker's settings gate.
 *
 * The model is five merged meshes (wood beads, twine, chrome medal, metal
 * + wood crucifix), so beads aren't addressable as nodes. Every bead
 * position below was extracted offline by clustering the geometry and
 * walking the twine cord's knot graph — the anchor table is exact and in
 * the model's raw mesh space; at runtime it's transformed by the loaded
 * node's world matrix, so it survives any node-level scale/rotation.
 *
 * Physical layout (matches how the cord is actually strung): crucifix at
 * bottom → medal above it → a 5-bead tail rising to the loop's entry knot
 * at bottom-right (Our Father, 3 Hail Marys, Glory Be) → decade 1 climbs
 * the RIGHT side → across the top → decade 4 down the LEFT → decade 5
 * returns through the inner drape to the entry knot. Decade Our Fathers
 * and Glory Bes are prayed on the knots between decades, as on a real
 * cord rosary.
 */

import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { RosaryStep } from "../../../../lib/rosary";

export const ROSARY_MODEL_CREDIT = {
  title: "Rosary",
  author: "Carlos.Maciel",
  url: "https://skfb.ly/otUUn",
  license: "CC BY 4.0",
  licenseUrl: "http://creativecommons.org/licenses/by/4.0/",
};

// ─── Step → scene zone mapping ───────────────────────────────────────────

export type StepTarget =
  | { zone: "crucifix" }
  | { zone: "pendant-of" }
  | { zone: "pendant-hm"; i: number } // 0-2
  | { zone: "pendant-chain" }
  | { zone: "medal" }
  | { zone: "decade-of"; decade: number } // 1-5
  | { zone: "decade-hm"; decade: number; bead: number } // bead 0-9
  | { zone: "decade-chain"; decade: number };

/** Where the camera should look for a given generator step. */
export function stepTarget(step: RosaryStep): StepTarget {
  if (step.section === "opening") {
    if (step.kind === "intention") return { zone: "medal" };
    if (step.name === "Sign of the Cross" || step.name === "Apostles' Creed")
      return { zone: "crucifix" };
    if (step.name === "Our Father") return { zone: "pendant-of" };
    if (step.name === "Hail Mary")
      return { zone: "pendant-hm", i: step.openingHailIndex ?? 0 };
    return { zone: "pendant-chain" }; // Glory Be — the tail's 5th bead
  }
  if (step.section === "closing") return { zone: "medal" };
  const d = "decade" in step && step.decade ? step.decade : 1;
  if (step.kind === "meditation") return { zone: "decade-of", decade: d };
  if (step.name === "Our Father") return { zone: "decade-of", decade: d };
  if (step.name === "Hail Mary")
    return { zone: "decade-hm", decade: d, bead: step.beadIndex ?? 0 };
  return { zone: "decade-chain", decade: d }; // Glory Be, Fatima
}

// ─── Public API ──────────────────────────────────────────────────────────

export type RosaryScene = {
  overview(instant?: boolean): void;
  focus(target: StepTarget, instant?: boolean): void;
  resize(width: number, height: number): void;
  dispose(): void;
};

// ─── Anchor table (raw mesh space, extracted offline from the GLB) ───────

type V3 = [number, number, number];

const RAW = {
  crucifix: [-0.243, -3.2, 0.42] as V3,
  medal: [-0.061, -1.917, 0.357] as V3,
  // Tail, in praying order from the medal outward.
  tailOF: [0.17, -1.059, 0.365] as V3,
  tailHM: [
    [1.026, -0.731, 0.365],
    [1.597, -0.931, 0.365],
    [2.146, -1.148, 0.365],
  ] as V3[],
  tailGlory: [3.255, -0.906, 0.365] as V3,
  // Knot before each decade (index 0 = entry knot before decade 1).
  knots: [
    [3.718, -0.431, 0.36],
    [0.638, 2.129, 0.35],
    [2.625, 4.415, 0.35],
    [-3.571, 3.756, 0.35],
    [-1.412, 0.18, 0.35],
  ] as V3[],
  // Where decade 5's Glory Be / Fatima land (cord returning to the entry).
  closeKnot: [3.258, -0.362, 0.36] as V3,
  // 5 decades × 10 Hail Mary beads, in praying order along the cord.
  decades: [
    [[4.181, 0.045, 0.343], [4.491, 0.513, 0.343], [4.493, 1.087, 0.343], [4.312, 1.634, 0.343], [3.897, 2.025, 0.343], [3.383, 2.294, 0.343], [2.841, 2.492, 0.343], [2.26, 2.566, 0.343], [1.697, 2.456, 0.335], [1.167, 2.189, 0.321]],
    [[0.108, 2.069, 0.343], [0.085, 2.552, 0.343], [0.523, 2.947, 0.343], [1.056, 3.127, 0.343], [1.615, 3.332, 0.343], [2.171, 3.487, 0.343], [2.744, 3.486, 0.343], [3.303, 3.632, 0.343], [3.592, 4.074, 0.343], [3.252, 4.433, 0.343]],
    [[1.997, 4.396, 0.343], [1.415, 4.473, 0.343], [0.851, 4.622, 0.343], [0.277, 4.769, 0.343], [-0.297, 4.834, 0.343], [-0.878, 4.81, 0.343], [-1.456, 4.703, 0.343], [-2.019, 4.524, 0.343], [-2.573, 4.361, 0.343], [-3.149, 4.174, 0.343]],
    [[-3.993, 3.338, 0.343], [-4.263, 2.815, 0.343], [-4.443, 2.263, 0.343], [-4.513, 1.676, 0.343], [-4.418, 1.109, 0.343], [-4.11, 0.628, 0.343], [-3.619, 0.317, 0.343], [-3.05, 0.166, 0.343], [-2.477, 0.096, 0.343], [-1.888, 0.096, 0.343]],
    [[-0.936, 0.264, 0.343], [-0.383, 0.465, 0.343], [0.136, 0.728, 0.343], [0.637, 1.046, 0.343], [1.126, 1.357, 0.343], [1.669, 1.551, 0.343], [2.245, 1.509, 0.343], [2.735, 1.199, 0.343], [3.074, 0.738, 0.343], [3.26, 0.182, 0.343]],
  ] as V3[][],
};

/** Raw-space bead radius (from geometry clustering) — used to scale
 * camera distances and the halo once the model's true scale is known. */
const RAW_BEAD_R = 0.31;

// ─── Scene construction ──────────────────────────────────────────────────

export function createRosaryScene(
  canvas: HTMLCanvasElement,
  opts: { reducedMotion?: boolean } = {}
): RosaryScene {
  const reduced = !!opts.reducedMotion;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  scene.background = null; // page's btf gradient shows through

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);

  const key = new THREE.DirectionalLight(new THREE.Color("#fff3d6"), 1.6);
  key.position.set(6, 8, 10);
  scene.add(key);
  const rim = new THREE.DirectionalLight(new THREE.Color("#3d8fc4"), 0.6);
  rim.position.set(-8, -4, -6);
  scene.add(rim);
  scene.add(new THREE.AmbientLight(new THREE.Color("#3a4f66"), 0.9));

  const wrapper = new THREE.Group();
  scene.add(wrapper);

  // Highlight — the focused bead "changes color": an additive gold glow
  // shell fitted snugly over the bead (the merged bead mesh can't be
  // recolored per bead, so the shell does it visually).
  const glowMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#e8cc7a"),
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const glowGeo = new THREE.SphereGeometry(1, 28, 20);
  const glow = new THREE.Mesh(glowGeo, glowMat);
  glow.visible = false;
  scene.add(glow);
  let glowScale = 1;

  const disposables: Array<{ dispose(): void }> = [envTex, glowMat, glowGeo];

  // ─── Model load + anchor resolution ────────────────────────────────────

  let ready = false;
  let disposed = false;
  let model: THREE.Group | null = null;
  // World-space anchors, filled once the model is in.
  const world = {
    crucifix: new THREE.Vector3(),
    medal: new THREE.Vector3(),
    tailOF: new THREE.Vector3(),
    tailHM: [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()],
    tailGlory: new THREE.Vector3(),
    knots: RAW.knots.map(() => new THREE.Vector3()),
    closeKnot: new THREE.Vector3(),
    decades: RAW.decades.map((d) => d.map(() => new THREE.Vector3())),
  };
  let beadR = 0.3; // world-space bead radius after scaling
  const bounds = new THREE.Box3();
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  let pendingTarget: StepTarget | null = null;
  let pendingOverview = true;

  new GLTFLoader().load(
    "/models/rosary.glb",
    (gltf) => {
      if (disposed) return;
      model = gltf.scene;
      wrapper.add(model);

      // Normalize: uniform scale so the rosary is ~11 world units tall,
      // centered at the origin (node matrices in the file may carry any
      // FBX-era scale).
      const rawBox = new THREE.Box3().setFromObject(model);
      const rawSize = rawBox.getSize(new THREE.Vector3());
      const s = 11 / Math.max(rawSize.y, 0.0001);
      wrapper.scale.setScalar(s);
      const rawCenter = rawBox.getCenter(new THREE.Vector3());
      wrapper.position.set(-rawCenter.x * s, -rawCenter.y * s, -rawCenter.z * s);
      wrapper.updateMatrixWorld(true);

      // Resolve raw anchors → world space through the bead mesh's node
      // chain (its geometry shares the space the anchors were measured in).
      let anchorNode: THREE.Object3D | null = null;
      model.traverse((o) => {
        if (!anchorNode && o.name.includes("WOOD_0") && !o.name.includes("CROSS")) anchorNode = o;
      });
      const node: THREE.Object3D = anchorNode ?? model;
      const toWorld = (v: V3, out: THREE.Vector3) =>
        node.localToWorld(out.set(v[0], v[1], v[2]));
      toWorld(RAW.crucifix, world.crucifix);
      toWorld(RAW.medal, world.medal);
      toWorld(RAW.tailOF, world.tailOF);
      RAW.tailHM.forEach((v, i) => toWorld(v, world.tailHM[i]));
      toWorld(RAW.tailGlory, world.tailGlory);
      RAW.knots.forEach((v, i) => toWorld(v, world.knots[i]));
      toWorld(RAW.closeKnot, world.closeKnot);
      RAW.decades.forEach((d, i) => d.forEach((v, k) => toWorld(v, world.decades[i][k])));

      // World bead radius: measure a known raw distance through the node.
      const a = node.localToWorld(new THREE.Vector3(0, 0, 0));
      const b = node.localToWorld(new THREE.Vector3(RAW_BEAD_R, 0, 0));
      beadR = a.distanceTo(b);
      glow.scale.setScalar(beadR * 1.22);

      // Boost the metals a little against the dark background.
      model.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh && mesh.material) {
          const m = mesh.material as THREE.MeshStandardMaterial;
          if ("envMapIntensity" in m) m.envMapIntensity = 1.2;
        }
      });

      bounds.setFromObject(wrapper);
      bounds.getSize(size);
      bounds.getCenter(center);

      ready = true;
      if (pendingOverview) applyOverview(true);
      else if (pendingTarget) applyFocus(pendingTarget, true);
    },
    undefined,
    () => {
      // Load failure — the walker's HUD still carries the prayer text.
    }
  );

  // ─── Camera rig ────────────────────────────────────────────────────────

  const HUD_FRACTION = 0.24;
  // Tabletop perspective: the camera looks DOWN at the rosary from above
  // the crucifix side, so the far edge of the loop recedes. 0 = the old
  // straight-on view; larger = steeper look-down angle.
  const CAMERA_TILT = 0.66; // radians (~38°)
  // Direction from any focus point out to the camera, and the matching
  // on-screen "up" direction in world space.
  const viewDir = new THREE.Vector3(0, Math.sin(CAMERA_TILT), Math.cos(CAMERA_TILT));
  const screenUp = new THREE.Vector3(0, Math.cos(CAMERA_TILT), -Math.sin(CAMERA_TILT));

  let aspect = 1;
  const goalPos = new THREE.Vector3(0, 0, 20);
  const goalLook = new THREE.Vector3(0, 0, 0);
  const curLook = new THREE.Vector3(0, 0, 0);

  function applyOverview(instant?: boolean) {
    glow.visible = false;
    if (!ready) {
      pendingOverview = true;
      return;
    }
    const fovRad = (camera.fov * Math.PI) / 180;
    const halfTan = Math.tan(fovRad / 2);
    // Height as projected onto the tilted screen plane (foreshortened).
    const projH = size.y * Math.cos(CAMERA_TILT) + size.z * Math.sin(CAMERA_TILT);
    const fitH = projH / 2 / halfTan / (1 - HUD_FRACTION);
    const fitW = (size.x / 2 / (halfTan * aspect)) * 1.02;
    const dist = Math.max(fitH, fitW) * 1.12;
    const yShift = (2 * dist * halfTan * HUD_FRACTION) / 2;
    goalPos.copy(center).addScaledVector(viewDir, dist).addScaledVector(screenUp, -yShift);
    goalLook.copy(center).addScaledVector(screenUp, -yShift);
    if (instant) {
      camera.position.copy(goalPos);
      curLook.copy(goalLook);
    }
  }

  function zoneAnchor(t: StepTarget): { pos: THREE.Vector3; dist: number; glowR: number } {
    const u = beadR / 0.3; // distance unit relative to bead size
    switch (t.zone) {
      case "crucifix":
        return { pos: world.crucifix, dist: 5.2 * u, glowR: 0 };
      case "pendant-of":
        return { pos: world.tailOF, dist: 2.4 * u, glowR: 1.22 };
      case "pendant-hm":
        return { pos: world.tailHM[Math.min(Math.max(t.i, 0), 2)], dist: 2.2 * u, glowR: 1.22 };
      case "pendant-chain":
        return { pos: world.tailGlory, dist: 2.2 * u, glowR: 1.22 };
      case "medal":
        return { pos: world.medal, dist: 2.6 * u, glowR: 0 };
      case "decade-of": {
        const d = Math.min(Math.max(t.decade - 1, 0), 4);
        return { pos: world.knots[d], dist: 2.6 * u, glowR: 0.8 };
      }
      case "decade-hm": {
        const d = Math.min(Math.max(t.decade - 1, 0), 4);
        const k = Math.min(Math.max(t.bead, 0), 9);
        return { pos: world.decades[d][k], dist: 2.2 * u, glowR: 1.22 };
      }
      case "decade-chain": {
        const d = Math.min(Math.max(t.decade - 1, 0), 4);
        return { pos: d < 4 ? world.knots[d + 1] : world.closeKnot, dist: 2.6 * u, glowR: 0.8 };
      }
    }
  }

  function applyFocus(t: StepTarget, instant?: boolean) {
    if (!ready) {
      pendingTarget = t;
      pendingOverview = false;
      return;
    }
    const { pos, dist, glowR } = zoneAnchor(t);
    // Tilted look-down view; the look target is nudged down-screen so the
    // focused bead sits above the bottom prayer panel.
    goalPos.copy(pos).addScaledVector(viewDir, dist);
    goalPos.x += dist * 0.1;
    goalLook.copy(pos).addScaledVector(screenUp, -dist * 0.1);
    glow.visible = glowR > 0;
    glowScale = glowR;
    glow.position.copy(pos);
    if (instant) {
      camera.position.copy(goalPos);
      curLook.copy(goalLook);
    }
  }

  // ─── Animation loop ────────────────────────────────────────────────────

  const clock = new THREE.Clock();
  let raf = 0;
  function frame() {
    if (disposed) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    if (!reduced) {
      wrapper.rotation.y = Math.sin(t * 0.22) * 0.04;
      wrapper.rotation.x = Math.sin(t * 0.17) * 0.018;
    }

    const k = reduced ? 1 : 1 - Math.exp(-dt * 2.6);
    camera.position.lerp(goalPos, k);
    curLook.lerp(goalLook, k);
    camera.lookAt(curLook);

    if (glow.visible) {
      const pulse = reduced ? 1 : 1 + 0.05 * Math.sin(t * 2.6);
      glow.scale.setScalar(beadR * glowScale * pulse);
      glowMat.opacity = reduced ? 0.45 : 0.35 + 0.2 * (0.5 + 0.5 * Math.sin(t * 2.6));
    }

    renderer.render(scene, camera);
  }
  frame();

  return {
    overview(instant) {
      pendingTarget = null;
      pendingOverview = true;
      applyOverview(instant);
    },
    focus(target, instant) {
      pendingOverview = false;
      applyFocus(target, instant);
    },
    resize(width, height) {
      aspect = width / Math.max(height, 1);
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      if (ready && pendingOverview) applyOverview();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      if (model) {
        model.traverse((o) => {
          const mesh = o as THREE.Mesh;
          if (mesh.isMesh) {
            mesh.geometry?.dispose();
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            for (const m of mats) {
              const sm = m as THREE.MeshStandardMaterial;
              sm.map?.dispose();
              sm.normalMap?.dispose();
              sm.roughnessMap?.dispose();
              sm.metalnessMap?.dispose();
              sm.dispose();
            }
          }
        });
      }
      for (const d of disposables) d.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
