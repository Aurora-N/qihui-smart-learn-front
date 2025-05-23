export const useQuizApi = () => {
  const nuxtApp = useNuxtApp()

  const getLearningPath = async userAnswersList => {
    const res = await nuxtApp.$axios.post('/quiz/LearningPath', {
      result: userAnswersList,
    })
    return res
  }

  return { getLearningPath }
}
