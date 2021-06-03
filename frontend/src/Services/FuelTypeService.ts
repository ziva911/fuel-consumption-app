import api from "../Api/Api";
import EventRegistry from '../Api/EventRegistry';
import FuelTypeModel from '../../../api/src/components/fuel-type/fuel-type.model';
import { ApiRole } from '../Api/Api';
export default class FuelTypeService {

    public static getAllFuelTypes(role: ApiRole = 'user'): Promise<FuelTypeModel[]> {
        return new Promise<FuelTypeModel[]>(resolve => {
            api("get", "/fuel-type", role)
                .then(res => {
                    if (res?.status !== 'ok') {
                        if (res.status === 'login') {
                            EventRegistry.emit("AUTH_EVENT", "force_login")
                        }
                        return resolve([]);
                    }
                    resolve(res.data as FuelTypeModel[])
                })
        })
    }

    public static addNewFuelType(payload: { name: string }) {
        return new Promise<FuelTypeModel | null>(resolve => {
            api("post", "/fuel-type", "administrator", payload)
                .then(res => {
                    if (res?.status !== 'ok') {
                        if (res.status === 'login') {
                            EventRegistry.emit("AUTH_EVENT", "force_login")
                        }
                        return resolve(null);
                    }
                    resolve(res.data as FuelTypeModel)
                })
        })
    }
}