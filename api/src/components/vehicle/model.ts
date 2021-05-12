export default class VehicleModel {
    vehicleId: number;
    internalName: string | null = null;
    manufactureYear: number;
    paintColor: string | null = null;
    mileageStart: number;
    mileageCurrent: number;
    imagePath: string;
    fuelTypeId: number;
    //fuelType: string;
    brandModelId: number;
    // brand: string;
    // model: string;
    createdAt: string; // YYYY-MM-DD HH:MM:SS.ffffff
    modifieadAt: string;
};