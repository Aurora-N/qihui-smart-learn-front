<template>
  <div class="container">
    <div class="quiz-container">
      <el-card class="quiz-card">
        <template #header>
          <div class="quiz-header">
            <h1>前端开发测试题</h1>
            <el-progress :percentage="progressPercentage" :format="progressFormat" />
          </div>
        </template>

        <div v-if="!showResults && !reviewMode">
          <div class="question-section">
            <div class="question-count">
              <span>问题 {{ currentQuestionIndex + 1 }}</span>/{{ questions.length }}
            </div>
            <div class="question-text" v-html="formatQuestionText(currentQuestion.text)"></div>
          </div>

          <div class="answer-section">
            <div class="option-buttons">
              <el-button v-for="(option, index) in currentQuestion.options" :key="index"
                :type="selectedAnswer === option.label ? 'primary' : 'default'" class="option-button"
                style="margin-left: 0;" @click="selectAnswer(option.label)" size="large">
                <div class="option-content">
                  <div class="option-label">{{ option.label }}</div>
                  <div class="option-text">{{ option.text }}</div>
                </div>
              </el-button>
            </div>
          </div>

          <div class="navigation-buttons">
            <el-button type="primary" plain @click="goToPreviousQuestion" :disabled="currentQuestionIndex === 0">
              上一题
            </el-button>

            <el-button type="primary" @click="goToNextQuestion" :disabled="!selectedAnswer">
              {{ currentQuestionIndex === questions.length - 1 ? '完成答题' : '下一题' }}
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
                <div v-html="formatQuestionText(scope.row.questionText)"></div>
              </template>
            </el-table-column>
            <el-table-column prop="selectedAnswer" label="您的选择" width="100">
              <template #default="scope">
                <el-tag v-if="scope.row.selectedAnswer" type="success">
                  {{ scope.row.selectedAnswer }}
                </el-tag>
                <el-tag v-else type="danger">未答</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button type="primary" link @click="editAnswer(scope.row.index)">
                  修改
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="submit-section">
            <el-alert v-if="hasUnansweredQuestions" title="您有未回答的题目" type="warning" :closable="false" show-icon />

            <div class="submit-buttons">
              <el-button @click="reviewMode = false">返回答题</el-button>
              <el-button type="primary" @click="submitQuiz" :disabled="hasUnansweredQuestions && requireAllAnswered">
                提交答案
              </el-button>
            </div>
          </div>
        </div>

        <div v-else class="results-container">
          <h2>答题结果</h2>
          <div class="score-summary">
            <el-result icon="success" :title="`得分: ${score}/${questions.length}`"
              :sub-title="`正确率: ${Math.round((score / questions.length) * 100)}%`">
            </el-result>
          </div>

          <div class="questions-review">
            <el-collapse>
              <el-collapse-item v-for="(question, index) in questions" :key="index"
                :title="`问题 ${index + 1}: ${question.text.replace(/\[([^\]]+)\]/g, '$1')}`" :name="index">
                <div class="question-review">
                  <div class="question-text" v-html="formatQuestionText(question.text)"></div>
                  <div class="options-review">
                    <div v-for="option in question.options" :key="option.label" :class="[
                      'option-item',
                      userAnswers[index] === option.label ? 'user-selected' : '',
                      question.answer === option.label ? 'correct-answer' : ''
                    ]">
                      {{ option.label }}) {{ option.text }}
                    </div>
                  </div>
                  <div class="explanation">
                    <div class="correct-answer-label">
                      <el-tag type="success">正确答案: {{ question.answer }}</el-tag>
                      <el-tag v-if="userAnswers[index] && userAnswers[index] !== question.answer" type="danger"
                        style="margin-left: 10px">
                        您的答案: {{ userAnswers[index] }}
                      </el-tag>
                    </div>
                    <div class="explanation-text">
                      <el-alert title="解析" type="info" :description="question.explanation" :closable="false"
                        show-icon />
                    </div>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>

          <el-button type="primary" @click="restartQuiz" class="restart-button">
            重新开始
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import localQuizData from '~/assets/quiz/test1.md?raw'

// 解析题目数据
const parseQuestions = (markdownText) => {
  const questions = [];
  const lines = markdownText.split('\n');

  let currentQuestion = null;

  for (const line of lines) {
    // 新题目开始
    const questionMatch = line.match(/^\d+\.\s+\[([^\]]+)\]\s+(.*)/);
    if (questionMatch) {
      if (currentQuestion) {
        questions.push(currentQuestion);
      }

      currentQuestion = {
        text: `[${questionMatch[1]}] ${questionMatch[2]}`,
        options: [],
        answer: '',
        explanation: ''
      };
      continue;
    }

    // 选项
    const optionMatch = line.match(/^([A-D])\)\s+(.*)/);
    if (optionMatch && currentQuestion) {
      currentQuestion.options.push({
        label: optionMatch[1],
        text: optionMatch[2]
      });
      continue;
    }

    // 答案
    const answerMatch = line.match(/^✅答案：(.+)/);
    if (answerMatch && currentQuestion) {
      currentQuestion.answer = answerMatch[1];
      continue;
    }

    // 解析
    const explanationMatch = line.match(/^📝解析：(.+)/);
    if (explanationMatch && currentQuestion) {
      currentQuestion.explanation = explanationMatch[1];
      continue;
    }
  }

  // 添加最后一个问题
  if (currentQuestion) {
    questions.push(currentQuestion);
  }

  return questions;
};

