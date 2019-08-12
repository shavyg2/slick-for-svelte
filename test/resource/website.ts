
import {spawn} from "child_process";
import {Options,As} from "@slick-for/di"
import urlJoin from "url-join";
export const website = Symbol.for("website");
import * as shell from "shell-quote";
import * as path from "path";
import getPort from "get-port";



export const WebsiteProvider = {
    provide:website,
    async useFactory(){

        const port = await getPort();
        let [cmd,...args]=shell.parse("yarn run dev");
        let child = spawn(cmd,args,{
            shell:true,
            cwd:path.resolve(__dirname,"../../example"),
            env:Object.assign(process.env,{
                PORT:port.toString(),
                NODE_ENV:"development"
            }),
            stdio:"pipe"
        });

        
        await new Promise(r=>{
            child.stdout.on("data",data=>{
                if(~data.toString().indexOf(port+"")){
                    child.stdout.removeAllListeners();
                    r()
                }
            })



            child.stderr.on("data",data=>{
                console.log(data.toString());
            })
        })
        
        return {
            port,
            child,
            url(url:string){
                return urlJoin(`http://localhost:${port}`,url);
            }
        }

    },
    scope:"Transient"
}