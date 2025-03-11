// 从content文件夹获取所有文件标题及stem
export const getArticlesLists = async (category, depth = 0) => {
    return await useAsyncData('content', async () => {
        const raw = await queryCollection('content').select('title', 'stem').all()
        const result = raw.filter((item) => item.stem.split('/')[depth] === category)
        // console.log(result)
        return result
    })
}

// 获取某一类型文章的下一级子文章类型
export const getSubCategories = async (category) => {
    return await useAsyncData('content', async () => {
        const subcategories = new Set();
        const raw = await queryCollection('content').select('title', 'stem').all()
        const dataIncludeCategory = raw.filter((item) => item.stem.split('/').indexOf(category) !== -1)
        dataIncludeCategory.forEach((item) => {
            const parts = item.stem.split('/')
            const index = parts.indexOf(category)
            // 确保 category 存在于路径中，并且后面还有子类别
            if (index !== -1 && index + 1 < parts.length) {
                subcategories.add(parts[index + 1])
            }
        })
        return Array.from(subcategories)
    })
}