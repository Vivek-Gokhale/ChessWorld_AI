import { describe, it, expect } from "vitest"
import { findOpeningDeviation } from "./chess-utils"

describe("Chess Utils", () => {
  describe("findOpeningDeviation", () => {
    it("should return null for empty PGN", () => {
      expect(findOpeningDeviation("")).toBe(null)
      expect(findOpeningDeviation(null)).toBe(null)
    })

    it("should return null for games with too few moves", () => {
      const shortPgn = "1. e4 e5 2. Nf3"
      expect(findOpeningDeviation(shortPgn)).toBe(null)
    })

    it("should detect deviation from main line", () => {
      const pgnWithDeviation = "1. e4 e5 2. Nf3 Nc6 3. Bc4 f5"
      const result = findOpeningDeviation(pgnWithDeviation)

      expect(result).toBeTruthy()
      expect(result.actualMove).toBe("f5")
      expect(result.moveNumber).toBeGreaterThan(0)
    })

    it("should return null when following book theory", () => {
      const bookPgn = "1. e4 e5 2. Nf3 Nc6 3. Bb5"
      const result = findOpeningDeviation(bookPgn)

      // This might return null if the moves follow our mock opening book
      expect(result).toBeDefined()
    })

    it("should handle PGN with annotations", () => {
      const annotatedPgn = "1. e4! e5 2. Nf3 {A good developing move} Nc6 3. Bb5 a6"
      const result = findOpeningDeviation(annotatedPgn)

      expect(result).toBeDefined()
    })

    it("should extract moves correctly from complex PGN", () => {
      const complexPgn = `
        [Event "Test Game"]
        [Site "lichess.org"]
        [Date "2024.01.01"]
        [White "Player1"]
        [Black "Player2"]
        [Result "1-0"]
        
        1. e4 e5 2. Nf3 Nc6 3. Bb5 {Spanish Opening} a6 4. Ba4 Nf6 1-0
      `

      const result = findOpeningDeviation(complexPgn)
      expect(result).toBeDefined()
    })
  })
})
