

import styles from './PlayButton.module.scss'

type PlayButtonProps = {
    isPlaying: boolean
    handlePlay: () => void
}

const PlayButton = ({ isPlaying, handlePlay }: PlayButtonProps) => {
    console.log("---->", isPlaying)
    return <button
        className={styles.play}
        onClick={handlePlay}
    >
        {isPlaying ? "Pause" : "Play"}
    </button>
}

export default PlayButton