import { ViewNotLoaded } from '@views/ViewNotLoaded'
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
import { getApiScoringInfo, checkIsParticipant } from './shared/api/espocrm'
import { checkIsAppAdmin, getUserInfo, checkIsAtmoMember } from './shared/api/vkbridge'
import { eViewIds } from './shared/enums'
import { iConfig, iExtendedUserInfo, iPerson, iScoringInfo } from './shared/types'
// import { ViewBlock } from './views/ViewBlock'
// import { ViewLoader } from './views/ViewLoader'
// import { ViewMain } from './views/ViewMain'
// import { ViewAdmin } from './views/ViewAdmin'

const App: FC = () => {
  const [appearance, setAppearance] = useState<AppearanceType>('dark')
  const [activeView, setActiveView] = useState<eViewIds>(eViewIds.Loader)

  const [scoringInfo, setScoringInfo] = useState<iScoringInfo>()
  const [userInfo, setFetchedUser] = useState<iExtendedUserInfo>()
  const [config, setConfig] = useState<iConfig>()
  const [curPerson, setCurPerson] = useState<iPerson>()

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
          isAppAdmin: false,
          isAppModerator: false,
          isShvaParticipant: false,
        }

        if (!userInfoToSet) {
          console.log(new Date().toTimeString(), 'Access denied: no userInfo')
          setActiveView(eViewIds.Block)
          return
        }
        console.log(new Date().toTimeString(), 'Access allowed: userInfo')

        const isAppAdmin = await checkIsAppAdmin()
        const isShvaParticipant = await checkIsParticipant(userInfoToSet.id)
        const isAppModerator = await checkIsAtmoMember(userInfoToSet.id)

        userInfoToSet = { ...userInfoToSet, isShvaParticipant, isAppAdmin, isAppModerator }
        console.log(userInfoToSet)

        if (!(isAppModerator || isShvaParticipant)) {
          console.log(new Date().toTimeString(), 'Access denied: not isAppModerator || isShvaParticipant')
          setActiveView(eViewIds.Block)
          return
        }
        console.log(new Date().toTimeString(), 'Access allowed: isAppModerator || isShvaParticipant')

        const scoringInfoToSet = await getApiScoringInfo()
        console.log({ scoringInfoToSet })

        // let curPersonToSet = persons.filter((person) => person.vkID === userInfoToSet?.id)[0] || undefined

        // setConfig(configToSet)
        // setFetchedUser(userInfoToSet)
        // setCurPerson(curPersonToSet)
        // setScoringInfo(scoringInfoToSet)

        // console.log(new Date().toTimeString(), 'App.fetchData hook processed')
        // if (userInfoToSet.isAppAdmin) {
        //   console.log('Mode admin')
        //   setActiveView(eViewIds.Admin)
        // } else {
        //   console.log('Mode user')
        //   setActiveView(eViewIds.Main)
        // }
      } catch (error) {
        console.log(new Date().toTimeString(), 'App.fetchData hook error', error)
        setActiveView(eViewIds.NotLoaded)
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
              {/* <Root activeView={activeView}>
                <ViewBlock id={eViewIds.Block} />
                <ViewNotLoaded id={eViewIds.NotLoaded} />
                <ViewLoader id={eViewIds.Loader} />
                <ViewAdmin
                  setActiveView={setActiveView}
                  id={eViewIds.Admin}
                  userInfo={userInfo}
                  scoringInfo={scoringInfo!}
                />
                <ViewMain
                  id={eViewIds.Main}
                  userInfo={userInfo}
                  curPerson={curPerson}
                  scoringInfo={scoringInfo!}
                />
              </Root> */}
            </SplitCol>
          </SplitLayout>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  )
}

export default App
