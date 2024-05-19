import context from "./Context";
import { useReducer } from "react";
import reducer ,{initstate} from "./reducer";
function Provider({children})
{
    const [state,dispatch]=useReducer(reducer,initstate)
    return <context.Provider value={[state,dispatch]}>
        {children}
    </context.Provider>
}
export default Provider