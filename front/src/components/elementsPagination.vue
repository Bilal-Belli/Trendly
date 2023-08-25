<template>
    <ul class="flex flex-wrap">
        <li @click="changePage(currentPage - 1)" class="w-full sm:w-auto mb-2 sm:mb-0 sm:mr-2 px-3 py-2 bg-gray-200 text-gray-500 rounded-lg">
            <a class="flex items-center font-bold" href="#">previous</a>
        </li>
        <li v-for="page in totalPages" :key="page" :class="{'w-full sm:w-auto mb-2 sm:mb-0 sm:mr-2 px-3 py-2 bg-gray-200 text-gray-700 hover:bg-gray-700 hover:text-gray-200 rounded-lg': page !== currentPage, 'w-full sm:w-auto mb-2 sm:mb-0 sm:mr-2 px-3 py-2 bg-gray-500 text-gray-200 rounded-lg': page === currentPage}">
            <a class="font-bold" @click="changePage(page)" href="#">{{ page }}</a>
        </li>
        <li @click="changePage(currentPage + 1)" class="w-full sm:w-auto mb-2 sm:mb-0 sm:ml-2 px-3 py-2 bg-gray-200 text-gray-700 hover:bg-gray-700 hover:text-gray-200 rounded-lg">
            <a class="flex items-center font-bold" href="#">Next</a>
        </li>
    </ul>
</template>

<script>
export default {
    props: {
        totalPages: {
            type: Number,
            required: true
        },
        currentPage: {
            type: Number,
            required: true
        }
    },
    methods: {
        changePage(newPage) {
            if (newPage >= 1 && newPage <= this.totalPages) {
                this.$emit('page-changed', newPage);
            }
        }
    }
}
</script>
