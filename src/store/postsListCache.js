const mePostsCache = {
    posts: [],
    likes: {},
    page: 0,
    hasMore: true,
    initialized: false,
}

const otherPostsCache = {}
const searchPostsCache = {}

function getMePostsCache() {
    return mePostsCache
}

function setMePostsCache(nextData) {
    Object.assign(mePostsCache, nextData)
}

function getOtherPostsCache(userName) {
    if (!otherPostsCache[userName]) {
        otherPostsCache[userName] = {
            posts: [],
            likes: {},
            page: 0,
            hasMore: true,
            initialized: false,
        }
    }

    return otherPostsCache[userName]
}

function setOtherPostsCache(userName, nextData) {
    const current = getOtherPostsCache(userName)
    Object.assign(current, nextData)
}

function getSearchPostsCache(term) {
    if (!searchPostsCache[term]) {
        searchPostsCache[term] = {
            posts: [],
            likes: {},
            page: 0,
            hasMore: true,
            initialized: false,
        }
    }

    return searchPostsCache[term]
}

function setSearchPostsCache(term, nextData) {
    const current = getSearchPostsCache(term)
    Object.assign(current, nextData)
}

function updatePostInCacheList(cache, postId, updater) {
    if (!Array.isArray(cache.posts) || cache.posts.length === 0) return

    cache.posts = cache.posts.map((post) =>
        post.id === postId ? updater(post) : post
    )
}

function updatePostLikeStateInAllCaches(postId, isLiked, likesDelta) {
    const applyUpdate = (cache) => {
        if (!cache) return

        cache.likes = {
            ...(cache.likes || {}),
            [postId]: isLiked,
        }

        updatePostInCacheList(cache, postId, (post) => ({
            ...post,
            likesCount: Math.max(0, (post.likesCount || 0) + likesDelta),
        }))
    }

    applyUpdate(mePostsCache)

    Object.values(otherPostsCache).forEach(applyUpdate)
    Object.values(searchPostsCache).forEach(applyUpdate)
}

function incrementPostCommentsInAllCaches(postId, commentsDelta = 1) {
    const applyUpdate = (cache) => {
        if (!cache) return

        updatePostInCacheList(cache, postId, (post) => ({
            ...post,
            commentsCount: Math.max(0, (post.commentsCount || 0) + commentsDelta),
        }))
    }

    applyUpdate(mePostsCache)

    Object.values(otherPostsCache).forEach(applyUpdate)
    Object.values(searchPostsCache).forEach(applyUpdate)
}

function clearPostsListCaches() {
    mePostsCache.posts = []
    mePostsCache.likes = {}
    mePostsCache.page = 0
    mePostsCache.hasMore = true
    mePostsCache.initialized = false

    Object.keys(otherPostsCache).forEach((key) => {
        delete otherPostsCache[key]
    })

    Object.keys(searchPostsCache).forEach((key) => {
        delete searchPostsCache[key]
    })
}

export {
    getMePostsCache,
    setMePostsCache,
    getOtherPostsCache,
    setOtherPostsCache,
    getSearchPostsCache,
    setSearchPostsCache,
    updatePostLikeStateInAllCaches,
    incrementPostCommentsInAllCaches,
    clearPostsListCaches,
}
