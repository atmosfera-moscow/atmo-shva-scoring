import { ReactComponent as Clown } from '@assets/img/medals/clown.svg'
import { ReactComponent as Goblet } from '@assets/img/medals/goblet.svg'
import { ReactComponent as Game } from '@assets/img/medals/game.svg'
import { ReactComponent as Start } from '@assets/img/medals/start.svg'
import { ReactComponent as Edu } from '@assets/img/medals/edu.svg'
import { ReactComponent as Image } from '@assets/img/medals/image.svg'
import { ReactComponent as Flash } from '@assets/img/medals/flash.svg'
import { ReactComponent as Owl } from '@assets/img/medals/owl.svg'
import { ReactComponent as Medal } from '@assets/img/medals/first-medal.svg'
import { ReactComponent as Life } from '@assets/img/medals/life.svg'
import { ReactComponent as Cat } from '@assets/img/medals/cat.svg'
import { ReactComponent as Theater } from '@assets/img/medals/theater.svg'
import { ReactComponent as Сupcake } from '@assets/img/medals/cupcake.svg'
import { ReactComponent as Hearts } from '@assets/img/medals/hearts.svg'

import './index.css'

export const getMedals = (size = 16, padding = '3'): Record<string, React.SVGProps<SVGSVGElement>> => {
  const style = { width: size, height: size, padding: padding }

  return {
    'otkrytie_participant': <Start className="medals__medal" style={style} />,
    'otkrytie_winner': <Goblet className="medals__medal" style={style} />,
    'meme_winner': <Clown className="medals__medal" style={style} />,
    'attendance': <Life className="medals__medal" style={style} />,
    'top_sum': <Medal className="medals__medal" style={style} />,
    'top_sum_electives': <Cat className="medals__medal" style={style} />,
    'top_sum_edu': <Edu className="medals__medal" style={style} />,
    'top_sum_game': <Game className="medals__medal" style={style} />,
    'top_sum_image': <Image className="medals__medal" style={style} />,
    'top_sum_activity': <Flash className="medals__medal" style={style} />,
    'top_sum_tests': <Owl className="medals__medal" style={style} />,
    'scene_winner_one': <Theater className="medals__medal" style={style} />,
    'scene_winner_two': <Theater className="medals__medal" style={style} />,
    'scene_winner_three': <Theater className="medals__medal" style={style} />,
    'yarm_winner': <Сupcake className="medals__medal" style={style} />,
    'chat_tasks': <Hearts className="medals__medal" style={style} />,
  }
}
