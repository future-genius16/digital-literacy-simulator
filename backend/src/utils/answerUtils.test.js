const test = require("node:test")
const assert = require("node:assert/strict")

const {
  normalizeArray,
  isSingleChoiceCorrect,
  isMultiSelectCorrect,
  isSequenceCorrect,
  calculatePercentage,
  getResultRecommendation,
} = require("./answerUtils")

test("normalizeArray returns array unchanged", () => {
  assert.deepEqual(normalizeArray(["option_a", "option_b"]), [
    "option_a",
    "option_b",
  ])
})

test("normalizeArray parses JSON string array", () => {
  assert.deepEqual(normalizeArray('["option_a","option_b"]'), [
    "option_a",
    "option_b",
  ])
})

test("normalizeArray returns empty array for invalid value", () => {
  assert.deepEqual(normalizeArray(null), [])
  assert.deepEqual(normalizeArray("not-json"), [])
  assert.deepEqual(normalizeArray({ option: "option_a" }), [])
})

test("isSingleChoiceCorrect returns true for matching option", () => {
  assert.equal(isSingleChoiceCorrect("option_a", "option_a"), true)
})

test("isSingleChoiceCorrect returns false for wrong option", () => {
  assert.equal(isSingleChoiceCorrect("option_b", "option_a"), false)
})

test("isSingleChoiceCorrect returns false for empty values", () => {
  assert.equal(isSingleChoiceCorrect(null, "option_a"), false)
  assert.equal(isSingleChoiceCorrect("option_a", null), false)
})

test("isMultiSelectCorrect ignores order of selected options", () => {
  assert.equal(
    isMultiSelectCorrect(
      ["option_b", "option_a"],
      ["option_a", "option_b"]
    ),
    true
  )
})

test("isMultiSelectCorrect returns false when one correct option is missing", () => {
  assert.equal(
    isMultiSelectCorrect(
      ["option_a"],
      ["option_a", "option_b"]
    ),
    false
  )
})

test("isMultiSelectCorrect supports one correct answer", () => {
  assert.equal(
    isMultiSelectCorrect(
      ["option_a"],
      ["option_a"]
    ),
    true
  )
})

test("isSequenceCorrect respects order", () => {
  assert.equal(
    isSequenceCorrect(
      ["option_a", "option_b", "option_c"],
      ["option_a", "option_b", "option_c"]
    ),
    true
  )
})

test("isSequenceCorrect returns false for wrong order", () => {
  assert.equal(
    isSequenceCorrect(
      ["option_b", "option_a", "option_c"],
      ["option_a", "option_b", "option_c"]
    ),
    false
  )
})

test("calculatePercentage returns rounded percentage", () => {
  assert.equal(calculatePercentage(3, 4), 75)
  assert.equal(calculatePercentage(2, 3), 67)
})

test("calculatePercentage returns 0 when total is zero", () => {
  assert.equal(calculatePercentage(3, 0), 0)
})

test("getResultRecommendation returns high result message", () => {
  const result = getResultRecommendation(85)

  assert.equal(result.title, "Отличный результат")
})

test("getResultRecommendation returns medium result message", () => {
  const result = getResultRecommendation(60)

  assert.equal(result.title, "Хорошая попытка")
})

test("getResultRecommendation returns low result message", () => {
  const result = getResultRecommendation(30)

  assert.equal(result.title, "Тренировка завершена")
})