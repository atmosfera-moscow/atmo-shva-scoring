import { iExtendedUserInfo, iLabel, iMedal, iPerson } from "@src/shared/types"

export interface iPersonCardProps {
    person: iPerson
    isCardsCollapsed: boolean
    isCurPerson: boolean
    labels: iLabel[]
    medals: iMedal[]
    userInfo: iExtendedUserInfo
  }
  