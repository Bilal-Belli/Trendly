<template>
    <div id="app" class="font-roboto bg-gray-100 ">
        <navbar></navbar>

        <div class="px-6 py-8 main-content">
            <div class="flex justify-between container mx-auto">
                <div class="w-full lg:w-8/12">
                    <div class="flex items-center justify-between">
                        <h1 class="text-xl font-bold text-gray-700 md:text-2xl">Posts</h1>
                        <!-- <post-filter></post-filter> -->
                    </div>
                    <div class="mt-8">
                        <Pagination :totalPages="totalPages" :currentPage="currentPage" @page-changed="changePage"></Pagination>
                    </div>

                    <div class="mt-6" v-for="post in displayedPosts" :key="post.id">
                        <post :data="post"></post>
                    </div>

                    <div class="mt-8">
                        <Pagination :totalPages="totalPages" :currentPage="currentPage" @page-changed="changePage"></Pagination>
                    </div>
                </div>
                <div class="-mx-8 w-4/12 hidden lg:block">
                    <div class="mt-10 px-8">
                        <h1 class="mb-4 text-xl font-bold text-gray-700">Categories</h1>
                        <categories></categories>
                    </div>
                </div>
            </div>
        </div>
        
        <simple-footer class="simple-footer"></simple-footer>
    </div>
</template>

<script>
    import Navbar from "./components/navigation-navbar-simple";
    import Post from "./components/elements-blog-post-article-review";
    import Pagination from "./components/elements-pagination";
    import Categories from "./components/sections-categories-list";
    import SimpleFooter from "./components/navigation-footer-simple-with-icon";

    export default {
        name: 'app',
        components: {
            Navbar,
            Post,
            Pagination,
            Categories,
            SimpleFooter
        },
        data() {
            return {
                posts: [],
                currentPage: 1,
                postsPerPage: 5
            }
        },
        computed: {
            totalPages() {
                return Math.ceil(this.posts.length / this.postsPerPage);
            },
            displayedPosts() {
                const start = (this.currentPage - 1) * this.postsPerPage;
                const end = start + this.postsPerPage;
                return this.posts.slice(start, end);
            }
        },
        methods: {
            async fetchArticles() {
            const response = await fetch('http://localhost:3000/getTrends');
            const data = await response.json();
            this.posts = data;
            },
            changePage(pageNumber) {
                if (pageNumber >= 1 && pageNumber <= this.totalPages) {
                    this.currentPage = pageNumber;
                }
            }
        },
        created() {
            // Fetch articles when the component is created
            this.fetchArticles();
        }
    }
</script>
<style>
    @import "assets/css/app.css";

    ::-webkit-scrollbar {
        width: 5px;
    }

    ::-webkit-scrollbar-track {
        background: #2D3748;
    }

    ::-webkit-scrollbar-thumb {
        background: #CBD5E0;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: #2D3748;
    }

    #app {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }
    /* Make the main content area grow and push the footer to the bottom */
    .main-content {
        flex-grow: 1;
    }
    /* Footer styles */
    .simple-footer {
        margin-top: auto; /* Push the footer to the bottom */
    }
</style>