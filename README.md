# Slick For Svelte


## What does this library do for you. 

Manage your views and routing following a practical and easy to follow approach for your svelte components.


```ts


@Controller("/user/")
export class UserController {
  
  
  
  @View("/home", HomePage)
  async homepage(userapi: GithubApi, @Query("page") page = 1) {
    let users = await userapi.getPage(page);

    return {
      users: users
    };
  }

  
  
  @View("/:username", UserPage)
  async getUserPage(api: GithubApi, @Param("username") username: string) {
    let user = await api.getUserByName(username);
    return {
      user
    };
  }

}
```


This library is inspired by nest and uses dependency injection to gather all the requirements
needed to call a route.


### Installation


##### Before I install I just want to play with the framework and see it work.

[Click Here](https://codesandbox.io/s/lflyu)

##### I rather have is all done for me, Where do I clone.

[Here](https://github.com/shavyg2/slick-app-basic-setup)

##### I want to set up it up from the official svelte repo, it's gonna be more work, but I am up for it. (Proceed)


Starting from the Official repo. Notice I am using the WebPack template and **not the roll up template**.
```
npx degit sveltejs/template-webpack svelte-app
cd svelte-app
yarn or npm install
```

### Dependencies (YOOOU need to install them, not me)
- typescript 
- reflect-metadata
- @slick-for/svelte
- history



**Confused?**
Paste one of the following options in your terminal inside your project folder.

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

#### I used the Webpack Template, Did you use Rollup? You will need to investigate how to get typescript working with Rollup.
#### Here is what you do for webpack, something similar is needed for rollup.

1.
```
npm install --save-dev awesome-typescript-loader
```

2.
```
yarn add --dev awesome-typescript-loader
```


Located ```webpack.config.js``` in your project root.


Here is what you need to do **Exactly**

1. Easy Way
```
Copy and Paste the config here 
https://github.com/shavyg2/slick-for-svelte-test/blob/master/webpack.config.js
```



2. Non Beginner (Webpack Config scares some people.)

The original file contains the following:
```js
resolve: {
    alias: {
        svelte: path.resolve('node_modules', 'svelte')
    },
    extensions: ['.mjs', '.js', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main']
},

```

You need to add support for typescript extension (typescript extension added)
```js
resolve: {
    alias: {
        svelte: path.resolve('node_modules', 'svelte')
    },
    extensions: ['.mjs', '.js', '.svelte','.ts'], //here
    mainFields: ['svelte', 'browser', 'module', 'main']
},
```


Add ```awesome-typescript-loader``` and configure it for webpack, below is a reference.
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


Configure webpack dev server to use the ```index.html``` file for your single page application. Below is a reference.
```js 
devServer: {
    port:process.env.PORT,
    historyApiFallback: {
        index: 'index.html'
    }
},
```



The entry file webpack compiles need to now be a typescript file.

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
    "experimentalDecorators": true,        
    "emitDecoratorMetadata": true, 
```


I use these settings. It works lovely for me ```tsconfig.json```
```json
    "target": "es5",                         
    "module": "commonjs",                    
    "lib": ["dom","esnext"],    
```


[Confused??? Click this and copy paste to tsconfig.json](https://github.com/shavyg2/slick-for-svelte-test/blob/master/tsconfig.json)


### Templates

Honestly just copy this and place under ```src/Template.svelte```.
You can check this template file out to understand how certain things work, however you don't need to understand it.

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
                <svelte:component this={view} {...props}/>
            </svelte:component>
        {:else}
            <svelte:component this={view} {...props}/>
        {/if}
    {/if}
{:catch error$}
    <svelte:component this={error}  error={error$}/>
{/await}
```

This is the global template engine for all views. You shouldn't need to change it unless it is to add something application wide.
Please refrain from doing this. There are better places to add customizations.




### 404 Page Sample 404 or Create your own.

```xhtml
<!-- src/404.svelte -->
<h1>Error 404</h1>
Not found
```



### Imports
```ts
    import {Controller,View,Module,Injectable,Inject,Param,Query,History} from "@slick-for/svelte";
```

These are some of the tools that come with this library and are very common to see/use.



### Main.ts 

```ts

import {Module,SlickForSvelteFactory} from "@slick-for/svelte";
import {createBrowserHistory} from "history"
import { UserController } from "./controller/UserController";
import { GithubApi } from "./services/github-api";
import Template from "./Template.svelte";
import Error404 from "./404.svelte"
import ErrorPage from "./Error.svelte";


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
	component404:Error404, //svelte 404 Page, make it up or copy from somewhere else,
	error:ErrorPage,
	target:document.body //Where to render to https://svelte.dev/docs#Creating_a_component
})

app.Initialize();

```

This will start your application listen for the URL changes using the history API.


# Wheeeew (AMAZING!!!!!)

Good Job, you have done great so far. Stretch you legs. Lemme know when you are ready.
I will literally be waiting for you.




### Controller (Basic)
Add the missing controller file.

```ts
//src/controllers/UserController.ts
import { Controller, View, Param, Query } from "@slick-for/svelte";


//Regular svelte components. Confused ? https://svelte.dev/tutorial/basics
import HomePage from "./pages/home.svelte";
import UserPage from "./pages/user.svelte";


//Service Component
import { GithubApi } from "../services/github-api";

@Controller("/user/")
export class UserController {
  @View("/home", HomePage)
  async homepage(userapi: GithubApi, @Query("page") page = 1) {
    let users = await userapi.getPage(page);

    return {
      users: users
    };
  }

  @View("/:username", UserPage)
  async getUserPage(api: GithubApi, @Param("username") username: string) {
    let user = await api.getUserByName(username);
    return {
      user
    };
  }
}


```

### Services
The case of the missing service file. You can add it.
Note that services can't have method properties automatically injected.
This can only be done in the controller. However the constructor can.

```ts

import {
  Injectable
} from "@slick-for/svelte";

@Injectable()
export class GithubApi {
  private apiUrl = "https://api.github.com";

  async getPage(page: number) {
    let res = await fetch(`${this.apiUrl}/users?since=${page}`);
    let users = await this.isGood(res);
    return users;
  }

  async getUserByName(username: string) {
    let res = await fetch(`${this.apiUrl}/users/${username}`);
    let users = await this.isGood(res);
    return users;
  }

  private async isGood(res: Response) {
    if (res.status - 299 > 0) {
      let text = await res.text();
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        throw text;
      }

      throw parsed;
    } else {
      return res.json();
    }
  }
}

```


## Serve over http and see the result

```
yarn run dev
```


You should be seeing the 404 page now

## Need Syntax highlighting for Svelte
https://marketplace.visualstudio.com/items?itemName=JamesBirtles.svelte-vscode



## Advanced (wow super star. Keep going!!)


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

    @View("/",AdminMainComponent)
    async getMainPage(){

        //This can be using writable stores in the background.
        const user = await this.user.getAdminUserDetails();
        

        //Notice that i didn't await for the settings and the Admin panel details
        const userSettings = this.account.getUserSettings(user.id);
        const userPanels = this.account.getAdminPanelDetails(user.id)

        return {
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

    @View("/",AdminMainComponent)
    async getMainPage(){

        //This can be using writable stores in the background.
        const user = await this.user.getAdminUserDetails();
        

        //Notice that i didn't await for the settings and the Admin panel details
        const userSettings = this.account.getUserSettings(user.id);
        const userPanels = this.account.getAdminPanelDetails(user.id)

        return {
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