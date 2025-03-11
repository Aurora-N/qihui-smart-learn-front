// // 转换用户输入的中文成为拼音，以定向到指定的文章
// import { defineNuxtRouteMiddleware, navigateTo } from '#app'
// import pinyin from 'pinyin'

// // Regex to match Chinese characters.
// const chineseRegex = /[\u4e00-\u9fff]/;

// export default defineNuxtRouteMiddleware((to) => {
//     // Split the route path into segments.
//     const segments = to.path.split('/');

//     let changed = false;
//     const newSegments = segments.map(segment => {
//         const decodedSegment = decodeURIComponent(segment);
//         if (chineseRegex.test(decodedSegment)) {
//             changed = true;
//             // Convert Chinese segment to pinyin without spaces.
//             return pinyin(decodedSegment, { style: pinyin.STYLE_NORMAL }).flat().join('-');
//         } else if (decodedSegment === ' ') {
//             // Convert space to '-'
//             changed = true;
//             return '-';
//         }
//         return decodedSegment.toLowerCase();
//     });

//     const newPath = newSegments.join('/') || '/';

//     // If conversion happened and the new path is different, redirect.
//     if (changed && newPath !== to.path) {
//         return navigateTo(newPath);
//     }
// });