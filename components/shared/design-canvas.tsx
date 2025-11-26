'use client'

interface Design {
  id: string
  text: string
  color: string
  size: number
  type: 'front' | 'back'
}

interface Line {
  id: string
  x1: number
  y1: number
  x2: number
  y2: number
  color: string
  width: number
  type: 'front' | 'back'
}

interface Image {
  id: string
  src: string
  x: number
  y: number
  size: number
  type: 'front' | 'back'
}

interface DesignCanvasProps {
  shirtColor: string
  neckline: 'round' | 'v' | 'polo'
  designs: Design[]
  selectedDesign: string | null
  onSelectDesign: (id: string) => void
  lines: Line[]
  images: Image[]
  selectedImage: string | null
  onSelectImage: (id: string) => void
}

export default function DesignCanvas({
  shirtColor,
  neckline,
  designs,
  selectedDesign,
  onSelectDesign,
  lines,
  images,
  selectedImage,
  onSelectImage,
}: DesignCanvasProps) {
  const getNecklineD = () => {
    switch (neckline) {
      case 'v':
        return 'M 90 65 L 100 80 L 110 65'
      case 'polo':
        return 'M 88 65 Q 100 68 112 65'
      case 'round':
      default:
        return 'M 85 68 Q 100 62 115 68'
    }
  }

  return (
    <div className="relative" style={{ perspective: '1000px' }}>
      <div className="relative aspect-[3/4] w-full max-w-xs">
        <svg viewBox="0 0 200 280" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          {/* ... existing neckline and body paths ... */}
          {/* Neckline */}
          <path d={getNecklineD()} fill={shirtColor} stroke="#999" strokeWidth="0.5" />

          {/* Left shoulder */}
          <path
            d="M 90 65 Q 70 70 60 90 L 80 75"
            fill={shirtColor}
            stroke="#999"
            strokeWidth="0.5"
          />

          {/* Right shoulder */}
          <path
            d="M 110 65 Q 130 70 140 90 L 120 75"
            fill={shirtColor}
            stroke="#999"
            strokeWidth="0.5"
          />

          {/* Main body */}
          <path
            d="M 60 85 L 50 220 Q 50 260 100 270 Q 150 260 150 220 L 140 85"
            fill={shirtColor}
            stroke="#999"
            strokeWidth="0.5"
          />

          {/* Left sleeve */}
          <ellipse
            cx="35"
            cy="100"
            rx="20"
            ry="35"
            fill={shirtColor}
            stroke="#999"
            strokeWidth="0.5"
          />

          {/* Right sleeve */}
          <ellipse
            cx="165"
            cy="100"
            rx="20"
            ry="35"
            fill={shirtColor}
            stroke="#999"
            strokeWidth="0.5"
          />

          {lines.map((line) => (
            <line
              key={line.id}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={line.color}
              strokeWidth={line.width}
              strokeLinecap="round"
            />
          ))}
        </svg>

        {/* Design overlay - Textos e Imágenes */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-32 w-32">
            {/* Textos */}
            {designs.map((design) => (
              <div
                key={design.id}
                onClick={() => onSelectDesign(design.id)}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none transition-all ${
                  selectedDesign === design.id ? 'ring-2 ring-primary ring-offset-2' : ''
                }`}
                style={{
                  color: design.color,
                  fontSize: `${(design.size * 2) / 3}px`,
                  fontWeight: 'bold',
                }}
              >
                {design.text}
              </div>
            ))}

            {images.map((image) => (
              <img
                key={image.id}
                src={image.src || '/placeholder.svg'}
                alt="design"
                onClick={() => onSelectImage(image.id)}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-md object-cover transition-all ${
                  selectedImage === image.id ? 'ring-2 ring-primary ring-offset-2' : ''
                }`}
                style={{
                  width: `${image.size}px`,
                  height: `${image.size}px`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
