import ICreateRefuelHistory from "../../../../backend/api/src/components/refuel_history/dto/ICreateRefuelHistory";
import RefuelHistory from "../../../../backend/api/src/components/refuel_history/refuel-history.model";
import api from "../Api/Api";
import EventRegistry from "../Api/EventRegistry";

export default class RefuelHistoryService {
    public static getRefuelHistoryByVehicleId(vehicleId: number): Promise<RefuelHistory[]> {
        return new Promise<RefuelHistory[]>(resolve => {
            api("get", `/vehicle/${vehicleId}/history`, "user")
                .then(res => {
                    if (res?.status !== 'ok') {
                        return resolve([]);
                    }
                    resolve(res.data as RefuelHistory[])
                })
        })
    }

    public static attemptAddRefuelHistory(vehicleId: number, refuelHistory: ICreateRefuelHistory | null) {
        return new Promise<RefuelHistory | null>(resolve => {
            api("post", `/vehicle/${vehicleId}/history`, "user", refuelHistory)
                .then(res => {
                    if (res?.status !== 'ok') {
                        EventRegistry.emit("REFUEL_EVENT", "fail_add_refuel", res.data)
                        return resolve(null);
                    }
                    EventRegistry.emit("REFUEL_EVENT", "add_refuel")
                    resolve(res.data as RefuelHistory)
                })
        })
    }

    public static attemptDeleteRefuelHistoryRecord(vehicleId: number, refuelHistoryId: number) {
        return new Promise<RefuelHistory | null>(resolve => {
            api("delete", `/vehicle/${vehicleId}/history/${refuelHistoryId}`, "user")
                .then(res => {
                    if (res?.status !== 'ok') {
                        EventRegistry.emit("REFUEL_EVENT", "fail_delete_refuel", res.data)
                        return resolve(null);
                    }
                    EventRegistry.emit("REFUEL_EVENT", "delete_refuel")
                    resolve(res.data as RefuelHistory)
                })
        })
    }
}