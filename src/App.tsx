import { useEffect, useRef, useState } from 'react'
import * as Tone from 'tone'
import styles from './App.module.scss'
import PlayButton from './components/PlayButton'

type SamplesProps = {
  samples: { url: string, name: string }[]
  steps: number
}

type Track = {
  id: number
  sampler: Tone.Sampler
}

const NOTE = "C2"

function App({ samples, steps }: SamplesProps) {
  const [isPlaying, setIsPlaying] = useState(false)



  const trackIds = [...Array(samples.length).keys()] // x4
  const stepIds = [...Array(steps).keys()] // x16

  const trackRef = useRef<Track[]>([])
  const stepRef = useRef<HTMLInputElement[][]>([[]])
  const seqRef = useRef<Tone.Sequence | null>(null)


  useEffect(() => {
    trackRef.current = samples.map((sample, i) => {
      return {
        id: i,
        sampler: new Tone.Sampler({
          urls: { [NOTE]: sample.url }
        }).toDestination()
      }
    })
    seqRef.current = new Tone.Sequence(
      (time, step) => {
        trackRef.current.map((trk) => {
          if (stepRef.current[trk.id][step].checked) {
            trk.sampler.triggerAttack(NOTE, time)
          }
        })
      },
      [...stepIds],
      "16n"
    )
    seqRef.current.start(0)

    return () => {
      seqRef.current?.dispose()
      trackRef.current.forEach(track => {
        track.sampler.dispose()
      })
    }
  }, [samples, steps])

  const handlePlay = async () => {
    if (Tone.Transport.state === "started") {
      Tone.Transport.stop()
      setIsPlaying(false)
    } else {
      await Tone.start()
      Tone.Transport.start()
      setIsPlaying(true)
    }
  }


  return (
    <div className={styles.container}>
      <div className={styles.cellList}>
        {
          trackIds.map((trackId) => { // x4
            return <div className={styles.row}>
              {
                stepIds.map(stepId => {
                  const id = trackId + " - " + stepId
                  return <label className={styles.cell} key={id}>
                    <input
                      ref={(elem) => {
                        if (!elem) return
                        if (!stepRef.current[trackId]) {
                          stepRef.current[trackId] = []
                        }
                        stepRef.current[trackId][stepId] = elem
                      }}

                      id={id}
                      type='checkbox'
                      className={styles.cell__input}
                    />
                    <div className={styles.cell__content} />
                  </label>
                })
              }
            </div>
          })
        }
        <div className={styles.controls}>
          <PlayButton isPlaying={isPlaying} handlePlay={handlePlay} />
        </div>
      </div>
    </div>
  )
}

export default App
