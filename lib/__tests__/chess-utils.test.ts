import { describe, it, expect } from "vitest"
import { findOpeningDeviation, formatDate, formatTimeControl } from "../chess-utils"

describe("chess-utils", () => {
  describe("findOpeningDeviation", () => {
    it("should detect deviation from theory", () => {
      const moves = ["e4", "e5", "Bc4"] // Deviates from common King's Pawn theory
      const opening = { eco: "C20", name: "King's Pawn Game" }

      const result = findOpeningDeviation(moves, opening)
      expect(result.deviationMove).toBeGreaterThanOrEqual(0)
    })

    it("should handle unknown openings", () => {
      const moves = ["e4", "e5"]
      const opening = { eco: "Z99", name: "Unknown Opening" }

      const result = findOpeningDeviation(moves, opening)
      expect(result.deviationMove).toBe(0)
    })
  })

  describe("formatDate", () => {
    it("should format timestamp correctly", () => {
      const timestamp = 1640995200000 // Jan 1, 2022
      const formatted = formatDate(timestamp)
      expect(formatted).toMatch(/Jan 1, 2022/)
    })
  })

  describe("formatTimeControl", () => {
    it("should format time controls correctly", () => {
      expect(formatTimeControl("bullet")).toBe("Bullet")
      expect(formatTimeControl("blitz")).toBe("Blitz")
      expect(formatTimeControl("rapid")).toBe("Rapid")
      expect(formatTimeControl("classical")).toBe("Classical")
    })
  })
})
