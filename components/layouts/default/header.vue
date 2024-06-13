<template>
    <header class="border-b">
        <nav
            class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
            aria-label="Global"
        >
            <div class="flex flex-1 justify-start">
                <div class="relative">
                    <button
                        type="button"
                        class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        @click="toggleMenu"
                    >
                        <span class="sr-only">Open main menu</span>
                        <svg
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                            />
                        </svg>
                    </button>

                    <transition name="menu-transition">
                        <LayoutsDefaultMenu v-if="isMenu" />
                    </transition>
                </div>
            </div>
            <div class="flex flex-1 justify-center">
                <a href="#" class="-m-1.5 p-1.5 flex gap-x-2">
                    <span class="sr-only">KidKids</span>
                    <img
                        class="h-12 w-auto"
                        src="~/assets/images/logo1.png"
                        alt=""
                    />
                    <img
                        class="h-12 w-auto"
                        src="~/assets/images/logo2.png"
                        alt=""
                    />
                </a>
            </div>
            <div class="flex flex-1 justify-end">
                <a
                    href="#"
                    class="text-sm font-semibold leading-6 text-gray-900"
                    >Log in <span aria-hidden="true">&rarr;</span></a
                >
            </div>
        </nav>
    </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const isMenu = ref(false);

const toggleMenu = () => {
    isMenu.value = !isMenu.value;
};

const handleClickOutside = (event: MouseEvent) => {
    // 클릭된 요소가 버튼이 아니면 메뉴를 닫음
    if (!(event.target as HTMLElement).closest('button')) {
        isMenu.value = false;
    }
};

// 문서 전체에 클릭 이벤트 리스너를 추가
onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

// 컴포넌트가 제거되기 전에 이벤트 리스너를 제거
onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.menu-transition-enter-active,
.menu-transition-leave-active {
    transition:
        opacity 0.2s ease,
        transform 0.2s ease;
}
.menu-transition-enter-from,
.menu-transition-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
