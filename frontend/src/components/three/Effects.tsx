import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'

export function Effects() {
  return (
    <EffectComposer>
      <Bloom intensity={0.55} luminanceThreshold={0.72} luminanceSmoothing={0.3} mipmapBlur />
      <Vignette eskil={false} offset={0.18} darkness={0.72} />
    </EffectComposer>
  )
}
