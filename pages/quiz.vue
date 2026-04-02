<template>
  <div class="container">
    <div class="quiz-container">
      <BannerQuiz>
        <el-card class="quiz-card" v-loading="loadingQuestions || checkingStatus">
          <template #header>
            <div class="quiz-header">
              <h1>学习路线规划测试</h1>
              <el-progress
                v-if="mode === 'quiz' && !reviewMode"
                :percentage="progressPercentage"
                :format="progressFormat"
                :color="primaryColor"
              />
            </div>
          </template>

          <div v-if="checkingStatus" class="checking-status">
            正在查询您的学习路线信息...
          </div>

          <div v-else-if="mode === 'form'" class="form-section">
            <el-form ref="formRef" :model="form" label-width="120px">
              <el-form-item label="学习目标" prop="learningTarget" required>
                <el-input
                  v-model="form.learningTarget"
                  placeholder="请输入你想学习的目标知识，如：前端开发、React"
                />
              </el-form-item>
              <el-form-item label="当前阶段" prop="learningStage" required>
                <el-select
                  v-model="form.learningStage"
                  placeholder="请选择所处的学习阶段"
                >
                  <el-option label="入门" value="入门" />
                  <el-option label="初级" value="初级" />
                  <el-option label="进阶" value="进阶" />
                  <el-option label="深入" value="深入" />
                </el-select>
              </el-form-item>
              <el-form-item label="学习意向路线" prop="tend" required>
                <el-select
                  v-model="form.tend"
                  placeholder="请选择倾向路线"
                >
                  <el-option label="Java" value="Java" />
                  <el-option label="Python" value="Python" />
                  <el-option label="HTML" value="HTML" />
                  <el-option label="Go" value="Go" />
                </el-select>
              </el-form-item>
              <el-form-item label="每日学习时间" prop="availableTime" required>
                <el-input-number
                  v-model="form.availableTime"
                  :min="0"
                  :max="12"
                  :step="0.5"
                />
                <span style="margin-left: 10px">小时/天</span>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  :loading="loadingQuestions"
                  @click="startQuiz(formRef)"
                >
                  生成专属测试卷
                </el-button>
              </el-form-item>
            </el-form>
          </div>

          <div v-else-if="mode === 'quiz' && !reviewMode">
            <div class="question-section">
              <div class="question-count">
                <span>问题 {{ currentQuestionIndex + 1 }}</span
                >/{{ questions.length }}
              </div>
              <div
                class="question-text"
                v-html="formatQuestionText(currentQuestion.question || currentQuestion.text)"
              ></div>
            </div>

            <div class="answer-section">
              <!-- 单选题 -->
              <div v-if="currentQuestion.type === 'single_choice' || !currentQuestion.type" class="option-buttons">
                <el-radio-group v-model="selectedAnswerSingle" class="vertical-radio-group">
                  <el-radio
                    v-for="(optionStr, index) in currentQuestion.options"
                    :key="index"
                    :label="getOptionChar(index)"
                    size="large"
                    class="option-radio"
                  >
                    <div class="option-content">
                      <div class="option-label">{{ getOptionChar(index) }}</div>
                      <div class="option-text">{{ optionStr }}</div>
                    </div>
                  </el-radio>
                </el-radio-group>
              </div>

              <!-- 多选题 -->
              <div v-else-if="currentQuestion.type === 'multiple_choice'" class="option-buttons">
                <el-checkbox-group v-model="selectedAnswerMultiple" class="vertical-checkbox-group">
                  <el-checkbox
                    v-for="(optionStr, index) in currentQuestion.options"
                    :key="index"
                    :label="getOptionChar(index)"
                    size="large"
                    class="option-checkbox"
                  >
                    <div class="option-content">
                      <div class="option-label">{{ getOptionChar(index) }}</div>
                      <div class="option-text">{{ optionStr }}</div>
                    </div>
                  </el-checkbox>
                </el-checkbox-group>
              </div>

              <!-- 填空题 -->
              <div v-else-if="currentQuestion.type === 'fill_blank'">
                <el-input
                  v-model="selectedAnswerFill"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入您的答案"
                />
              </div>
            </div>

            <div class="navigation-buttons">
              <el-button
                type="primary"
                plain
                :disabled="currentQuestionIndex === 0"
                :style="{ borderColor: primaryColor, color: primaryColor }"
                @click="goToPreviousQuestion"
              >
                上一题
              </el-button>

              <el-button
                type="primary"
                :disabled="!hasAnsweredCurrent()"
                :style="{
                  backgroundColor: primaryColor,
                  borderColor: primaryColor,
                  color: 'white',
                }"
                @click="goToNextQuestion"
              >
                {{
                  currentQuestionIndex === questions.length - 1
                    ? '完成答题'
                    : '下一题'
                }}
              </el-button>
            </div>
          </div>

          <div v-else-if="reviewMode" class="review-mode">
            <h2>答题预览</h2>
            <p class="review-description">请检查您的答案，确认无误后提交</p>

            <el-table :data="reviewData" style="width: 100%" border>
              <el-table-column prop="questionNumber" label="题号" width="70" />
              <el-table-column prop="questionText" label="题目">
                <template #default="scope">
                  <div
                    v-html="formatQuestionText(scope.row.questionText)"
                  ></div>
                </template>
              </el-table-column>
              <el-table-column
                prop="selectedAnswerDisplay"
                label="您的选择"
                width="150"
              >
                <template #default="scope">
                  <el-tag
                    v-if="scope.row.selectedAnswerDisplay"
                    type="success"
                    :style="{
                      backgroundColor: '#f0f9eb',
                      color: '#67C23A',
                      borderColor: '#67C23A',
                    }"
                  >
                    {{ scope.row.selectedAnswerDisplay }}
                  </el-tag>
                  <el-tag v-else type="danger">未答</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80">
                <template #default="scope">
                  <el-button
                    type="primary"
                    link
                    :style="{ color: primaryColor }"
                    @click="editAnswer(scope.row.index)"
                  >
                    修改
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <div class="submit-section">
               <el-alert
                v-if="hasUnansweredQuestions"
                title="您有未回答的题目"
                type="warning"
                :closable="false"
                show-icon
              />

              <div class="submit-buttons">
                <el-button @click="reviewMode = false">返回答题</el-button>
                <el-button
                  type="primary"
                  :disabled="hasUnansweredQuestions"
                  :style="{
                    backgroundColor: primaryColor,
                    borderColor: primaryColor,
                  }"
                  @click="submitQuiz"
                >
                  提交答案
                </el-button>
              </div>
            </div>
          </div>

          <div v-else-if="mode === 'result'" class="results-container">
            <h2 v-if="!recommendLearningPath">正在生成您的专属学习路线...</h2>
            <template v-else>
              <h2>您的学习路线</h2>
              
              <div v-if="score > 0 || questions.length > 0" class="score-summary">
                <el-result
                  icon="success"
                  :title="`测试完成`"
                >
                </el-result>
              </div>

              <div class="questions-review">
                <el-collapse
                  class="custom-collapse"
                  @change="handleCollapseChange"
                >
                  <el-collapse-item title="学习路线推荐" name="roadmap">
                    <GraphRoadMap
                      ref="graphEmbeded"
                      :roadmap-data="recommendLearningPath"
                    />
                  </el-collapse-item>

                  <el-collapse-item v-if="questions.length > 0" title="答题情况" name="answer">
                    <el-collapse class="custom-answer-collapse">
                      <el-collapse-item
                        v-for="(question, index) in questions"
                        :key="index"
                        :title="`问题 ${index + 1}: ${(question.question || question.text || '').substring(0, 30)}...`"
                        :name="index"
                      >
                        <div class="question-review">
                          <div
                            class="question-text"
                            v-html="formatQuestionText(question.question || question.text)"
                          ></div>
                          <div class="options-review" v-if="question.options">
                            <div
                              v-for="(optionStr, optIndex) in question.options"
                              :key="optIndex"
                              class="option-item"
                            >
                              <span class="review-option-label">{{ getOptionChar(optIndex) }}</span>
                              <span class="review-option-text">{{ optionStr }}</span>
                            </div>
                          </div>
                          <div class="explanation">
                            <div class="correct-answer-label">
                              <el-tag type="success">
                                标准答案: {{ question.correct_answer || question.answer }}
                              </el-tag>
                              <br/>
                              <el-tag
                                type="info"
                                style="margin-top: 10px"
                              >
                                您的答案: {{ Array.isArray(userAnswers[index]) ? userAnswers[index].join(', ') : userAnswers[index] }}
                              </el-tag>
                              <el-tag
                                :type="userScores[index] > 0 ? (userScores[index] === 1 ? 'success' : 'warning') : 'danger'"
                                style="margin-top: 10px; margin-left: 10px"
                              >
                                得分率: {{ userScores[index] }}
                              </el-tag>
                            </div>
                            <div class="explanation-text" v-if="question.scoring_rules || question.explanation">
                              <el-alert
                                title="评分规则/解析"
                                type="info"
                                :description="question.scoring_rules || question.explanation"
                                :closable="false"
                                show-icon
                              />
                            </div>
                          </div>
                        </div>
                      </el-collapse-item>
                    </el-collapse>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </template>
          </div>
        </el-card>
      </BannerQuiz>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import type { FormInstance } from 'element-plus'
