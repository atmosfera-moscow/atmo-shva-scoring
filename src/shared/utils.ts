import {
  type AdaptivityProps,
  getViewWidthByViewportWidth,
  getViewHeightByViewportHeight,
  ViewWidth,
  SizeType,
} from '@vkontakte/vkui'
import type { UseAdaptivity } from '@vkontakte/vk-bridge-react'
import { iPerson } from './types'

/**
 * Требуется конвертировать данные из VK Bridge в те, что принимает AdaptivityProvider из VKUI.
 */
export const transformVKBridgeAdaptivity = ({
  type,
  viewportWidth,
  viewportHeight,
}: UseAdaptivity): AdaptivityProps => {
  switch (type) {
    case 'adaptive':
      return {
        viewWidth: getViewWidthByViewportWidth(viewportWidth),
        viewHeight: getViewHeightByViewportHeight(viewportHeight),
      }
    case 'force_mobile':
    case 'force_mobile_compact':
      return {
        viewWidth: ViewWidth.MOBILE,
        sizeX: SizeType.COMPACT,
        sizeY: type === 'force_mobile_compact' ? SizeType.COMPACT : SizeType.REGULAR,
      }
    default:
      return {}
  }
}

export const sortByLastName = (p1: iPerson, p2: iPerson): number => {
  if (p1.lastName < p2.lastName) {
    return -1
  }
  if (p1.lastName > p2.lastName) {
    return 1
  }
  return 0
}

export const sortByTotalScore = (p1: iPerson, p2: iPerson): number => {
  if (p1.totalScore && p2.totalScore) {
    return p2.totalScore - p1.totalScore
  }
  return 0
}
