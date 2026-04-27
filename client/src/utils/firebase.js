
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth"


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "gogleexamnotesai.firebaseapp.com",
  projectId: "gogleexamnotesai",
  storageBucket: "gogleexamnotesai.firebasestorage.app",
  messagingSenderId: "567294996023",
  appId: "1:567294996023:web:aee2f6f6d2730b324d99b2"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider =new GoogleAuthProvider()
export { auth, provider }