import { DataModel } from "./DataModel";
import { ILayer } from "./ILayer";
import { ToolManager } from "./ToolManager";
import { CustomPointerEvent } from "./datatypes/PointerEvent";
import { TypedEvent } from "./datatypes/TypedEvent";

export class Layer implements ILayer {

    readonly onRenderRequested = new TypedEvent<void>

    constructor(private readonly layerIndex:number, private readonly toolManager: ToolManager, private readonly dataModel: DataModel){
    }

    render(ctx: CanvasRenderingContext2D) {
        this.dataModel.getLayerObjects(this.layerIndex).forEach(obj => {
            this.toolManager.getTool(obj.type)?.renderObject(ctx, obj)
        })
    }

    receivePointerDownEvent(ev: CustomPointerEvent): void {
        const currentTool = this.toolManager.getCurrentTool()
        if(currentTool) { // toolが選択されてればそれを優先
            currentTool.pointerDown(ev)
            if(ev.used) {
                this.onRenderRequested.emit()
            }
            return
        }

        this.dataModel.getLayerObjects(this.layerIndex).forEach(obj => {
            obj.pointerDown(ev)
        })
        
        this.onRenderRequested.emit()
    }
    receivePointerUpEvent(ev: CustomPointerEvent): void {
        const currentTool = this.toolManager.getCurrentTool()
        if(currentTool) { // toolが選択されていればそれを優先
            currentTool.pointerUp(ev)
            if(ev.used) {
                this.onRenderRequested.emit()
            }
            return
        }

        this.dataModel.getLayerObjects(this.layerIndex).forEach(obj => {
            obj.pointerUp(ev)
        })
        this.onRenderRequested.emit()
    }
    receivePointerMoveEvent(ev: CustomPointerEvent): void {
        const currentTool = this.toolManager.getCurrentTool()
        if(currentTool) { // toolが選択されていればそれを優先
            currentTool.pointerMove(ev)
            if(ev.used) {
                this.onRenderRequested.emit()
            }
            return
        }

        // draggingとhoverではdraggingを優先するため、sortで先頭に持ってくるようにする
        this.dataModel.getLayerObjects(this.layerIndex).sort((left, right) => {
            if(left.isDragging() && right.isDragging()) {
                return 0
            } else if(left.isDragging()) {
                return -1
            } else if (right.isDragging()) {
                return 1
            } else {
                return 0
            }
        }).forEach(obj => {
            obj.pointerMove(ev)
        })

        this.onRenderRequested.emit()
    }

    resetObjectState() {
        this.dataModel.getLayerObjects(this.layerIndex).forEach(obj => {
            obj.clearState()
        })
    }
}