import api from "../Api/Api";
import { saveAuthToken, saveRefreshToken } from '../Api/Api';
import EventRegistry from '../Api/EventRegistry';
import ICreateUser from '../../../api/src/components/user/dto/ICreateUser';
import UserModel from '../../../api/src/components/user/user.model';
import IUpdateUser from '../../../api/src/components/user/dto/IUpdateUser';

interface UserCredentials {
    email: string,
    password: string
}
export default class AuthService {
    public static attemptUserLogin(credentials: UserCredentials) {
        api(
            'post',
            "/auth/user/login",
            "user",
            credentials,
            false
        )
            .then(res => {
                if (res.status === 'ok') {
                    const authToken = res.data?.authToken ?? "";
                    const refreshToken = res.data?.refreshToken ?? "";
                    saveAuthToken("user", authToken);
                    saveRefreshToken("user", refreshToken);
                    EventRegistry.emit("AUTH_EVENT", "user_login")
                } else {
                    EventRegistry.emit("AUTH_EVENT", "user_login_failed", res.data)
                }
            })
            .catch(err => {
                EventRegistry.emit("AUTH_EVENT", "user_login_failed", err)
            })
    }

    public static attemptAdministratorLogin(credentials: UserCredentials) {
        api(
            'post',
            "/auth/administrator/login",
            "user",
            credentials,
            false
        )
            .then(res => {
                if (res.status === 'ok') {
                    const authToken = res.data?.authToken ?? "";
                    const refreshToken = res.data?.refreshToken ?? "";
                    saveAuthToken("administrator", authToken);
                    saveRefreshToken("administrator", refreshToken);
                    EventRegistry.emit("AUTH_EVENT", "administrator_login")
                } else {
                    EventRegistry.emit("AUTH_EVENT", "administrator_login_failed", res.data)
                }
            })
            .catch(err => {
                EventRegistry.emit("AUTH_EVENT", "administrator_login_failed", err)
            })
    }

    public static attemptRegisterUser(userInfo: ICreateUser) {

        return new Promise<UserModel | null>(resolve => {
            api("post", `/user/register`, "user", userInfo)
                .then(res => {
                    if (res?.status !== 'ok') {
                        EventRegistry.emit("AUTH_EVENT", "fail_user_register", res.data)
                        return resolve(null);
                    }
                    EventRegistry.emit("AUTH_EVENT", "user_register")
                    resolve(res.data as UserModel)
                })
        })
    }

    public static attemptEditUser(userInfo: IUpdateUser) {
        return new Promise<UserModel | null>(resolve => {
            api("put", `/user`, "user", userInfo)
                .then(res => {
                    if (res?.status !== 'ok') {
                        EventRegistry.emit("AUTH_EVENT", "fail_user_register", res.data)
                        return resolve(null);
                    }
                    EventRegistry.emit("AUTH_EVENT", "user_register")
                    resolve(res.data as UserModel)
                })
        })
    }

    public static getUser() {
        return new Promise<UserModel | null>(resolve => {
            api("get", `/user`, "user")
                .then(res => {
                    if (res?.status !== 'ok') {
                        if (res.status === 'login') {
                            EventRegistry.emit("AUTH_EVENT", "force_login")
                        }
                        return resolve(null);
                    }
                    resolve(res.data as UserModel);
                })
        })
    }
}