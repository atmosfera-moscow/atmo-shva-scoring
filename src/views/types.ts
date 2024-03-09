import { eViewIds } from '@src/shared/enums'
import { iExtendedUserInfo, iPerson, iScoringInfo } from '@src/shared/types'
import { ViewProps } from '@vkontakte/vkui'

export interface iCustomViewProps extends Omit<ViewProps, 'activePanel'> {
  id: eViewIds
  userInfo?: iExtendedUserInfo
}

export interface iNonAuthViewsProps extends iCustomViewProps {
  setActiveView?: (view: eViewIds) => void
}

export interface iAdminViewProps extends iCustomViewProps {
  scoringInfo: iScoringInfo
  userInfo: iExtendedUserInfo
  setActiveView: (view: eViewIds) => void
}

export interface iMainViewProps extends iCustomViewProps {
  curPerson: iPerson | undefined
  scoringInfo: iScoringInfo
}
