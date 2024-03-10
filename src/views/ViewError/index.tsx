import blockGif from '@assets/img/cat_wait.gif'
import { eViewIds } from '@views/enums'
import { iErrorViewProps } from '@views/types'
import { Panel, PanelHeader, Text, View } from '@vkontakte/vkui'
import { FC } from 'react'
import { REACT_APP_APP_TITLE } from '../../shared/consts'
import './index.css'

export const ViewError: FC<iErrorViewProps> = ({ errorMessage, ...rest }) => (
  <View activePanel={eViewIds.Error} {...rest}>
    <Panel id={eViewIds.Error}>
      <PanelHeader delimiter="none">{REACT_APP_APP_TITLE}</PanelHeader>
      <div className="view-error__content">
        <Text className="view-error__content-text">При загрузке произошла ошибка. Пожалуйста, попробуй позже или сообщите администратору.</Text>
        {errorMessage && 
          (<Text className="view-error__content-text">Ошибка: {errorMessage}</Text>)
        }
        <img src={blockGif} alt="Access denied" className="view-error__image" />
      </div>
    </Panel>
  </View>
)