import {
  getUserLearningPath,
  checkUserHasCustomPath,
  planUserLearningPath,
  getFinalLearningPath
} from '~/api/learn'
import type { QuestionData, QuizResult } from '~/api/type/learn'
import { useUserStore } from '~/stores/userStore'
import { ElMessage } from 'element-plus'

const mode = ref<'form' | 'quiz' | 'result'>('form')
const checkingStatus = ref(true)
const loadingQuestions = ref(false)
const primaryColor = ref('#0060DF')

const formRef = ref<FormInstance>()
const form = ref({
  learningTarget: '',
  learningStage: '入门',
  tend: 'Java',
  availableTime: 2,
})

const graphEmbeded = ref<any>(null)
const recommendLearningPath = ref<any>(null)

const questions = ref<QuestionData[]>([])
const currentQuestionIndex = ref(0)

const userAnswers = ref<Record<number, any>>({})
const userScores = ref<Record<number, number>>({})

const selectedAnswerSingle = ref('')
const selectedAnswerMultiple = ref<string[]>([])
const selectedAnswerFill = ref('')

const score = ref(0)
const reviewMode = ref(false)

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

definePageMeta({
  middleware: 'auth'
})

useHead({
  title: '获取专属学习路线',
})

onMounted(async () => {
  if (userInfo.value && userInfo.value.id) {
    try {
      const status = await checkUserHasCustomPath(userInfo.value.id)
      if (status === 'old') {
        const pathData = await getUserLearningPath(userInfo.value.id)
        if (pathData && pathData.finalPath) {
           recommendLearningPath.value = pathData.finalPath
        } else {
           recommendLearningPath.value = pathData
        }
        mode.value = 'result'
      } else {
        mode.value = 'form'
      }
    } catch (error) {
      console.error('Check path error', error)
      mode.value = 'form'
    }
  } else {
    mode.value = 'form'
  }
  checkingStatus.value = false
})

