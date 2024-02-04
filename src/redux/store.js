import {createStore,combineReducers} from 'redux'
import { authReducers } from './reducers'
import {persistStore,persistReducer} from "redux-persist"
import storage from "redux-persist/lib/storage"

const rootReducers = combineReducers({
    auth:authReducers
})

const persistConfig=({
    key:'root',
    storage,
})

const persistReducers = persistReducer(persistConfig,rootReducers)

export const store = createStore(persistReducers)
export const persistor = persistStore(store)

