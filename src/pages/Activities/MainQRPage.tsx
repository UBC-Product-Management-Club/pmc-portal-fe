import React, { useEffect, useState } from "react";
import { useAuth } from "../../providers/Auth/AuthProvider";
import enterEmail, { localEmail } from "./EnterEmail";


export function mainQRPage() {
    // const { isSignedIn, userData } = useAuth();
    if (localEmail != null) {
        // prompt user to enter email
        useEffect(() => {
            enterEmail();
        }, []);
    } else {

    }
}

