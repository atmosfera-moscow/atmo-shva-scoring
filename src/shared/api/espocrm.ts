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
} from '../consts'

import AvatartPathArcticfox from '@assets/img/avatartArcticfox.svg'

import { iMedal, iEspoCRMApiGetListResponce, iPerson, iLabel, iLabelList, iConfig, iScoringInfo, iCRMUser, iTeam } from '../types'
import apiService from './ApiService'
import { getPhotoUrls } from './vkbridge'
import { eEduFormats } from '../enums'

export const getApiScoringInfo = async (): Promise<iScoringInfo> => {
  let persons = await getApiParticipants()
  const medals = await getApiMedals()
  const config = await getApiConfig()
  const lables = await getApiLables()
  const teams = await getApiTeams()

  persons = persons.map(p => {
    return {
      ...p, shvaTeamNumber: teams.find(t => t.id === p.shvaTeamId)?.shvaTeamNumber
    }
  })

  const onlinePersons = persons
    .filter((p) => p.eduFormat === eEduFormats.Online)
    .sort((p1, p2) => p2.totalScore - p1.totalScore)
    .map((p, i) => {
      return { ...p, place: i + 1 }
    })
  const offlinePersons = persons
    .filter((p) => p.eduFormat === eEduFormats.Offline)
    .sort((p1, p2) => p2.totalScore - p1.totalScore)
    .map((p, i) => {
      return { ...p, place: i + 1 }
    })

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

export const checkIsAppAdmin = async (vkId: number): Promise<boolean> => {
  console.log(new Date().toTimeString(), 'checkIsAppAdmin sent')
  // const whereParams = [
  //   {
  //     type: 'equals',
  //     attribute: 'vkID',
  //     value: vkId,
  //   },
  // ]
  const params = `where%5B0%5D%5Btype%5D=linkedWith&where%5B0%5D%5Battribute%5D=teams&where%5B0%5D%5Bvalue%5D%5B%5D=65ca7982de804f874&where%5B1%5D%5Btype%5D=equals&where%5B1%5D%5Battribute%5D=vkID&where%5B1%5D%5Bvalue%5D=${vkId}`
  const urlBase = `${REACT_APP_CRM_API}/${REACT_APP_CRM_API_USERS_ENTITY}?${params}`
  let persons = await getListEspoCRMApi<iCRMUser>(urlBase)
  console.log(new Date().toTimeString(), 'checkIsAppAdmin recieved')
  console.log(`checkIsAppAdmin ${persons}`)

  return persons.length > 0
}

const getApiParticipants = async (): Promise<iPerson[]> => {
  const urlBase = `${REACT_APP_CRM_API}/${REACT_APP_CRM_API_SHVA_PARTICIPANTS_ENTITY}`
  console.log(new Date().toTimeString(), 'getCRMParticipants sent')
  let persons = await getListEspoCRMApi<iPerson>(urlBase)
  console.log(new Date().toTimeString(), 'getCRMParticipants recieved')

  // let personsToSet = suitePersons(persons)
  // // personsToSet = sortPersons({ persons: personsToSet, ...ePersonsSort.SUM })

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

const getApiTeams = async (): Promise<iTeam[]> => {
  console.log(new Date().toTimeString(), 'getApiTeams sent')
  const urlBase = `${REACT_APP_CRM_API}/${REACT_APP_CRM_API_SHVA_TEAMS_ENTITY}`
  let teams = await getListEspoCRMApi<iTeam>(urlBase)
  console.log(new Date().toTimeString(), 'getApiTeams recieved')
  return teams
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

  console.log({ responce })
  return responce
}
