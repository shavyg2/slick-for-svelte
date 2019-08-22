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


    it("Throw an Error on purpose",async()=>{
        history.push("/error")
        await Tock();
        let div = select("h1")
        expect(div.innerHTML).toBe("Error");
        let pre = select("pre")
        expect(/This is intentional/.test(pre.innerHTML)).toBeTruthy();
    })
})