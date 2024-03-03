import { ePanelIds } from '@shared/enums'
import { ExtendedUserInfo, iPerson, iScoringInfo } from '@shared/types'
import { PanelProps } from '@vkontakte/vkui'

export interface iCustomPanelProps extends PanelProps {
  id: ePanelIds
  setActivePanel: (panel: ePanelIds) => void
  fetchedUser?: ExtendedUserInfo
  curPerson?: iPerson | undefined
}

export interface iPeoplePanelProps extends iCustomPanelProps {
  curPerson: iPerson | undefined
  scoringInfo: iScoringInfo
}
