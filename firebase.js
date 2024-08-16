// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMeOrlgeJjkfuRbXs1idv9-imCJomCoEQ",
  authDomain: "flashcards-8b2aa.firebaseapp.com",
  projectId: "flashcards-8b2aa",
  storageBucket: "flashcards-8b2aa.appspot.com",
  messagingSenderId: "944986252414",
  appId: "1:944986252414:web:5f2372c0a1b99ad0dca42f",
  measurementId: "G-YC7EVEVPG5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);