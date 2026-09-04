"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeScrollCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0c0a08, 0.02);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 2. Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0x181512, 2.2);
    scene.add(ambientLight);

    // 3. Dynamic Lights that FOLLOW the 3D Object
    const followingAmberLight = new THREE.PointLight(0xe8a33d, 70, 25);
    scene.add(followingAmberLight);

    const followingTealLight = new THREE.PointLight(0x3eb89f, 55, 20);
    scene.add(followingTealLight);

    const followingCyanHalo = new THREE.PointLight(0x00f0ff, 45, 18);
    scene.add(followingCyanHalo);

    // 4. Compact Cyberpunk Energy Ball Group
    const ballGroup = new THREE.Group();
    scene.add(ballGroup);

    // -- A. Small Inner Glowing Cyber Core (Radius 0.44)
    const coreGeo = new THREE.IcosahedronGeometry(0.44, 2);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0xe8a33d,
      emissive: 0x2f6e62,
      emissiveIntensity: 0.5,
      metalness: 0.85,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    });
    const coreBall = new THREE.Mesh(coreGeo, coreMat);
    ballGroup.add(coreBall);

    // -- B. Outer Translucent Glass Holographic Shell
    const shellGeo = new THREE.SphereGeometry(0.50, 32, 32);
    const shellMat = new THREE.MeshPhysicalMaterial({
      color: 0x3eb89f,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.92,
      thickness: 0.5,
      transparent: true,
      opacity: 0.45,
      reflectivity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });
    const shellBall = new THREE.Mesh(shellGeo, shellMat);
    ballGroup.add(shellBall);

    // -- C. Glowing Wireframe Grid
    const wireGeo = new THREE.IcosahedronGeometry(0.53, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireBall = new THREE.Mesh(wireGeo, wireMat);
    ballGroup.add(wireBall);

    // -- D. Orbiting Neon Laser Halos
    const halo1Geo = new THREE.TorusGeometry(0.66, 0.01, 16, 80);
    const halo1Mat = new THREE.MeshBasicMaterial({
      color: 0xe8a33d,
      transparent: true,
      opacity: 0.85,
    });
    const halo1 = new THREE.Mesh(halo1Geo, halo1Mat);
    halo1.rotation.x = Math.PI / 4;
    ballGroup.add(halo1);

    const halo2Geo = new THREE.TorusGeometry(0.76, 0.01, 16, 80);
    const halo2Mat = new THREE.MeshBasicMaterial({
      color: 0x3eb89f,
      transparent: true,
      opacity: 0.75,
    });
    const halo2 = new THREE.Mesh(halo2Geo, halo2Mat);
    halo2.rotation.y = Math.PI / 3;
    ballGroup.add(halo2);

    // -- E. 800 Subtle Floating Quantum Particles
    const pCount = 800;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pCol = new Float32Array(pCount * 3);

    const cAmber = new THREE.Color(0xe8a33d);
    const cTeal = new THREE.Color(0x3eb89f);
    const cCyan = new THREE.Color(0x00f0ff);
    const cWhite = new THREE.Color(0xf2efe9);

    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 22;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 18;

      const r = Math.random();
      const c = r > 0.65 ? cAmber : r > 0.35 ? cTeal : r > 0.15 ? cCyan : cWhite;
      pCol[i * 3] = c.r;
      pCol[i * 3 + 1] = c.g;
      pCol[i * 3 + 2] = c.b;
    }

    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(pCol, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particleField = new THREE.Points(pGeo, pMat);
    scene.add(particleField);

    // 5. Scroll Tracking
    const tracking = {
      targetProgress: 0,
      currentProgress: 0,
      targetMouseX: 0,
      targetMouseY: 0,
      currentMouseX: 0,
      currentMouseY: 0,
    };

    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        tracking.targetProgress = Math.min(Math.max(window.scrollY / total, 0), 1);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      tracking.targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      tracking.targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    onScroll();

    // 6. Resize Listener
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", onResize, { passive: true });

    // 7. Animation Loop (Strictly Scroll-Driven Across the Entire Website)
    let reqId: number;

    const animate = () => {
      reqId = requestAnimationFrame(animate);

      const speed = prefersReducedMotion ? 0.3 : 0.08;
      tracking.currentProgress += (tracking.targetProgress - tracking.currentProgress) * speed;
      tracking.currentMouseX += (tracking.targetMouseX - tracking.currentMouseX) * 0.04;
      tracking.currentMouseY += (tracking.targetMouseY - tracking.currentMouseY) * 0.04;

      const p = tracking.currentProgress;
      const mx = tracking.currentMouseX;
      const my = tracking.currentMouseY;

      // STRICT SCROLL-DRIVEN ROTATIONS (Static when scroll stops)
      halo1.rotation.z = p * Math.PI * 6.0;
      halo2.rotation.y = p * Math.PI * 7.0;
      wireBall.rotation.y = p * Math.PI * 3.0;
      coreBall.rotation.y = p * Math.PI * 3.5;
      coreBall.rotation.x = p * Math.PI * 2.0;
      particleField.rotation.y = p * 0.7;

      const isMobile = window.innerWidth < 768;
      const scale = isMobile ? 0.8 : 1.0;

      // -------------------------------------------------------------
      // Smooth VERTICAL UPSIDE-DOWN Path (Top to Bottom) across the entire site
      // -------------------------------------------------------------
      // Start top-right at Hero (y = 2.4), move down continuously to bottom at FAQ (y = -2.6)
      const x = isMobile ? 1.8 : 3.2;
      const y = 2.4 - p * 5.0; // Moves continuously from +2.4 down to -2.6
      const z = 0.3;

      const parallaxX = mx * (isMobile ? 0.04 : 0.12);
      const parallaxY = my * (isMobile ? 0.04 : 0.1);

      ballGroup.position.x += (x + parallaxX - ballGroup.position.x) * 0.08;
      ballGroup.position.y += (y + parallaxY - ballGroup.position.y) * 0.08;
      ballGroup.position.z += (z - ballGroup.position.z) * 0.08;

      ballGroup.scale.setScalar(scale);

      // DYNAMIC LIGHTS THAT FOLLOW THE 3D OBJECT AS IT MOVES UP TO DOWN
      followingAmberLight.position.set(
        ballGroup.position.x + 0.3,
        ballGroup.position.y + 0.5,
        ballGroup.position.z + 1.2
      );

      followingTealLight.position.set(
        ballGroup.position.x - 0.4,
        ballGroup.position.y - 0.4,
        ballGroup.position.z + 0.8
      );

      followingCyanHalo.position.set(
        ballGroup.position.x,
        ballGroup.position.y,
        ballGroup.position.z + 0.5
      );

      // Color/Lighting Shift based on Scroll Position
      const colorMix = (Math.sin(p * Math.PI * 3) + 1) * 0.5;
      coreMat.color.setHSL(0.08 + colorMix * 0.35, 0.85, 0.55);
      followingAmberLight.intensity = 55 + Math.sin(p * Math.PI * 4) * 20;
      followingTealLight.intensity = 45 + Math.cos(p * Math.PI * 4) * 15;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Cleanup
    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      coreGeo.dispose();
      coreMat.dispose();
      shellGeo.dispose();
      shellMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      halo1Geo.dispose();
      halo1Mat.dispose();
      halo2Geo.dispose();
      halo2Mat.dispose();
      pGeo.dispose();
      pMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
    />
  );
}
