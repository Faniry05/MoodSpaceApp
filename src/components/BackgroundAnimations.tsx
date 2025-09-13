import { motion } from "framer-motion";
import { useAnimation } from "@/contexts/AnimationProvider";
import { useMemo } from "react";

const BubblesAnimation = () => {
  const bubbles = useMemo(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 40 + 10,
      delay: Math.random() * 20,
      duration: Math.random() * 10 + 20,
      left: Math.random() * 100,
    })), []
  );

  return (
    <>
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute bg-primary/20 dark:bg-primary/10 rounded-full"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.left}%`,
          }}
          animate={{
            y: [window.innerHeight + 100, -100],
            opacity: [0, 0.7, 0.7, 0],
            scale: [0.5, 1, 1, 0.5],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </>
  );
};

const SnowAnimation = () => {
  const snowflakes = useMemo(() => 
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      size: Math.random() * 6 + 2,
      delay: Math.random() * 20,
      duration: Math.random() * 15 + 10,
      left: Math.random() * 100,
      drift: Math.random() * 100 - 50,
    })), []
  );

  return (
    <>
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute bg-foreground/40 dark:bg-white/70 rounded-full"
          style={{
            width: flake.size,
            height: flake.size,
            left: `${flake.left}%`,
          }}
          animate={{
            y: [0, window.innerHeight + 100],
            x: [0, flake.drift],
            rotate: [0, 360],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: flake.duration,
            delay: flake.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </>
  );
};

const ParticlesAnimation = () => {
  const particles = useMemo(() => 
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      size: Math.random() * 8 + 3,
      delay: Math.random() * 5,
      duration: Math.random() * 8 + 4,
      left: Math.random() * 100,
      top: Math.random() * 100,
      xMovement: Math.random() * 200 - 100,
      yMovement: Math.random() * 200 - 100,
    })), []
  );

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-primary/70 dark:bg-primary/60 rounded-full blur-[0.5px]"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={{
            x: [0, particle.xMovement, -particle.xMovement * 0.5, particle.xMovement * 0.3, 0],
            y: [0, particle.yMovement, -particle.yMovement * 0.3, particle.yMovement * 0.7, 0],
            scale: [0.5, 1.2, 0.8, 1, 0.5],
            opacity: [0, 0.9, 0.6, 0.9, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
};

const FirefliesAnimation = () => {
  const fireflies = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: Math.random() * 10 + 5,
      delay: Math.random() * 5,
      left: Math.random() * 100,
      top: Math.random() * 100,
    })), []
  );

  return (
    <>
      {fireflies.map((firefly) => (
        <motion.div
          key={firefly.id}
          className="absolute bg-yellow-400 dark:bg-yellow-400/80 rounded-full blur-sm"
          style={{
            width: firefly.size,
            height: firefly.size,
            left: `${firefly.left}%`,
            top: `${firefly.top}%`,
          }}
          animate={{
            x: [0, 50, -30, 20, 0],
            y: [0, -30, 40, -20, 0],
            opacity: [0.3, 1, 0.5, 1, 0.3],
            scale: [0.8, 1.2, 0.9, 1.1, 0.8],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            delay: firefly.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
};

export default function BackgroundAnimations() {
  const { animationType, isAnimationEnabled } = useAnimation();

  if (!isAnimationEnabled || animationType === 'none') {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {animationType === 'bubbles' && <BubblesAnimation />}
      {animationType === 'snow' && <SnowAnimation />}
      {animationType === 'particles' && <ParticlesAnimation />}
      {animationType === 'fireflies' && <FirefliesAnimation />}
    </div>
  );
}