import { eViewIds } from '@src/shared/enums'
import { ExtendedUserInfo, iPerson, iScoringInfo } from '@src/shared/types'
import { ViewProps } from '@vkontakte/vkui'

export interface iCustomViewProps extends Omit<ViewProps, 'activePanel'> {
  id: eViewIds
  fetchedUser?: ExtendedUserInfo
}

export interface iNonAuthViewsProps extends iCustomViewProps {
  setActiveView?: (view: eViewIds) => void
}

export interface iModeratorViewProps extends iCustomViewProps {
  scoringInfo: iScoringInfo
  setActiveView: (view: eViewIds) => void
}

export interface iMainViewProps extends iCustomViewProps {
  curPerson: iPerson | undefined
  scoringInfo: iScoringInfo
}
