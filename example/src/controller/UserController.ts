//src/controllers/UserController.ts
import { Controller, View, Param, Query } from "@slick-for/svelte";
//Regular svelte component. Confused ? https://svelte.dev/tutorial/basics
import HomePage from "./pages/home.svelte";
import UserPage from "./pages/user.svelte";
import { GithubApi } from "../services/github-api";
import UserLayout from "./layout/user-layout.svelte"
import Loading from "../loading.svelte"
@Controller("/user",{
    layout:UserLayout,
    loading:Loading
})
export class UserController {
  @View("/", HomePage)
  async homepage(userapi: GithubApi, @Query("page") page = 1) {
    let users = await userapi.getPage(page);

    return {
        page,
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
