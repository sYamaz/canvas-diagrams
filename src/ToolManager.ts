import { ITool } from "./ITool";
import {TypedEvent} from "./datatypes/TypedEvent"

export interface ToolChangedEventArgs {
    oldType: string
    newType: string
}

export class ToolManager {
    private readonly tools: Map<string, ITool> = new Map<string, ITool>()
    private currentType = ''

    readonly onToolChanged = new TypedEvent<ToolChangedEventArgs>()

    constructor(tools: ITool[]) {
        tools.forEach(tool => {
            this.tools.set(tool.type, tool)
        })
    }

    addTool(tool: ITool) {
        this.tools.set(tool.type, tool)
    }

    selectTool(type: string) {
        const before = this.currentType
        this.currentType = type
        const after = this.currentType

        if(before !== after) {
            this.onToolChanged.emit({
                oldType: before,
                newType: after
            })
        }
    }

    getCurrentTool(): ITool | undefined {
        return this.tools.get(this.currentType)
    }

    getTool(type: string) : ITool | undefined {
        return this.tools.get(type)
    }
}