import axios, { AxiosRequestConfig } from 'axios'

// import createAuthRefreshInterceptor from 'axios-auth-refresh'
// import Cookies from 'js-cookie'
// import { translation } from '@src/translation'
// import eventBusService from '../eventBusService'
// import { CsrfToken } from './consts'

export class ApiService {
  //   accessToken = Cookies.get(CsrfToken.Access) || ''
  //   refreshToken = Cookies.get(CsrfToken.Refresh) || ''

  //  constructor() {
  //     createAuthRefreshInterceptor(axios, this.refreshTokenLogic, {
  //       statusCodes: [401, 403],
  //       pauseInstanceWhileRefreshing: true,
  //     })
  //     this.setRequestsInterceptor()
  //   }

  //   private setRequestsInterceptor = () => axios.interceptors.request.use(request => {
  //     if (request.method !== 'get') {
  //       request.headers = { ...request.headers || {}, 'X-CSRF-TOKEN': this.accessToken }
  //     }

  //     return request
  //   })

  //   public refreshTokenLogic = (): any => {
  //     if (!this.refreshToken) {
  //       eventBusService.emit('logout')
  //       return Promise.reject(new Error(translation.AUTHORIZATION__NO_REFRESH_TOKEN))
  //     }

  //     return axios
  //       .get('/api/authorization/refresh', {
  //         headers: {
  //           'X-CSRF-REFRESH-TOKEN': this.refreshToken
  //         },
  //       })
  //       .catch(() => {
  //         eventBusService.emit('logout')
  //       })
  //   }

  public async get<T>(url: string, options?: AxiosRequestConfig): Promise<T> {
    return this.http<T>(url, { ...options, method: 'get' })
  }

  public async post<T>(url: string, options?: AxiosRequestConfig): Promise<T> {
    return this.http<T>(url, { ...options, method: 'post' })
  }

  public async put<T>(url: string, options?: AxiosRequestConfig): Promise<T> {
    return this.http<T>(url, { ...options, method: 'put' })
  }

  public async delete<T>(url: string, options?: AxiosRequestConfig): Promise<T> {
    return this.http<T>(url, { ...options, method: 'delete' })
  }

  public async patch<T>(url: string, options?: AxiosRequestConfig): Promise<T> {
    return this.http<T>(url, { ...options, method: 'patch' })
  }

  private async http<T>(url: string, options?: AxiosRequestConfig): Promise<T> {
    const response = await axios(url, options)
    const result = await response.data
    // console.log({ result })
    return result as unknown as T
  }
}

const apiService = new ApiService()

export default apiService
