import {ColorElementInterface} from "./ColorElementInterface";

interface RoomDataInterface {
    material : number,
    width : number,
    height : number,
    margin : number,
    square : number,
    weight : number,
    price : number,
    color : ColorElementInterface,
    secondColor : ColorElementInterface,
    heightLowering : number,
    totalPanelLength : number,
    totalStringerLength : number,
    totalConnectorsCount : number,
    totalStringerCount : number,
    svg : string
}

export default RoomDataInterface
