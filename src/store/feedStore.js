import { create } from 'zustand'

export const useFeedStore = create((set) => ({
    posts: [],
    likes: {},
    page: 0,
    hasMore: true,
    seed: null,
    scrollY: 0,
    loading: false,
    isInitialized: false,

    setLoading: (val) => set({ loading: val }),
    setLikes: (fn) => set((state) => ({ likes: fn(state.likes) })),
    setPage: (fn) => set((state) => ({ page: fn(state.page) })),
    setHasMore: (val) => set({ hasMore: val }),
    setSeed: (val) => set({ seed: val }),
    setScrollY: (val) => set({ scrollY: val }),
    setInitialized: (val) => set({ isInitialized: val }),

    // MERGE SEM DUPLICAR POSTS
    mergePosts: (newPosts) =>
        set((state) => {
            const map = new Map()

            state.posts.forEach(post => {
                map.set(post.id, post)
            })

            newPosts.forEach(post => {
                const existing = map.get(post.id)
                map.set(post.id, { ...existing, ...post })
            })

            return { posts: Array.from(map.values()) }
        }),

    updatePostLikeCount: (postId, increment) =>
        set((state) => ({
            posts: state.posts.map(post =>
                post.id === postId
                    ? { ...post, likesCount: post.likesCount + increment }
                    : post
            )
        })),

    updatePostCommentCount: (postId, increment) =>
        set((state) => ({
            posts: state.posts.map(post =>
                post.id === postId
                    ? { ...post, commentsCount: post.commentsCount + increment }
                    : post
            )
        })),

    resetFeed: () => set({
        posts: [],
        likes: {},
        page: 0,
        hasMore: true,
        seed: null,
        scrollY: 0,
        loading: false,
        isInitialized: false,
    })
}))