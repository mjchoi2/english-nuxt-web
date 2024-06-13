<template>
    <div class="wrapper flex flex-col gap-y-4">
        <div class="w-[700px]">
            <CommonVideo
                :url="'https://ssproxy.ucloudbiz.olleh.com/v1/AUTH_0d725069-2e6a-4b63-8ddc-895d98986c83/silver_res/class/clips/64d44b26699342e401011832/paper_08_튤립 만들기.mp4'"
                :section="selectedSection"
            />
        </div>
        <div class="w-full flex flex-row gap-x-2">
            <button v-for="(play, i) in playList" :key="i" class="px-4 py-4 bg-green-500 text-white font-bold w-full" @click="onClickSection(play.second)">
                {{ play.sectionName }}
            </button>
        </div>
        <NuxtLink to="/today/find"
            ><button class="flex items-center absolute right-0 top-0">NEXT <ArrowRightEndOnRectangleIcon class="w-8 h-8" /></button
        ></NuxtLink>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { ArrowRightEndOnRectangleIcon } from '@heroicons/vue/24/solid';

const selectedSection = ref(0);
const playList = [
    { sectionName: '월요일', second: 10 },
    { sectionName: '화요일', second: 20 },
    { sectionName: '수요일', second: 30 },
    { sectionName: '목요일', second: 40 },
    { sectionName: '금요일', second: 50 },
];

function onClickSection(second) {
    selectedSection.value = second;
}
</script>

<style>
:root {
    --plyr-color-main: #1ac266;
}

.player {
    --plyr-color-main: #1ac266;
}
</style>
