import { useEffect, useRef } from 'react';
import { motion as Motion, useAnimation } from 'framer-motion';

const dots = Array.from({ length: 40 }, (_, index) => ({
  id: index,
  size: 4 + Math.random() * 4,
  offsetX: Math.random() * 100,
  offsetY: Math.random() * 100,
  duration: 12 + Math.random() * 10,
}));

const ParticlesBackground = () => {
  const controls = useAnimation();
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    const animate = async () => {
      while (true) {
        await controls.start({
          opacity: [0.2, 0.65, 0.2],
          transition: {
            duration: 6,
            repeat: 1,
            repeatType: 'reverse',
            ease: 'easeInOut',
          },
        });
      }
    };

    animate();
  }, [controls]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-dashboard-grid opacity-80"></div>
      <Motion.div animate={controls} className="absolute inset-0">
        {dots.map((dot) => (
          <Motion.span
            key={dot.id}
            className="absolute rounded-full bg-brand-emerald/40 shadow-emerald"
            style={{
              width: dot.size,
              height: dot.size,
              top: `${dot.offsetY}%`,
              left: `${dot.offsetX}%`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: dot.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: dot.id * 0.15,
            }}
          />
        ))}
      </Motion.div>
      <Motion.div
        className="absolute -left-20 top-1/4 h-96 w-96 rounded-full bg-brand-emerald/15 blur-3xl"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <Motion.div
        className="absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-accent-indigo/20 blur-[120px]"
        animate={{ scale: [1, 0.94, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
};

export default ParticlesBackground;
