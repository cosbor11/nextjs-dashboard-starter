'use client'

import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/Footer"
import LoadingOverlay from "@/components/LoadingOverlay";
import { useEffect, useState } from "react";


export default function SignInWithGoogle() {
    const { signInWithGoogle, handleRedirectResult, authCheckCompleted, onLoginResponse} = useAuth();
    const [ signingIn, setSigningIn] = useState(false);

    useEffect(() => {
        if(authCheckCompleted){
            handleRedirectResult().then(result => {
                if(result && result.user){
                    onLoginResponse(result)
                } else if (!signingIn){
                    setSigningIn(true);
                    signInWithGoogle();
                }
            })
        }
        }, [authCheckCompleted, handleRedirectResult, onLoginResponse, signInWithGoogle, signingIn]);

    return (
        <>
            <main className="flex min-h-screen flex-col items-center">
                <LoadingOverlay />
            </main>
            <Footer />
        </>

    )

}



