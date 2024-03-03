// import { iEspoCRMGetParams, iEspoCRMPostPayload, iEspocrmApiClientOptions } from '../types'
// import https, { RequestOptions } from 'https'
// import http, { OutgoingHttpHeaders } from 'http'
// import crypto from 'crypto'
// import querystring from 'querystring'

// export class Client {
//   url: string
//   apiKey: string
//   secretKey?: string
//   options?: iEspocrmApiClientOptions
//   urlPath: string
//   isHttps: boolean

//   constructor(url: string, apiKey: string, secretKey?: string, options?: iEspocrmApiClientOptions) {
//     this.url = url
//     this.apiKey = apiKey
//     this.secretKey = secretKey

//     if (this.url.slice(-1) === '/') {
//       this.url = this.url.slice(0, this.url.length - 1)
//     }

//     this.options = options || {}

//     this.urlPath = '/api/v1/'
//     this.isHttps = url.toLowerCase().startsWith('https')
//   }

//   request(method: string, entity: string, data: any) {
//     method = method || 'GET'
//     method = method.toUpperCase()

//     let url = this._buildUrl(entity)

//     const headers: OutgoingHttpHeaders = {}

//     if (this.apiKey && this.secretKey) {
//       let string = method + ' /' + entity
//       let b2 = crypto.createHmac('sha256', this.secretKey).update(string).digest()
//       let b1 = Buffer.from(this.apiKey + ':')
//       let authPart = Buffer.concat([b1, b2]).toString('base64')
//       headers['X-Hmac-Authorization'] = authPart
//     } else if (this.apiKey) {
//       headers['X-Api-Key'] = this.apiKey
//     } else {
//       throw new Error('Api-Key is not set.')
//     }

//     let postData: string

//     if (data) {
//       if (method === 'GET') {
//         url += '?' + querystring.stringify({ searchParams: JSON.stringify(data) })
//       } else {
//         postData = JSON.stringify(data)

//         headers['Content-Type'] = 'application/json'
//         headers['Content-Length'] = Buffer.byteLength(postData).toString()
//       }
//     }
    
//     let requestParams: RequestOptions = {
//       headers: headers,
//       method: method,
//     }

//     if (this.options!.port) {
//       requestParams.port = this.options!.port
//     }

//     if (this.options!.timeout) {
//       requestParams.timeout = this.options!.timeout
//     }

//     const h = this.isHttps ? https : http
//     //   const h = https

//     return new Promise((resolve, reject) => {
//       const req = h.request(url, requestParams, (res) => {
//         let data = ''

//         res.on('data', (chunk: string) => {
//           data += chunk
//         })

//         res.on('end', () => {
//           if (res.statusCode! < 200 || res.statusCode! > 299) {
//             reject(res)
//             return
//           }

//           try {
//             data = JSON.parse(data)
//           } catch (e) {
//             console.error(`Error: Could not parse response`)
//             reject({})

//             return
//           }

//           resolve(data)
//         })
//       })

//       req.on('error', (e) => {
//         console.error(`Error: ${e.message}`)
//         reject(e)
//       })

//       if (data && method !== 'GET') {
//         req.write(postData)
//       }

//       req.end()
//     })
//   }

//   _buildUrl(entity: string) {
//     return this.url + this.urlPath + entity
//   }
// }

// export default Client
