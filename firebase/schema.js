// Challenges Collection Schema
const challengeSchema = {
  title: String,          // Challenge title
  description: String,    // Challenge description
  category: String,       // Challenge category (Cardio, Strength, etc.)
  difficulty: String,     // Difficulty level
  prizeMoney: Number,     // Prize pool in ETH
  deadline: Timestamp,    // Challenge end date
  image: String,          // Challenge image URL
  createdBy: String,      // User ID who created the challenge
  createdAt: Timestamp,   // Creation timestamp
  status: String,         // active, completed, cancelled
  participants: Number,   // Number of participants
  progress: Number,       // Overall progress (0-1)
  rules: Array,          // Challenge rules/requirements
  rewards: Object,       // Reward distribution structure
  joinedUsers: Array,    // Array of user IDs who joined
};

// User Challenges Collection Schema (for tracking user progress)
const userChallengeSchema = {
  userId: String,        // User ID
  challengeId: String,   // Challenge ID
  progress: Number,      // User's progress (0-1)
  joinedAt: Timestamp,   // When user joined
  status: String,        // active, completed, dropped
  achievements: Array,   // Milestones reached
  dailyStats: Array,    // Daily progress records
}; 