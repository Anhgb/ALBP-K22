import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ThreeBackground
 * - Particle field  (2 400 points)
 * - Wireframe tori + icosahedra floating
 * - Mouse parallax on the camera
 * - Subtle pulse / drift animation
 */
export default function ThreeBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    /* ── renderer ─────────────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    /* ── scene & camera ───────────────────────────────────── */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 8);

    /* ── PARTICLES ────────────────────────────────────────── */
    const COUNT = 2400;
    const pos   = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    const pgeo = new THREE.BufferGeometry();
    pgeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pmat = new THREE.PointsMaterial({
      color: 0xa78bfa, size: 0.055, sizeAttenuation: true,
      transparent: true, opacity: 0.75, depthWrite: false,
    });
    const particles = new THREE.Points(pgeo, pmat);
    scene.add(particles);

    /* ── WIREFRAME SHAPES helper ──────────────────────────── */
    const shapes = [];

    function addShape(geo, color, pos, rotSpeed) {
      const mat  = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.22 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      mesh.userData.rotSpeed = rotSpeed;
      mesh.userData.initY    = pos[1];
      mesh.userData.phase    = Math.random() * Math.PI * 2;
      scene.add(mesh);
      shapes.push(mesh);
    }

    // Tori
    addShape(new THREE.TorusGeometry(0.9, 0.27, 14, 58), 0x7c3aed, [-5.5,  2.5, -4], { x: 0.28, y: 0.20 });
    addShape(new THREE.TorusGeometry(0.8, 0.24, 14, 58), 0x06b6d4, [ 5.5, -2.5, -5], { x: 0.18, y: 0.14 });
    addShape(new THREE.TorusGeometry(0.7, 0.20, 14, 58), 0xa78bfa, [ 0.0,  4.0, -6], { x: 0.22, y: 0.16 });
    addShape(new THREE.TorusGeometry(1.0, 0.30, 14, 58), 0xf43f5e, [-2.0, -4.5, -7], { x: 0.15, y: 0.22 });

    // Icosahedra
    addShape(new THREE.IcosahedronGeometry(0.65, 0), 0x06b6d4, [-4.0, -3.0, -3], { x: 0.35, z: 0.25 });
    addShape(new THREE.IcosahedronGeometry(0.55, 0), 0x7c3aed, [ 4.5,  3.0, -4], { x: 0.25, z: 0.18 });
    addShape(new THREE.IcosahedronGeometry(0.50, 0), 0xf59e0b, [-2.0,  5.0, -5], { x: 0.20, z: 0.30 });
    addShape(new THREE.IcosahedronGeometry(0.60, 0), 0x10b981, [ 6.0, -1.0, -6], { x: 0.30, z: 0.20 });

    // Octahedra
    addShape(new THREE.OctahedronGeometry(0.6, 0), 0xa78bfa, [ 3.0,  5.5, -4], { y: 0.30, z: 0.22 });
    addShape(new THREE.OctahedronGeometry(0.5, 0), 0x06b6d4, [-6.0,  1.0, -5], { y: 0.22, z: 0.18 });

    /* ── MOUSE parallax ───────────────────────────────────── */
    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    /* ── RESIZE ───────────────────────────────────────────── */
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    /* ── ANIMATE ──────────────────────────────────────────── */
    let animId;
    const clock = new THREE.Clock();

    function animate() {
      animId = requestAnimationFrame(animate);
      const t     = clock.getElapsedTime();
      const delta = clock.getDelta ? 0.016 : 0.016;

      // Particle drift
      particles.rotation.y = t * 0.045;
      particles.rotation.x = t * 0.022 + mouse.y * 0.06;

      // Shapes
      shapes.forEach((mesh) => {
        const rs = mesh.userData.rotSpeed;
        if (rs.x) mesh.rotation.x += 0.016 * rs.x;
        if (rs.y) mesh.rotation.y += 0.016 * rs.y;
        if (rs.z) mesh.rotation.z += 0.016 * rs.z;
        // gentle float
        mesh.position.y = mesh.userData.initY + Math.sin(t * 0.6 + mesh.userData.phase) * 0.35;
      });

      // Camera parallax
      camera.position.x += (mouse.x * 1.4 - camera.position.x) * 0.025;
      camera.position.y += (-mouse.y * 1.4 - camera.position.y) * 0.025;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }

    animate();

    /* ── CLEANUP ──────────────────────────────────────────── */
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize',    onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        width: '100vw',
        height: '100vh',
      }}
    />
  );
}
