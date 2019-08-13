<script>
  import { CurrentQuery, spa, URLSTORE } from "@slick-for/svelte";
  import { tick } from "svelte";
  export let users;
  export let page;

  import ImgPlaceholder from "./home-component/avatar.svelte";
  import promiseAny from "promise-any";

  let images = users.map(async (user, i) => {
    if (i === 0) {
      return new Promise(r => {
        let image = new Image();
        image.src = user.avatar_url;
        image.onload = () => r(user.avatar_url);
      });
    } else {
      let loading = new Promise(async r => {
        let image = new Image();

        const onload = async () => {
          
          await images[i - 1];
          r(user.avatar_url);
        };
        await tick();
        image.src = user.avatar_url;
        image.onload = onload;
      });

      return loading;
    }
  });
</script>

<div class="navigation flex flex-row justify-around">
  <div>
    <a id="prev" use:spa href={`?page=${Math.max(parseInt(page) - 1, 1)}`}>Prev</a>
  </div>

  <div>
    <a id="next" use:spa href={`?page=${Math.max(parseInt(page) + 1, 1)}`}>Next</a>
  </div>
</div>
<div class="flex flex-row flex-wrap">
  {#each users as user, i}
    <a href={`/user/${user.login}`} use:spa>
      <div class="p-5 flex flex-row items-center">
        <div class="pb-3 flex-col items-center">
          <div class="mb-3 rounded-full border shadow overflow-hidden">
            <ImgPlaceholder avatarUrl={images[i]} />
          </div>
          <div class="capitalize text-center">{user.login}</div>
        </div>
      </div>
    </a>
  {/each}
</div>
