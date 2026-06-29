import dotenv from "dotenv";
import { connectToDatabase } from "./utils/db.js";
import Student from "./models/Student.js";
import Teacher from "./models/Teacher.js";
import Classroom from "./models/Class.js";
import Assignment from "./models/Assignment.js";
import Submission from "./models/Submission.js";
import Exam from "./models/Exam.js";
import Attendance from "./models/Attendance.js";
import ExamResult from "./models/ExamResult.js";
import Bus from "./models/Bus.js";
import BusStop from "./models/BusStop.js";
import BusAttendance from "./models/BusAttendance.js";
import Transaction from "./models/Transaction.js";
import Event from "./models/Event.js";
import Notification from "./models/Notification.js";
import Asset from "./models/Asset.js";
import Setting from "./models/Setting.js";
import Report from "./models/Report.js";
import Message from "./models/Message.js";
import Parent from "./models/Parent.js";
import MaintenanceRequest from "./models/MaintenanceRequest.js";
import Staff from "./models/Staff.js";
import StaffTask from "./models/StaffTask.js";
import StaffAttendance from "./models/StaffAttendance.js";
import StaffLeave from "./models/StaffLeave.js";
import StaffPayroll from "./models/StaffPayroll.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

async function run() {
  await connectToDatabase();

  // Clear existing
  await Promise.all([
    Student.deleteMany({}),
    Teacher.deleteMany({}),
    Classroom.deleteMany({}),
    Assignment.deleteMany({}),
    Submission.deleteMany({}),
    Exam.deleteMany({}),
    Attendance.deleteMany({}),
    ExamResult.deleteMany({}),
    Bus.deleteMany({}),
    BusStop.deleteMany({}),
    BusAttendance.deleteMany({}),
    Transaction.deleteMany({}),
    Event.deleteMany({}),
    Notification.deleteMany({}),
    Asset.deleteMany({}),
    Setting.deleteMany({}),
    Report.deleteMany({}),
    Message.deleteMany({}),
    Parent.deleteMany({}),
    Staff.deleteMany({}),
    StaffTask.deleteMany({}),
    StaffAttendance.deleteMany({}),
    StaffLeave.deleteMany({}),
    StaffPayroll.deleteMany({}),
    MaintenanceRequest.deleteMany({}),
    User.deleteMany({}),
  ]);

  // Students (idempotent upsert to avoid duplicate key errors)
  const studentSeed = [
    { studentId: "ST001", name: "John Doe", className: "10A", rollNo: "101", email: "john@school.com", phone: "+91 98765 43210", status: "Active" },
    { studentId: "ST002", name: "Sarah Smith", className: "10A", rollNo: "102", email: "sarah@school.com", phone: "+91 98765 43211", status: "Active" },
    { studentId: "ST003", name: "Mike Johnson", className: "10B", rollNo: "103", email: "mike@school.com", phone: "+91 98765 43212", status: "Active" },
    { studentId: "ST004", name: "Emily Davis", className: "9A", rollNo: "104", email: "emily@school.com", phone: "+91 98765 43213", status: "Active" },
    { studentId: "ST005", name: "David Wilson", className: "9B", rollNo: "105", email: "david@school.com", phone: "+91 98765 43214", status: "Inactive" },
  ];
  await Student.bulkWrite(
    studentSeed.map((s) => ({
      updateOne: {
        filter: { studentId: s.studentId },
        update: { $set: s },
        upsert: true,
      },
    }))
  );
  const students = await Student.find({ studentId: { $in: studentSeed.map((s) => s.studentId) } });

  // Teachers
  const teachers = await Teacher.insertMany([
    { name: "Dr. Sarah Johnson", subject: "Mathematics", classes: ["10A", "10B"], experienceYears: 15, email: "sarah.j@school.com", phone: "+91 98765 43210", status: "Active" },
    { name: "Mr. Robert Smith", subject: "Physics", classes: ["11A", "12A"], experienceYears: 12, email: "robert.s@school.com", phone: "+91 98765 43211", status: "Active" },
    { name: "Ms. Emily Brown", subject: "English", classes: ["9A", "9B", "10A"], experienceYears: 8, email: "emily.b@school.com", phone: "+91 98765 43212", status: "Active" },
    { name: "Dr. Michael Lee", subject: "Chemistry", classes: ["11B", "12B"], experienceYears: 20, email: "michael.l@school.com", phone: "+91 98765 43213", status: "On Leave" },
  ]);

  // Classes
  const classes = await Classroom.insertMany([
    { name: "Class 10A", studentsCount: 45, teacherName: "Dr. Sarah Johnson", subjectsCount: 8, timetable: [
      { day: "Monday", period: "08:30-09:30", subject: "Mathematics" },
      { day: "Tuesday", period: "10:30-11:30", subject: "Mathematics" },
    ] },
    { name: "Class 10B", studentsCount: 42, teacherName: "Dr. Sarah Johnson", subjectsCount: 8, timetable: [
      { day: "Monday", period: "10:00-11:00", subject: "Mathematics" },
      { day: "Wednesday", period: "08:30-09:30", subject: "Mathematics" },
    ] },
    { name: "Class 11A", studentsCount: 38, teacherName: "Ms. Emily Brown", subjectsCount: 9, timetable: [
      { day: "Monday", period: "11:30-12:30", subject: "Mathematics" },
      { day: "Tuesday", period: "12:00-13:00", subject: "Mathematics" },
    ] },
    { name: "Class 12A", studentsCount: 40, teacherName: "Mr. Robert Smith", subjectsCount: 9, timetable: [
      { day: "Tuesday", period: "09:00-10:00", subject: "Physics" },
      { day: "Wednesday", period: "10:00-11:00", subject: "Physics" },
    ] },
  ]);

  // Map teachers
  const teacherByName = Object.fromEntries(teachers.map((t) => [t.name, t]));

  // Staff
  const staff = await Staff.insertMany([
    { name: "Anita Sharma", role: "Lab Assistant", department: "Science", email: "anita.s@school.com", phone: "+91 90000 10001", status: "Active" },
    { name: "Rajiv Kumar", role: "Clerk", department: "Administration", email: "rajiv.k@school.com", phone: "+91 90000 10002", status: "Active" },
    { name: "Neha Verma", role: "Sports Coordinator", department: "Sports", email: "neha.v@school.com", phone: "+91 90000 10003", status: "On Leave" },
    { name: "Sanjay Gupta", role: "Maintenance", department: "Operations", email: "sanjay.g@school.com", phone: "+91 90000 10004", status: "Active" },
  ]);

  const staffByName = Object.fromEntries(staff.map((s) => [s.name, s]));

  // Staff tasks
  const staffTasks = await StaffTask.insertMany([
    { staffId: staffByName["Anita Sharma"]._id, title: "Setup lab PCs", dueDate: new Date("2025-01-12"), status: "In Progress" },
    { staffId: staffByName["Anita Sharma"]._id, title: "Inventory chemicals", dueDate: new Date("2025-01-14"), status: "Pending" },
    { staffId: staffByName["Rajiv Kumar"]._id, title: "Prepare admission files", dueDate: new Date("2025-01-11"), status: "Pending" },
    { staffId: staffByName["Sanjay Gupta"]._id, title: "Fix lab projector", dueDate: new Date("2025-01-10"), status: "In Progress" },
    { staffId: staffByName["Anita Sharma"]._id, title: "Organize lab shelves", dueDate: new Date("2025-01-16"), status: "Pending" },
    { staffId: staffByName["Rajiv Kumar"]._id, title: "Archive 2024 records", dueDate: new Date("2025-01-19"), status: "Pending" },
  ]);

  // Staff attendance (last few days)
  const staffAttendance = await StaffAttendance.insertMany([
    // Anita
    { staffId: staffByName["Anita Sharma"]._id, date: new Date("2025-01-08"), status: "Present", checkIn: "09:00", checkOut: "17:30" },
    { staffId: staffByName["Anita Sharma"]._id, date: new Date("2025-01-09"), status: "Present", checkIn: "09:05", checkOut: "17:25" },
    { staffId: staffByName["Anita Sharma"]._id, date: new Date("2025-01-10"), status: "Absent" },
    { staffId: staffByName["Anita Sharma"]._id, date: new Date("2025-01-11"), status: "Present", checkIn: "09:02", checkOut: "17:28" },
    { staffId: staffByName["Anita Sharma"]._id, date: new Date("2025-01-12"), status: "Present", checkIn: "09:01", checkOut: "17:20" },
    // Rajiv
    { staffId: staffByName["Rajiv Kumar"]._id, date: new Date("2025-01-08"), status: "Present", checkIn: "08:55", checkOut: "17:35" },
    { staffId: staffByName["Rajiv Kumar"]._id, date: new Date("2025-01-09"), status: "Present", checkIn: "09:10", checkOut: "17:20" },
    { staffId: staffByName["Rajiv Kumar"]._id, date: new Date("2025-01-10"), status: "Present", checkIn: "09:00", checkOut: "17:30" },
    { staffId: staffByName["Rajiv Kumar"]._id, date: new Date("2025-01-11"), status: "Present", checkIn: "09:03", checkOut: "17:27" },
    // Sanjay
    { staffId: staffByName["Sanjay Gupta"]._id, date: new Date("2025-01-08"), status: "Present", checkIn: "08:45", checkOut: "17:45" },
    { staffId: staffByName["Sanjay Gupta"]._id, date: new Date("2025-01-09"), status: "Present", checkIn: "08:50", checkOut: "17:40" },
    { staffId: staffByName["Sanjay Gupta"]._id, date: new Date("2025-01-10"), status: "Present", checkIn: "08:52", checkOut: "17:39" },
  ]);

  // Staff leaves
  const staffLeaves = await StaffLeave.insertMany([
    { staffId: staffByName["Neha Verma"]._id, fromDate: new Date("2025-01-12"), toDate: new Date("2025-01-13"), days: 2, reason: "Medical", status: "Approved" },
    { staffId: staffByName["Anita Sharma"]._id, fromDate: new Date("2025-01-20"), toDate: new Date("2025-01-20"), days: 1, reason: "Personal", status: "Pending" },
    { staffId: staffByName["Rajiv Kumar"]._id, fromDate: new Date("2025-01-18"), toDate: new Date("2025-01-18"), days: 1, reason: "Errand", status: "Approved" },
    { staffId: staffByName["Sanjay Gupta"]._id, fromDate: new Date("2025-01-22"), toDate: new Date("2025-01-23"), days: 2, reason: "Family", status: "Pending" },
  ]);

  // Staff payroll
  const staffPayroll = await StaffPayroll.insertMany([
    { staffId: staffByName["Anita Sharma"]._id, month: "Dec 2024", gross: 50000, deductions: 4800, net: 45200 },
    { staffId: staffByName["Anita Sharma"]._id, month: "Jan 2025", gross: 50000, deductions: 5000, net: 45000 },
    { staffId: staffByName["Anita Sharma"]._id, month: "Feb 2025", gross: 50000, deductions: 4700, net: 45300 },
    { staffId: staffByName["Rajiv Kumar"]._id, month: "Jan 2025", gross: 40000, deductions: 4200, net: 35800 },
    { staffId: staffByName["Rajiv Kumar"]._id, month: "Feb 2025", gross: 40000, deductions: 4100, net: 35900 },
    { staffId: staffByName["Rajiv Kumar"]._id, month: "Dec 2024", gross: 40000, deductions: 3900, net: 36100 },
    { staffId: staffByName["Sanjay Gupta"]._id, month: "Jan 2025", gross: 38000, deductions: 3900, net: 34100 },
    { staffId: staffByName["Sanjay Gupta"]._id, month: "Feb 2025", gross: 38000, deductions: 3800, net: 34200 },
  ]);

  // Assignments
  const assignments = await Assignment.insertMany([
    { title: "Chapter 5 - Algebra", className: "Class 10A", subject: "Mathematics", dueDate: new Date("2025-01-15"), teacherId: teacherByName["Dr. Sarah Johnson"]._id, status: "Active", submittedCount: 38, totalCount: 45 },
    { title: "Trigonometry Practice", className: "Class 10B", subject: "Mathematics", dueDate: new Date("2025-01-18"), teacherId: teacherByName["Dr. Sarah Johnson"]._id, status: "Active", submittedCount: 35, totalCount: 42 },
    { title: "Calculus Assignment", className: "Class 11A", subject: "Mathematics", dueDate: new Date("2025-01-20"), teacherId: teacherByName["Dr. Sarah Johnson"]._id, status: "Active", submittedCount: 28, totalCount: 38 },
    { title: "Statistics Project", className: "Class 12A", subject: "Physics", dueDate: new Date("2025-01-12"), teacherId: teacherByName["Mr. Robert Smith"]._id, status: "Completed", submittedCount: 40, totalCount: 40 },
  ]);

  // Submissions for first assignment
  await Submission.insertMany([
    { assignmentId: assignments[0]._id, studentName: "John Doe", className: "Class 10A", status: "Submitted" },
    { assignmentId: assignments[0]._id, studentName: "Sarah Smith", className: "Class 10A", status: "Submitted" },
    { assignmentId: assignments[0]._id, studentName: "Mike Johnson", className: "Class 10B", status: "Missing" },
  ]);

  // Exams
  const exams = await Exam.insertMany([
    { name: "Mid-term Exam", className: "Class 10A", subject: "Mathematics", date: new Date("2025-01-25"), maxMarks: 100, teacherId: teacherByName["Dr. Sarah Johnson"]._id, gradedCount: 0, totalCount: 45, status: "Upcoming" },
    { name: "Unit Test 3", className: "Class 10B", subject: "Mathematics", date: new Date("2025-01-20"), maxMarks: 50, teacherId: teacherByName["Dr. Sarah Johnson"]._id, gradedCount: 42, totalCount: 42, status: "Graded" },
    { name: "Final Exam", className: "Class 11A", subject: "Mathematics", date: new Date("2025-01-28"), maxMarks: 100, teacherId: teacherByName["Dr. Sarah Johnson"]._id, gradedCount: 0, totalCount: 38, status: "Upcoming" },
    { name: "Unit Test 2", className: "Class 12A", subject: "Physics", date: new Date("2025-01-15"), maxMarks: 50, teacherId: teacherByName["Mr. Robert Smith"]._id, gradedCount: 35, totalCount: 40, status: "Grading" },
  ]);

  // Attendance sample
  await Attendance.insertMany([
    { date: new Date("2025-01-10"), className: "Class 10A", subject: "Mathematics", teacherId: teacherByName["Dr. Sarah Johnson"]._id, entries: [
      { studentName: "John Doe", rollNo: "10A-001", present: true },
      { studentName: "Sarah Smith", rollNo: "10A-002", present: true },
      { studentName: "Mike Johnson", rollNo: "10A-003", present: false },
    ] },
    { date: new Date("2025-01-11"), className: "Class 10A", subject: "Mathematics", teacherId: teacherByName["Dr. Sarah Johnson"]._id, entries: [
      { studentName: "John Doe", rollNo: "10A-001", present: true },
      { studentName: "Sarah Smith", rollNo: "10A-002", present: true },
      { studentName: "Mike Johnson", rollNo: "10A-003", present: true },
    ] },
    { date: new Date("2025-01-12"), className: "Class 10B", subject: "Mathematics", teacherId: teacherByName["Dr. Sarah Johnson"]._id, entries: [
      { studentName: "John Doe", rollNo: "10B-001", present: true },
      { studentName: "Sarah Smith", rollNo: "10B-002", present: false },
      { studentName: "Mike Johnson", rollNo: "10B-003", present: true },
    ] },
  ]);

  // Buses
  const buses = await Bus.insertMany([
    { number: "Bus #12", route: "Route A - North Zone", students: 45, driver: "John Doe", status: "Active", maintenance: "Good" },
    { number: "Bus #15", route: "Route B - South Zone", students: 38, driver: "Mike Johnson", status: "Active", maintenance: "Due" },
    { number: "Bus #18", route: "Route C - East Zone", students: 42, driver: "Sarah Williams", status: "Active", maintenance: "Good" },
    { number: "Bus #22", route: "Route D - West Zone", students: 40, driver: "Robert Brown", status: "Maintenance", maintenance: "In Progress" },
  ]);

  const busByNumber = Object.fromEntries(buses.map((b) => [b.number, b]));

  // Bus stops
  const bus12Stops = await BusStop.insertMany([
    { busId: busByNumber["Bus #12"]._id, name: "Stop 1 - Main Gate", eta: "07:50", students: 12, order: 1 },
    { busId: busByNumber["Bus #12"]._id, name: "Stop 2 - Park Avenue", eta: "08:00", students: 15, order: 2 },
    { busId: busByNumber["Bus #12"]._id, name: "Stop 3 - Market Street", eta: "08:10", students: 18, order: 3 },
  ]);

  // Bus attendance sample
  await BusAttendance.insertMany([
    { busId: busByNumber["Bus #12"]._id, date: new Date("2025-01-10"), entries: [
      { studentName: "John Doe", stop: "Stop 1 - Main Gate", status: "Onboard" },
      { studentName: "Sarah Smith", stop: "Stop 2 - Park Avenue", status: "Onboard" },
      { studentName: "Mike Johnson", stop: "Stop 3 - Market Street", status: "Pending" },
    ] },
  ]);

  // Create a Parent with three children (first three students)
  const parent = await Parent.create({
    name: "Mr. James Johnson",
    email: "parent.johnson@school.com",
    phone: "+91 90000 00000",
    children: [students[0]._id, students[1]._id, students[2]._id],
    address: "45 Parent Street, Knowledge City",
    preferences: { emailNotifications: true, smsNotifications: true, pushNotifications: false },
  });

  // Transactions (Fees)
  const transactions = await Transaction.insertMany([
    { studentName: "John Doe", className: "10A", amount: 15000, type: "Tuition Fee", status: "Paid", date: new Date("2025-01-10") },
    { studentName: "Sarah Smith", className: "10A", amount: 12000, type: "Tuition Fee", status: "Paid", date: new Date("2025-01-09") },
    { studentName: "Mike Johnson", className: "10B", amount: 18000, type: "Annual Fee", status: "Pending", date: new Date("2025-01-08") },
    { studentName: "Emily Davis", className: "9A", amount: 3500, type: "Transport Fee", status: "Paid", date: new Date("2025-01-08") },
  ]);

  // Exam Results per student (simple set)
  const studentByName = Object.fromEntries(students.map((s) => [s.name, s]));
  const results = await ExamResult.insertMany([
    { studentId: studentByName["John Doe"]._id, className: "10A", examName: "Unit Test 2", subject: "Mathematics", score: 94, maxMarks: 100, percentage: 94, grade: "A", date: new Date("2025-01-10") },
    { studentId: studentByName["John Doe"]._id, className: "10A", examName: "Science Quiz", subject: "Science", score: 88, maxMarks: 100, percentage: 88, grade: "A-", date: new Date("2025-01-05") },
    { studentId: studentByName["Sarah Smith"]._id, className: "10A", examName: "English Essay", subject: "English", score: 92, maxMarks: 100, percentage: 92, grade: "A", date: new Date("2025-01-07") },
  ]);

  // Events
  const events = await Event.insertMany([
    { title: "Parent-Teacher Meeting", date: new Date("2025-01-15"), time: "10:00 AM", location: "Main Hall", attendees: 120, type: "Meeting", color: "from-blue-500 to-cyan-600" },
    { title: "Annual Sports Day", date: new Date("2025-01-20"), time: "09:00 AM", location: "Sports Ground", attendees: 850, type: "Event", color: "from-orange-500 to-amber-600" },
    { title: "Mid-term Exams", date: new Date("2025-01-25"), time: "08:30 AM", location: "All Classrooms", attendees: 1245, type: "Exam", color: "from-purple-500 to-pink-600" },
    { title: "Science Exhibition", date: new Date("2025-01-28"), time: "11:00 AM", location: "Science Block", attendees: 200, type: "Exhibition", color: "from-green-500 to-emerald-600" },
    { title: "Staff Training Workshop", date: new Date("2025-01-30"), time: "02:00 PM", location: "Conference Room", attendees: 85, type: "Training", color: "from-indigo-500 to-purple-600" },
  ]);

  // Notifications
  const notifications = await Notification.insertMany([
    { type: "alert", title: "System Alert", message: "Server maintenance scheduled tonight", unread: true },
    { type: "info", title: "New Admission", message: "5 new students registered", unread: true },
    { type: "success", title: "Fees Collected", message: "₹2,50,000 collected today", unread: false },
  ]);

  // Assets
  const assets = await Asset.insertMany([
    { name: "Classrooms", category: "Facility", count: 48, capacity: 2400, utilization: "95%", status: "Good", icon: "Home", color: "from-blue-500 to-cyan-600" },
    { name: "Science Labs", category: "Facility", count: 6, capacity: 180, utilization: "88%", status: "Good", icon: "Beaker", color: "from-purple-500 to-pink-600" },
    { name: "Library", category: "Facility", count: 2, capacity: 200, utilization: "75%", status: "Excellent", icon: "Library", color: "from-green-500 to-emerald-600" },
    { name: "Sports Facilities", category: "Facility", count: 4, capacity: 160, utilization: "82%", status: "Good", icon: "Trophy", color: "from-orange-500 to-amber-600" },
  ]);

  // Settings
  const settings = await Setting.insertMany([
    { key: "school.name", value: "EduManage High School" },
    { key: "school.code", value: "EHS2025" },
    { key: "school.address", value: "123 Education Street, Knowledge City" },
    { key: "school.email", value: "admin@edumanage.com" },
    { key: "school.phone", value: "+91 98765 43210" },
    { key: "notifications.email", value: true },
    { key: "notifications.sms", value: true },
    { key: "notifications.push", value: false },
  ]);

  // Reports
  const reports = await Report.insertMany([
    { title: "Student Performance Report", type: "Academic", lastGenerated: new Date("2025-01-10") },
    { title: "Financial Summary", type: "Finance", lastGenerated: new Date("2025-01-09") },
    { title: "Attendance Analysis", type: "Academic", lastGenerated: new Date("2025-01-08") },
    { title: "Transport Utilization", type: "Transport", lastGenerated: new Date("2025-01-07") },
    { title: "Teacher Performance", type: "HR", lastGenerated: new Date("2025-01-06") },
    { title: "Infrastructure Status", type: "Operations", lastGenerated: new Date("2025-01-05") },
  ]);

  // Messages
  const messages = await Message.insertMany([
    { from: "Parent - John Doe", to: "Admin", subject: "Regarding son's performance", body: "Please share the progress report.", unread: true },
    { from: "Teacher - Sarah Johnson", to: "Admin", subject: "Class 10A Progress Report", body: "Summary attached.", unread: true },
    { from: "Staff - Mike Williams", to: "Admin", subject: "Infrastructure maintenance", body: "Need approval for repairs.", unread: false },
    { from: "Parent - Emily Brown", to: "Admin", subject: "Fee payment query", body: "Payment not reflecting.", unread: false },
  ]);

  // Maintenance Requests
  const maintenance = await MaintenanceRequest.insertMany([
    { facility: "Computer Lab - Block A", issue: "AC Not Working", priority: "High", date: new Date("2025-01-10"), status: "Pending" },
    { facility: "Classroom 12B", issue: "Projector Repair", priority: "Medium", date: new Date("2025-01-09"), status: "In Progress" },
    { facility: "Library - Main Building", issue: "Water Leakage", priority: "High", date: new Date("2025-01-08"), status: "Completed" },
    { facility: "Sports Ground", issue: "Equipment Maintenance", priority: "Low", date: new Date("2025-01-07"), status: "Pending" },
  ]);

  // Seed verified users for easy testing of the 6 roles
  const hashedPassword = bcrypt.hashSync("password123", 10);
  await User.insertMany([
    { name: "Admin Founder", email: "admin@school.com", password: hashedPassword, role: "admin", verified: true },
    { name: "Teacher User", email: "teacher@school.com", password: hashedPassword, role: "teacher", verified: true },
    { name: "Student User", email: "student@school.com", password: hashedPassword, role: "student", verified: true },
    { name: "Parent User", email: "parent@school.com", password: hashedPassword, role: "parent", verified: true },
    { name: "Staff User", email: "staff@school.com", password: hashedPassword, role: "staff", verified: true },
    { name: "Transport User", email: "transport@school.com", password: hashedPassword, role: "transport", verified: true },
  ]);
  console.log("✓ Seeded auth users for all six roles (password: password123)");

  console.log("Seeded:", {
    students: students.length,
    teachers: teachers.length,
    classes: classes.length,
    assignments: assignments?.length || 0,
    exams: exams?.length || 0,
    examResults: results?.length || 0,
    buses: buses.length,
    busStops: (await BusStop.countDocuments({})),
    busAttendance: (await BusAttendance.countDocuments({})),
    transactions: transactions.length,
    events: events.length,
    notifications: notifications.length,
    assets: assets.length,
    settings: settings.length,
    reports: reports.length,
    messages: messages.length,
    maintenance: maintenance.length,
    staff: staff.length,
    staffTasks: staffTasks.length,
    staffAttendance: staffAttendance.length,
    staffLeaves: staffLeaves.length,
    staffPayroll: staffPayroll.length,
  });

  process.exit(0);
}

run().catch((e) => {
  console.error("Seed failed", e);
  process.exit(1);
});


