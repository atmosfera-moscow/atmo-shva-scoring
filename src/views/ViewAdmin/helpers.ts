import { REACT_APP_VK_MINIAPP_LINK } from '@src/shared/consts'
import { iPerson } from '@src/shared/types'

export const getAppWidgetCode = (group: 'offline' | 'online', persons: iPerson[]): [string, string] => {
  let type = 'table'
  let shva_title: string
  switch (group) {
    case 'offline':
      shva_title = 'оффлайн'
      break
    case 'online':
      shva_title = 'онлайн'
      break
  }

  let date = new Date().toLocaleDateString()
  let code = {
    'title': `Топ ${shva_title} ШВА (${date})`,
    'title_url': REACT_APP_VK_MINIAPP_LINK,
    'more': 'Смотреть полностью',
    'more_url': REACT_APP_VK_MINIAPP_LINK,
    'head': [
      {
        'text': 'Участник',
        'align': 'left',
      },
      {
        'text': 'Место',
        'align': 'right',
      },
      {
        'text': 'Бейдж',
        'align': 'right',
      },
      {
        'text': 'Команда',
        'align': 'right',
      },
      {
        'text': 'Баллы',
        'align': 'right',
      },
    ],
    'body': [[{}]],
  }

  let persons_top = persons.slice(0, 10)

  code['body'] = persons_top.map((p) => {
    return [
      {
        'text': `${p.firstName} ${p.lastName}`,
        'icon_id': `id${p.vkID}`,
        'url': `https://vk.com/id${p.vkID}`,
      },
      {
        'text': `${p.place}`,
      },
      {
        'text': `${p.badge}`,
      },
      {
        'text': `${p.shvaTeamNumber}`,
      },
      {
        'text': `${p.totalScore}`,
      },
    ]
  })

  let code_str = `return ${JSON.stringify(code)};`
  return [type, code_str]
}

export const getDynamicAppWidgetCode = (group: 'offline' | 'online', persons: iPerson[]): [string, string] => {
  let code: string
  let type = 'table'
  let shva_title: string
  switch (group) {
    case 'offline':
      shva_title = 'оффлайн'
      break
    case 'online':
      shva_title = 'онлайн'
      break
  }

  let date = new Date().toLocaleDateString()
  let widget = {
    'title': `Топ ${shva_title} ШВА (${date})`,
    'title_url': REACT_APP_VK_MINIAPP_LINK,
    'more': 'Смотреть полностью',
    'more_url': REACT_APP_VK_MINIAPP_LINK,
    'head': [
      {
        'text': 'Участник',
        'align': 'left',
      },
      {
        'text': 'Место',
        'align': 'right',
      },
      {
        'text': 'Бейдж',
        'align': 'right',
      },
      {
        'text': 'Команда',
        'align': 'right',
      },
      {
        'text': 'Баллы',
        'align': 'right',
      },
    ],
    'body': [[{}]],
  }

  code = `var widget=${JSON.stringify(widget)};`

  persons = persons.filter((p) => !p.excluded && p.totalScore && p.totalScore > 1)
  console.log(`Show in widget ${persons.length}`)
  if (persons.length > 200) {
    persons = persons.slice(0, 200)
  }
  console.log(`Show in widget ${persons.length}`)

  let persons_short = persons.map((p) => ({
    'p': p.place ? p.place : null,
    'n': p.firstName ? p.firstName : null,
    'sn': p.lastName ? p.lastName : null,
    'id': p.vkID ? p.vkID : null,
    'b': p.badge ? p.badge : null,
    't': p.shvaTeamNumber ? p.shvaTeamNumber : null,
    's': p.totalScore ? p.totalScore : null,
  }))

  let persons_str = 'var persons_short=['
  persons_short.forEach((p, i) => {
    persons_str = `${persons_str} ${i % 2 === 1 ? '\n' : ''} ${JSON.stringify(p)},`
  })
  persons_str = `${persons_str} \n ];`

  code = `${code} \n ${persons_str}`

  code = `${code} \n
        var vkID = Args.uid;
        var persons_top = persons_short.slice(0, 10);

        var i = 0;
        var cur_person = null;
        do {
            var p = persons_short[i];
            if (p.id !=null && p.id == vkID && p.p !=null && p.p > 10) {
                cur_person = p;
            };
            i = i + 1;
        } while (i < persons_short.length);
        if (cur_person) {
            persons_top.pop();
            persons_top.push(cur_person);
        };

        i = 0;
        var body = [];
        do {
            var p = persons_top[i];
            var name = (p.n != null ? p.n : "") + " " + (p.sn != null ? p.sn : "");
            if (p.id !=null && p.id == vkID) {
                name = name + "⭐";
            };
            body.push([
                {
                    "text": name,
                    "icon_id": "id"+(p.id != null ? ""+p.id : "1"),
                    "url": "https://vk.com/id"+(p.id != null ? ""+p.id : "1"),
                },
                {
                    "text": p.p != null ? ""+p.p : "",
                },
                {
                    "text": p.b != null ? ""+p.b : "",
                },
                {
                    "text": p.t != null ? ""+p.t : "",
                },
                {
                    "text": p.s != null ? ""+p.s : "",
                },
            ]);
            i = i + 1;
        } while (i < persons_top.length);
        widget.body = body;
        return widget;
    `
  //   console.log({ code })
  return [type, code]
}
