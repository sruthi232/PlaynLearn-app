// Test Redemption Creator
// Run this in browser console to create a test redemption

const testRedemption = {
  id: "test_" + Date.now(),
  studentId: "student_001",
  productId: "test_product",
  productName: "Test Reward",
  coinsRedeemed: 100,
  timestamp: Date.now(),
  expiryDate: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days from now
  oneTimeToken: "test_token_" + Date.now(),
  redemptionCode: "EDU-TEST-1234",
  status: "pending"
};

// Save to localStorage
const studentId = "student_001";
const storageKey = `student_redemptions_${studentId}`;
const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
existing.push(testRedemption);
localStorage.setItem(storageKey, JSON.stringify(existing));

console.log("Test redemption created:", testRedemption);
console.log("Use code: EDU-TEST-1234");