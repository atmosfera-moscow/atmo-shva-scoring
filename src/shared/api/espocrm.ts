import {
  REACT_APP_CRM_SITE,
  REACT_APP_CRM_API_TOKEN,
  REACT_APP_CRM_API_SHVA_PARTICIPANTS_ENTITY,
  REACT_APP_CRM_API_SHVA_MEDALS_ENTITY,
  REACT_APP_CRM_API_LABELS_ENTITY,
  REACT_APP_CRM_API_SHVA_CONFIG_ENTITY,
  REACT_APP_CRM_API,
} from '../consts'

import AvatartPathArcticfox from '@assets/img/avatartArcticfox.svg'

import { iMedal, iEspoCRMApiGetListResponce, iPerson, iLabel, iLabelList, iConfig, iScoringInfo } from '../types'
import apiService from './ApiService'
import { getPhotoUrls } from './vkbridge'

export const getApiScoringInfo = async (): Promise<iScoringInfo> => {
  const persons = await getApiParticipants()
  const medals = await getApiMedals()
  const config = await getApiConfig()
  const lables = await getApiLables()

  // TODO: split and sort online offline
  // TODO: count 

  const scoringInfo: iScoringInfo = {
    medals: medals,
    onlinePersons: persons,
    offlinePersons: persons,
    isOnlineEnabled: Boolean(config.find(c => c.value === 'isOnlineEnabled')?.key) || false,
    isOfflineEnabled: Boolean(config.find(c => c.value === 'isOfflineEnabled')?.key) || false,
    labels: lables,
    scoringMax: undefined,
  }

  return scoringInfo
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
  const params = `where%5B0%5D%5Btype%5D=equals&where%5B0%5D%5Battribute%5D=vkID&where%5B0%5D%5Bvalue%5D=${vkId}`
  const urlBase = `${REACT_APP_CRM_API}/${REACT_APP_CRM_API_SHVA_PARTICIPANTS_ENTITY}?${params}`
  let persons = await getListEspoCRMApi<iPerson>(urlBase)
  console.log(new Date().toTimeString(), 'checkIsParticipant recieved')
  console.log(`checkIsParticipant ${persons}`)

  return persons.length > 0
}

const getApiParticipants = async (): Promise<iPerson[]> => {
  const urlBase = `${REACT_APP_CRM_API}/${REACT_APP_CRM_API_SHVA_PARTICIPANTS_ENTITY}`
  console.log(new Date().toTimeString(), 'getCRMParticipants sent')
  let persons = await getListEspoCRMApi<iPerson>(urlBase)
  console.log(new Date().toTimeString(), 'getCRMParticipants recieved')

  // let personsToSet = suitePersons(persons)
  // // personsToSet = sortPersons({ persons: personsToSet, ...ePeopleSort.SUM })

  persons = await updatePhotos(persons)
  return persons
}

// TODO: users & config api get

const getApiMedals = async (): Promise<iMedal[]> => {
  const urlBase = `${REACT_APP_CRM_API}/${REACT_APP_CRM_API_SHVA_MEDALS_ENTITY}`
  console.log(new Date().toTimeString(), 'getApiMedals sent')
  let medals = await getListEspoCRMApi<iMedal>(urlBase)
  console.log(new Date().toTimeString(), 'getApiMedals recieved')
  return medals
}

const getApiConfig = async (): Promise<iConfig[]> => {
  console.log(new Date().toTimeString(), 'getApiConfig sent')
  let urlBase = `${REACT_APP_CRM_API}/${REACT_APP_CRM_API_SHVA_CONFIG_ENTITY}`
  const config = await getListEspoCRMApi<iConfig>(urlBase)
  console.log(new Date().toTimeString(), 'getApiConfig recieved')
  return config
}

const getApiLables = async (): Promise<iLabel> => {
  console.log(new Date().toTimeString(), 'getApiLables sent')
  const urlBase = `${REACT_APP_CRM_API}/${REACT_APP_CRM_API_LABELS_ENTITY}`
  const labelsDTO = await getEspoCRMApi<iLabelList>(urlBase)
  const labels: iLabel = labelsDTO[REACT_APP_CRM_API_SHVA_PARTICIPANTS_ENTITY]
  console.log(new Date().toTimeString(), 'getApiLables recieved')
  return labels
}

const updatePhotos = async (persons: iPerson[]): Promise<iPerson[]> => {
  const photos = await getPhotoUrls(persons.map((p) => p.vkID))
  const personsToSet = persons.map((person) => ({
    ...person,
    'photo': photos.find((i) => i.id === person.vkID)?.photo || AvatartPathArcticfox,
  }))
  return personsToSet
}

const getListEspoCRMApi = async <T>(urlBase: string): Promise<T[]> => {
  const maxSize = 200
  const headers = {
    'X-Api-Key': REACT_APP_CRM_API_TOKEN,
    'Content-Type': 'application/json',
    'X-No-Total': 'true',
  }
  let isEmptyNextResponce = false
  let offset = 0
  let dataList: T[] = []
  while (!isEmptyNextResponce) {
    const CRMUrl = `${urlBase}?offset=${offset}&maxSize=${maxSize}`
    const { list } = await apiService.get<iEspoCRMApiGetListResponce<T>>(CRMUrl, { headers: headers })
    dataList.push(...list)
    offset += maxSize
    isEmptyNextResponce = list.length < maxSize
  }
  console.log({ dataList })
  return dataList
}

const getEspoCRMApi = async <T>(urlBase: string): Promise<T> => {
  const headers = {
    'X-Api-Key': REACT_APP_CRM_API_TOKEN,
    'Content-Type': 'application/json',
    'X-No-Total': 'true',
  }

  const responce = await apiService.get<T>(urlBase, { headers: headers })

  console.log({ responce })
  return responce
}
