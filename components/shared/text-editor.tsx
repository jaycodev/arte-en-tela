'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'

interface TextEditorProps {
  onAdd: (text: string, color: string) => void
  onClose: () => void
}

export default function TextEditor({ onAdd, onClose }: TextEditorProps) {
  const [text, setText] = useState('')
  const [color, setColor] = useState('#000000')

  const handleAdd = () => {
    if (text.trim()) {
      onAdd(text, color)
      setText('')
      setColor('#000000')
      onClose()
    }
  }

  return (
    <div className="mt-4 space-y-3 border-t border-border pt-4">
      <div>
        <label className="text-xs font-medium text-muted-foreground">Texto</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe aquí..."
          className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
          maxLength={30}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          autoFocus
        />
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground">Color</label>
        <div className="mt-1 flex gap-2">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-9 w-9 cursor-pointer rounded-md border border-border"
          />
          <div
            className="flex-1 rounded-md border border-border text-center text-xs font-mono leading-9"
            style={{ backgroundColor: color }}
          >
            {color}
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button onClick={handleAdd} className="flex-1">
          Agregar
        </Button>
        <Button onClick={onClose} variant="outline" className="flex-1">
          Cancelar
        </Button>
      </div>
    </div>
  )
}
