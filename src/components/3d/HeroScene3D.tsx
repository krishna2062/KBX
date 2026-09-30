import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface HeroScene3DProps {
  className?: string;
}

export const HeroScene3D: React.FC<HeroScene3DProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Verify WebGL availability
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch {
      setWebGlSupported(false);
      return;
    }

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    // Group for mouse parallax and floating motion
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Inner Metallic Emerald Organic Geosphere / Torus Hybrid Core
    const innerGeo = new THREE.IcosahedronGeometry(1.65, 3);
    const innerMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#072d1c'),
      emissive: new THREE.Color('#031a10'),
      roughness: 0.18,
      metalness: 0.94,
      clearcoat: 0.95,
      clearcoatRoughness: 0.08,
      reflectivity: 0.98,
      wireframe: false,
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    masterGroup.add(innerCore);

    // Outer Geodesic Network Sphere (Hexagonal / Triangular Wireframe Lattice)
    const networkGeo = new THREE.IcosahedronGeometry(2.35, 2);
    const wireframeGeo = new THREE.WireframeGeometry(networkGeo);
    const networkLineMat = new THREE.LineBasicMaterial({
      color: new THREE.Color('#10b981'),
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const networkMesh = new THREE.LineSegments(wireframeGeo, networkLineMat);
    masterGroup.add(networkMesh);

    // Network Interconnection Nodes (Glowing vertices on the sphere)
    const nodeCoords: number[] = [];
    const posAttr = networkGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      nodeCoords.push(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
    }
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.Float32BufferAttribute(nodeCoords, 3));
    const nodeMat = new THREE.PointsMaterial({
      color: new THREE.Color('#6ee7b7'),
      size: 0.12,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const networkNodes = new THREE.Points(nodeGeo, nodeMat);
    masterGroup.add(networkNodes);

    // Orbital Equatorial Data Ring
    const ringGeo = new THREE.TorusGeometry(3.3, 0.025, 16, 120);
    const ringMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#34d399'),
      emissive: new THREE.Color('#10b981'),
      emissiveIntensity: 0.5,
      roughness: 0.25,
      metalness: 0.8,
      transparent: true,
      opacity: 0.4,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.8;
    ringMesh.rotation.y = Math.PI / 5;
    masterGroup.add(ringMesh);

    // Ambient floating particles
    const particleCount = 75;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      particleScales[i] = Math.random() * 0.06 + 0.02;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: new THREE.Color('#34d399'),
      size: 0.08,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Lighting Setup
    const ambientLight = new THREE.AmbientLight(new THREE.Color('#031d12'), 1.8);
    scene.add(ambientLight);

    // Bright emerald key light
    const keyLight = new THREE.DirectionalLight(new THREE.Color('#34d399'), 3.2);
    keyLight.position.set(5, 6, 4);
    scene.add(keyLight);

    // Vibrant rim light from back-left
    const rimLight = new THREE.DirectionalLight(new THREE.Color('#10b981'), 4.0);
    rimLight.position.set(-6, -3, -4);
    scene.add(rimLight);

    // Interactive soft point light that tracks cursor
    const cursorLight = new THREE.PointLight(new THREE.Color('#6ee7b7'), 2.5, 12);
    cursorLight.position.set(0, 0, 4);
    scene.add(cursorLight);

    // Mouse parallax tracking
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);

      targetRotY = x * 0.45;
      targetRotX = -y * 0.35;

      cursorLight.position.x = x * 3.5;
      cursorLight.position.y = y * 3.5;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!container || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      if (prefersReducedMotion) {
        // Static rendered frame
        masterGroup.rotation.y = 0.6;
        masterGroup.rotation.x = 0.3;
        renderer?.render(scene, camera);
        return;
      }

      const elapsedTime = clock.getElapsedTime();

      // Continuous slow rotation of the 3D network sphere
      innerCore.rotation.y = elapsedTime * 0.18;
      innerCore.rotation.x = Math.sin(elapsedTime * 0.14) * 0.2;

      networkMesh.rotation.y = -elapsedTime * 0.14;
      networkMesh.rotation.x = Math.cos(elapsedTime * 0.12) * 0.18;
      networkNodes.rotation.y = networkMesh.rotation.y;
      networkNodes.rotation.x = networkMesh.rotation.x;

      ringMesh.rotation.z = -elapsedTime * 0.1;

      // Levitation floating motion
      masterGroup.position.y = Math.sin(elapsedTime * 0.75) * 0.18;

      // Smooth mouse lerping
      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;

      masterGroup.rotation.x = currentRotX;
      masterGroup.rotation.y = currentRotY;

      // Drift particles gently
      particles.rotation.y = elapsedTime * 0.03;

      renderer?.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Pause rendering when document hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        clock.start();
        animate();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);

      if (renderer) {
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
      innerGeo.dispose();
      innerMat.dispose();
      networkGeo.dispose();
      wireframeGeo.dispose();
      networkLineMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[420px] lg:min-h-[580px] flex items-center justify-center select-none ${className}`}
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      role="img"
      aria-label="Interactive 3D emerald organic technology sculpture reacting to cursor movement"
    >
      {/* Background Soft Emerald Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle 380px at 50% 50%, rgba(16, 185, 129, 0.18), rgba(5, 150, 105, 0.05) 55%, transparent 75%)',
          filter: 'blur(32px)'
        }}
      />

      {/* WebGL Fallback if not supported */}
      {!webGlSupported && (
        <div className="flex flex-col items-center justify-center p-8 text-center text-[#34d399]">
          <div className="w-48 h-48 rounded-full border border-emerald-500/30 bg-emerald-950/20 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-2 border-dashed border-emerald-400/40 animate-spin" />
          </div>
          <span className="mt-4 text-xs font-mono uppercase tracking-widest text-emerald-400/70">
            KBX Core Visual Matrix
          </span>
        </div>
      )}

      {/* Floating Interactive Tag */}
      <div
        className={`absolute bottom-4 right-4 text-[11px] font-mono text-emerald-400/60 pointer-events-none transition-opacity duration-300 hidden sm:block ${
          isInteracting ? 'opacity-90' : 'opacity-40'
        }`}
      >
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse" />
        Interactive WebGL Mesh · Move cursor to orbit
      </div>
    </div>
  );
};
