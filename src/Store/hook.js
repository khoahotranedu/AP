import { useContext } from "react";
import context from "./Context";
export const UseStore=()=>{
    const [state,dispatch]=useContext(context)
    return [state,dispatch]
}