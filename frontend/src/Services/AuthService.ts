import api from "../Api/Api";
import { saveAuthToken, saveRefreshToken } from '../Api/Api';
import EventRegistry from '../Api/EventRegistry';

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
}