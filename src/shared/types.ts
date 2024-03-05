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

export interface iEspoCRMApiGetResponce<T> {
  total: number
  list: T[]
}

export interface iConfig {
  isOnlineEnabled: boolean
  isOfflineEnabled: boolean
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

export interface iFormat {

}

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

export interface iScoringInfo {
  medals: iMedal[]
  persons: iPerson[] 
  onlinePersons: iPerson[]
  offlinePersons: iPerson[]
  config: iConfig
}

export interface iFilter {
  key: string
  value: string | number | boolean
}

export interface iSort {
  key: string
  order: 1 | -1
}

export interface ExtendedUserInfo extends UserInfo {
  isAtmoMember: boolean
  isShvaParticipant: boolean
  isAppModerator: boolean
}
