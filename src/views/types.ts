import { iExtendedUserInfo, iPerson, iScoringInfo } from '@src/shared/types'
import { ViewProps } from '@vkontakte/vkui'
import { eViewIds } from './enums'

export interface iCustomViewProps extends Omit<ViewProps, 'activePanel' | 'children'> {
  id: eViewIds
}

export interface iNonAuthViewsProps extends iCustomViewProps {}

export interface iAuthViewsProps extends iCustomViewProps {}

// views
export interface iLoaderViewProps extends iNonAuthViewsProps {}

export interface iErrorViewProps extends iNonAuthViewsProps {
  errorMessage: string | undefined
}

export interface iBlockViewProps extends iNonAuthViewsProps {
  userInfo: iExtendedUserInfo
}

export interface iAdminViewProps extends iAuthViewsProps {
  scoringInfo: iScoringInfo
  userInfo: iExtendedUserInfo
  setActiveView: (view: eViewIds) => void
}

export interface iMainViewProps extends iAuthViewsProps {
  scoringInfo: iScoringInfo
  userInfo: iExtendedUserInfo
}

