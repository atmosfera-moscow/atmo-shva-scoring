import { ViewError } from '@views/ViewError'
import bridge, { AppearanceType } from '@vkontakte/vk-bridge'
import {
  AdaptivityProvider,
  AppRoot,
  ConfigProvider,
  Root,
  SplitCol,
  SplitLayout,
  useAdaptivityConditionalRender,
} from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css'
import { FC, useEffect, useState } from 'react'
import { getApiScoringInfo, checkIsParticipant, checkIsAppAdmin } from './shared/api/espocrm'
import { getUserInfo, checkIsAtmoMember, getLaunchParams } from './shared/api/vkbridge'
import { iConfig, iExtendedUserInfo, iPerson, iScoringInfo } from './shared/types'
import { ViewBlock } from '@views/ViewBlock'
import { ViewLoader } from '@views/ViewLoader'
import { ViewAdmin } from '@views/ViewAdmin'
import { ViewMain } from '@views/ViewMain'
import { eViewIds } from '@views/enums'

const App: FC = () => {
  const [appearance, setAppearance] = useState<AppearanceType>('dark')
  const [activeView, setActiveView] = useState<eViewIds>(eViewIds.Loader)

  const [scoringInfo, setScoringInfo] = useState<iScoringInfo>()
  const [userInfo, setUserInfo] = useState<iExtendedUserInfo>()
  const [errorMessage, setErrorMessage] = useState<string>()

  // const { sizeX } = useAdaptivityConditionalRender()

  useEffect(() => {
    // TODO: mv to shared
    bridge.subscribe((res) => {
      if (res.detail.type === 'VKWebAppUpdateConfig') {
        setAppearance(res.detail.data.appearance)
      }
    })

    async function fetchData() {
      console.log(new Date().toTimeString(), 'App.fetchData hook called')
      try {
        let userInfoToSet: iExtendedUserInfo = {
          ...(await getUserInfo()),
          launchParams: await getLaunchParams(),
          isAppAdmin: false,
          isAppModerator: false,
          isShvaParticipant: false,
        }

        if (!userInfoToSet) {
          console.log(new Date().toTimeString(), 'Access denied: no userInfo')
          setErrorMessage(`Access denied: no userInfo featched ${JSON.stringify(userInfoToSet)}`)
          setActiveView(eViewIds.Error)
          return
        }
        console.log(new Date().toTimeString(), 'Access allowed: userInfo')

        const isAppAdmin = await checkIsAppAdmin(userInfoToSet.id)
        const isShvaParticipant = await checkIsParticipant(userInfoToSet.id)
        const isAppModerator = await checkIsAtmoMember(userInfoToSet.id)

        userInfoToSet = { ...userInfoToSet, isShvaParticipant, isAppAdmin, isAppModerator }

        if (!(isAppModerator || isShvaParticipant)) {
          console.log(new Date().toTimeString(), 'Access denied: not isAppModerator || isShvaParticipant')
          setActiveView(eViewIds.Block)
          return
        }
        console.log(new Date().toTimeString(), 'Access allowed: isAppModerator || isShvaParticipant')

        const scoringInfoToSet = await getApiScoringInfo()
        console.log({ scoringInfoToSet })

        userInfoToSet.curPerson =
          scoringInfoToSet.offlinePersons.find((person) => person.vkID === userInfoToSet.id) ||
          scoringInfoToSet.onlinePersons.find((person) => person.vkID === userInfoToSet.id)

        console.log({ userInfoToSet })

        setUserInfo(userInfoToSet)
        setScoringInfo(scoringInfoToSet)

        console.log(new Date().toTimeString(), 'App.fetchData hook processed')
        // if (userInfoToSet.isAppAdmin) {
        //   console.log('Mode admin')
        //   setActiveView(eViewIds.Admin)
        // } else {
        console.log('Mode user')
        setActiveView(eViewIds.Main)
        // }
      } catch (error) {
        const errorMessageToSet = `App.fetchData hook error ${JSON.stringify(error)}`
        console.log(new Date().toTimeString(), errorMessageToSet)
        setErrorMessage(errorMessageToSet)
        setActiveView(eViewIds.Error)
      }
    }

    fetchData()
  }, [])

  return (
    <ConfigProvider appearance={appearance}>
      <AdaptivityProvider>
        <AppRoot>
          <SplitLayout>
            <SplitCol>
              <Root activeView={activeView}>
                <ViewLoader id={eViewIds.Loader} />
                <ViewError id={eViewIds.Error} errorMessage={errorMessage} />
                <ViewBlock id={eViewIds.Block} userInfo={userInfo!} />
                <ViewAdmin
                  id={eViewIds.Admin}
                  scoringInfo={scoringInfo!}
                  userInfo={userInfo!}
                  setActiveView={setActiveView}
                />
                <ViewMain id={eViewIds.Main} scoringInfo={scoringInfo!} userInfo={userInfo!} />
              </Root>
            </SplitCol>
          </SplitLayout>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  )
}

export default App
