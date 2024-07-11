import { iPerson } from '../types'
import { sortByLastName, sortByTotalScore } from '../utils'

export const scorePlaceProcessing = (persons: iPerson[], isNoScoreMode = false): iPerson[] => {
  if (isNoScoreMode) {
    return persons
      .sort(sortByLastName)
      .sort((p1, p2) => Number(p1.excluded) - Number(p2.excluded))
      .map((p) => ({ ...p, place: undefined, totalScore: undefined }))
  } else {
    return persons
      .sort(sortByTotalScore)
      .sort((p1, p2) => Number(p1.excluded) - Number(p2.excluded))
      .map((p, i) => ({ ...p, place: !p.excluded ? i + 1 : undefined }))
  }
}
