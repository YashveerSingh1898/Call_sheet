"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RotateCw, Video, ArrowDown, Activity } from "lucide-react";

export default function ThreeStudio() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [lightingPreset, setLightingPreset] = useState<"amber" | "teal" | "studio">("amber");
  const [deformIntensity, setDeformIntensity] = useState<number>(0.65);

  const sceneStateRef = useRef({
    lightingPreset: "amber",
    deformIntensity: 0.65,
    mouseX: 0,
    mouseY: 0,
    targetRotationX: 0,
    targetRotationY: 0,
    isDragging: false,
    prevMouseX: 0,
    prevMouseY: 0,
  });

  useEffect(() => {
    sceneStateRef.current.lightingPreset = lightingPreset;
  }, [lightingPreset]);

  useEffect(() => {
    sceneStateRef.current.deformIntensity = deformIntensity;
  }, [deformIntensity]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x14120f, 0.032);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x221e18, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0xe8a33d, 45, 20);
    keyLight.position.set(5, 4, 6);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x3eb89f, 35, 20);
    rimLight.position.set(-6, -3, -4);
    scene.add(rimLight);

    const centerGlowLight = new THREE.PointLight(0xe8a33d, 16, 10);
    centerGlowLight.position.set(0, 0, 0);
    scene.add(centerGlowLight);

    // 3. Master Sculpture Group
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // -- A. GLSL Vertex Displaced Procedural Core
    const vertexShader = `
      uniform float uTime;
      uniform float uDeform;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying float vDisplacement;

      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(
                  i.z + vec4(0.0, i1.z, i2.z, 1.0))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3  ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        float noise = snoise(position * 1.5 + vec3(uTime * 0.5));
        float disp = noise * (0.2 + uDeform * 0.45);
        vDisplacement = disp;
        vec3 newPosition = position + normal * disp;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform vec3 uColorAmber;
      uniform vec3 uColorTeal;
      uniform vec3 uColorDark;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying float vDisplacement;

      void main() {
        vec3 viewDir = normalize(-vPosition);
        float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.8);
        float colorFactor = clamp(vDisplacement * 1.9 + 0.5, 0.0, 1.0);
        vec3 baseColor = mix(uColorDark, uColorAmber, colorFactor);
        vec3 finalColor = mix(baseColor, uColorTeal, fresnel * 0.95);
        float specular = pow(max(dot(vNormal, vec3(0.5, 0.7, 0.5)), 0.0), 20.0);
        finalColor += uColorAmber * specular * 0.9;
        gl_FragColor = vec4(finalColor, 0.94);
      }
    `;

    const uniforms = {
      uTime: { value: 0 },
      uDeform: { value: 0.65 },
      uColorAmber: { value: new THREE.Color(0xe8a33d) },
      uColorTeal: { value: new THREE.Color(0x3eb89f) },
      uColorDark: { value: new THREE.Color(0x1a1713) },
    };

    const coreGeo = new THREE.IcosahedronGeometry(1.6, 48);
    const coreMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    masterGroup.add(coreMesh);

    // Geodesic Wireframe Cage
    const wireGeo = new THREE.IcosahedronGeometry(1.85, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xe8a33d,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    masterGroup.add(wireMesh);

    // Concentric Gyroscope Rings
    const gyroRing1Geo = new THREE.TorusGeometry(2.6, 0.035, 16, 100);
    const gyroRing1Mat = new THREE.MeshStandardMaterial({
      color: 0x9c9488,
      metalness: 0.95,
      roughness: 0.15,
    });
    const gyroRing1 = new THREE.Mesh(gyroRing1Geo, gyroRing1Mat);
    masterGroup.add(gyroRing1);

    const gyroRing2Geo = new THREE.TorusGeometry(2.2, 0.045, 16, 80);
    const gyroRing2Mat = new THREE.MeshStandardMaterial({
      color: 0xe8a33d,
      metalness: 0.9,
      roughness: 0.25,
      emissive: 0x4a2a0a,
      emissiveIntensity: 0.3,
    });
    const gyroRing2 = new THREE.Mesh(gyroRing2Geo, gyroRing2Mat);
    masterGroup.add(gyroRing2);

    const laserRingGeo = new THREE.RingGeometry(1.85, 1.9, 64);
    const laserRingMat = new THREE.MeshBasicMaterial({
      color: 0x3eb89f,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.55,
    });
    const laserRing = new THREE.Mesh(laserRingGeo, laserRingMat);
    masterGroup.add(laserRing);

    // Floating Dust Particles (800 count for local viewport)
    const pCount = 800;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pCol = new Float32Array(pCount * 3);

    const cAmber = new THREE.Color(0xe8a33d);
    const cTeal = new THREE.Color(0x3eb89f);
    const cWhite = new THREE.Color(0xf2efe9);

    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 14;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 10;

      const rc = Math.random();
      const col = rc > 0.6 ? cAmber : rc > 0.3 ? cTeal : cWhite;
      pCol[i * 3] = col.r;
      pCol[i * 3 + 1] = col.g;
      pCol[i * 3 + 2] = col.b;
    }

    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(pCol, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(pGeo, pMat);
    scene.add(particleSystem);

    // 4. Mouse & Orbit Interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      sceneStateRef.current.mouseX = x;
      sceneStateRef.current.mouseY = y;

      if (sceneStateRef.current.isDragging) {
        const deltaX = e.clientX - sceneStateRef.current.prevMouseX;
        const deltaY = e.clientY - sceneStateRef.current.prevMouseY;
        sceneStateRef.current.targetRotationY += deltaX * 0.008;
        sceneStateRef.current.targetRotationX += deltaY * 0.008;
        sceneStateRef.current.prevMouseX = e.clientX;
        sceneStateRef.current.prevMouseY = e.clientY;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      sceneStateRef.current.isDragging = true;
      sceneStateRef.current.prevMouseX = e.clientX;
      sceneStateRef.current.prevMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      sceneStateRef.current.isDragging = false;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    // 5. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // 6. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Update GLSL Uniforms
      uniforms.uTime.value = elapsedTime;
      uniforms.uDeform.value = sceneStateRef.current.deformIntensity;

      // Gyro Rotations
      gyroRing1.rotation.x = elapsedTime * 0.28;
      gyroRing2.rotation.y = elapsedTime * 0.38;
      laserRing.rotation.z = -elapsedTime * 0.45;
      wireMesh.rotation.y = elapsedTime * 0.18;
      particleSystem.rotation.y = elapsedTime * 0.02;

      // Mouse Parallax & Orbit Interpolation
      const targetParallaxX =
        sceneStateRef.current.mouseY * 0.3 + sceneStateRef.current.targetRotationX;
      const targetParallaxY =
        sceneStateRef.current.mouseX * 0.4 + sceneStateRef.current.targetRotationY;

      masterGroup.rotation.x += (targetParallaxX - masterGroup.rotation.x) * 0.06;
      masterGroup.rotation.y += (targetParallaxY - masterGroup.rotation.y) * 0.06;
      masterGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.12;

      // Lighting Presets
      const preset = sceneStateRef.current.lightingPreset;
      if (preset === "amber") {
        keyLight.color.setHex(0xe8a33d);
        keyLight.intensity = 50;
        rimLight.color.setHex(0x3eb89f);
        centerGlowLight.color.setHex(0xe8a33d);
      } else if (preset === "teal") {
        keyLight.color.setHex(0x3eb89f);
        keyLight.intensity = 60;
        rimLight.color.setHex(0x2f6e62);
        centerGlowLight.color.setHex(0x3eb89f);
      } else {
        keyLight.color.setHex(0xf2efe9);
        keyLight.intensity = 45;
        rimLight.color.setHex(0x9c9488);
        centerGlowLight.color.setHex(0xf2efe9);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      resizeObserver.disconnect();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      coreGeo.dispose();
      coreMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      gyroRing1Geo.dispose();
      gyroRing1Mat.dispose();
      gyroRing2Geo.dispose();
      gyroRing2Mat.dispose();
      laserRingGeo.dispose();
      laserRingMat.dispose();
      pGeo.dispose();
      pMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section
      id="3d-studio"
      className="relative w-full py-16 md:py-24 border-y border-text-muted/15 overflow-hidden"
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-accent-amber/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-accent-teal/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface border border-accent-teal/30 text-accent-teal-bright text-xs font-mono">
              <Video className="w-3.5 h-3.5" />
              <span>INTERACTIVE WEBGL STUDIO LAB</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-text-primary font-normal tracking-tight">
              Direct the Procedural Sculpture
            </h2>
            <p className="font-body text-sm text-text-muted max-w-lg">
              Interact with the dynamic GLSL vertex deformation engine. Click and drag to orbit in 3D space, 
              modulate wave frequencies, and toggle real-time studio lighting arrays.
            </p>
          </div>

          <div>
            <a
              href="#generator"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-surface hover:bg-surface-raised border border-accent-amber/40 text-accent-amber text-xs sm:text-sm font-medium transition-all shadow-sm group"
            >
              <span>Ready to generate?</span>
              <ArrowDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
            </a>
          </div>
        </div>

        {/* 3D Viewport Box */}
        <div className="relative w-full h-[460px] sm:h-[540px] md:h-[600px] rounded-xl bg-surface border border-text-muted/20 overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing group">
          <div ref={containerRef} className="w-full h-full" />

          {/* Top-Left Telemetry HUD */}
          <div className="absolute top-4 left-4 p-3.5 rounded-lg glass-panel space-y-1.5 pointer-events-none max-w-xs shadow-lg">
            <div className="flex items-center justify-between gap-4 text-xs font-mono text-accent-amber border-b border-text-muted/15 pb-1">
              <span className="font-semibold">SCULPTURE TELEMETRY</span>
              <span className="text-[10px] text-accent-teal-bright animate-pulse">● GLSL 60FPS</span>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] font-mono text-text-muted">
              <span>SHADER:</span>
              <span className="text-text-primary text-right font-medium">Perlin Simplex</span>
              <span>VERTICES:</span>
              <span className="text-text-primary text-right font-medium">11,520 Pts</span>
              <span>FRESNEL:</span>
              <span className="text-text-primary text-right font-medium">Amber/Teal IRIS</span>
              <span>DEFORMATION:</span>
              <span className="text-accent-amber text-right font-medium">
                {(deformIntensity * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Top-Right Drag Hint */}
          <div className="absolute top-4 right-4 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel-subtle text-xs font-mono text-text-muted pointer-events-none">
            <RotateCw className="w-3.5 h-3.5 text-accent-amber animate-spin" style={{ animationDuration: "8s" }} />
            <span>Click & Drag to Orbit</span>
          </div>

          {/* Bottom Interactive Controls */}
          <div className="absolute bottom-4 left-4 right-4 md:left-6 md:right-6 p-3 sm:p-4 rounded-lg glass-panel flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-xl">
            {/* Lighting array presets */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-text-muted shrink-0 hidden sm:inline">
                LIGHTING ARRAY:
              </span>
              <div className="flex items-center gap-1.5 bg-bg/70 p-1 rounded-md border border-text-muted/20">
                <button
                  type="button"
                  onClick={() => setLightingPreset("amber")}
                  className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                    lightingPreset === "amber"
                      ? "bg-accent-amber text-bg font-semibold shadow-sm"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  Amber Cine
                </button>
                <button
                  type="button"
                  onClick={() => setLightingPreset("teal")}
                  className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                    lightingPreset === "teal"
                      ? "bg-accent-teal-bright text-bg font-semibold shadow-sm"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  Cyber Teal
                </button>
                <button
                  type="button"
                  onClick={() => setLightingPreset("studio")}
                  className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                    lightingPreset === "studio"
                      ? "bg-text-primary text-bg font-semibold shadow-sm"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  Studio Clean
                </button>
              </div>
            </div>

            {/* Wave Deformation Slider */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-text-muted shrink-0 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-accent-amber" />
                WAVE DEFORMATION:
              </span>
              <input
                type="range"
                min="0.1"
                max="1.2"
                step="0.05"
                value={deformIntensity}
                onChange={(e) => setDeformIntensity(parseFloat(e.target.value))}
                className="w-28 sm:w-36 h-1.5 bg-bg rounded-lg appearance-none cursor-pointer accent-accent-amber"
                aria-label="Wave Deformation Slider"
              />
              <span className="font-mono text-xs text-text-primary w-10 text-right">
                {(deformIntensity * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
