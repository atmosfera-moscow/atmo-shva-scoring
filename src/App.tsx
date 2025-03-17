import { ViewError } from '@views/ViewError'
import { ModalCard, ModalRoot, Root, SplitCol, SplitLayout } from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css'
import { FC, ReactElement, useEffect, useState } from 'react'
import { getApiScoringInfo, checkIsParticipant, checkIsAppAdmin, checkIsEntranceAdmin } from './shared/api/espocrm'
import { getUserInfo, checkIsAtmoMember, getLaunchParams } from './shared/api/vkbridge'
import { iExtendedUserInfo, iScoringInfo } from './shared/types'
import { ViewBlock } from '@views/ViewBlock'
import { ViewLoader } from '@views/ViewLoader'
import { ViewAdmin } from '@views/ViewAdmin'
import { ViewMain } from '@views/ViewMain'
import { eViewIds } from '@views/enums'
import SVG from 'react-inlinesvg'
import vkQr from '@vkontakte/vk-qr'
import { useAppearance } from '@vkontakte/vk-bridge-react'

export const App: FC = () => {
  const vkBridgeAppearance = useAppearance() || undefined

  const [activeView, setActiveView] = useState<eViewIds>(eViewIds.Loader)
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [personalQRModal, setPersonalQRModal] = useState<ReactElement | null>(null)

  const [scoringInfo, setScoringInfo] = useState<iScoringInfo>()
  const [userInfo, setUserInfo] = useState<iExtendedUserInfo>()
  const [errorMessage, setErrorMessage] = useState<string>()

  // const { sizeX } = useAdaptivityConditionalRender()

  useEffect(() => {
    async function fetchData() {
      console.log(new Date().toTimeString(), 'App.fetchData hook called')
      try {
        let userInfoToSet: iExtendedUserInfo = {
          ...(await getUserInfo()),
          launchParams: await getLaunchParams(),
          isAppAdmin: false,
          isEntranceAdmin: false,
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
        const isEntranceAdmin = await checkIsEntranceAdmin(userInfoToSet.id)
        const isShvaParticipant = await checkIsParticipant(userInfoToSet.id)
        const isAppModerator = await checkIsAtmoMember(userInfoToSet.id)

        userInfoToSet = { ...userInfoToSet, isShvaParticipant, isAppAdmin, isAppModerator, isEntranceAdmin }

        if (!(isAppModerator || isShvaParticipant)) {
          console.log(new Date().toTimeString(), 'Access denied: not isAppModerator || isShvaParticipant')
          setActiveView(eViewIds.Block)
          return
        }
        console.log(new Date().toTimeString(), 'Access allowed: isAppModerator || isShvaParticipant')

        const scoringInfoToSet = await getApiScoringInfo()

        userInfoToSet.curPerson =
          scoringInfoToSet.offlinePersons.find((person) => person.vkID === userInfoToSet.id) ||
          scoringInfoToSet.onlinePersons.find((person) => person.vkID === userInfoToSet.id)

        // TODO: comment
        // console.log({ scoringInfoToSet })
        // console.log({ userInfoToSet })

        setUserInfo(userInfoToSet)
        setScoringInfo(scoringInfoToSet)

        console.log(new Date().toTimeString(), 'App.fetchData hook processed')
        if (userInfoToSet.isAppAdmin || userInfoToSet.isEntranceAdmin) {
          console.log('Mode admin')
          setActiveView(eViewIds.Admin)
        } else {
          console.log('Mode user')
          setActiveView(eViewIds.Main)
        }
      } catch (error) {
        // const errorMessageToSet = `App.fetchData hook error ${JSON.stringify(error)}`
        const errorMessageToSet = `App.fetchData hook error ${error}`
        console.log(new Date().toTimeString(), errorMessageToSet, error)
        setErrorMessage(errorMessageToSet)
        setActiveView(eViewIds.Error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    async function updatePersonalQRModal() {
      if (!userInfo || !userInfo.curPerson?.id) {
        return null
      }

      const personalQRSvg = vkQr.createQR(`${userInfo.curPerson?.id}`, {
        qrSize: 256,
        isShowLogo: false,
        foregroundColor: vkBridgeAppearance === 'dark' ? '#ffffff' : '#000000',
      })
      const style: React.CSSProperties = {
        width: 300,
        height: 300,
        padding: "3 3 40 3",
        marginLeft: 'auto',
        marginRight: 'auto',
      }

      setPersonalQRModal(<SVG src={personalQRSvg} style={style}></SVG>)
    }
    updatePersonalQRModal()
  }, [userInfo])

  return (
    <SplitLayout>
      <SplitCol>
        <ModalRoot activeModal={activeModal} onClose={() => setActiveModal(null)}>
          <ModalCard id="personalQR" onClose={() => setActiveModal(null)}>
            {personalQRModal}
          </ModalCard>
        </ModalRoot>
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
          <ViewMain
            id={eViewIds.Main}
            scoringInfo={scoringInfo!}
            userInfo={userInfo!}
            setActiveModalPersonalQR={() => setActiveModal('personalQR')}
          />
        </Root>
      </SplitCol>
    </SplitLayout>
  )
}

export default App
