
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DynamicGalleryProps {
  images: { image: string; alt: string; id: string }[];
}

// Switched order so the first is the most background and the last is the front-most
const frameProps = [
  {
    // Previously front-most, now back-most
    className: "absolute left-1/2 top-20 w-[60%] md:w-[64%] aspect-square -translate-x-1/2 z-0 rounded-xl shadow",
    style: { transform: "translate(-50%, 0) scale(0.67)" },
    animate: { scale: 0.67, y: 84, opacity: 0.45, filter: "brightness(0.68)" },
    transition: { duration: 0.5 }
  },
  {
    className: "absolute left-1/2 top-14 w-[64%] md:w-[70%] aspect-square -translate-x-1/2 z-10 rounded-xl shadow-md",
    style: { transform: "translate(-50%, 0) scale(0.79)" },
    animate: { scale: 0.79, y: 56, filter: "brightness(0.82)" },
    transition: { duration: 0.5 }
  },
  {
    className: "absolute left-1/2 top-8 w-[70%] md:w-[77%] aspect-square -translate-x-1/2 z-20 rounded-xl shadow-xl",
    style: { transform: "translate(-50%, 0) scale(0.93)" },
    animate: { scale: 0.93, y: 28, filter: "brightness(0.9)" },
    transition: { duration: 0.5 }
  },
  {
    // Previously back-most, now front-most and prominent
    className: "absolute left-[45%] top-4 w-[77%] md:w-[85%] aspect-square -translate-x-1/2 z-30 shadow-2xl rounded-xl ring-4 ring-primary bg-card",
    style: { transform: "translate(-50%, 0) scale(1.07)" },
    animate: { scale: 1.07, y: 0, boxShadow: "0 16px 32px 0 rgba(70,88,225,0.12)", filter: "brightness(1)" },
    transition: { duration: 0.5 }
  }
];

export const DynamicGallery: React.FC<DynamicGalleryProps> = ({ images }) => {
  const [positions, setPositions] = useState([0, 1, 2, 3]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setPositions((prev) => {
        return [...prev.slice(1), prev[0]];
      });
    }, 5000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [positions]);

  // Apply the swapped frameProps order: map the first position in array to the most "background" style
  return (
    <div className="relative h-[320px] sm:h-[360px] md:h-[430px] w-full flex items-center justify-center">
      {positions.map((imgIdx, i) => {
        const nft = images[imgIdx];
        if (!nft) return null;
        const fr = frameProps[i];
        return (
          <motion.div
            key={nft.id}
            initial={{ scale: fr.animate.scale, y: fr.animate.y, opacity: i === 0 ? 0.45 : 1 }}
            animate={fr.animate}
            transition={fr.transition}
            className={cn(fr.className, "overflow-hidden group")}
            style={fr.style}
          >
            <img
              src={nft.image}
              alt={nft.alt}
              className="w-full h-full object-cover select-none pointer-events-none rounded-xl"
              draggable={false}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
