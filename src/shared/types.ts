import { UserInfo } from '@vkontakte/vk-bridge'
import { eTabbarItemIds } from './enums'

export interface iEspoCRMPostPayload {
  [key: string]: string[] | string | number | number[] | boolean
}

export interface iEspoCRMGetParams {
  maxSize?: number
  where?: iEspoCRMGetWhereParams[]
  select?: string[]
  // [key: string]: string[] | string | number | number[] | boolean
}

export interface iEspoCRMGetWhereParams {
  type: string
  attribute: string
  value: string
  [key: string]: string[] | string | number | number[] | boolean
}

export interface iEspoCRMGetResponce {
  total: number
  list: iEspoCRMGetParticipantsResponce[]
}

export interface iEspoCRMGetParticipantsResponce {
  [key: string]: string[] | string | number | number[] | boolean
}

export interface iGsheetsResDTO {
  online: iFormatDTO
  offline: iFormatDTO
  medalsMeta: iMedalMeta[]
  persons: iPersonDTO[]
  config: iConfig
}

export interface iConfig {
  shva_group_id: number
  moderators: number[]
  admins: number[]
  [key: string]: string[] | string | number | number[] | boolean
}

export interface iScoringInfo {
  online: iFormat
  offline: iFormat
  medalsMeta: iMedalMeta[]
}

export interface iMedalMeta {
  key: string
  title_male: string
  title_female: string
  descr?: string
  disable?: boolean
  limit?: number
  type?: 'dynamic' | 'static'
}

export interface iFormatDTO {
  enable: boolean
  meta: iScoringMeta
}

export interface iFormat {
  enable: boolean
  meta: iScoringMeta
  persons: iPerson[]
}

export interface iScoringMeta {
  [key: string]: iScoringMetaKey
}

export interface iScoringMetaKey {
  title_ru?: string
  max_score?: number
  is_dynamic?: boolean
  column?: string
}

export interface iPersonDTO {
  sex?: 'Ж' | 'М'
  photo?: string
  vk_id?: number
  name?: string
  surname?: string
  medals?: string
  badge?: number | string
  team?: number
  message?: string
  format: eTabbarItemIds
  place?: number
  sum: number
  excluded: boolean
  [key: string]: string | number | boolean | undefined
}

export interface iPerson {
  sex: 'Ж' | 'М'
  photo?: string
  vk_id?: number
  name?: string
  surname?: string
  medals: string[]
  badge?: number | string
  team?: number
  message?: string
  format: eTabbarItemIds
  place?: number
  sum: number
  excluded: boolean
  [key: string]: string | number | boolean | string[] | number[] | undefined
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
