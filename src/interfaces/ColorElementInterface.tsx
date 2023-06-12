import {ReactNode} from "react";

export interface ColorElementInterface {
    id : number,
    isDark : boolean,
    light ?: boolean,
    image : ReactNode,
    title : string
}