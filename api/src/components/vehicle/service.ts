import VehicleModel from "./model";

export default class VehicleService {

    public async getAll(): Promise<VehicleModel[]> {
        const vehicles: VehicleModel[] = [];
        // TODO
        return vehicles;
    }

    public async getById(vehicleId: number): Promise<VehicleModel | null> {
        if (![1, 2].includes(vehicleId)) {
            return null;
        }
        return null; // TODO
    }
}