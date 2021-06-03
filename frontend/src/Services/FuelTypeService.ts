import api from "../Api/Api";
import EventRegistry from '../Api/EventRegistry';

export default class FuelTypeService {

    public static getAllFuelTypes(): Promise<any[]> {
        return new Promise<any[]>(resolve => {
            api("get", "/fuel-type", "user")
                .then(res => {
                    if (res?.status !== 'ok') {
                        if (res.status === 'login') {
                            EventRegistry.emit("AUTH_EVENT", "force_login")
                        }
                        return resolve([]);
                    }
                    resolve(res.data as any[])
                })
        })
    }
}