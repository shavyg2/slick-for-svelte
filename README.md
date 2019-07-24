# Slick For Svelte




## What does this library do for you. 

Manage your views and routing following a practical and easy to follow approach for your svelte component.


```ts
@Controller("/admin",{
    layout:AdminComponent,
    loading:AdminLoadingView,
    error:AdminErrorView,
    pause:400
})
class AdminController{

    constructor(private user:UserService,private account:AccountService){

    }

    @View("/")
    async getMainPage(){

        //This can be using writable stores in the background.
        const user = await this.user.getAdminUserDetails();
        

        //Notice that i didn't await for the settings and the Admin panel details
        const userSettings = this.account.getUserSettings(user.id);
        const userPanels = this.account.getAdminPanelDetails(user.id)

        return {
            view:AdminMainComponent,
            user,
            userSettings,
            userPanels,
        }
    }
}
```


This library is inspired by nest and using dependency injection to gather all the requirements needed to call a route.



## Purpose

This is a lite framework created to aid in routing and dependency injection.
It allows you to create your route, and data and leave svelte to do what it does best, rendering views.

When navigating to a route you want to to the information and you need certain dependencies to carry that out. This is why this library aim to be such.




### Installation

##### I rather have is all done for me, Where do i clone.

[here]()

##### I want to set up from official svelte repo because i like that more, it's gonna be more work but i am up for it. (Proceed)


from official repo. Notice i am using the webpack template and **not the roll up template.
```
npx degit sveltejs/template-webpack svelte-app
cd svelte-app
yarn or npm install
```

### Dependecies (YOOOU need to install them, not me)
- typescript 
- reflect-metadata
- @slick-for/svelte
- history



**Confused?**
Paste this in your terminal inside your project

1.
```
npm install reflect-metadata @slick-for/svelte history
npm install --save-dev typescript
```
or 

2.
```
yarn add reflect-metadata @slick-for/svelte history
yarn add --dev typescript 

```


**Confused?** Do number 1


### You need Typescript (Not a nice to have, Required)

#### I used Webpack Template, Did you use Rollup? Can't help you but it can be done. Here is what you do for webpack, something similar is needed for rollup

1.
```
npm install --save-dev awesome-typescript-loader
```

2.
```
yarn add --dev awesome-typescript-loader
```


Located ```webpack.config.js``` in your project root.


Here is what you need to do ***Exactly***

1. Easy Way
```
Copy and Paste the config here 
https://github.com/shavyg2/slick-for-svelte-test/blob/master/webpack.config.js
```



2. Non Beginner (Webpack Config scares some people.)

This needs to change (original file content)
```js
resolve: {
    alias: {
        svelte: path.resolve('node_modules', 'svelte')
    },
    extensions: ['.mjs', '.js', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main']
},

```

Needs to be this (typescript extension added)
```js
resolve: {
    alias: {
        svelte: path.resolve('node_modules', 'svelte')
    },
    extensions: ['.mjs', '.js', '.svelte','.ts'],
    mainFields: ['svelte', 'browser', 'module', 'main']
},
```


Add to module.rules: Remember you can use easy link for reference
```js
{
    test: /\.ts$/,
    use: {
        loader: 'awesome-typescript-loader',
        options: {
            transpileOnly:true //make life easy
        }
    }
},
```


add this for the dev server to work on a Single Page App, this redirects everything in webpack to index.html in public folder.
```js 
devServer: {
    port:process.env.PORT,
    historyApiFallback: {
        index: 'index.html'
    }
},
```



Entry should now be (We are using typescript):
```js
entry: {
    bundle: ['./src/main.ts']
},
```

### Typescript config

Generate tsconfig file

```
npx tsc --init
```

Add the following to your ```tsconfig.json```

```json
    "experimentalDecorators": true,        /* Enables experimental support for ES7 decorators. */
    "emitDecoratorMetadata": true, 
```


Make life easy add to your ```tsconfig.json```
```json
    "target": "es5",                         
    "module": "commonjs",                    
    "lib": ["dom","esnext"],    
```


