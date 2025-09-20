export const JHARKHAND_ZONES = [
  { id: "ranchi", name: "Ranchi", districts: ["Ranchi", "Khunti", "Lohardaga"] },
  { id: "dhanbad", name: "Dhanbad", districts: ["Dhanbad", "Bokaro", "Giridih"] },
  { id: "jamshedpur", name: "Jamshedpur", districts: ["East Singhbhum", "West Singhbhum", "Seraikela-Kharsawan"] },
  { id: "hazaribagh", name: "Hazaribagh", districts: ["Hazaribagh", "Chatra", "Koderma"] },
  { id: "deoghar", name: "Deoghar", districts: ["Deoghar", "Dumka", "Jamtara"] },
  { id: "palamu", name: "Palamu", districts: ["Palamu", "Latehar", "Garhwa"] },
]

export const MINISTRIES = [
  { id: "urban_dev", name: "Urban Development", departments: ["Municipal Corporation", "Town Planning", "Housing"] },
  { id: "rural_dev", name: "Rural Development", departments: ["Panchayati Raj", "Rural Infrastructure", "MGNREGA"] },
  {
    id: "environment",
    name: "Environment & Forest",
    departments: ["Pollution Control", "Forest Conservation", "Wildlife"],
  },
  { id: "transport", name: "Transport", departments: ["Road Transport", "Public Works", "Traffic Management"] },
  { id: "water", name: "Water Resources", departments: ["Water Supply", "Irrigation", "Drainage"] },
]

export const ISSUE_CATEGORIES = [
  { id: "pothole", name: "Pothole", ministry: "transport", icon: "🕳️" },
  { id: "streetlight", name: "Street Light", ministry: "urban_dev", icon: "💡" },
  { id: "garbage", name: "Garbage/Waste", ministry: "urban_dev", icon: "🗑️" },
  { id: "water", name: "Water Supply", ministry: "water", icon: "💧" },
  { id: "electricity", name: "Electricity", ministry: "urban_dev", icon: "⚡" },
  { id: "other", name: "Other", ministry: "urban_dev", icon: "📝" },
]

export const CITIZEN_LEVELS = [
  { level: 1, name: "Newcomer", minPoints: 0, maxPoints: 99, color: "bg-gray-500" },
  { level: 2, name: "Contributor", minPoints: 100, maxPoints: 299, color: "bg-blue-500" },
  { level: 3, name: "Advocate", minPoints: 300, maxPoints: 599, color: "bg-green-500" },
  { level: 4, name: "Champion", minPoints: 600, maxPoints: 999, color: "bg-yellow-500" },
  { level: 5, name: "Guardian", minPoints: 1000, maxPoints: 1999, color: "bg-purple-500" },
  { level: 6, name: "Legend", minPoints: 2000, maxPoints: Number.POSITIVE_INFINITY, color: "bg-red-500" },
]

export const POINT_SYSTEM = {
  REPORT_SUBMITTED: 10,
  REPORT_ACKNOWLEDGED: 5,
  ISSUE_RESOLVED: 50,
  FIRST_REPORT_BONUS: 25,
  WEEKLY_STREAK: 20,
  MONTHLY_STREAK: 100,
}