const handleCollapseChange = (value: any) => {
  if (Object.values(value).includes('roadmap')) {
    nextTick(() => {
      if (graphEmbeded.value) {
        graphEmbeded.value.initGraph()
      }
    })
  }
}

const formatQuestionText = (text: string) => {
  if (!text) return ''
  return text.replace(/\n/g, '<br/>').replace(/\[([^\]]+)\]/g, '<span class="tag-highlight">$1</span>')
}

const getOptionChar = (index: number) => {
  return String.fromCharCode(65 + index)
}

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] || {})

const progressPercentage = computed(() => {
  if (questions.value.length === 0) return 0
  const answeredCount = Object.keys(userAnswers.value).length
  return Math.round((answeredCount / questions.value.length) * 100)
})

const progressFormat = () => {
  return `${Object.keys(userAnswers.value).length}/${questions.value.length}`
}

const startQuiz = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async valid => {
    if (valid) {
      if (!userInfo.value || !userInfo.value.id) {
        ElMessage.error('用户未登录')
        return
      }
      loadingQuestions.value = true
      try {
        const res = await planUserLearningPath({
          userId: userInfo.value.id,
          learningTarget: form.learningTarget,
          learningStage: form.learningStage,
          availableTime: form.availableTime,
        })
        
        let qs: QuestionData[] = []
        if (Array.isArray(res)) {
          qs = res
        } else if (res && typeof res === 'object') {
           if (Array.isArray((res as any).questions)) {
              qs = (res as any).questions
           } else if (Array.isArray((res as any).data)) {
              qs = (res as any).data
           } else {
              qs = [res as unknown as QuestionData]
           }
        }
        
        if (qs.length === 0) {
          ElMessage.warning('未能获取到测试题目，请重试')
          return
        }
        
        questions.value = qs
        mode.value = 'quiz'
        currentQuestionIndex.value = 0
        syncStateFromUserAnswers()
      } catch (e) {
        console.error(e)
        ElMessage.error('生成测试卷失败')
      } finally {
        loadingQuestions.value = false
      }
    }
  })
}

