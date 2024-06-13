<template>
    <div class="wrapper">
        <!-- <TodayCard /> -->
        <!-- <TodaySpeech /> -->
        <!-- <TodayFind /> -->
        <!-- <TodayVideo /> -->
        <!-- <TodaySlide /> -->
        <div class="mx-auto grid max-w-7xl grid-cols-2 items-center gap-x-8 gap-y-16 px-8 py-4">
            <div>
                <h2 class="text-xl font-bold tracking-tight text-gray-900">Alphabet Tree</h2>
                <div class="grid grid-cols-5 m-5 justify-items-center">
                    <div v-for="(alphabet, i) in alphabetList" :key="i" class="w-8 h-8 text-center">
                        <span class="p-1 rounded-full">{{ alphabet.name }}</span>
                    </div>
                </div>

                <dl class="mt-8 grid grid-cols-3 gap-x-6 gap-y-10">
                    <div class="border-t border-gray-200 pt-4">
                        <dt class="font-medium text-gray-900">Activity</dt>
                        <dd class="mt-2 text-sm text-gray-500">img</dd>
                    </div>
                    <div class="border-t border-gray-200 pt-4">
                        <dt class="font-medium text-gray-900">Song & Chant</dt>
                        <dd class="mt-2 text-sm text-gray-500">img</dd>
                    </div>
                    <div class="border-t border-gray-200 pt-4">
                        <dt class="font-medium text-gray-900">AI Speeking</dt>
                        <dd class="mt-2 text-sm text-gray-500">img</dd>
                    </div>
                </dl>
            </div>
            <div class="grid grid-cols-1 gap-4">
                <div>
                    <CommonVideo :url="'https://ssproxy.ucloudbiz.olleh.com/v1/AUTH_0d725069-2e6a-4b63-8ddc-895d98986c83/silver_res/class/clips/64d44b26699342e401011832/paper_08_튤립 만들기.mp4'" />
                </div>
                <div>
                    <nav class="w-full flex text-center bg-white rounded-l-lg rounded-r-lg">
                        <a class="block w-full p-4 border-r border-b" href="#" :class="{ 'border-b-2 border-b-orange-500': tab == 0 }" @click="tab = 0">MON</a>
                        <a class="block w-full p-4 border-r border-b" href="#" :class="{ 'border-b-2 border-b-orange-500': tab == 1 }" @click="tab = 1">TUE</a>
                        <a class="block w-full p-4 border-r border-b" href="#" :class="{ 'border-b-2 border-b-orange-500': tab == 2 }" @click="tab = 2">WED</a>
                        <a class="block w-full p-4 border-r border-b" href="#" :class="{ 'border-b-2 border-b-orange-500': tab == 3 }" @click="tab = 3">THU</a>
                        <a class="block w-full p-4 border-b" href="#" :class="{ 'border-b-2 border-b-orange-500': tab == 4 }" @click="tab = 4">FRI</a>
                    </nav>
                    <div class="bg-white p-4 flex gap-x-12 justify-center">
                        <img
                            src="https://tailwindui.com/img/ecommerce-images/product-feature-03-detail-01.jpg"
                            alt="Walnut card tray with white powder coated steel divider and 3 punchout holes."
                            class="rounded-lg bg-gray-100 w-24 h-24"
                            @click="onClickTodayLearning"
                        />
                        <img
                            src="https://tailwindui.com/img/ecommerce-images/product-feature-03-detail-02.jpg"
                            alt="Top down view of walnut card tray with embedded magnets and card groove."
                            class="rounded-lg bg-gray-100 w-24 h-24"
                        />
                        <img
                            src="https://tailwindui.com/img/ecommerce-images/product-feature-03-detail-03.jpg"
                            alt="Side of walnut card tray with card groove and recessed card area."
                            class="rounded-lg bg-gray-100 w-24 h-24"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const { $swal } = useNuxtApp();
const router = useRouter();

const alphabetList = [
    { name: 'A', isClear: false },
    { name: 'B', isClear: false },
    { name: 'C', isClear: false },
    { name: 'D', isClear: false },
    { name: 'E', isClear: false },
    { name: 'F', isClear: false },
    { name: 'G', isClear: false },
    { name: 'H', isClear: false },
    { name: 'I', isClear: false },
    { name: 'J', isClear: false },
    { name: 'K', isClear: false },
    { name: 'L', isClear: false },
    { name: 'M', isClear: false },
    { name: 'N', isClear: false },
    { name: 'O', isClear: false },
    { name: 'P', isClear: false },
    { name: 'Q', isClear: false },
    { name: 'R', isClear: false },
    { name: 'S', isClear: false },
    { name: 'T', isClear: false },
    { name: 'U', isClear: false },
    { name: 'V', isClear: false },
    { name: 'W', isClear: false },
    { name: 'X', isClear: false },
    { name: 'Y', isClear: false },
    { name: 'Z', isClear: false },
];
const dayItem = ref([]);
const tab = ref(0);

const onClickTodayLearning = () => {
    $swal
        .fire({
            title: '오늘의 원어민 수업 영상을 확인해 주세요.',
            confirmButtonText: '원어민 영상 보러가기',
        })
        .then((result) => {
            if (result.isConfirmed) {
                router.push('/today/video');
            }
        });
};
</script>

<style scoped></style>
