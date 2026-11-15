const PASSING_PERCENTAGE = 67

function isArray(value) {
  return Array.isArray(value)
}

export function validateQuizData(data) {
  if (
    typeof data !== 'object' ||
    data === null ||
    isArray(data)
  ) {
    return false
  }

  if (
    typeof data.quizTitle !== 'string' ||
    data.quizTitle.trim() === ''
  ) {
    return false
  }

  if (
    !isArray(data.correctAnswers) ||
    data.correctAnswers.length === 0
  ) {
    return false
  }

  if (
    !isArray(data.attempts) ||
    data.attempts.length === 0
  ) {
    return false
  }

  for (const attempt of data.attempts) {
    if (
      typeof attempt !== 'object' ||
      attempt === null ||
      isArray(attempt)
    ) {
      return false
    }

    if (
      typeof attempt.name !== 'string' ||
      attempt.name.trim() === ''
    ) {
      return false
    }

    if (
      !isArray(attempt.answers) ||
      attempt.answers.length !== data.correctAnswers.length
    ) {
      return false
    }
  }

  return true
}

export function calculateAttempt(attempt, correctAnswers) {
  let score = 0

  correctAnswers.forEach((correctAnswer, index) => {
    if (attempt.answers[index] === correctAnswer) {
      score += 1
    }
  })

  const percentage = Math.round((score / correctAnswers.length) * 100)
  const passed = percentage >= PASSING_PERCENTAGE

  return {
    name: attempt.name.trim(),
    score,
    percentage,
    passed,
  }
}

export function calculateReport(data) {
  const attempts = data.attempts.map((attempt) =>
    calculateAttempt(attempt, data.correctAnswers)
  )

  const participantCount = attempts.length

  const averagePercentage = Math.round(
    attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) /
      participantCount
  )

  const passedCount = attempts.filter((attempt) => attempt.passed).length

  let best = attempts[0]

  for (const attempt of attempts) {
    if (attempt.score > best.score) {
      best = attempt
    }
  }

  return {
    quizTitle: data.quizTitle.trim(),
    questionCount: data.correctAnswers.length,
    participantCount,
    averagePercentage,
    passedCount,
    threshold: PASSING_PERCENTAGE,
    best,
    attempts,
  }
}