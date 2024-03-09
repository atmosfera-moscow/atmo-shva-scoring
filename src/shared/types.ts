import { UserInfo } from '@vkontakte/vk-bridge'
import { eTabbarItemIds } from './enums'

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
  type: 'dynamic' | 'static'
  [key: string]: string | number | boolean | string[] | number[] | undefined | 'null'
}

export interface iFormat {}

export interface iCRMUser {
  id: string
  key: string
  [key: string]: string | number | boolean | string[] | number[] | undefined | 'null'
}

export interface iPerson {
  id: string
  // TODO: rm
  place: number
  sex: 'Ж' | 'М'
  photo?: string
  vkID: number
  firstName: string
  lastName: string
  // TODO: rm
  medals: string[]
  shvaScroingMedalsDynamic?: string
  shvaScroingMedalsStatic?: string
  badge?: number | string
  numberOfTeam?: string
  message?: string
  eduFormat: eTabbarItemIds
  totalScore: number
  excluded: boolean
  // [key: string]: string | number | boolean | string[] | number[] | undefined | 'null'
}

export interface iLabel {
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

export interface iLabelList {
  [key: string]: iLabel
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
  labels: iLabel
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
  isAppAdmin: boolean
  isShvaParticipant: boolean
  isAppModerator: boolean
  personInfo?: iPerson
}
