import { useCallback, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Camera, Upload, Video } from 'lucide-react'
import type { SkillType } from '../types'
import { SKILL_OPTIONS } from '../types'

interface AnalyzePageProps {
  onBack: () => void
  onAnalyze: (file: File, skill: SkillType) => void
  isLoading: boolean
}

export function AnalyzePage({ onBack, onAnalyze, isLoading }: AnalyzePageProps) {
  const [skill, setSkill] = useState<SkillType>('shot')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith('video/')) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const f = e.dataTransfer.files[0]
      if (f) handleFile(f)
    },
    [handleFile],
  )

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch {
      alert('Camera access denied. Please upload a video instead.')
    }
  }

  const stopCamera = () => {
    const video = videoRef.current
    if (video?.srcObject) {
      ;(video.srcObject as MediaStream).getTracks().forEach((t) => t.stop())
      video.srcObject = null
    }
  }

  const canSubmit = file && !isLoading

  return (
    <div className="gradient-pitch min-h-screen">
      <header className="flex items-center gap-4 px-6 py-5 max-w-3xl mx-auto">
        <button
          onClick={() => {
            stopCamera()
            onBack()
          }}
          className="glass rounded-xl p-2 hover:bg-white/8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">New Analysis</h1>
      </header>

      <main className="max-w-3xl mx-auto px-6 pb-16 space-y-8">
        {/* Skill picker */}
        <section>
          <h2 className="text-sm uppercase tracking-widest text-stone-500 mb-4">
            1 · Select Skill
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {SKILL_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSkill(opt.id)}
                className={`glass rounded-2xl p-4 text-left transition-all ${
                  skill === opt.id
                    ? 'border-grass bg-grass/10 ring-1 ring-grass/50'
                    : 'hover:border-white/20'
                }`}
              >
                <span className="text-2xl mb-2 block">{opt.icon}</span>
                <span className="font-bold block">{opt.label}</span>
                <span className="text-xs text-stone-400">{opt.desc}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Upload */}
        <section>
          <h2 className="text-sm uppercase tracking-widest text-stone-500 mb-4">
            2 · Upload Clip (max 30 sec)
          </h2>

          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={`glass rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
              dragOver ? 'border-grass bg-grass/5' : 'border-white/10 hover:border-white/20'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) handleFile(f)
              }}
            />

            {preview ? (
              <video
                src={preview}
                controls
                className="max-h-48 mx-auto rounded-xl mb-4"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <Upload className="w-10 h-10 text-stone-500 mx-auto mb-4" />
            )}

            <p className="font-medium mb-1">
              {file ? file.name : 'Drop video here or click to browse'}
            </p>
            <p className="text-sm text-stone-500">MP4, WebM, MOV · Max 50 MB</p>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={startCamera}
              className="flex-1 glass rounded-xl py-3 flex items-center justify-center gap-2 text-sm hover:bg-white/8"
            >
              <Camera className="w-4 h-4" />
              Use Camera
            </button>
          </div>

          <video ref={videoRef} className="hidden" muted playsInline />
        </section>

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          disabled={!canSubmit}
          onClick={() => file && onAnalyze(file, skill)}
          className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
            canSubmit
              ? 'bg-grass hover:bg-grass-bright text-stadium hover:shadow-lg hover:shadow-grass/25'
              : 'bg-stone-800 text-stone-600 cursor-not-allowed'
          }`}
        >
          <Video className="w-5 h-5" />
          {isLoading ? 'Analyzing…' : 'Run AI Analysis'}
        </motion.button>
      </main>
    </div>
  )
}
