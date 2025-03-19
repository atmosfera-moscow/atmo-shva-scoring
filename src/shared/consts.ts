import { iContentInfoKey } from './types'

export const REACT_APP_APP_TITLE = 'Рейтинг ШВА25'
export const WARNING_GRADIENT = 'linear-gradient(90deg, #ffb73d 0%, #ffa000 100%)'

export const contentMainInfoKeys: iContentInfoKey[] = [
  { re: /^Сообщение от организаторов$/i, isTextValue: true, isPersonal: true },
  { re: /^Баллы за медиа-активность$/i },
  { re: /^Баллы за практику$/i },
  { re: /^Промежуточный экзамен$/i, limit: 8, isZeroAllowed: true },
  { re: /^Промежуточный экзамен \| Игротека$/i, limit: 5, threshold: 2.75, isZeroAllowed: true },
  { re: /^Промежуточный экзамен \| Теория$/i, limit: 3, threshold: 1.25, isZeroAllowed: true },
  { re: /^Промежуточный экзамен \| Kоличество попыток$/i, isPersonal: true, isZeroAllowed: true },
  // TODO: limits and thresholds
  { re: /^Финальный экзамен$/i, limit: undefined, isZeroAllowed: true },
  { re: /^Финальный экзамен \| Игротека$/i, limit: 5, threshold: 3, isZeroAllowed: true },
  { re: /^Финальный экзамен \| Теория$/i, limit: 12, threshold: 7, isZeroAllowed: true },
  { re: /^Финальный экзамен \| Kоличество попыток$/i, isPersonal: true, isZeroAllowed: true },
]

export const contentWeekInfoKeys: iContentInfoKey[] = [
  { re: /^Н[1-9]$/i, isZeroAllowed: true},
  { re: /^Н[1-9] \| Занятие$/i },
  { re: /^Н[1-9] \| Занятие \| Активность$/i, limit: 3 },
  { re: /^Н[1-9] \| Занятие \| Учеба$/i, limit: 12 },
  { re: /^Н[1-9] \| Занятие \| Игротека$/i, limit: 5 },
  { re: /^Н[1-9] \| Занятие \| Заморочки$/i, limit: 4 },
  { re: /^Н[1-9] \| Занятие \| Отрядка$/i, limit: 5 },
  { re: /^Н[1-9] \| Балл от организаторов$/i, limit: 1 },
  { re: /^Н[1-9] \| Штраф$/i },
  { re: /^Н[1-9] \| Факультатив \d$/i },
  { re: /^Н[1-9] \| Факультатив \d \| Игротека$/i, limit: 3 },
  { re: /^Н[1-9] \| Факультатив \d \| Отрядка$/i, limit: 1 },
  { re: /^Н[1-9] \| Образовалка$/i },
  { re: /^Н[1-9] \| Образовалка \| Тест .*$/i, limit: 3 },
  { re: /^Н[1-9] \| Онлайн$/i },
  { re: /^Н[1-9] \| Победа в мероприятии$/i },
  { re: /^Н[1-9] \| Посещаемость образовалки$/i, limit: 4 },
]

export const NoScoreModeWeekThreshold = 6
// TODO: opimise this shit
export const contentWeekInfoNoScoreModeKeys: iContentInfoKey[] = [
  { re: /^Н[6-9]$/i },
  { re: /^Н[6-9] \| Занятие$/i },
  { re: /^Н[6-9] \| Занятие \| Активность$/i, limit: 3 },
  { re: /^Н[6-9] \| Занятие \| Учеба$/i, limit: 12 },
  { re: /^Н[6-9] \| Занятие \| Игротека$/i, limit: 3 },
  { re: /^Н[6-9] \| Занятие \| Заморочки$/i, limit: 4 },
  { re: /^Н[6-9] \| Занятие \| Отрядка$/i, limit: 5 },
  { re: /^Н[6-9] \| Балл от организаторов$/i, limit: 1 },
  { re: /^Н[6-9] \| Штраф$/i },
  { re: /^Н[6-9] \| Факультатив \d$/i },
  { re: /^Н[6-9] \| Факультатив \d \| Игротека$/i, limit: 3 },
  { re: /^Н[6-9] \| Факультатив \d \| Отрядка$/i, limit: 1 },
  { re: /^Н[6-9] \| Образовалка$/i },
  { re: /^Н[6-9] \| Образовалка \| Тест .*$/i, limit: 3 },
  { re: /^Н[6-9] \| Онлайн$/i },
  { re: /^Н[6-9] \| Победа в мероприятии$/i },
  { re: /^Н[6-9] \| Посещаемость образовалки$/i, limit: 4 },
]

export const keysToMark: string[] = [
  'week1Visit',
  'week2Visit',
  'week3Visit',
  'week4Visit',
  'week5Visit',
  'week6Visit',
  'week7Visit',
  'week8Visit',
]
// export const contentWeekInfoNoScoreModeKeys = contentWeekInfoKeys.map((key) => ({
//   ...key,
//   re: RegExp(String(key.re).replaceAll('[1-9]', `[${NoScoreModeWeekThreshold}-9]`).replaceAll('\\/', '\\/')),
// }))
// console.log({ contentWeekInfoKeys })
// console.log({ contentWeekInfoNoScoreModeKeys })

export const relatedFieldsParticipants = ['shvaScroingMedalsStaticIds', 'shvaScroingMedalsDynamicIds']

// .env block
export const REACT_APP_VK_MINIAPP_ID = parseInt(process.env.REACT_APP_VK_MINIAPP_ID || '')
export const REACT_APP_VK_MINIAPP_LINK = process.env.REACT_APP_VK_MINIAPP_LINK || ''

export const REACT_APP_CRM_SITE = process.env.REACT_APP_CRM_SITE || ''
export const REACT_APP_CRM_API = process.env.REACT_APP_CRM_API || ''
export const REACT_APP_CRM_API_TOKEN = process.env.REACT_APP_CRM_API_TOKEN || ''
export const REACT_APP_CRM_API_SHVA_PARTICIPANTS_ENTITY = process.env.REACT_APP_CRM_API_SHVA_PARTICIPANTS_ENTITY || ''
export const REACT_APP_CRM_API_SHVA_TEAMS_ENTITY = process.env.REACT_APP_CRM_API_SHVA_TEAMS_ENTITY || ''
export const REACT_APP_CRM_API_SHVA_MEDALS_ENTITY = process.env.REACT_APP_CRM_API_SHVA_MEDALS_ENTITY || ''
export const REACT_APP_CRM_API_SHVA_CONFIG_ENTITY = process.env.REACT_APP_CRM_API_SHVA_CONFIG_ENTITY || ''
export const REACT_APP_CRM_API_LABELS_ENTITY = process.env.REACT_APP_CRM_API_LABELS_ENTITY || ''
export const REACT_APP_CRM_API_USERS_ENTITY = process.env.REACT_APP_CRM_API_USERS_ENTITY || ''

export const REACT_APP_VK_ATMOMY_GROUP_ID = parseInt(process.env.REACT_APP_VK_ATMOMY_GROUP_ID || '')
export const REACT_APP_VK_SHVA_GROUP_ID = parseInt(process.env.REACT_APP_VK_SHVA_GROUP_ID || '')
export const REACT_APP_VK_SHVA_ONLINE_GROUP_ID = parseInt(process.env.REACT_APP_VK_SHVA_ONLINE_GROUP_ID || '')
