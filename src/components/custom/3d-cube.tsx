'use client';

import { useEffect, useRef } from 'react';

export function LowPolyCube() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let rotation = 0;
    let bobOffset = 0;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const size = 120;

    // Cube vertices (low-poly style)
    const vertices = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], // Front face
      [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],     // Back face
    ];

    // Cube faces (indices)
    const faces = [
      [0, 1, 2, 3], // Front
      [1, 5, 6, 2], // Right
      [5, 4, 7, 6], // Back
      [4, 0, 3, 7], // Left
      [3, 2, 6, 7], // Top
      [4, 5, 1, 0], // Bottom
    ];

    function rotateY(point: number[], angle: number): number[] {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return [
        point[0] * cos + point[2] * sin,
        point[1],
        -point[0] * sin + point[2] * cos,
      ];
    }

    function rotateX(point: number[], angle: number): number[] {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return [
        point[0],
        point[1] * cos - point[2] * sin,
        point[1] * sin + point[2] * cos,
      ];
    }

    function project(point: number[], bob: number): [number, number] {
      const scale = 200 / (200 + point[2]);
      return [
        centerX + point[0] * size * scale,
        centerY + point[1] * size * scale + bob,
      ];
    }

    function drawLock(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);

      // Lock body
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(-15, 0, 30, 35);

      // Lock shackle
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 12, Math.PI, 0, true);
      ctx.stroke();

      // Keyhole
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(0, 12, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(-2, 12, 4, 10);

      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      rotation += 0.005;
      bobOffset = Math.sin(rotation * 2) * 10;

      // Rotate and project vertices
      const rotatedVertices = vertices.map(v => {
        let point = rotateY(v, rotation);
        point = rotateX(point, rotation * 0.5);
        return point;
      });

      const projectedVertices = rotatedVertices.map(v => project(v, bobOffset));

      // Calculate face depths for sorting
      const facesWithDepth = faces.map((face, i) => {
        const depth = face.reduce((sum, idx) => sum + rotatedVertices[idx][2], 0) / face.length;
        return { face, depth, index: i };
      });

      // Sort faces by depth (painter's algorithm)
      facesWithDepth.sort((a, b) => a.depth - b.depth);

      // Draw faces
      facesWithDepth.forEach(({ face, index }) => {
        ctx.beginPath();
        ctx.moveTo(projectedVertices[face[0]][0], projectedVertices[face[0]][1]);
        for (let i = 1; i < face.length; i++) {
          ctx.lineTo(projectedVertices[face[i]][0], projectedVertices[face[i]][1]);
        }
        ctx.closePath();

        // Fill with black
        ctx.fillStyle = '#000000';
        ctx.fill();

        // Draw yellow edges
        ctx.strokeStyle = '#FFD200';
        ctx.lineWidth = 3;
        ctx.stroke();
      });

      // Draw lock on front face (face 0)
      const frontFace = faces[0];
      const frontCenter = [
        (projectedVertices[frontFace[0]][0] + projectedVertices[frontFace[2]][0]) / 2,
        (projectedVertices[frontFace[0]][1] + projectedVertices[frontFace[2]][1]) / 2,
      ];

      // Only draw lock if front face is visible
      const frontDepth = rotatedVertices[frontFace[0]][2];
      if (frontDepth < 0) {
        drawLock(ctx, frontCenter[0], frontCenter[1], 0.8);
      }

      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="max-w-full h-auto"
      />
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Proteção avançada para seus pagamentos
        </h1>
        <p className="text-lg md:text-xl text-gray-300">
          Análise precisa, clara e confiável
        </p>
      </div>
    </div>
  );
}

// Fallback SVG for static rendering
export function LowPolyCubeSVG() {
  return (
    <svg
      width="400"
      height="400"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="max-w-full h-auto"
    >
      {/* Cube faces */}
      <path
        d="M200 100 L280 150 L280 250 L200 300 L120 250 L120 150 Z"
        fill="#000000"
        stroke="#FFD200"
        strokeWidth="3"
      />
      <path
        d="M200 100 L280 150 L200 200 L120 150 Z"
        fill="#000000"
        stroke="#FFD200"
        strokeWidth="3"
      />
      <path
        d="M200 200 L280 150 L280 250 L200 300 Z"
        fill="#000000"
        stroke="#FFD200"
        strokeWidth="3"
      />

      {/* Lock icon */}
      <g transform="translate(200, 200)">
        {/* Lock body */}
        <rect x="-15" y="0" width="30" height="35" fill="#FFFFFF" />
        {/* Lock shackle */}
        <path
          d="M -12 0 A 12 12 0 0 1 12 0"
          stroke="#FFFFFF"
          strokeWidth="4"
          fill="none"
        />
        {/* Keyhole */}
        <circle cx="0" cy="12" r="4" fill="#000000" />
        <rect x="-2" y="12" width="4" height="10" fill="#000000" />
      </g>
    </svg>
  );
}
