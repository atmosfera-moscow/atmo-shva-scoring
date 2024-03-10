import './index.css'
import { ePanelIds } from './enums'
import { iMainViewProps } from '@views/types'
import { View } from '@vkontakte/vkui'
import { FC, useState } from 'react'
import { PanelPersons } from './PanelPersons'

export const ViewMain: FC<iMainViewProps> = ({ userInfo, scoringInfo, ...rest }) => {
  const [activePanel, setActivePanel] = useState<ePanelIds>(ePanelIds.Persons)

  return (
    <View
      className="view-main"
      activePanel={activePanel}
      {...rest}
      onSwipeBack={() => setActivePanel(ePanelIds.Persons)}
    >
      <PanelPersons
        id={ePanelIds.Persons}
        setActivePanel={setActivePanel}
        userInfo={userInfo}
        scoringInfo={scoringInfo}
      />
    </View>
  )
}
