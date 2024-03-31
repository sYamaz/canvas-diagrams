import { IObjectData } from "./IObjectData";
import { CustomPointerEvent } from "./datatypes/PointerEvent";

export interface IObjectFactory {
    pointerDown(ev: CustomPointerEvent): void
    pointerUp(ev: CustomPointerEvent): void
    pointerMove(ev: CustomPointerEvent): void
}

export interface IObjectRenderer {
    renderObject(ctx: CanvasRenderingContext2D, object: IObjectData):void
}

export interface ITool extends IObjectRenderer, IObjectFactory {
    type: string
}