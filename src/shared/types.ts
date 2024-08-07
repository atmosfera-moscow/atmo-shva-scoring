import { GetLaunchParamsResponse, UserInfo } from '@vkontakte/vk-bridge'
import { eEduFormats, eLabelContentTypes } from './enums'

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
  totalScore?: number
  // TODO: rm due to unused
  // totalScoreActivity: number
  // totalScoreEdu: number
  // totalScoreGames: number
  // totalScoreMulct: number
  // totalScoreOpt: number
  // totalScoreOrg: number
  // totalScoreProblems: number
  excluded: boolean
  [key: string]: string | number | boolean | string[] | number[] | undefined | 'null'
}

export interface iContentInfoKey {
  re: RegExp
  isTextValue?: boolean
  isPersonal?: boolean
  isZeroAllowed?: boolean
  limit?: number
  threshold?: number
}

export interface iLabel extends Omit<iContentInfoKey, 're'> {
  key: string
  title: string
  level: number
  level1: string
  level2: string
  level3: string
  levelLast: string
  contentType?: eLabelContentTypes
  re?: RegExp
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
  isNoScoreOnlineMode: boolean
  isOfflineEnabled: boolean
  isNoScoreOfflineMode: boolean
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

export interface iGetListEspoCRMApiParams {
  urlBase: string
  maxSize?: number
  offset?: number
  select?: string
  orderBy?: string
  order?: 'desc' | 'asc'
  otherParams?: string
}
