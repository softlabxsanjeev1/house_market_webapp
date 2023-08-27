import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";


const useAuthState = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [checkState, setCheckState] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoggedIn(true);
            }
            setCheckState(false);
        });
    });

    return {
        loggedIn, checkState
    };

}

export default useAuthState