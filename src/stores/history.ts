
import {writable} from "svelte/store";
import {History} from "history";

export const historyStore = writable(null as History)