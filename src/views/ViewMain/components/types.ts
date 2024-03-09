import { ePanelIds } from '@shared/enums'
import { iExtendedUserInfo, iPerson, iScoringInfo } from '@shared/types'
import { PanelProps } from '@vkontakte/vkui'

export interface iCustomPanelProps extends PanelProps {
  id: ePanelIds
  setActivePanel: (panel: ePanelIds) => void
  userInfo?: iExtendedUserInfo
  curPerson?: iPerson | undefined
}

export interface iPeoplePanelProps extends iCustomPanelProps {
  curPerson: iPerson | undefined
  scoringInfo: iScoringInfo
}
