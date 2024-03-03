import {
  REACT_APP_CRM_SITE,
  REACT_APP_CRM_API_TOKEN,
  REACT_APP_CRM_API_SHVA_PARTICIPANTS_ENTITY,
  REACT_APP_CRM_API_SHVA_MEDALS_ENTITY,
} from '../consts'

import AvatartPathArcticfox from '@assets/img/avatartArcticfox.svg'
import { sortPersons } from '@views/ViewMain/components/PanelPeople/helpers'

import { ePeopleSort, eTabbarItemIds } from '../enums'
import {
  iConfig,
  iEspoCRMGetParams,
  iEspoCRMGetResponce,
  iGsheetsResDTO,
  iPerson,
  iPersonDTO,
  iScoringInfo,
} from '../types'
import apiService from './ApiService'
import { getPhotoUrls } from './vkbridge'

export const getApiParticipants = async (): Promise<void> => {
  const CRMUrlBase = `${REACT_APP_CRM_SITE}/api/v1/${REACT_APP_CRM_API_SHVA_PARTICIPANTS_ENTITY}`
  const maxSize = 200
  const headers = {
    'X-Api-Key': REACT_APP_CRM_API_TOKEN,
    'Content-Type': 'application/json',
    'X-No-Total': 'true',
  }

  console.log(new Date().toTimeString(), 'getCRMParticipants sent')
  let isEmptyResponce = false
  let offset = 0
  let dataList = []
  while (!isEmptyResponce) {
    const CRMUrl = `${CRMUrlBase}?offset=${offset}&maxSize=${maxSize}`
    const { list } = await apiService.get<iEspoCRMGetResponce>(CRMUrl, { headers: headers })
    dataList.push(...list)
    offset += maxSize
    isEmptyResponce = list.length === 0
    console.log({dataList })
  }
  // console.log({ data })
  console.log(new Date().toTimeString(), 'getCRMParticipants recieved')

  // const { online, offline, medalsMeta, persons, config } = gsheetsData
  // let personsToSet = suitePersons(persons)
  // // personsToSet = sortPersons({ persons: personsToSet, ...ePeopleSort.SUM })
  // personsToSet = await updatePhotos(personsToSet)

  // let onlineToSet = { ...online, persons: personsToSet.filter((p) => p.format === eTabbarItemIds.Online) }
  // onlineToSet = { ...onlineToSet, persons: onlineToSet.persons }
  // let offlineToSet = { ...offline, persons: personsToSet.filter((p) => p.format === eTabbarItemIds.Offline) }
  // offlineToSet = { ...offlineToSet, persons: offlineToSet.persons }

  // personsToSet = offlineToSet.persons.concat(onlineToSet.persons)
  // return [personsToSet, { online: onlineToSet, offline: offlineToSet, medalsMeta }, config]
}

export const getApiMedals = async (): Promise<void> => {
  const CRMUrlBase = `${REACT_APP_CRM_SITE}/api/v1/${REACT_APP_CRM_API_SHVA_MEDALS_ENTITY}`
  const maxSize = 200
  const headers = {
    'X-Api-Key': REACT_APP_CRM_API_TOKEN,
    'Content-Type': 'application/json',
    'X-No-Total': 'true',
  }

  console.log(new Date().toTimeString(), 'getCRMMedals sent')

  let isEmptyResponce = false
  let offset = 0
  let dataList = []
  while (!isEmptyResponce) {
    const CRMUrl = `${CRMUrlBase}?offset=${offset}&maxSize=${maxSize}`
    const data = await apiService.get<iEspoCRMGetResponce>(CRMUrl, { headers: headers })
    console.log({ data })
    offset += maxSize
    // isEmptyResponce =
  }
  console.log(new Date().toTimeString(), 'getCRMMedals recieved')
}

const suitePersons = (persons: iPersonDTO[]): iPerson[] => {
  let personsToSet: iPerson[] = persons.map((p) => {
    const pToSet = {
      ...p,
      'medals': p.medals
        ? p.medals
            .toString()
            .replaceAll('\r', '')
            .replaceAll('\n', ',')
            .split(',')
            .map((m) => m.trim())
        : [],
      'sex': p.sex || 'М',
    }
    return pToSet
  })

  return personsToSet
}

export const updatePhotos = async (localPersons: iPerson[]): Promise<iPerson[]> => {
  const photos = await getPhotoUrls(localPersons.map((p) => p.vk_id))
  const personsToSet = localPersons.map((person) => ({
    ...person,
    'photo': photos.find((i) => i.id === person.vk_id)?.photo || AvatartPathArcticfox,
  }))
  return personsToSet
}
