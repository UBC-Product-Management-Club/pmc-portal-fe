import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const localEmail = localStorage.getItem("email");

async function enterEmail() {
    const { email } = useParams<{ email: string }>(); // takes value of email

    return (
        <div className="background-popup">

        </div>
    );
}

export default enterEmail;