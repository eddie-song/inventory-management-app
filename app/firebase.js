import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyA0ixkxFq4iITOCKxy0NytQJxBKxHTt8Mw",
    authDomain: "inventory-management-app-1c89c.firebaseapp.com",
    projectId: "inventory-management-app-1c89c",
    storageBucket: "inventory-management-app-1c89c.appspot.com",
    messagingSenderId: "309505297810",
    appId: "1:309505297810:web:5f6e599d432c903b33054b",
    measurementId: "G-PL6LSY414D"
  };
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };