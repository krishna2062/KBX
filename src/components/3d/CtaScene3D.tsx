import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const CtaScene3D: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch {
      return;
    }

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 6);

    const group = new THREE.Group();
    scene.add(group);

    // Faceted Icosahedron Gem
    const geometry = new THREE.IcosahedronGeometry(1.6, 1);
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#063821'),
      emissive: new THREE.Color('#032014'),
      roughness: 0.1,
      metalness: 0.9,
      transmission: 0.25,
      ior: 1.5,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      wireframe: false,
    });
    const gemMesh = new THREE.Mesh(geometry, material);
    group.add(gemMesh);

    // Inner wireframe lattice
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#34d399'),
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const innerLattice = new THREE.Mesh(new THREE.IcosahedronGeometry(1.62, 1), wireframeMat);
    group.add(innerLattice);

    // Lighting
    const amb = new THREE.AmbientLight(0x064e3b, 2.0);
    scene.add(amb);

    const dirLight1 = new THREE.DirectionalLight(0x34d399, 4.0);
    dirLight1.position.set(4, 5, 3);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x10b981, 3.0);
    dirLight2.position.set(-4, -4, -3);
    scene.add(dirLight2);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      if (prefersReducedMotion) {
        group.rotation.y = 0.5;
        group.rotation.x = 0.2;
        renderer?.render(scene, camera);
        return;
      }
      const t = clock.getElapsedTime();
      group.rotation.y = t * 0.35;
      group.rotation.x = Math.sin(t * 0.25) * 0.3;
      group.position.y = Math.sin(t * 1.2) * 0.15;

      renderer?.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer) {
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
      geometry.dispose();
      material.dispose();
      wireframeMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[280px] sm:h-[340px] flex items-center justify-center pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(circle 220px at 50% 50%, rgba(16, 185, 129, 0.15), transparent 70%)',
          filter: 'blur(24px)'
        }}
      />
    </div>
  );
};