const hasAnsweredCurrent = () => {
  const t = currentQuestion.value.type || 'single_choice'
  if (t === 'single_choice') return !!selectedAnswerSingle.value
  if (t === 'multiple_choice') return selectedAnswerMultiple.value.length > 0
  if (t === 'fill_blank') return !!selectedAnswerFill.value.trim()
  return false
}

const saveCurrentAnswer = () => {
  const t = currentQuestion.value.type || 'single_choice'
  if (t === 'single_choice') {
    userAnswers.value[currentQuestionIndex.value] = selectedAnswerSingle.value
  } else if (t === 'multiple_choice') {
    userAnswers.value[currentQuestionIndex.value] = [...selectedAnswerMultiple.value].sort()
  } else if (t === 'fill_blank') {
    userAnswers.value[currentQuestionIndex.value] = selectedAnswerFill.value.trim()
  }
}

const syncStateFromUserAnswers = () => {
  const t = currentQuestion.value.type || 'single_choice'
  const saved = userAnswers.value[currentQuestionIndex.value]
  if (t === 'single_choice') {
    selectedAnswerSingle.value = saved || ''
  } else if (t === 'multiple_choice') {
    selectedAnswerMultiple.value = saved ? [...saved] : []
  } else if (t === 'fill_blank') {
    selectedAnswerFill.value = saved || ''
  }
}

const goToNextQuestion = () => {
  if (hasAnsweredCurrent()) {
    saveCurrentAnswer()
    if (currentQuestionIndex.value < questions.value.length - 1) {
      currentQuestionIndex.value++
      syncStateFromUserAnswers()
    } else {
      reviewMode.value = true
    }
  }
}

const goToPreviousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    saveCurrentAnswer()
    currentQuestionIndex.value--
    syncStateFromUserAnswers()
  }
}

const editAnswer = (index: number) => {
  currentQuestionIndex.value = index
  syncStateFromUserAnswers()
  reviewMode.value = false
}

const reviewData = computed(() => {
  return questions.value.map((question, index) => {
    const ans = userAnswers.value[index]
    let display = ''
    if (Array.isArray(ans)) {
      display = ans.join(', ')
    } else if (ans) {
      display = String(ans)
    }
    return {
      index,
      questionNumber: index + 1,
      questionText: question.question || question.text || '',
      selectedAnswerDisplay: display,
    }
  })
})

const hasUnansweredQuestions = computed(() => {
  return reviewData.value.some(item => !item.selectedAnswerDisplay)
})

