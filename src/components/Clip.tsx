import { useEffect, useState } from 'react';

const base = import.meta.env.BASE_URL;

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

/**
 * Two stacked frames crossfading on a 3s loop (1.5s per frame) so the pair
 * of photos reads like a short clip of the movement.
 */
export function Clip({
  exerciseId, alt, size = 'medium', onTap,
}: {
  exerciseId: string;
  alt: string;
  size?: 'small' | 'medium' | 'large';
  onTap?: () => void;
}) {
  const reduced = usePrefersReducedMotion();
  const src = (frame: 0 | 1) => `${base}exercises/${exerciseId}/${frame}.webp`;

  const inner = (
    <>
      <img src={src(0)} alt={alt} loading="lazy" draggable={false} />
      {!reduced && (
        <img
          src={src(1)}
          alt=""
          loading="lazy"
          draggable={false}
          className="clip-frame-b"
          aria-hidden
        />
      )}
    </>
  );

  if (onTap) {
    return (
      <button
        type="button"
        className={`clip clip-${size}`}
        onClick={onTap}
        aria-label={`${alt} — enlarge photo`}
      >
        {inner}
      </button>
    );
  }
  return <div className={`clip clip-${size}`}>{inner}</div>;
}

export function ClipModal({
  exerciseId, name, onClose,
}: {
  exerciseId: string;
  name: string;
  onClose: () => void;
}) {
  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-label={name}>
      <div className="clip-modal" onClick={(e) => e.stopPropagation()}>
        <Clip exerciseId={exerciseId} alt={name} size="large" />
        <div className="clip-modal-name">{name}</div>
        <button type="button" className="btn btn-ghost" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
