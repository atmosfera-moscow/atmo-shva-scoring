import {
  REACT_APP_CRM_SITE,
  REACT_APP_CRM_API_TOKEN,
  REACT_APP_CRM_API_SHVA_PARTICIPANTS_ENTITY,
  REACT_APP_CRM_API_SHVA_MEDALS_ENTITY,
  REACT_APP_CRM_API_LABELS_ENTITY,
  REACT_APP_CRM_API_SHVA_CONFIG_ENTITY,
  REACT_APP_CRM_API,
  REACT_APP_CRM_API_USERS_ENTITY,
  REACT_APP_CRM_API_SHVA_TEAMS_ENTITY,
  contentSubInfoKeys,
  relatedFieldsParticipants,
} from '../consts'

import AvatartPathArcticfox from '@assets/img/avatartArcticfox.svg'

import {
  iMedal,
  iEspoCRMApiGetListResponce,
  iPerson,
  iLabel,
  iLabelListDTO,
  iLabelDTO,
  iConfig,
  iScoringInfo,
  iCRMUser,
  iTeam,
  iGetListEspoCRMApiParams,
} from '../types'
import apiService from './ApiService'
import { getPhotoUrls } from './vkbridge'
import { eEduFormats } from '../enums'

export const getApiScoringInfo = async (): Promise<iScoringInfo> => {
  let persons = await getApiParticipants()
  const medals = await getApiMedals()
  const config = await getApiConfig()
  const labelListDTO = await getApiLables()
  const teams = await getApiTeams()

  persons = persons.map((p) => {
    const pMedals: string[] = []
    p.shvaScroingMedalsStaticIds && pMedals.push(...p.shvaScroingMedalsStaticIds)
    p.shvaScroingMedalsDynamicIds && pMedals.push(...p.shvaScroingMedalsDynamicIds)
    // console.log(...pMedals)
    return {
      ...p,
      shvaTeamNumber: teams.find((t) => t.id === p.shvaTeamId)?.shvaTeamNumber,
      medals: pMedals,
    }
  })

  const onlinePersons = persons
    .filter((p) => p.eduFormat === eEduFormats.Online)
    .sort((p1, p2) => p2.totalScore - p1.totalScore)
    .sort((p1, p2) => Number(p1.excluded) - Number(p2.excluded))
    .map((p, i) => {
      return { ...p, place: !p.excluded ? i + 1 : undefined }
    })
  const offlinePersons = persons
    .filter((p) => p.eduFormat === eEduFormats.Offline)
    .sort((p1, p2) => p2.totalScore - p1.totalScore)
    .sort((p1, p2) => Number(p1.excluded) - Number(p2.excluded))
    .map((p, i) => {
      return { ...p, place: !p.excluded ? i + 1 : undefined }
    })

  const lables = parseLabels(labelListDTO)

  const scoringInfo: iScoringInfo = {
    medals: medals,
    onlinePersons: onlinePersons,
    offlinePersons: offlinePersons,
    isOnlineEnabled: config.find((c) => c.key === 'isOnlineEnabled')?.value === true || false,
    isOfflineEnabled: config.find((c) => c.key === 'isOfflineEnabled')?.value === true || false,
    labels: lables,
    scoringMax: undefined,
  }

  return scoringInfo
}

const parseLabels = (labelListDTO: iLabelListDTO): iLabel[] => {
  const labelDTO = labelListDTO[REACT_APP_CRM_API_SHVA_PARTICIPANTS_ENTITY]
  const labelDTOFields = labelDTO.fields

  let labels: iLabel[] = []

  for (let [field, title] of Object.entries(labelDTOFields)) {
    const contentSubInfoKey = contentSubInfoKeys.find((k) => k.re.test(title))
    title = title.startsWith('Н') ? 'Неделя ' + title.slice(1) : title

    let partsSplitted = title.split(' | ')
    let parts: string[] = [partsSplitted[0]]
    let levelLast: string = partsSplitted[0]
    partsSplitted[1] && parts.push(partsSplitted[1]) && (levelLast = partsSplitted[1])
    const partsLast = partsSplitted.slice(2).join(' | ')
    partsSplitted[2] && parts.push(partsLast) && (levelLast = partsLast)

    // TODO: implement max limits
    labels.push({
      field: field,
      title: title,
      level: parts.length - 1,
      isContentSubInfoKey: contentSubInfoKey !== undefined,
      limit: contentSubInfoKey?.limit,
      level1: parts[0],
      level2: parts[1],
      level3: parts[2],
      levelLast: levelLast,
    })
  }

  labels = labels.sort(function (a, b) {
    return a.title < b.title ? -1 : 1
  })

  return labels
}

