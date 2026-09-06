"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeAmbientCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0c10, 0.0015);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 120;

    // 2. WebGL Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 3. Cyber Particles Cloud (Without heavy solid objects)
    const particleCount = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    const amberColor = new THREE.Color(0xf59e0b);
    const tealColor = new THREE.Color(0x14b8a6);
    const whiteColor = new THREE.Color(0xf1f5f9);

    for (let i = 0; i < particleCount; i++) {
      // Spread across wide 3D space
      positions[i * 3] = (Math.random() - 0.5) * 350;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 250;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;

      // Color variation (Amber / Teal / Soft White)
      const rand = Math.random();
      const mixedColor = rand < 0.45 ? amberColor : rand < 0.85 ? tealColor : whiteColor;
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;

      scales[i] = Math.random() * 2.5 + 0.5;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Custom Particle Texture (Circular glow)
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.6)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    const texture = new THREE.CanvasTexture(canvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 2.2,
      map: texture,
      transparent: true,
      opacity: 0.7,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    // 4. Subtle Undulating Digital Grid Waves
    const gridRows = 35;
    const gridCols = 35;
    const gridCount = gridRows * gridCols;
    const gridGeo = new THREE.BufferGeometry();
    const gridPositions = new Float32Array(gridCount * 3);
    const gridColors = new Float32Array(gridCount * 3);

    let idx = 0;
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const x = (c - gridCols / 2) * 8;
        const y = -45;
        const z = (r - gridRows / 2) * 8;

        gridPositions[idx * 3] = x;
        gridPositions[idx * 3 + 1] = y;
        gridPositions[idx * 3 + 2] = z;

        gridColors[idx * 3] = 0.96; // amber-gold tone
        gridColors[idx * 3 + 1] = 0.62;
        gridColors[idx * 3 + 2] = 0.04;
        idx++;
      }
    }

    gridGeo.setAttribute("position", new THREE.BufferAttribute(gridPositions, 3));
    gridGeo.setAttribute("color", new THREE.BufferAttribute(gridColors, 3));

    const gridMaterial = new THREE.PointsMaterial({
      size: 1.6,
      map: texture,
      transparent: true,
      opacity: 0.35,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const gridPoints = new THREE.Points(gridGeo, gridMaterial);
    gridPoints.rotation.x = 0.25;
    scene.add(gridPoints);

    // 5. Interactive Mouse Parallax Tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 40;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 30;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 6. Resize handler
    const handleResize = () => {
      if (!container) return;
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    // 7. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth camera parallax
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      camera.position.x = currentMouseX * 0.8;
      camera.position.y = -currentMouseY * 0.8;
      camera.lookAt(0, 0, 0);

      // Slow ambient particle cloud rotation & drift
      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05;

      // Animate wave motion on the floor grid
      const posAttr = gridGeo.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;

      let pIdx = 0;
      for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
          const wave =
            Math.sin(elapsedTime * 1.5 + c * 0.3) * 3 +
            Math.cos(elapsedTime * 1.2 + r * 0.3) * 3;

          array[pIdx * 3 + 1] = -45 + wave;
          pIdx++;
        }
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      geometry.dispose();
      particleMaterial.dispose();
      gridGeo.dispose();
      gridMaterial.dispose();
      texture.dispose();
      renderer.dispose();

      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
      aria-hidden="true"
    />
  );
}
