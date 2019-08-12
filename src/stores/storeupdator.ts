import { QUERYSTORE, PARAMSTORE, URLSTORE } from "./main";

export class StoreUpdater{

    private queryStore = QUERYSTORE

    private paramStore = PARAMSTORE


    private urlStore = URLSTORE



    updateQuery(query){
        this.queryStore.update(()=>query);
    }

    updateUrl(url){
        this.urlStore.update(()=>url)
    }

    updateParam(param){
        this.paramStore.update(()=>param)
    }


    all({param,url,query}){
        this.updateParam(param);
        this.updateQuery(query);
        this.updateUrl(url);
    }

    static set(){
        return new StoreUpdater();
    }


}