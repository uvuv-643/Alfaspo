import {ColorElementInterface} from "./ColorElementInterface";
import MaterialElementInterface from "./MaterialElementInterface";
import {DimensionsElementInterface} from "./DimensionsElementInterface";
import {MarginElementInterface} from "./MarginElementInterface";
import {RealPointInterface} from "../components/Draw/utils/Utils";
import {SidebarSelectedValues} from "./SidebarSelectedValues";

interface RoomDataInterface {

    selectedMaterial : MaterialElementInterface | null,
    selectedWidth : DimensionsElementInterface | null,
    selectedHeight : DimensionsElementInterface | null,
    selectedMargin : MarginElementInterface | null,
    selectedColor : ColorElementInterface | null,
    selectedSecondColor : ColorElementInterface | null,
    selectedSizeMode : number,
    selectedSize : number,
    selectedSizePlacement : number,
    selectedPoints : RealPointInterface[],
    selectedAngle : number | null,
    finishedBuilding : boolean,
    selectedValues : SidebarSelectedValues,
    square : number | undefined,
    heightLowering : number,
    totalPanelLength : number,
    // totalStringerLength : number,
    totalStringerCountActual : number
    totalConnectorsCount : number,
    svg : string,
    totalWeight : number,
    totalPrice : number,

    totalStringerCount : number,

    // material : number,
    // width : number,
    // height : number,
    // margin : number,
    // square : number,
    // weight : number,
    // price : number,
    // color : ColorElementInterface,
    // secondColor : ColorElementInterface,
    // heightLowering : number,
    // totalPanelLength : number,
    //
    // // must be unused
    // totalStringerLength : number,
    //
    // totalConnectorsCount : number,
    // totalStringerCount : number,
    // svg : string
}

export default RoomDataInterface
