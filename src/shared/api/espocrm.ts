import {
  REACT_APP_CRM_SITE,
  REACT_APP_CRM_API_TOKEN,
  REACT_APP_CRM_API_SHVA_PARTICIPANTS_ENTITY,
  REACT_APP_CRM_API_SHVA_MEDALS_ENTITY,
} from '../consts'

import AvatartPathArcticfox from '@assets/img/avatartArcticfox.svg'

import { iConfig, iMedal, iEspoCRMApiGetResponce, iCRMUser, iPerson } from '../types'
import apiService from './ApiService'
import { getPhotoUrls } from './vkbridge'

const getEspoCRMApi = async <T>(urlBase: string): Promise<T[]> => {
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
    const { list } = await apiService.get<iEspoCRMApiGetResponce<T>>(CRMUrl, { headers: headers })
    dataList.push(...list)
    offset += maxSize
    isEmptyNextResponce = list.length < maxSize
  }
  console.log({ dataList })
  return dataList
}

export const getApiParticipants = async (): Promise<iPerson[]> => {
  const urlBase = `${REACT_APP_CRM_SITE}/api/v1/${REACT_APP_CRM_API_SHVA_PARTICIPANTS_ENTITY}`
  console.log(new Date().toTimeString(), 'getCRMParticipants sent')
  let persons = await getEspoCRMApi<iPerson>(urlBase)
  console.log(new Date().toTimeString(), 'getCRMParticipants recieved')

  // let personsToSet = suitePersons(persons)
  // // personsToSet = sortPersons({ persons: personsToSet, ...ePeopleSort.SUM })

  persons = await updatePhotos(persons)
  return persons
}

// TODO: users & config api get

export const getApiMedals = async (): Promise<iMedal[]> => {
  const urlBase = `${REACT_APP_CRM_SITE}/api/v1/${REACT_APP_CRM_API_SHVA_MEDALS_ENTITY}`
  console.log(new Date().toTimeString(), 'getApiMedals sent')
  let medals = await getEspoCRMApi<iMedal>(urlBase)
  console.log(new Date().toTimeString(), 'getApiMedals recieved')
  return medals
}

export const updatePhotos = async (persons: iPerson[]): Promise<iPerson[]> => {
  const photos = await getPhotoUrls(persons.map((p) => p.vkID))
  const personsToSet = persons.map((person) => ({
    ...person,
    'photo': photos.find((i) => i.id === person.vkID)?.photo || AvatartPathArcticfox,
  }))
  return personsToSet
}
