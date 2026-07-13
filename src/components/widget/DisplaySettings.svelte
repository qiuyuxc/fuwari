<script lang="ts">
import { AUTO_MODE, DARK_MODE, LIGHT_MODE } from "@constants/constants";
import Icon from "@iconify/svelte";
import {
	getBgBlur,
	getDevMode,
	getDevServer,
	getHideBg,
	getStoredTheme,
	setBgBlur,
	setDevMode,
	setDevServer,
	setHideBg,
	setTheme,
} from "@utils/setting-utils";
import { onMount } from "svelte";

let theme = getStoredTheme();
let bgBlur = getBgBlur();
let hideBg = getHideBg();
let isDevMode = getDevMode();
let devServer = getDevServer();

$: {
	setBgBlur(bgBlur);
}

function switchTheme(newTheme: string) {
	theme = newTheme;
	setTheme(newTheme);
}

function toggleHideBg() {
	hideBg = !hideBg;
	setHideBg(hideBg);
}

function toggleDevMode() {
	isDevMode = !isDevMode;
	setDevMode(isDevMode);
}

function onDevServerChange() {
	setDevServer(devServer);
}
</script>

<div id="display-setting" class="float-panel float-panel-closed absolute transition-all w-80 right-4 px-4 py-4">
    <div class="flex flex-row gap-2 mb-3 items-center justify-between">
        <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]"
        >
            主题模式
        </div>
        <div class="flex gap-1">
            <button aria-label="Light Mode"
                class="w-10 h-7 rounded-md transition flex items-center justify-center active:scale-90
                {theme === LIGHT_MODE ? 'bg-[var(--primary)] text-[var(--primary-inverse)]' : 'bg-[var(--btn-regular-bg)] text-[var(--btn-content)] hover:bg-[var(--btn-regular-bg-hover)]'}"
                on:click={() => switchTheme(LIGHT_MODE)}
            >
                <Icon icon="material-symbols:wb-sunny-rounded" class="text-[1.1rem]"></Icon>
            </button>
            <button aria-label="Dark Mode"
                class="w-10 h-7 rounded-md transition flex items-center justify-center active:scale-90
                {theme === DARK_MODE ? 'bg-[var(--primary)] text-[var(--primary-inverse)]' : 'bg-[var(--btn-regular-bg)] text-[var(--btn-content)] hover:bg-[var(--btn-regular-bg-hover)]'}"
                on:click={() => switchTheme(DARK_MODE)}
            >
                <Icon icon="material-symbols:dark-mode-rounded" class="text-[1.1rem]"></Icon>
            </button>
            <button aria-label="Auto Mode"
                class="w-10 h-7 rounded-md transition flex items-center justify-center active:scale-90
                {theme === AUTO_MODE ? 'bg-[var(--primary)] text-[var(--primary-inverse)]' : 'bg-[var(--btn-regular-bg)] text-[var(--btn-content)] hover:bg-[var(--btn-regular-bg-hover)]'}"
                on:click={() => switchTheme(AUTO_MODE)}
            >
                <Icon icon="material-symbols:hdr-auto-rounded" class="text-[1.1rem]"></Icon>
            </button>
        </div>
    </div>

    <div class="flex flex-row gap-2 mb-3 items-center justify-between">
        <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]"
        >
            禁用背景
        </div>
        <input type="checkbox" class="toggle-switch" checked={hideBg} on:change={toggleHideBg} />
    </div>

    <div class="flex flex-row gap-2 mb-3 mt-3 items-center justify-between">
        <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]"
        >
            背景模糊
        </div>
        <div class="flex gap-1">
            <div class="transition bg-[var(--btn-regular-bg)] w-10 h-7 rounded-md flex justify-center
            font-bold text-sm items-center text-[var(--btn-content)]">
                {bgBlur}px
            </div>
        </div>
    </div>
    <div class="w-full h-6 bg-[var(--btn-regular-bg)] rounded select-none">
        <input aria-label="背景模糊" type="range" min="0" max="20" bind:value={bgBlur}
               class="slider" step="1" style="width: 100%; --value-percent: {bgBlur / 20 * 100}%">
    </div>

    <div class="flex flex-row gap-2 mb-3 mt-3 items-center justify-between">
        <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]"
        >
            开发模式
        </div>
        <input type="checkbox" class="toggle-switch" checked={isDevMode} on:change={toggleDevMode} />
    </div>

    {#if isDevMode}
    <div class="flex flex-row gap-2 mb-3 items-center justify-between transition-all" >
        <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]"
        >
            Server
        </div>
        <div class="flex gap-1">
             <input aria-label="Server Value" type="text" bind:value={devServer} on:input={onDevServerChange}
                   class="transition bg-[var(--btn-regular-bg)] w-32 h-7 rounded-md text-center font-bold text-sm text-[var(--btn-content)] outline-none"
            />
        </div>
    </div>
    {/if}
</div>


<style lang="stylus">
    #display-setting
      input[type="range"]
        -webkit-appearance none
        height 1.5rem
        background-color transparent
        transition background-image 0.15s ease-in-out
        background-image linear-gradient(to right, var(--primary) 0%, var(--primary) var(--value-percent), transparent var(--value-percent), transparent 100%)

      input[type="range"]
        &::-webkit-slider-thumb
          -webkit-appearance none
          height 1rem
          width 0.5rem
          border-radius 0.125rem
          background rgba(255, 255, 255, 0.7)
          box-shadow none
          margin-top 0
          transform none
          transition background 0.15s
          &:hover
            background rgba(255, 255, 255, 0.8)
          &:active
            background rgba(255, 255, 255, 0.6)

        &::-moz-range-thumb
          -webkit-appearance none
          height 1rem
          width 0.5rem
          border-radius 0.125rem
          border-width 0
          background rgba(255, 255, 255, 0.7)
          box-shadow none
          transform none
          transition background 0.15s
          &:hover
            background rgba(255, 255, 255, 0.8)
          &:active
            background rgba(255, 255, 255, 0.6)

        &::-ms-thumb
          -webkit-appearance none
          height 1rem
          width 0.5rem
          border-radius 0.125rem
          background rgba(255, 255, 255, 0.7)
          box-shadow none
          transform none
          transition background 0.15s
          &:hover
            background rgba(255, 255, 255, 0.8)
          &:active
            background rgba(255, 255, 255, 0.6)

      .toggle-switch
        appearance none
        width 3rem
        height 1.5rem
        background var(--btn-regular-bg)
        border-radius 999px
        position relative
        cursor pointer
        transition background 0.3s
        &::after
            content ''
            position absolute
            top 0.25rem
            left 0.25rem
            width 1rem
            height 1rem
            background var(--btn-content)
            border-radius 50%
            transition transform 0.3s
        &:checked
            background var(--primary)
            &::after
                transform translateX(1.5rem)
                background var(--primary-inverse)
</style>
