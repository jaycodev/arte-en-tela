'use client'

interface NecklineSelectorProps {
  value: 'round' | 'v' | 'polo'
  onChange: (neckline: 'round' | 'v' | 'polo') => void
}

export default function NecklineSelector({ value, onChange }: NecklineSelectorProps) {
  const options = [
    { id: 'round', label: 'Redondo', description: 'Clásico' },
    { id: 'v', label: 'Escote V', description: 'Moderno' },
    { id: 'polo', label: 'Polo', description: 'Deportivo' },
  ] as const

  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onChange(option.id)}
          className={`flex flex-col items-center gap-1 rounded-lg border-2 px-3 py-2 text-center transition-all ${
            value === option.id
              ? 'border-primary bg-secondary'
              : 'border-border hover:border-primary/50'
          }`}
        >
          <span className="text-xs font-medium">{option.label}</span>
          <span className="text-xs text-muted-foreground">{option.description}</span>
        </button>
      ))}
    </div>
  )
}