export const checkIsParticipant = async (vkId: number): Promise<boolean> => {
  console.log(new Date().toTimeString(), 'checkIsParticipant sent')
  const whereParams = [
    {
      type: 'equals',
      attribute: 'vkID',
      value: vkId,
    },
  ]
  const urlBase = `${REACT_APP_CRM_API}/${REACT_APP_CRM_API_SHVA_PARTICIPANTS_ENTITY}`
  const otherParams = `where%5B0%5D%5Btype%5D=equals&where%5B0%5D%5Battribute%5D=vkID&where%5B0%5D%5Bvalue%5D=${vkId}`
  let persons = await getListEspoCRMApi<iPerson>({ urlBase, otherParams })
  console.log(new Date().toTimeString(), 'checkIsParticipant recieved')

  return persons.length > 0
}

export const checkIsAppAdmin = async (vkId: number): Promise<boolean> => {
  console.log(new Date().toTimeString(), 'checkIsAppAdmin sent')
  // const whereParams = [
  //   {
  //     type: 'equals',
  //     attribute: 'vkID',
  //     value: vkId,
  //   },
  // ]
  const urlBase = `${REACT_APP_CRM_API}/${REACT_APP_CRM_API_USERS_ENTITY}`
  const otherParams = `where%5B0%5D%5Btype%5D=linkedWith&where%5B0%5D%5Battribute%5D=teams&where%5B0%5D%5Bvalue%5D%5B%5D=65ca7982de804f874&where%5B1%5D%5Btype%5D=equals&where%5B1%5D%5Battribute%5D=vkID&where%5B1%5D%5Bvalue%5D=${vkId}`
  let persons = await getListEspoCRMApi<iCRMUser>({ urlBase, otherParams })
  console.log(new Date().toTimeString(), 'checkIsAppAdmin recieved')

  return persons.length > 0
}

const getApiParticipantsFields = async (): Promise<string[]> => {
  console.log(new Date().toTimeString(), 'getApiTestParticipants sent')
  const headers = {
    'X-Api-Key': REACT_APP_CRM_API_TOKEN,
    'Content-Type': 'application/json',
    'X-No-Total': 'true',
  }
  const urlBase = `${REACT_APP_CRM_API}/${REACT_APP_CRM_API_SHVA_PARTICIPANTS_ENTITY}`

  const CRMUrl = `${urlBase}?offset=0&maxSize=1`
  const { list } = await apiService.get<iEspoCRMApiGetListResponce<iPerson>>(CRMUrl, { headers: headers })
  const person = list[0]
  const fields = Object.keys(person)
  console.log(new Date().toTimeString(), 'getApiTestParticipants recieved')
  return fields
}

const getApiParticipants = async (): Promise<iPerson[]> => {
  const fields = await getApiParticipantsFields()
  fields.push(...relatedFieldsParticipants)
  const select = fields.join(',')
  const orderBy = 'totalScore'
  const order = 'desc'
  const urlBase = `${REACT_APP_CRM_API}/${REACT_APP_CRM_API_SHVA_PARTICIPANTS_ENTITY}`
  console.log(new Date().toTimeString(), 'getCRMParticipants sent')
  let persons = await getListEspoCRMApi<iPerson>({ urlBase, select, orderBy, order })
  console.log(new Date().toTimeString(), 'getCRMParticipants recieved')

  persons = await updatePhotos(persons)
  return persons
}

