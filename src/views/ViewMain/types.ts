import { iExtendedUserInfo, iScoringInfo } from '@shared/types'
import { PanelProps } from '@vkontakte/vkui'
import { ePanelIds } from './enums'

export interface iCustomPanelProps extends PanelProps {
  id: string
  userInfo: iExtendedUserInfo
}

export interface iPersonsPanelProps extends iCustomPanelProps {
  id: ePanelIds
  setActivePanel: (panel: ePanelIds) => void
  scoringInfo: iScoringInfo
}
