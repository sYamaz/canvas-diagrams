export interface CustomPointerEvent {
    pressure:number
    x:number
    y:number
    timestamp:number
    used: boolean
}

export interface CustomMouseEvent {
    x:number
    y:number
    timestamp:number
    used: boolean
}

export interface CustomKeyboardEvent {
    key: string
    altKey: boolean
    ctrlKey: boolean
    metaKey: boolean
    shiftKey: boolean
    used: boolean
}

