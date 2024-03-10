import { iLabel, iMedal, iPerson } from "@src/shared/types"

export interface iPersonCardProps {
    person: iPerson
    isCardsCollapsed: boolean
    isCurPerson: boolean
    // scoringMeta: iScoringMeta
    labels: iLabel
    medals: iMedal[]
    // scoringMax?: number[]
  }
  