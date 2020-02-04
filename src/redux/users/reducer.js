import actions from "./actions";
import { Map } from "immutable";
const initState= new Map({
    userData:null
    
})
export default function(state=initState,action){
    switch(action.type){
        case actions.USER_MENU_HEADER_DATA:
            return state.set('userData',action.payload);
        case actions.USER_MENU_REMOVE_DATA:
            return initState;
        default:
            return state;
    }
}