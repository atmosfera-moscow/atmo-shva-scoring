import { getGroupToken } from '@src/shared/api/vkbridge'
import { eViewIds } from '@views/enums'
import { iAdminViewProps } from '@views/types'
import bridge from '@vkontakte/vk-bridge'
import {
  Button,
  ButtonGroup,
  Div,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  ScreenSpinner,
  Title,
  View,
} from '@vkontakte/vkui'
import { FC, ReactElement, useEffect, useState } from 'react'
import { keysToMark, REACT_APP_VK_SHVA_GROUP_ID, REACT_APP_VK_SHVA_ONLINE_GROUP_ID } from '../../shared/consts'
import './index.css'
import { getDynamicAppWidgetCode } from './helpers'
import { iEspoCRMApiPostPayload, iPerson } from '@src/shared/types'
import { updateApiParticipant } from '@src/shared/api/espocrm'

export const ViewAdmin: FC<iAdminViewProps> = ({ setActiveView, scoringInfo, userInfo, ...rest }) => {
  const [popout, setPopout] = useState<ReactElement | null>(null)

  const [isShvaOfflineButtonLoading, setIsShvaOfflineButtonLoading] = useState<boolean>(false)
  const [isShvaOnlineButtonLoading, setIisShvaOnlineButtonLoading] = useState<boolean>(false)
  const userPlatfromWithoutCamera = userInfo.launchParams.vk_platform === 'desktop_web'

  useEffect(() => {
    // console.log({tableWidget})
    console.log(new Date().toTimeString(), 'ViewAdmin hook called')
    if (!userInfo?.isAppAdmin) {
      setActiveView(eViewIds.Main)
    }
    console.log(new Date().toTimeString(), 'ViewAdmin hook ended')
  }, [])

  const markCRMKey = async (key: string) => {
    const response = await bridge.send('VKWebAppOpenCodeReader')
    if (response.code_data) {
      const id = response.code_data
      console.log({ id })

      const payload: iEspoCRMApiPostPayload = {}
      payload[key] = true

      const isDone = await updateApiParticipant(id, payload)
      console.log('markCRMKey done')
      isDone ? setPopout(<ScreenSpinner state="done" />) : setPopout(<ScreenSpinner state="error" />)
      setTimeout(() => {
        setPopout(null)
        markCRMKey(key)
      }, 1500)
    } else {
      console.log('markCRMKey failed')
      setPopout(<ScreenSpinner state="error" />)
      setTimeout(() => setPopout(null), 1500)
    }
  }

  const updateAppWidget = async (group: 'offline' | 'online' = 'offline', mode: 'set' | 'del' = 'set') => {
    let groupId: number
    let loadingButtonFun: (flag: boolean) => void
    let persons: iPerson[]
    switch (group) {
      case 'offline':
        groupId = REACT_APP_VK_SHVA_GROUP_ID
        loadingButtonFun = setIsShvaOfflineButtonLoading
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
      <Panel id={eViewIds.Admin}>
        {popout}
        <PanelHeader delimiter="none" before={<PanelHeaderBack onClick={() => setActiveView(eViewIds.Main)} />}>
          Для админов
        </PanelHeader>
        {userInfo.isAppAdmin && (
          <Div>
            <Div>
              <Title level="3">Оффлайн</Title>
              <ButtonGroup mode="horizontal" gap="m">
                <Button
                  onClick={() => updateAppWidget('offline', 'set')}
                  appearance="positive"
                  // stretched={true}
                  mode="primary"
                  loading={isShvaOfflineButtonLoading}
                  disabled={!scoringInfo.isOfflineEnabled || scoringInfo.isNoScoreOfflineMode}
                >
                  Обновить виджет
                </Button>
                <Button
                  onClick={() => updateAppWidget('offline', 'del')}
                  appearance="neutral"
                  mode="primary"
                  loading={isShvaOfflineButtonLoading}
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
                  disabled={!scoringInfo.isOnlineEnabled || scoringInfo.isNoScoreOnlineMode}
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
          </Div>
        )}

        <Div>
          <Title level="3">Посещение занятий</Title>
          <ButtonGroup mode="vertical" gap="m">
            {keysToMark.map((key) => {
              const keyToMarkLabel = scoringInfo.labels.find((l) => l.key === key)?.title || key
              return (
                <Button onClick={() => markCRMKey(key)} mode="link" disabled={userPlatfromWithoutCamera}>
                  {`Отметить ${keyToMarkLabel}`}
                </Button>
              )
            })}
          </ButtonGroup>
        </Div>

        {/* <Image src="https://www.svgrepo.com/show/407661/two-hearts.svg" size={28}/> */}
      </Panel>
    </View>
  )
}
