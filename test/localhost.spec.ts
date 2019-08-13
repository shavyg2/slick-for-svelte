import {container} from "./resource";
import {website} from "./resource/website";
import  puppet from "puppeteer";

jasmine.DEFAULT_TIMEOUT_INTERVAL=10000*60;

describe("Connect to localhost",()=>{

    let web;
    let browser:puppet.Browser;

    beforeAll(async ()=>{
           web = await container.get(website);      
           browser = await puppet.launch({headless:false});
    })

    test("Does it boot",async ()=>{
        let [page] = await browser.pages()
        await page.goto(web.url("/user"));

        await page.waitForSelector("#next");

        await page.tap("#next");

        await page.waitFor(1000)

        let url = page.url()
        expect(url).toBe(web.url("/user?page=2"))


        await page.tap(".capitalize.text-center")
        await page.waitFor(100);

        url = page.url();

        expect(url.match(/tomtt/)).toBeTruthy();
    })
    
    afterAll(async ()=>{
        browser.close()
        web.child.kill()
    })

})