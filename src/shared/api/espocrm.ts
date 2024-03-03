import {
  REACT_APP_CRM_SITE,
  REACT_APP_CRM_API_TOKEN,
  REACT_APP_CRM_API_SHVA_PARTICIPANTS_ENTITY,
  REACT_APP_CRM_API_SHVA_MEDALS_ENTITY,
} from '../consts'

import AvatartPathArcticfox from '@assets/img/avatartArcticfox.svg'
import { sortPersons } from '@views/ViewMain/components/PanelPeople/helpers'

import { ePeopleSort, eTabbarItemIds } from '../enums'
import { iConfig, iEspoCRMGetParams, iGsheetsResDTO, iPerson, iPersonDTO, iScoringInfo } from '../types'
import apiService from './ApiService'
import { getPhotoUrls } from './vkbridge'

export const getApiParticipants = async (): Promise<void> => {
  const CRMurl = `${REACT_APP_CRM_SITE}/api/v1/${REACT_APP_CRM_API_SHVA_PARTICIPANTS_ENTITY}`
  const headers = {
    'X-Api-Key': REACT_APP_CRM_API_TOKEN,
  }

  console.log(new Date().toTimeString(), 'getCRMParticipants sent')
  const gsheetsData = await apiService.get<iGsheetsResDTO>(CRMurl, { headers: headers })
  console.log({ gsheetsData })
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
  const CRMurl = `${REACT_APP_CRM_SITE}/api/v1/${REACT_APP_CRM_API_SHVA_MEDALS_ENTITY}`
  const headers = {
    'X-Api-Key': REACT_APP_CRM_API_TOKEN,
  }

  console.log(new Date().toTimeString(), 'getCRMMedals sent')
  const data = await apiService.get<iGsheetsResDTO>(CRMurl, { headers: headers })
  console.log({ data })
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
