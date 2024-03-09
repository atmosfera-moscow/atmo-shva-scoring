import './index.css'
import { ePanelIds } from '@src/shared/enums'
import { iMainViewProps } from '@views/types'
import { View } from '@vkontakte/vkui'
import { FC, useState } from 'react'
import { PanelPeople } from './components/PanelPeople'

export const ViewMain: FC<iMainViewProps> = ({ curPerson, userInfo, scoringInfo, ...rest }) => {
  const [activePanel, setActivePanel] = useState<ePanelIds>(ePanelIds.People)

  return (
    <View
      className="view-main"
      activePanel={activePanel}
      {...rest}
      onSwipeBack={() => setActivePanel(ePanelIds.People)}
    >
      <PanelPeople
        id={ePanelIds.People}
        setActivePanel={setActivePanel}
        userInfo={userInfo}
        curPerson={curPerson}
        scoringInfo={scoringInfo}
      />
    </View>
  )
}
