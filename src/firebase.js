import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1xlw7Z1IkIn10Wjh6t82vY2tYp2o7CT8",
  authDomain: "team-collaboration-kanban.firebaseapp.com",
  projectId: "team-collaboration-kanban",
  storageBucket: "team-collaboration-kanban.firebasestorage.app",
  messagingSenderId: "1001888623492",
  appId: "1:1001888623492:web:dfd41da02e40e85f480bd1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);