// TODO: users & config api get

const getApiMedals = async (): Promise<iMedal[]> => {
  const urlBase = `${REACT_APP_CRM_API}/${REACT_APP_CRM_API_SHVA_MEDALS_ENTITY}`
  console.log(new Date().toTimeString(), 'getApiMedals sent')
  let medals = await getListEspoCRMApi<iMedal>({ urlBase })
  console.log(new Date().toTimeString(), 'getApiMedals recieved')
  return medals
}

const getApiTeams = async (): Promise<iTeam[]> => {
  console.log(new Date().toTimeString(), 'getApiTeams sent')
  const urlBase = `${REACT_APP_CRM_API}/${REACT_APP_CRM_API_SHVA_TEAMS_ENTITY}`
  let teams = await getListEspoCRMApi<iTeam>({ urlBase })
  console.log(new Date().toTimeString(), 'getApiTeams recieved')
  return teams
}

const getApiConfig = async (): Promise<iConfig[]> => {
  console.log(new Date().toTimeString(), 'getApiConfig sent')
  let urlBase = `${REACT_APP_CRM_API}/${REACT_APP_CRM_API_SHVA_CONFIG_ENTITY}`
  const config = await getListEspoCRMApi<iConfig>({ urlBase })
  console.log(new Date().toTimeString(), 'getApiConfig recieved')
  return config
}

const getApiLables = async (): Promise<iLabelListDTO> => {
  console.log(new Date().toTimeString(), 'getApiLables sent')
  const urlBase = `${REACT_APP_CRM_API}/${REACT_APP_CRM_API_LABELS_ENTITY}`
  const labelListDTO = await getEspoCRMApi<iLabelListDTO>(urlBase)
  console.log(new Date().toTimeString(), 'getApiLables recieved')
  return labelListDTO
}

const updatePhotos = async (persons: iPerson[]): Promise<iPerson[]> => {
  const photos = await getPhotoUrls(persons.map((p) => p.vkID))
  const personsToSet = persons.map((person) => ({
    ...person,
    'photo': photos.find((i) => i.id === person.vkID)?.photo || AvatartPathArcticfox,
  }))
  return personsToSet
}

const getListEspoCRMApi = async <T>({
  urlBase,
  maxSize = 200,
  offset = 0,
  select,
  orderBy,
  order,
  otherParams,
}: iGetListEspoCRMApiParams): Promise<T[]> => {
  const headers = {
    'X-Api-Key': REACT_APP_CRM_API_TOKEN,
    'Content-Type': 'application/json',
    'X-No-Total': 'true',
  }
  let dataList: T[] = []
  let isEmptyNextResponce = false
  while (!isEmptyNextResponce) {
    let CRMUrl = `${urlBase}?`
    offset && (CRMUrl = `${CRMUrl}&offset=${offset}`)
    maxSize && (CRMUrl = `${CRMUrl}&maxSize=${maxSize}`)
    select && (CRMUrl = `${CRMUrl}&select=${select}`)
    orderBy && (CRMUrl = `${CRMUrl}&orderBy=${orderBy}`)
    order && (CRMUrl = `${CRMUrl}&order=${order}`)
    otherParams && (CRMUrl = `${CRMUrl}&${otherParams}`)

    // console.log(CRMUrl)
    const { list } = await apiService.get<iEspoCRMApiGetListResponce<T>>(CRMUrl, { headers: headers })
    dataList.push(...list)
    offset += maxSize
    isEmptyNextResponce = list.length < maxSize
  }
  // console.log({ dataList })
  return dataList
}

const getEspoCRMApi = async <T>(urlBase: string): Promise<T> => {
  const headers = {
    'X-Api-Key': REACT_APP_CRM_API_TOKEN,
    'Content-Type': 'application/json',
    'X-No-Total': 'true',
  }

  const responce = await apiService.get<T>(urlBase, { headers: headers })
  // console.log({ responce })
  return responce
}
