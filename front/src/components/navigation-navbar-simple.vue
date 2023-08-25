<template>
    <nav class="bg-white px-6 py-4 shadow">
        <div class="flex flex-col container mx-auto md:flex-row md:items-center md:justify-between">
            <div class="flex justify-between items-center">
                <div>
                    <a class="text-gray-800 text-xl font-bold md:text-2xl" href="#"><span class="text-blue-500">Trendly</span></a>
                </div>
            </div>
            <div class="flex flex-col md:flex-row md:-mx-4" :class="isOpen ? 'block' : ['hidden' , 'md:block']">
                <a class="my-1 text-gray-800 hover:text-blue-500 md:mx-4 md:my-0" href="#">About us</a>
            </div>
        </div>
    </nav>
</template>
<script>
    export default {
        data() {
            return {
                isOpen: false
            }
        }
    }
</script>