const calculateScoreRatio = (q: QuestionData, ans: any): number => {
  if (ans === undefined || ans === null || ans === '') return 0
  
  const ruleStr = (q.scoring_rules || '').toLowerCase()
  const correctAnsStr = (q.correct_answer || q.answer || '').toString().trim()
  
  if (q.type === 'multiple_choice') {
    const userArray = Array.isArray(ans) ? ans : [ans]
    let correctArray = correctAnsStr.split(/[,，\s]+/).map(x => x.trim().toUpperCase()).filter(Boolean)
    if (correctArray.length === 1 && correctArray[0].length > 1 && !correctArray[0].includes(' ')) {
      correctArray = correctArray[0].split('')
    }
    
    if (ruleStr.includes('全部选对得满分')) {
       const hasWrong = userArray.some(x => !correctArray.includes(x))
       if (hasWrong) return 0
       if (userArray.length === correctArray.length) return 1
       return userArray.length / correctArray.length
    }
    
    if (userArray.length === correctArray.length && userArray.every(x => correctArray.includes(x))) return 1
    return 0
  } else if (q.type === 'fill_blank') {
    const userStr = String(ans).trim()
    const matchStrList = correctAnsStr.split(/[,，|]+/).map(x => x.trim())
    
    if (ruleStr.includes('包含') || ruleStr.includes('关键词即视为正确')) {
      const quotesRegex = /['"‘“](.*?)['"’”]/g
      let keywords = []
      let match
      while ((match = quotesRegex.exec(ruleStr)) !== null) {
          keywords.push(match[1])
      }
      if (keywords.length === 0) keywords = matchStrList
      
      return keywords.some(kw => userStr.toLowerCase().includes(kw.toLowerCase())) ? 1 : 0
    } else if (ruleStr.includes('接受')) {
      const quotesRegex = /['"‘“](.*?)['"’”]/g
      let others = []
      let match
      while ((match = quotesRegex.exec(ruleStr)) !== null) {
          others.push(match[1])
      }
      
      const isCorrect = userStr.toLowerCase() === correctAnsStr.toLowerCase() || 
                        others.some(kw => userStr.toLowerCase() === kw.toLowerCase())
      return isCorrect ? 1 : 0
    } else if (ruleStr.includes('忽略大小写')) {
      return userStr.toLowerCase() === correctAnsStr.toLowerCase() ? 1 : 0
    }
    
    return userStr === correctAnsStr ? 1 : 0
  } else {
    const userStr = String(ans).trim().toUpperCase()
    const correctLetter = correctAnsStr.toUpperCase()
    return userStr === correctLetter ? 1 : 0
  }
}

const submitQuiz = async () => {
  reviewMode.value = false
  mode.value = 'result'
  
  const kpStats: Record<string, { total: number, correct: number }> = {}

  questions.value.forEach((q, i) => {
    const ans = userAnswers.value[i]
    const ratio = calculateScoreRatio(q, ans)
    userScores.value[i] = ratio
    
    const kp = q.knowledge_point || 'general'
    if (!kpStats[kp]) kpStats[kp] = { total: 0, correct: 0 }
    
    kpStats[kp].total += 1
    kpStats[kp].correct += ratio
  })

  score.value = questions.value.length

  const quizResults: QuizResult[] = Object.keys(kpStats).map(kp => ({
    knowledge_point: kp,
    correct_rate: kpStats[kp].total > 0 ? (kpStats[kp].correct / kpStats[kp].total) : 0
  }))
  
  try {
    const finalPathRes = await getFinalLearningPath({
      userId: userInfo.value.id,
      tartget: form.learningTarget,
      tend: form.tend,
      quizResults
    })
    
    if (finalPathRes && finalPathRes.finalPath) {
      recommendLearningPath.value = finalPathRes.finalPath
    } else {
      recommendLearningPath.value = finalPathRes
    }
  } catch (error) {
    console.error('Failed to get final path', error)
    ElMessage.error('生成最终路线失败')
  }
}

</script>

<style scoped>
.container {
  padding-top: 55px;
}

.quiz-container {
  margin: 0 auto;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.quiz-card {
  margin-bottom: 20px;
}

.checking-status {
  text-align: center;
  padding: 40px;
  font-size: 16px;
  color: #606266;
}

.quiz-header {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.quiz-header h1 {
  margin: 0;
  font-size: 24px;
  color: #303133;
  text-align: center;
}

.form-section {
  max-width: 600px;
  margin: 0 auto;
}

.question-section {
  margin-bottom: 20px;
}

.question-count {
  margin-bottom: 10px;
  font-size: 14px;
  color: #909399;
}

.question-count span {
  font-weight: bold;
  color: #0060df;
}

.question-text {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 20px;
  line-height: 1.6;
}

.answer-section {
  margin-bottom: 30px;
  width: 100%;
}

.vertical-radio-group,
.vertical-checkbox-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.option-radio,
.option-checkbox {
  width: 100%;
  margin-bottom: 12px;
  margin-left: 0 !important;
  height: auto !important;
  white-space: normal;
  padding: 12px 15px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
}

.option-radio.is-checked,
.option-checkbox.is-checked {
  background-color: #e6effd;
  border-color: #0060df;
}

.option-content {
  display: flex;
  align-items: center;
  line-height: 1.5;
}

.option-label {
  font-weight: bold;
  margin-right: 15px;
}

.option-text {
  flex: 1;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.review-mode {
  padding: 10px;
}

.review-mode h2 {
  text-align: center;
  margin-bottom: 10px;
  color: #303133;
}

.review-description {
  text-align: center;
  color: #606266;
  margin-bottom: 20px;
}

.submit-section {
  margin-top: 20px;
}

.submit-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.results-container {
  padding: 10px;
}

.results-container h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #303133;
}

.score-summary {
  margin-bottom: 30px;
}

.questions-review {
  margin-bottom: 30px;
}

.question-review {
  padding: 10px;
}

.options-review {
  margin: 15px 0;
}

.option-item {
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 8px;
  border: 1px solid #ebeef5;
  display: flex;
  align-items: center;
}

.review-option-label {
  font-weight: bold;
  min-width: 30px;
  margin-right: 10px;
}

.review-option-text {
  flex: 1;
}

.explanation {
  margin-top: 15px;
}

.correct-answer-label {
  margin-bottom: 10px;
}
</style>

<style>
.tag-highlight {
  background-color: #e6effd;
  color: #0060df;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
  margin: 0 2px;
  display: inline-block;
}

.custom-collapse .el-collapse-item__header {
  font-size: 18px;
  padding: 15px;
  line-height: 1.5;
}

.custom-collapse .el-collapse-item__content {
  padding: 20px;
}
</style>
