import blockGif from '@assets/img/cat_wait.gif'
import { ePanelIds, eViewIds } from '@src/shared/enums'
import { iNonAuthViewsProps } from '@views/types'
import { Panel, PanelHeader, Text, View } from '@vkontakte/vkui'
import { FC } from 'react'
import { REACT_APP_APP_TITLE } from '../../shared/consts'
import './index.css'

export const ViewNotLoaded: FC<iNonAuthViewsProps> = ({ ...rest }) => (
  <View activePanel={eViewIds.NotLoaded} {...rest}>
    <Panel id={ePanelIds.NotLoaded}>
      <PanelHeader delimiter="none">{REACT_APP_APP_TITLE}</PanelHeader>
      <div className="view-notloaded__content">
        <Text className="view-notloaded__content-text">При загрузке произошла ошибка. Пожалуйста, попробуй позже.</Text>
        <img src={blockGif} alt="Access denied" className="view-notloaded__image" />
      </div>
    </Panel>
  </View>
)
