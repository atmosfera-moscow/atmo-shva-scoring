export const REACT_APP_APP_TITLE = 'Рейтинг ШВА'
export const WARNING_GRADIENT = 'linear-gradient(90deg, #ffb73d 0%, #ffa000 100%)'

export const contentSubInfoKeys = [
  { re: /^Н[1-9]$/i },
  { re: /^Н[1-9] \| Занятие$/i },
  { re: /^Н[1-9] \| Занятие \| Активность$/i, limit: 4 },
  { re: /^Н[1-9] \| Занятие \| Учеба$/i, limit: 10 },
  { re: /^Н[1-9] \| Занятие \| Игротека$/i, limit: 5 },
  { re: /^Н[1-9] \| Занятие \| Заморочки$/i, limit: 3 },
  { re: /^Н[1-9] \| Балл от организаторов$/i, limit: 1 },
  { re: /^Н[1-9] \| Штраф$/i },
  { re: /^Н[1-9] \| Факультатив \d$/i },
  { re: /^Н[1-9] \| Факультатив \d \| Игротека$/i, limit: 5 },
  { re: /^Н[1-9] \| Факультатив \d \| Активность$/i, limit: 3 },
  { re: /^Н[1-9] \| Образовалка$/i },
  { re: /^Н[1-9] \| Образовалка \| Тест .*$/i, limit: 3 },
  { re: /^Н[1-9] \| Онлайн$/i },
  { re: /^Н[1-9] \| Победа в мероприятии$/i },
  { re: /^Н[1-9] \| Посещаемость образовалки$/i, limit: 4 },
  { re: /^Промежуточный экзамен$/i, limit: 8 },
  { re: /^Промежуточный экзамен | Игротека$/i, limit: 5 },
  { re: /^Промежуточный экзамен | Теория$/i, limit: 3 },
]

export const contentMainInfoKeys = [
  { key: 'message', isPersonal: true },
  { key: 'totalScorePractice', isInline: true },
  { key: 'totalScoreMedia', isInline: true },
]

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
