 const initialState ={
    token:null
}

export const authReducers = (state = initialState,action)=>{
    switch(action.type){
        case 'SET_USER_DATA':
            return{
                ...state,
                token:action.payload
            }
        default :
            return state
    }
}