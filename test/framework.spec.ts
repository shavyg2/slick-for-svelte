require("svelte/register");
import { select } from "./dom";
import "./application/test.app";
import { history } from "./application/test.app";
import { Tock } from "../src/framework/tock";



describe("Framework Test",()=>{

    it("should be able to render the document",()=>{
        history.push("/")
        let div = select("div")
        expect(div.innerHTML).toBe("Hello World");
    })
    it("Should Render the Error Page for unknown url",async()=>{
        history.push("/error/404")
        await Tock();
        let div = select("h1")
        expect(div.innerHTML).toBe("Error 404");
    })


    it("it should be able to get the param from the url",async()=>{
        history.push("/user/slick")
        await Tock();
        let div = select("div")
        expect(div.innerHTML).toBe("Hello, slick 1");
    })


    it("it should be able to get the param from an async controller method",async()=>{
        history.push("/async/user/slick")
        await Tock();
        let div = select("div")
        expect(div.innerHTML).toBe("Hello, slick 1");
    })


    it("it should be able to get the param from a constructor class",async()=>{
        history.push("/meta")
        await Tock();
        let div = select("div")
        expect(div.innerHTML).toBe("@slick-for/svelte");
    })


    it("Throw an Error on purpose",async()=>{
        history.push("/error")
        await Tock();
        let div = select("h1")
        expect(div.innerHTML).toBe("Error");
        let pre = select("pre")
        expect(/This is intentional/.test(pre.innerHTML)).toBeTruthy();
    })


    it("should load factory providers",async ()=>{
        history.push("/controller/factory/inject")
        await Tock();
        const div = select("div")
        expect(div.innerHTML).toBe("New Factory");
    })


    it("should load async factory providers",async ()=>{
        history.push("/controller/factory/async")
        await Tock();
        const div = select("div")
        expect(div.innerHTML).toBe("New Factory");
    })


    it("should load layout props using the layout props decorator",async ()=>{
        history.push("/layout/props")
        await Tock();
        
        debugger;
        const user = select("#user-menu")
        const date = select("#date")



        expect(user.innerHTML).toBe("bob");
        expect(date.innerHTML).toBe("Good Day");
    })
})