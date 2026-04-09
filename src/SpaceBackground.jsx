import { useEffect, useRef } from "react";

export default function SpaceBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let stars = [];
    let shootingStars = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    // create stars
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        alpha: Math.random(),
        delta: Math.random() * 0.02,
      });
    }

    // shooting star
    function createShootingStar() {
      shootingStars.push({
        x: Math.random() * canvas.width,
        y: 0,
        length: Math.random() * 80 + 20,
        speed: Math.random() * 10 + 6,
        size: Math.random() * 1.5,
        wait: Math.random() * 3000,
      });
    }

    setInterval(createShootingStar, 2000);

    function animate() {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // draw stars
      stars.forEach((star) => {
        star.alpha += star.delta;

        if (star.alpha <= 0 || star.alpha >= 1) {
          star.delta = -star.delta;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
        ctx.fill();
      });

      // shooting stars
      shootingStars.forEach((s, i) => {
        ctx.beginPath();

        const gradient = ctx.createLinearGradient(
          s.x,
          s.y,
          s.x + s.length,
          s.y + s.length,
        );

        gradient.addColorStop(0, "white");
        gradient.addColorStop(1, "transparent");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = s.size;

        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + s.length, s.y + s.length);
        ctx.stroke();

        s.x += s.speed;
        s.y += s.speed;

        if (s.x > canvas.width || s.y > canvas.height) {
          shootingStars.splice(i, 1);
        }
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        background: "black",
      }}
    />
  );
}
