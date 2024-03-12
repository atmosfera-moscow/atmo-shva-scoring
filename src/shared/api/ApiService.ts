import axios, { AxiosRequestConfig } from 'axios'

// import createAuthRefreshInterceptor from 'axios-auth-refresh'
// import Cookies from 'js-cookie'
// import { translation } from '@src/translation'
// import eventBusService from '../eventBusService'
// import { CsrfToken } from './consts'

export class ApiService {
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
