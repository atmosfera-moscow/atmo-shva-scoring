import { GetLaunchParamsResponse, UserInfo } from '@vkontakte/vk-bridge'
import { eEduFormats } from './enums'
import { ReactElement } from 'react'

export interface iEspoCRMApiPostPayload {
  [key: string]: string[] | string | number | number[] | boolean
}

export interface iEspoCRMApiGetParams {
  maxSize?: number
  where?: iEspoCRMApiGetWhereParams[]
  select?: string[]
  // [key: string]: string[] | string | number | number[] | boolean
}

export interface iEspoCRMApiGetWhereParams {
  type: string
  attribute: string
  value: string
  [key: string]: string[] | string | number | number[] | boolean
}

export interface iEspoCRMApiGetListResponce<T> {
  total: number
  list: T[]
}

export interface iMedal {
  id: string
  key: string
  titleMale: string
  titleFemale: string
  description: string
  disabled: boolean
  limit?: number
  iconSvg: string
  type: 'dynamic' | 'static'
  [key: string]: string | number | boolean | string[] | number[] | undefined | 'null'
}

export interface iCRMUser {
  id: string
  vkID: number
  [key: string]: string | number | boolean | string[] | number[] | undefined | 'null'
}

export interface iTeam {
  id: string
  shvaTeamNumber: number | undefined
  [key: string]: string | number | boolean | string[] | number[] | undefined | 'null'
}

export interface iPerson {
  id: string
  place?: number
  sex: 'Ж' | 'М' | 'M'
  photo?: string
  vkID: number
  firstName: string
  lastName: string
  // TODO: rm
  medals?: string[]
  shvaScroingMedalsStaticIds?: string[]
  shvaScroingMedalsDynamicIds?: string[]
  badge?: number | string
  shvaTeamId: string | undefined
  shvaTeamName: string | undefined
  shvaTeamNumber?: number
  message?: string
  eduFormat: eEduFormats
  totalScore: number
  totalScoreActivity: number
  totalScoreEdu: number
  totalScoreGames: number
  totalScoreMulct: number
  totalScoreOpt: number
  totalScoreOrg: number
  totalScoreProblems: number
  excluded: boolean
  [key: string]: string | number | boolean | string[] | number[] | undefined | 'null'
}

export interface iLabel {
  field: string
  title: string
  level: number
  level1: string
  level2: string
  level3: string
  levelLast: string
  limit?: number
  isContentSubInfoKey: boolean
}

export interface iLabelDTO {
  fields: {
    [key: string]: string
  }
  links: {
    [key: string]: string
  }
  labels: {
    [key: string]: string
  }
  options: {
    [key: string]: {
      [key: string]: string
    }
  }
}

export interface iLabelListDTO {
  [key: string]: iLabelDTO
}

export interface iConfig {
  value: string | number | boolean | string[] | number[] | undefined | 'null'
  key: string
  [key: string]: string | number | boolean | string[] | number[] | undefined | 'null'
}

export interface iScoringInfo {
  medals: iMedal[]
  onlinePersons: iPerson[]
  offlinePersons: iPerson[]
  isOnlineEnabled: boolean
  isOfflineEnabled: boolean
  labels: iLabel[]
  scoringMax?: {
    [key: string]: number
  }[]
}

export interface iFilter {
  key: string
  value: string | number | boolean
}

export interface iSort {
  key: string
  order: 1 | -1
}

export interface iExtendedUserInfo extends UserInfo {
  launchParams: GetLaunchParamsResponse
  isAppAdmin: boolean
  isShvaParticipant: boolean
  isAppModerator: boolean
  curPerson?: iPerson
}
