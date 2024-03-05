// import AvatartPathArcticfox from '@assets/img/avatartArcticfox.svg'
// import { sortPersons } from '@views/ViewMain/components/PanelPeople/helpers'
// import { REACT_APP_GSHEETS_API_URL } from '../consts'

// import { ePeopleSort, eTabbarItemIds } from '../enums'
// import { iConfig, iGsheetsResDTO, iPerson, iPersonDTO, iScoringInfo } from '../types'
// import apiService from './ApiService'
// import { getPhotoUrls } from './vkbridge'

// export const getGsheetsData = async (): Promise<[iPerson[], iScoringInfo, iConfig]> => {
//   const gheetsAPI = REACT_APP_GSHEETS_API_URL || ''

//   console.log(new Date().toTimeString(), 'getGsheetsData sent')
//   const gsheetsData = await apiService.get<iGsheetsResDTO>(gheetsAPI)
//   // console.log({ gsheetsData })
//   console.log(new Date().toTimeString(), 'getGsheetsData recieved')

//   const { online, offline, medalsMeta, persons, config } = gsheetsData
//   let personsToSet = suitePersons(persons)
//   // personsToSet = sortPersons({ persons: personsToSet, ...ePeopleSort.SUM })
//   personsToSet = await updatePhotos(personsToSet)

//   let onlineToSet = { ...online, persons: personsToSet.filter((p) => p.format === eTabbarItemIds.Online) }
//   onlineToSet = { ...onlineToSet, persons: onlineToSet.persons }
//   let offlineToSet = { ...offline, persons: personsToSet.filter((p) => p.format === eTabbarItemIds.Offline) }
//   offlineToSet = { ...offlineToSet, persons: offlineToSet.persons }

//   personsToSet = offlineToSet.persons.concat(onlineToSet.persons)
//   return [personsToSet, { online: onlineToSet, offline: offlineToSet, medalsMeta }, config]
// }

// const suitePersons = (persons: iPersonDTO[]): iPerson[] => {
//   // let personsToSet = persons.map((item) => (_updateBoolean(item)))
//   // console.log({ persons })
//   let personsToSet: iPerson[] = persons.map((p) => {
//     const pToSet = {
//       ...p,
//       'medals': p.medals
//         ? p.medals
//             .toString()
//             .replaceAll('\r', '')
//             .replaceAll('\n', ',')
//             .split(',')
//             .map((m) => m.trim())
//         : [],
//       'sex': p.sex || 'М',
//     }
//     return pToSet
//   })

//   return personsToSet
// }

// export const updatePhotos = async (localPersons: iPerson[]): Promise<iPerson[]> => {
//   const photos = await getPhotoUrls(localPersons.map((p) => p.vkID))
//   const personsToSet = localPersons.map((person) => ({
//     ...person,
//     'photo': photos.find((i) => i.id === person.vkID)?.photo || AvatartPathArcticfox,
//   }))
//   return personsToSet
// }
