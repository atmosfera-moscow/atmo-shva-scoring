import blockGif from '@assets/img/cat_wait.gif'
import { ePanelIds, eViewIds } from '@src/shared/enums'
import { iNonAuthViewsProps } from '@views/types'
import { Panel, PanelHeader, Text, View } from '@vkontakte/vkui'
import { FC } from 'react'
import { REACT_APP_APP_TITLE, REACT_APP_VK_SHVA_GROUP_ID } from '../../shared/consts'
import './index.css'

export const ViewBlock: FC<iNonAuthViewsProps> = ({ ...rest }) => (
  <View activePanel={eViewIds.Block} {...rest}>
    <Panel id={ePanelIds.Block}>
      <PanelHeader delimiter="none">{REACT_APP_APP_TITLE}</PanelHeader>
      <div className="view-block__content">
        <Text className="view-block__content-text">
          В доступе отказано, так как ты не являешься организатором или участником ШВА.
          <br />
          Если считаешь, что это ошибка, напиши в сообщения{' '}
          <a
            style={{ color: 'inherit' }}
            target="_blank"
            rel="noreferrer"
            href={`https://vk.me/club${REACT_APP_VK_SHVA_GROUP_ID}`}
          >
            группы ШВА
          </a>
          .
        </Text>
        <img src={blockGif} alt="Access denied" className="view-block__image" />
      </div>
    </Panel>
  </View>
)
