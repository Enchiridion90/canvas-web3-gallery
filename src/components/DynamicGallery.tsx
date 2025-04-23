
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DynamicGalleryProps {
  images: { image: string; alt: string; id: string }[];
}

const frameProps = [
  {
    className: "absolute left-1/2 top-1/2 w-[85%] md:w-[90%] aspect-square -translate-x-1/2 -translate-y-1/2 z-30 rounded-xl",
    variants: {
      initial: { scale: 0.9, y: 0, opacity: 0 },
      animate: { scale: 1, y: 0, opacity: 1, filter: "brightness(1)" },
      exit: { scale: 0.9, y: 20, opacity: 0 }
    }
  },
  {
    className: "absolute left-1/2 top-1/2 w-[75%] md:w-[80%] aspect-square -translate-x-1/2 -translate-y-1/2 z-20 rounded-xl",
    variants: {
      initial: { scale: 0.8, y: -20, opacity: 0 },
      animate: { scale: 0.85, y: -40, opacity: 0.8, filter: "brightness(0.9)" },
      exit: { scale: 0.8, y: -60, opacity: 0 }
    }
  },
  {
    className: "absolute left-1/2 top-1/2 w-[65%] md:w-[70%] aspect-square -translate-x-1/2 -translate-y-1/2 z-10 rounded-xl",
    variants: {
      initial: { scale: 0.7, y: -40, opacity: 0 },
      animate: { scale: 0.7, y: -80, opacity: 0.6, filter: "brightness(0.8)" },
      exit: { scale: 0.7, y: -100, opacity: 0 }
    }
  },
  {
    className: "absolute left-1/2 top-1/2 w-[55%] md:w-[60%] aspect-square -translate-x-1/2 -translate-y-1/2 z-0 rounded-xl",
    variants: {
      initial: { scale: 0.6, y: -60, opacity: 0 },
      animate: { scale: 0.6, y: -120, opacity: 0.4, filter: "brightness(0.7)" },
      exit: { scale: 0.6, y: -140, opacity: 0 }
    }
  }
];

export const DynamicGallery: React.FC<DynamicGalleryProps> = ({ images }) => {
  const [positions, setPositions] = useState([0, 1, 2, 3]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setPositions((prev) => [...prev.slice(1), prev[0]]);
    }, 4000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [positions]);

  return (
    <div className="relative h-[400px] md:h-[500px] w-full">
      <AnimatePresence mode="popLayout">
        {positions.map((imgIdx, i) => {
          const nft = images[imgIdx];
          if (!nft) return null;
          const fr = frameProps[i];
          
          return (
            <motion.div
              key={`${nft.id}-${i}`}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={fr.variants}
              transition={{ 
                duration: 0.6,
                ease: [0.32, 0.72, 0, 1]
              }}
              className={cn(
                fr.className,
                "overflow-hidden group hover:scale-105 transition-transform duration-300"
              )}
            >
              <motion.img
                src={nft.image}
                alt={nft.alt}
                className="w-full h-full object-cover select-none pointer-events-none rounded-xl shadow-2xl"
                draggable={false}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8 }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