// 状态管理
const questions = ref([]);
const currentQuestionIndex = ref(0);
const selectedAnswer = ref('');
const userAnswers = ref({});
const showResults = ref(false);
const score = ref(0);
const reviewMode = ref(false);
const requireAllAnswered = ref(false); // 是否要求所有题目都回答

// 计算属性
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] || {});

const progressPercentage = computed(() => {
  const answeredCount = Object.keys(userAnswers.value).length;
  return Math.round((answeredCount / questions.value.length) * 100);
});

const progressFormat = (percentage) => {
  return `${Object.keys(userAnswers.value).length}/${questions.value.length}`;
};

const reviewData = computed(() => {
  return questions.value.map((question, index) => {
    return {
      index,
      questionNumber: index + 1,
      questionText: question.text,
      selectedAnswer: userAnswers.value[index] || '',
    };
  });
});

const hasUnansweredQuestions = computed(() => {
  return reviewData.value.some(item => !item.selectedAnswer);
});

// 方法
const formatQuestionText = (text) => {
  if (!text) return '';
  return text.replace(/\[([^\]]+)\]/g, '<span class="tag-highlight">$1</span>');
};

const selectAnswer = (answer) => {
  selectedAnswer.value = answer;
};

const goToNextQuestion = () => {
  if (selectedAnswer.value) {
    userAnswers.value[currentQuestionIndex.value] = selectedAnswer.value;

    if (currentQuestionIndex.value < questions.value.length - 1) {
      currentQuestionIndex.value++;
      selectedAnswer.value = userAnswers.value[currentQuestionIndex.value] || '';
    } else {
      // 到达最后一题，进入预览模式
      reviewMode.value = true;
    }
  }
};

const goToPreviousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
    selectedAnswer.value = userAnswers.value[currentQuestionIndex.value] || '';
  }
};

const editAnswer = (index) => {
  currentQuestionIndex.value = index;
  selectedAnswer.value = userAnswers.value[index] || '';
  reviewMode.value = false;
};

const submitQuiz = () => {
  calculateScore();
  reviewMode.value = false;
  showResults.value = true;

  // 这里可以添加提交数据到服务器的逻辑
  console.log('提交的答案:', userAnswers.value);
};

const calculateScore = () => {
  score.value = 0;
  for (let i = 0; i < questions.value.length; i++) {
    if (userAnswers.value[i] === questions.value[i].answer) {
      score.value++;
    }
  }
};

const restartQuiz = () => {
  currentQuestionIndex.value = 0;
  selectedAnswer.value = '';
  userAnswers.value = {};
  showResults.value = false;
  reviewMode.value = false;
  score.value = 0;
};

// 生命周期钩子
onMounted(() => {
  // 预留从API或文件加载数据接口
  questions.value = parseQuestions(localQuizData);
});
</script>

<style scoped>
.container {
  margin-top: 80px;
}

.quiz-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.quiz-card {
  margin-bottom: 20px;
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
  color: #409EFF;
}

.question-text {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 20px;
  line-height: 1.6;
}

.tag-highlight {
  background-color: #ecf5ff;
  color: #409EFF;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
  margin: 0 2px;
  display: inline-block;
}

.answer-section {
  margin-bottom: 30px;
}

.option-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-button {
  width: 100%;
  height: auto;
  padding: 12px 15px;
  text-align: left;
  border-radius: 6px;
  transition: all 0.3s;
}

.option-content {
  display: flex;
  align-items: flex-start;
  width: 100%;
}

.option-label {
  font-weight: bold;
  margin-right: 10px;
  font-size: 16px;
  min-width: 20px;
  flex: 2;
}

.option-text {
  flex: 8;
  font-size: 16px;
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
  border: 1px solid #EBEEF5;
}

.user-selected {
  background-color: #ebf5f9;
  border-color: #d8e3f3;
}

.correct-answer {
  background-color: #f0f9eb;
  border-color: #67C23A;
  color: #67C23A;
}

.explanation {
  margin-top: 15px;
}

.correct-answer-label {
  margin-bottom: 10px;
}

.restart-button {
  display: block;
  margin: 20px auto;
  width: 200px;
}
</style>