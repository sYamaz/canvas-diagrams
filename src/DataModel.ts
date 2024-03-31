import { IObjectData } from "./IObjectData"

export class DataModel {
    layers: {
        [objectId:string]: IObjectData
    }[] = []

    createObject(layerIndex:number, object: IObjectData): string {
        if(!this.layers[layerIndex]) {
            this.layers[layerIndex] = {}
        }

        const uuid = crypto.randomUUID()
        this.layers[layerIndex][uuid] = object
        return uuid
    }

    getLayerObjects(layerIndex:number): IObjectData[] {
        if(!this.layers[layerIndex]) {
            return []
        }

        return Object.values(this.layers[layerIndex])
    }
}