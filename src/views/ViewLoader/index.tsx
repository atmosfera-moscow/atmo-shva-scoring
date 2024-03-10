import loaderGif from '@assets/img/atmo_loader_opt.gif'
import { eViewIds } from '@views/enums'
import { iLoaderViewProps } from '@views/types'
import { Footnote, Panel, PanelHeader, View } from '@vkontakte/vkui'
import { FC, useEffect, useState } from 'react'
import { REACT_APP_APP_TITLE } from '../../shared/consts'
import './index.css'
import { TEXTS, TEXT_CHANGE_INTERVAL } from './consts'

export const ViewLoader: FC<iLoaderViewProps> = ({ ...rest }) => {
  const [isFadeIn, seIsFadeIn] = useState<boolean>(true)
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const fadeTimeout = setInterval(() => {
      seIsFadeIn(!isFadeIn)
    }, TEXT_CHANGE_INTERVAL / 2)
    return () => clearInterval(fadeTimeout)
  }, [isFadeIn])

  useEffect(() => {
    const wordTimeout = setInterval(() => {
      setWordIndex((wordIndex + 1) % TEXTS.length)
    }, TEXT_CHANGE_INTERVAL)
    return () => clearInterval(wordTimeout)
  }, [wordIndex])

  return (
    <View activePanel={eViewIds.Loader} {...rest}>
      <Panel id={eViewIds.Loader}>
        <PanelHeader delimiter="none" className="view-loader__header">
          {REACT_APP_APP_TITLE}
        </PanelHeader>
        <div className="view-loader__content">
          <img src={loaderGif} alt="loading" className="view-loader__content-spinner" />
          <Footnote caps className={`view-loader__content-text ${isFadeIn ? 'fade-in' : 'fade-out'}`}>
            {TEXTS[wordIndex]}
          </Footnote>
        </div>
      </Panel>
    </View>
  )
}
