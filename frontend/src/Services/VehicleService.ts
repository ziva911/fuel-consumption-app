import ICreateVehicle from "../../../../backend/api/src/components/vehicle/dto/ICreateVehicle";
import IUpdateVehicle from "../../../../backend/api/src/components/vehicle/dto/IUpdateVehicle";
import VehicleModel from "../../../../backend/api/src/components/vehicle/vehicle.model";
import api from "../Api/Api";
import EventRegistry from '../Api/EventRegistry';

export default class VehicleService {

    public static getAllVehicles(): Promise<VehicleModel[]> {
        return new Promise<VehicleModel[]>(resolve => {
            api("get", "/vehicle", "user")
                .then(res => {
                    if (res?.status !== 'ok') {
                        if (res.status === 'login') {
                            EventRegistry.emit("AUTH_EVENT", "force_login")
                        }
                        return resolve([]);
                    }
                    resolve(res.data as VehicleModel[])
                })
        })
    }

    public static getVehicleById(vehicleId: number): Promise<VehicleModel | null> {
        return new Promise<VehicleModel | null>(resolve => {
            api("get", `/vehicle/${vehicleId}`, "user")
                .then(res => {
                    if (res?.status !== 'ok') {
                        if (res.status === 'login') {
                            EventRegistry.emit("AUTH_EVENT", "force_login")
                        }
                        return resolve(null);
                    }
                    resolve(res.data as VehicleModel);
                })
        })
    }

    public static attemptAddVehicle(vehicle: ICreateVehicle, photo: File | null) {
        let payload = new FormData();
        payload.append('data', JSON.stringify(vehicle));
        if (photo) {
            payload.append('photo', photo)
        }
        return new Promise<VehicleModel | null>(resolve => {
            api("post", `/vehicle`, "user", payload)
                .then(res => {
                    if (res?.status !== 'ok') {
                        EventRegistry.emit("VEHICLE_EVENT", "fail_add_vehicle")
                        return resolve(null);
                    }
                    EventRegistry.emit("VEHICLE_EVENT", "add_vehicle")
                    resolve(res.data as VehicleModel)
                })
        })
    }
    public static attemptEditVehicle(vehicleId: number, payload: IUpdateVehicle) {
        return new Promise<VehicleModel | null>(resolve => {
            api("put", `/vehicle/${vehicleId}`, "user", payload)
                .then(res => {
                    if (res?.status !== 'ok') {
                        EventRegistry.emit("VEHICLE_EVENT", "fail_edit_vehicle")
                        return resolve(null);
                    }
                    EventRegistry.emit("VEHICLE_EVENT", "edit_vehicle")
                    resolve(res.data as VehicleModel)
                })
        })
    }

    public static attemptAddVehiclePhoto(vehicleId: number, photo: File) {
        let payload = new FormData();
        payload.append("photo", photo);
        return new Promise<VehicleModel | null>(resolve => {
            api("post", `/vehicle/${vehicleId}/photo`, "user", payload)
                .then(res => {
                    if (res?.status !== 'ok') {
                        EventRegistry.emit("VEHICLE_EVENT", "fail_edit_vehicle_photo")
                        return resolve(null);
                    }
                    EventRegistry.emit("VEHICLE_EVENT", "edit_vehicle_photo")
                    resolve(res.data as VehicleModel)
                })
        })
    }

    public static attemptDeleteVehicle(vehicleId: number) {
        return new Promise<VehicleModel | null>(resolve => {
            api("delete", `/vehicle/${vehicleId}`, "user")
                .then(res => {
                    if (res?.status !== 'ok') {
                        EventRegistry.emit("VEHICLE_EVENT", "fail_delete_vehicle")
                        return resolve(null);
                    }
                    EventRegistry.emit("VEHICLE_EVENT", "edit_vehicle")
                    resolve(res.data as VehicleModel)
                })
        })
    }

    public static attemptDeleteVehiclePhoto(vehicleId: number) {
        return new Promise<VehicleModel | null>(resolve => {
            api("delete", `/vehicle/${vehicleId}/photo`, "user", false)
                .then(res => {
                    if (res?.status !== 'ok') {
                        EventRegistry.emit("VEHICLE_EVENT", "fail_delete_vehicle_photo")
                        return resolve(null);
                    }
                    EventRegistry.emit("VEHICLE_EVENT", "delete_vehicle_photo")
                    resolve(res.data as VehicleModel)
                })
        })
    }
}