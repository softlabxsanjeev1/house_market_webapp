import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase.config'
// import { toast } from 'react-toastify'
import { FcGoogle } from 'react-icons/fc'


const OAuth = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const onGoogleAuthHandler = async () => {
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const user = result.user
            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)
            if (!docSnap.exists()) {
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp(),
                })
            }
            navigate("/")
        } catch (error) {
            alert("Problem with Google Auth")
        }
    }

    return (
        <div>
            <h6>Sign {location.pathname === "/signup" ? 'UP' : 'In'} with</h6>
            <button onClick={onGoogleAuthHandler}>
                <FcGoogle />
            </button>
        </div>
    )
}

export default OAuth