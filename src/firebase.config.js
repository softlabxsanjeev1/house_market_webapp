import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyD1nYLbnPL2aStTf6wN8GfV_3BnTvC83gs",
    authDomain: "house-market-2ed49.firebaseapp.com",
    projectId: "house-market-2ed49",
    storageBucket: "house-market-2ed49.appspot.com",
    messagingSenderId: "505764093005",
    appId: "1:505764093005:web:0b51442a50716d9bc71004"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore();