import { REACT_APP_VK_MINIAPP_ID, REACT_APP_VK_ATMOMY_GROUP_ID } from '@src/shared/consts'
import bridge, { GetLaunchParamsResponse, UserInfo } from '@vkontakte/vk-bridge'

export const getAccessToken = async (): Promise<string> => {
  const { access_token } = await bridge.send('VKWebAppGetAuthToken', {
    app_id: REACT_APP_VK_MINIAPP_ID,
    scope: '',
  })
  return access_token
}

export const bridgeInit = async (): Promise<void> => {
  await bridge.send('VKWebAppInit')
}

export const getLaunchParams = async (): Promise<GetLaunchParamsResponse> => {
  const launchParams = await bridge.send('VKWebAppGetLaunchParams')
  return launchParams
}

// export const checkIsAppAdmin = async (): Promise<boolean> => {
//   // TODO: fix
//   // const { vk_testing_group_id } = await bridge.send('VKWebAppGetLaunchParams')
//   const details = await bridge.send('VKWebAppGetLaunchParams')
//   console.log({ details })
//   let vk_testing_group_id = ''
//   return vk_testing_group_id !== undefined
// }

export const getPhotoUrls = async (ids: (number | undefined)[]): Promise<{ photo: string; id: number }[]> => {
  // console.log({ ids })
  let result = await bridge.send('VKWebAppCallAPIMethod', {
    method: 'users.get',
    params: {
      user_ids: ids.join(','),
      fields: 'photo_max,has_photo',
      v: '5.131',
      access_token: await getAccessToken(),
    },
  })
  let photos: (any | null)[] = result.response
  // console.log({ photos })
  photos = photos.map((item: { deactivated?: string; photo_max: string; has_photo: number; id: number }) => ({
    photo: item.deactivated || item.has_photo === 0 ? null : item.photo_max,
    id: item.id,
  }))
  // console.log({ photos })
  return photos
}

export const checkIsAtmoMember = async (vkId: number): Promise<boolean> => {
  const { response } = await bridge.send('VKWebAppCallAPIMethod', {
    method: 'groups.getMembers',
    params: {
      group_id: REACT_APP_VK_ATMOMY_GROUP_ID,
      v: '5.131',
      access_token: await getAccessToken(),
    },
  })
  const atmoMembers: number[] = response.items
  return atmoMembers.includes(vkId)
}

export const getUserInfo = async (): Promise<UserInfo> => {
  return await bridge.send('VKWebAppGetUserInfo')
}

export const getGroupToken = async (groupId: number): Promise<string> => {
  const { access_token } = await bridge.send('VKWebAppGetCommunityToken', {
    app_id: REACT_APP_VK_MINIAPP_ID,
    group_id: groupId,
    scope: 'app_widget',
  })
  return access_token
}
