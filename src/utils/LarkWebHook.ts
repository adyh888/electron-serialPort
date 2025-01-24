import axios from 'axios'

export async function larkSendMessage(content: string) {
  new Promise((resolve, reject) => {
    const url: string = 'https://open.feishu.cn/open-apis/bot/v2/hook/65c0d698-8792-4964-9e50-dbea1c348321'
    const data = {
      msg_type: 'text',
      content: {
        text: content
      }
    }
    // @ts-ignore
    axios({
      url: url, //仅为示例，并非真实接口地址。
      data: data,
      header: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}
