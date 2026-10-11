/**
 * Pure-CSS cumulus layers: soft, slow, and cheap on the compositor.
 * Positions and drift speeds are passed in so each section can differ.
 */
export default function Clouds({ layers = [] }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {layers.map((layer, index) => (
        <span
          key={index}
          className="cloud"
          style={{
            width: layer.width,
            height: layer.height,
            top: layer.top,
            insetInlineStart: layer.start,
            opacity: layer.opacity ?? 0.75,
            filter: layer.blur ? `blur(${layer.blur})` : undefined,
            animationDuration: `${layer.duration ?? 90}s`,
            animationDelay: `${layer.delay ?? 0}s`,
          }}
        />
      ))}
    </div>
  )
}
