import { ParamService, QueryService, HistoryService } from "./providerName";
import {get} from "svelte/store";
import { PARAMSTORE, QUERYSTORE } from "../stores/main";
import { historyStore } from "../stores/history";



export const ParamProvider = {

    provide:ParamService,

    useFactory(){
        
        return get(PARAMSTORE)
    },
    scope:"Request"
}


export const QueryProvider = {
    provide:QueryService,
    useFactory(){
        return get(QUERYSTORE)
    },
    scope:"Request"
}


export const HistoryProvider = {
    provide:HistoryService,
    useFactory(){
        return get(historyStore)
    },
    scope:"Request"

}


export const ApplicationProviders = [ParamProvider,QueryProvider,HistoryProvider]