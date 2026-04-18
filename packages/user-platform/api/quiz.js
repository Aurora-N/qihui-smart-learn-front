export const useQuizApi = () => {
  const nuxtApp = useNuxtApp()

  const getLearningPath = async (userId, userAnswersList) => {
    const res = await nuxtApp.$axios.post(
      `/quiz/LearningPath?user_id=${userId}`,
      {
        result: userAnswersList,
      }
    )
    return res
  }

  return { getLearningPath }
}
