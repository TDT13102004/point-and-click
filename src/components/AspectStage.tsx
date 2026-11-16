import React, { useEffect, useRef, useState } from 'react';
import { AssetId, getAssetPath, NormalizedRect, SceneHotspot } from '../assets/assetRegistry';

export interface StageOverlay {
  id: AssetId;
  box?: NormalizedRect;
  opacity: number;
  className?: string;
}

interface AspectStageProps {
  baseImageId: AssetId;
  alt: string;
  aspectRatio?: number;
  overlays?: StageOverlay[];
  hotspots?: SceneHotspot[];
  showHotspots?: boolean;
  inspectedHotspotIds?: string[];
  onHotspotClick?: (hotspot: SceneHotspot) => void;
  reduceEffects?: boolean;
  children?: React.ReactNode;
}

export const AspectStage: React.FC<AspectStageProps> = ({
  baseImageId,
  alt,
  aspectRatio = 1672 / 941,
  overlays = [],
  hotspots = [],
  showHotspots = false,
  inspectedHotspotIds = [],
  onHotspotClick,
  reduceEffects = false,
  children,
}) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const update = () => {
      const cw = el.clientWidth;
      const ch = el.clientHeight;
      if (cw <= 0 || ch <= 0) return;

      let w: number;
      let h: number;
      if (cw / ch > aspectRatio) {
        h = ch;
        w = h * aspectRatio;
      } else {
        w = cw;
        h = w / aspectRatio;
      }
      setSize({ w: Math.floor(w), h: Math.floor(h) });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [aspectRatio]);

  return (
    <div className="aspect-stage-viewport" ref={viewportRef}>
      <div
        className="aspect-stage-frame"
        style={
          size
            ? { width: `${size.w}px`, height: `${size.h}px` }
            : { aspectRatio: `${aspectRatio}`, width: '100%' }
        }
      >
        <img
          src={getAssetPath(baseImageId)}
          alt={alt}
          className="aspect-stage-base"
          draggable={false}
        />

        {overlays.map((ov, index) => {
          if (ov.box) {
            const [x, y, w, h] = ov.box;
            return (
              <div
                key={`${ov.id}-${index}`}
                className={`stage-overlay-box ${reduceEffects ? 'no-anim' : ''} ${ov.className ?? ''}`}
                style={{
                  left: `${x * 100}%`,
                  top: `${y * 100}%`,
                  width: `${w * 100}%`,
                  height: `${h * 100}%`,
                  opacity: ov.opacity,
                }}
                aria-hidden="true"
              >
                <img src={getAssetPath(ov.id)} alt="" draggable={false} />
              </div>
            );
          }

          return (
            <img
              key={`${ov.id}-${index}`}
              src={getAssetPath(ov.id)}
              alt=""
              aria-hidden="true"
              className={`stage-overlay-full ${ov.className ?? ''}`}
              style={{ opacity: ov.opacity }}
              draggable={false}
            />
          );
        })}

        {children}

        {hotspots.map((spot) => {
          const [x, y, w, h] = spot.rect;
          const isInspected = inspectedHotspotIds.includes(spot.id);
          return (
            <button
              key={spot.id}
              type="button"
              className={`stage-hotspot ${spot.tagPosition === 'top' ? 'tag-top' : ''} ${
                showHotspots ? 'visible' : ''
              } ${isInspected ? 'inspected' : ''}`}
              style={{
                left: `${x * 100}%`,
                top: `${y * 100}%`,
                width: `${w * 100}%`,
                height: `${h * 100}%`,
              }}
              onClick={() => onHotspotClick?.(spot)}
              aria-label={spot.label}
              title={spot.label}
            >
              <span className="hotspot-tag">
                {spot.label}
                {isInspected ? ' ✓' : ''}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
