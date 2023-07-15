// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Kith.dev';
export const SITE_DESCRIPTION = 'Tuplelog contains a collection of writings, insights, notes and learning experiences for frontend development';

export const NAV_ITEMS: NavItems = {
    home: {
        path: '/',
        title: 'home'
    },
    blog: {
        path: '/blog',
        title: 'blog'
    },
    tags: {
        path: '/tags',
        title: 'tags'
    },
    media: {
        path: '/media',
        title: 'media'
    },
    about: {
        path: '/about',
        title: 'about'
    }
}

export const SITE = {
    // Your site's detail?
    name: 'KithDev',
    nameToken:{
        initial: 'Kith',
        last:'.dev'
    },
    title: 'KithDev',
    description: 'KithDev contains a collection of writings, insights, notes and learning experiences for frontend development',
    url: 'https://kith.dev',
    githubUrl: 'https://github.com/poonia',
    listDrafts: true,
    image: 'https://github.com/poonia/tuplelog/blob/main/public/placeholder-about.jpg',

    ytChannelId: '',
    // Optional, user/author settings (example)
    // Author: name
    author: 'Praveen Poonia',
    // Author: Twitter handler
    authorTwitter: 'praveen_poonia',
    // Author: Image external source
    authorImage: '', // Example: https://pbs.twimg.com/profile_images/1272979356529221632/sxvncugt_400x400.jpg, https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png
    // Author: Bio
    authorBio: 'Frontend developer, believe in minimalism and make things happen.'
}

// Ink - Theme configuration
export const PAGE_SIZE = 8
export const USE_POST_IMG_OVERLAY = false
export const USE_MEDIA_THUMBNAIL = true

export const USE_AUTHOR_CARD = true
export const USE_SUBSCRIPTION = false /* works only when USE_AUTHOR_CARD is true */