[Confused??? Click this and copy paste to tsconfig.json](https://github.com/shavyg2/slick-for-svelte-test/blob/master/tsconfig.json)


### Templates

Honestly just copy this and place under src/Template.svelte.
Read it if you want doesn't matter, but it will give some incite as to home page views are generated

```xhtml
<script>
    export let layout;
    export let NotFound;
    export let viewProps;
    export let loading;
    export let error;

</script>
{#await viewProps}
    {#if layout}
            <svelte:component this={layout}>
                <svelte:component this={loading}/>
            </svelte:component>
        {:else}
            <svelte:component this={loading}/>
    {/if}
{:then props}
    {#if viewProps.NotFound}
        <svelte:component this={props.NotFound}  />
    {:else}
        {#if props.layout||layout}
            <svelte:component this={props.layout || layout} {...props}>
                <svelte:component this={props.view} {...props}/>
            </svelte:component>
        {:else}
            <svelte:component this={props.view} {...props}/>
        {/if}
    {/if}
{:catch error$}
    <svelte:component this={error}  error={error$}/>
{/await}
```

This is where everything in your application will render to.
It provide a layout over all and shouldn't need to change anything here.
I know what you are thinking. I want to customize. There is a different place for that.
Do **exactly** this



### 404 Page 

```xhtml
<!-- src/404.svelte -->
<h1>Error 404</h1>
```



### Imports
```ts
    import {Controller,View,Module,Injectable,Inject} from "@slick-for/svelte";
```

These are going to be your best friends, know them well and you will see them referenced in 
other areas. Remember.



### Main.js --> Main.ts 

Copy and paste, you will be changing is so doesn't matter just do it for now. You will see errors, don't let the red squillies stress you.

```ts

import {Controller,View,Module,Injectable,Inject, SlickForSvelteFactory} from "@slick-for/svelte"; //you installed
import {createBrowserHistory} from "history" //you installed
import { UserController } from "./controller/UserController"; //doesn't exist yet
import { GithubApi } from "./services/github-api"; //doesn't exist yet
import Template from "./Template.svelte"; // You created
import Error404 from "./404.svelte"  //You created


const history =  createBrowserHistory();

@Module({
	controllers:[UserController],
	provider:[GithubApi]
})
export class ApplicationModule{

}


const app = SlickForSvelteFactory.create(ApplicationModule,{
	base:Template, // Remember that template i told you to keep in your back pocket, take it out.
	history, //https://www.npmjs.com/package/history
	component404:Error404, 
	target:document.body // Some people will like to select an element like #main, do so if you like
})

/**
 * Do you know express/http node and the listen api, if you do great, basically similar things.
 * If you don't, DON'T WORRY, This makes things work. With out it, your application is configured, but not listening to the browser url and it's changes.
 * and won't render
 * Call it.
 */
app.Initialize();

```
This will start your application listen for the url changes using the history api.


# Wheeeew (AMAZING!!!!!)

Good Job, you have done great so far. Stretch you legs. Lemme know when you are ready.
I will literally be waiting for you.
So obviously nothing is work. Here are files you are missing



### Controller (Basic)

The case of the missing controller file. You can create it.

```ts
    //src/controllers/UserController.ts
    import {Controller,View} from "@slick-for/svelte"
    //Regular svelte component. Confused ? https://svelte.dev/tutorial/basics
    import Home from "../pages/home.svelte"

    @Controller("/user/")
    class UserController{

        @View("/home")
        async homepage(userapi:GithubApi){
            let user = await userapi.getCurrentUser();

            return {
                view:Home,
                account:account
            }
        }

    }

```

### Services
The case of the missing service file. You can add it.

```ts

import { Injectable,
        CurrentQuery,    //useful for ?page=1 value is {page:1}
        CurrentParameter //handy /user/:username value is {username:<username>}
        /**
         *  if you want these auto injected for you, just create a provider and pass it in.
        */
} from "@slick-for/svelte";

@Injectable()
export class GithubApi{

    private apiUrl = "https://api.github.com"

    async getPage(){
        let res = await fetch(`${this.apiUrl}/users?since=${this.page}`)
        let users = await this.isGood(res);
        return users;
    }


    async getUserByName(username:string){
        let res = await fetch(`${this.apiUrl}/users/${username}`)
        let users = await this.isGood(res);
        return users;
    }


    //Note you could have injected you own fetch api module, and use that and hide away all the logic.
    private async isGood(res: Response) {
        if (res.status - 299 > 0) {
            let text = await res.text();
            let parsed;
            try {
                parsed = JSON.parse(text);
            }
            catch (e) {
                throw text;
            }

            throw parsed;
        }else {
            return res.json();
        }
    }

    private get page(){
        let since = (CurrentQuery.value.page || 1) -1;
        return since * 31;
    }
}
```


## Serve over http and see the result

```
yarn run dev
```

## It doesn't look pretty in my vscode editor.
https://marketplace.visualstudio.com/items?itemName=JamesBirtles.svelte-vscode



## Advanced (Some where, right now someone thinks your an hero, let's build on that)


### Controller (Advance)
```
{
    layout:SvelteComponent
    loading:SvelteComponent
    error:SvelteComponent
    pause:400

}
```



#### layout

This is a custom view that you should give you a page, it allows you to customize the layout for that controller.
Make sure that you have a slot in that layout. This is where your view from your page will go.

#### loading

This is the layout that will be shown while your page your data is loading. It will use the layout while it is loading.

#### error
If an error happens this is the component that will be shown, it will receieve one prop and it will be called error.

### pause

When you are using a single page application the layout will be able to load much faster than the data will, This will delay the transition until the data is ready.
However if the data is taking a really long time (over 400ms) by default then it will switch to that page and display the loading, component.

This is useful because you don't want user on really fast connection to be seeing this loading screen if it takes less than 400 ms for the data to load. 
If you want to increase or decrease this time however you can. The default 400 ms is good however.


```ts



@Controller("/admin",{
    layout:AdminComponent,
    loading:AdminLoadingView,
    error:AdminErrorView,
    pause:400
})
class AdminController{

    constructor(private user:UserService,private account:AccountService){

    }

    @View("/")
    async getMainPage(){

        //This can be using writable stores in the background.
        const user = await this.user.getAdminUserDetails();
        

        //Notice that i didn't await for the settings and the Admin panel details
        const userSettings = this.account.getUserSettings(user.id);
        const userPanels = this.account.getAdminPanelDetails(user.id)

        return {
            view:AdminMainComponent,
            user,
            userSettings,
            userPanels,
        }
    }
}
```

```xhtml
<!-- AdminMainComponent -->
<div>
    Welcome, {user.username}
</div>
<div class="content">
    {#await userPanels as panels}
        <div class="panels">
            {#each panels as panel}
                <!-- don't actually name your clases as such -->
                <div class="make-it-sexy">
                    <PanelComponent {panel}/>
                </div>
            {/each}
        </div>

    {:catch error}
        <div>Failed to load panels</div>
    {/await}

    {#await userSettings as settings}
    <!-- Please don't name classes as such -->
    <div class="make-it-spacy">
        <SettingsView {settings}/>
    </div>
    {:catch error}
        <div>Settings failed to load</div>
    {/await}
</div>

```


#### Back to the method
```ts
    ...

    @View("/")
    async getMainPage(){

        //This can be using writable stores in the background.
        const user = await this.user.getAdminUserDetails();
        

        //Notice that i didn't await for the settings and the Admin panel details
        const userSettings = this.account.getUserSettings(user.id);
        const userPanels = this.account.getAdminPanelDetails(user.id)

        return {
            view:AdminMainComponent,
            user,
            userSettings,
            userPanels,
        }
    }

    ...
```

The reason why i waited for the view to load is that i don't want the page to be shown until that date is ready.
This will keep the page until the pause amount is met, at which point this will show the loading page.

However if the data is resolved in a decent enough time then it will show your page.
There are somethings however we don't mind waiting for and we can start rendering the page.

We will wait for the user panels and the user settings and can show a loading or 
a grayout version while the user is waiting for the page to load.

This will make your page feel more responsive, You could have also loaded all of the information inside the controller method.
This is completely upto you want you want to wait for in the component and what you want your page to load with.


This saves you from having to do alot of templating in the the view layer since it's best for rendering views.

but for the things that you would like to wait for you have that option.




## Injectable 

Injectable allows you to manage your application in a way where the classes and set up code just works and you don't have to string them all together.
The Library will do all of the heavy lifting but does provide you with enough options so that you can get some things dont yourself.



### Providers

Providers or Injectables come in different shapes and sizes


```ts
    //Singleton
   @Injectable()
    class Repo{

    }

    // a new service is created for each request or page navigation
    @Injectable({
        scope:"Request"
    })
    class Service{

    }

    /**
     * Since this depends on something that is refreshed for each navigation it will not default to being built with every request, you can't change this.
     */ 
    @Injectable()
    class Operation{
        constructor(
            public service:Service,
            @Inject("simple") public simple,
            public repo:Repo
            ){}
    }


    //This controller will be new everytime a user goes to a different page or reloads.
    @Controller("/thing",{
        scope:"Request",
    })
    class TestController{

    }

    //Need to inject some text use the @Inject Parameter decorator
    const simpleProvider = {
        provide:"simple",
        useValue:"Simple"
    }

    /**
     *  Need something resolved async but you still want the actual object. Use a factory.
     *  Notice the inject is used.
     * 
     * Transient a fresh copy for every page load.
     * 
     */
    const factory = {
        provide:"factory",
        async useFactory(operation:Operation){

                await new Promise((r)=>{
                    setTimeout(r,500)
                })

                return {
                    operation
                }
        },
        inject:[Operation],
        scope:"Transient" 
    }

```