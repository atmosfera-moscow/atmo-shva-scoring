import { getGroupToken } from '@src/shared/api/vkbridge'
import { ePanelIds, eViewIds } from '@src/shared/enums'
import { iAdminViewProps } from '@views/types'
import bridge from '@vkontakte/vk-bridge'
import { Button, ButtonGroup, Div, Panel, PanelHeader, PanelHeaderBack, Title, View } from '@vkontakte/vkui'
import { FC, useEffect, useState } from 'react'
import { REACT_APP_VK_SHVA_GROUP_ID, REACT_APP_VK_SHVA_ONLINE_GROUP_ID } from '../../shared/consts'
import './index.css'
import { getDynamicAppWidgetCode } from './helpers'
import { iPerson } from '@src/shared/types'

export const ViewAdmin: FC<iAdminViewProps> = ({ setActiveView, scoringInfo, userInfo, ...rest }) => {
  const [isShvaButtonLoading, setIsShvaButtonLoading] = useState<boolean>(false)
  const [isShvaOnlineButtonLoading, setIisShvaOnlineButtonLoading] = useState<boolean>(false)
  useEffect(() => {
    // console.log({tableWidget})
    console.log(new Date().toTimeString(), 'ViewAdmin hook called')
    if (!userInfo?.isAppAdmin) {
      setActiveView(eViewIds.Main)
    }
    console.log(new Date().toTimeString(), 'ViewAdmin hook ended')
  }, [])

  const updateAppWidget = async (group: 'offline' | 'online' = 'offline', mode: 'set' | 'del' = 'set') => {
    let groupId: number
    let loadingButtonFun: (flag: boolean) => void
    let persons: iPerson[]
    switch (group) {
      case 'offline':
        groupId = REACT_APP_VK_SHVA_GROUP_ID
        loadingButtonFun = setIsShvaButtonLoading
        persons = scoringInfo.offlinePersons
        break
      case 'online':
        groupId = REACT_APP_VK_SHVA_ONLINE_GROUP_ID
        loadingButtonFun = setIisShvaOnlineButtonLoading
        persons = scoringInfo.onlinePersons
        break
    }
    loadingButtonFun(true)

    let code: string
    let type: string
    switch (mode) {
      case 'set':
        // [type, code] = getAppWidgetCode(group, persons)
        ;[type, code] = getDynamicAppWidgetCode(group, persons)
        break
      case 'del':
        type = 'table'
        code = 'return false;'
        break
    }

    const groupToken = await getGroupToken(groupId)
    const res = await bridge.send('VKWebAppCallAPIMethod', {
      method: 'appWidgets.update',
      params: {
        type: type,
        code: code,
        v: '5.131',
        access_token: groupToken,
      },
    })
    console.log({ res })
    loadingButtonFun(false)
  }

  return (
    <View activePanel={eViewIds.Admin} {...rest}>
      <Panel id={ePanelIds.Admin}>
        <PanelHeader delimiter="none" before={<PanelHeaderBack onClick={() => setActiveView(eViewIds.Main)} />}>
          Для админов
        </PanelHeader>
        <Div>
          <Title level="3">Оффлайн</Title>
          <ButtonGroup mode="horizontal" gap="m">
            <Button
              onClick={() => updateAppWidget('offline', 'set')}
              appearance="positive"
              // stretched={true}
              mode="primary"
              loading={isShvaButtonLoading}
              disabled={!scoringInfo.isOfflineEnabled}
            >
              Обновить виджет
            </Button>
            <Button
              onClick={() => updateAppWidget('offline', 'del')}
              appearance="neutral"
              mode="primary"
              loading={isShvaButtonLoading}
            >
              Удалить виджет
            </Button>
          </ButtonGroup>
        </Div>
        <Div>
          <Title level="3">Онлайн</Title>
          <ButtonGroup mode="horizontal" gap="m">
            <Button
              onClick={() => updateAppWidget('online', 'set')}
              appearance="positive"
              mode="primary"
              loading={isShvaOnlineButtonLoading}
              disabled={!scoringInfo.isOnlineEnabled}
            >
              Обновить виджет
            </Button>
            <Button
              onClick={() => updateAppWidget('online', 'del')}
              appearance="neutral"
              mode="primary"
              loading={isShvaOnlineButtonLoading}
            >
              Удалить виджет
            </Button>
          </ButtonGroup>
        </Div>
        {/* <Image src="https://www.svgrepo.com/show/407661/two-hearts.svg" size={28}/> */}
      </Panel>
    </View>
  )
}
