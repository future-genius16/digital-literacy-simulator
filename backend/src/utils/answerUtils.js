const normalizeArray = (value) => {
  if (!value) {
    return []
  }

  if (Array.isArray(value)) {
    return value
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  return []
}

const isSingleChoiceCorrect = (selectedOption, correctOption) => {
  if (!selectedOption || !correctOption) {
    return false
  }

  return selectedOption === correctOption
}

const isMultiSelectCorrect = (selectedOptions, correctOptions) => {
  const normalizedSelected = normalizeArray(selectedOptions)
  const normalizedCorrect = normalizeArray(correctOptions)

  if (normalizedSelected.length !== normalizedCorrect.length) {
    return false
  }

  const selectedSorted = [...normalizedSelected].sort()
  const correctSorted = [...normalizedCorrect].sort()

  return selectedSorted.every(
    (optionKey, index) => optionKey === correctSorted[index]
  )
}

const isSequenceCorrect = (selectedOptions, correctOptions) => {
  const normalizedSelected = normalizeArray(selectedOptions)
  const normalizedCorrect = normalizeArray(correctOptions)

  if (normalizedSelected.length !== normalizedCorrect.length) {
    return false
  }

  return normalizedSelected.every(
    (optionKey, index) => optionKey === normalizedCorrect[index]
  )
}

const calculatePercentage = (score, totalQuestions) => {
  if (!totalQuestions || totalQuestions <= 0) {
    return 0
  }

  return Math.round((score / totalQuestions) * 100)
}

const getResultRecommendation = (percentage) => {
  if (percentage >= 80) {
    return {
      title: "Отличный результат",
      text: "Раздел можно считать подготовленным. Можно переходить к следующему заданию НЭ.",
    }
  }

  if (percentage >= 50) {
    return {
      title: "Хорошая попытка",
      text: "Часть тем уже понятна, но стоит разобрать ошибки и пройти тренировку ещё раз.",
    }
  }

  return {
    title: "Тренировка завершена",
    text: "Рекомендуем повторить материалы по этому заданию и попробовать ещё раз.",
  }
}

module.exports = {
  normalizeArray,
  isSingleChoiceCorrect,
  isMultiSelectCorrect,
  isSequenceCorrect,
  calculatePercentage,
  getResultRecommendation,
}