'use client'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  colors?: string[]
}

export default function ColorPicker({ value, onChange, colors = [] }: ColorPickerProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={`h-8 w-8 rounded-md border-2 transition-transform hover:scale-110 ${
              value === color ? 'ring-2 ring-primary ring-offset-2' : 'border-border'
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-10 cursor-pointer rounded-md border border-border"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-md border border-border px-3 py-2 text-sm font-mono"
          placeholder="#ffffff"
        />
      </div>
    </div>
  )
}
