import axios, { AxiosResponse } from 'axios';
import { ApiConfiguration } from '../Config/api.config';
type ApiMethod = 'get' | 'post' | 'put' | 'delete';
type ApiRole = 'user' | 'administrator';
type ApiResponseStatus = 'ok' | 'error' | 'login';

export interface ApiResponse {
    status: ApiResponseStatus,
    data: any
}

export default function api(
    method: ApiMethod,
    path: string,
    role: ApiRole = 'user',
    body: any | undefined = undefined,
    attemptToRefresh: boolean = true
): Promise<ApiResponse> {
    return new Promise<ApiResponse>(resolve => {
        axios(
            {
                method: method,
                baseURL: ApiConfiguration.API_URL,
                url: path,
                data: body ? body : null,
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + getAuthToken(role)
                }
            }
        )
            .then(res => responseHandler(res, resolve))
            .catch(async err => {
                if (attemptToRefresh && ('' + err).includes("401")) {
                    const newToken: string | null = await refreshToken(role);
                    if (newToken === null) {
                        return resolve({
                            status: 'login',
                            data: null
                        })
                    }
                    saveAuthToken(role, newToken);
                    api(method, path, role, body, false)
                        .then(res => resolve(res))
                        .catch(() => {
                            return resolve({
                                status: 'login',
                                data: null
                            })
                        });
                    return;
                }
                if (err?.response?.status === 401) {
                    return resolve({
                        status: 'login',
                        data: null
                    })
                }
                if (err?.response?.status === 403) {
                    return resolve({
                        status: 'login',
                        data: 'Wrong role'
                    })
                }
                return resolve({
                    status: 'error',
                    data: err?.response
                })
            })
    })
}


function responseHandler(res: AxiosResponse<any>, resolve: (data: ApiResponse) => void) {
    if (res?.status < 200 || res?.status >= 300) {
        return resolve({
            status: 'error',
            data: '' + res
        })
    }
    resolve({
        status: 'ok',
        data: res.data
    })
}

function getAuthToken(role: ApiRole): string {
    return localStorage.getItem(role + '-auth-token') ?? '';
}

function getRefreshToken(role: ApiRole): string {
    return localStorage.getItem(role + '-refresh-token') ?? '';
}

export function getIdentity(role: ApiRole): string {
    return localStorage.getItem(role + '-identity') ?? '';
}

export function saveAuthToken(role: ApiRole, token: string) {
    localStorage.setItem(role + '-auth-token', token);
}

export function saveRefreshToken(role: ApiRole, token: string) {
    localStorage.setItem(role + '-refresh-token', token);
}

export function saveIdentity(role: ApiRole, identity: string) {
    localStorage.setItem(role + '-identity', identity);
}

function refreshToken(role: ApiRole): Promise<string | null> {
    return new Promise<string | null>((resolve) => {
        axios(
            {
                method: 'post',
                baseURL: ApiConfiguration.API_URL,
                url: `/auth/${role}/refresh`,
                data: JSON.stringify({
                    refreshToken: getRefreshToken(role)
                }),
                headers: {
                    'Content-type': 'application/json'
                }
            }
        )
            .then(res => refreshTokenResponseHandler(res, resolve))
            .catch(err => {
                resolve(null);
            })
    })
}

function refreshTokenResponseHandler(res: AxiosResponse<any>, resolve: (data: string | null) => void) {
    if (res.status !== 200) {
        return resolve(null);
    }

    resolve(res.data?.authTokenString);
}
