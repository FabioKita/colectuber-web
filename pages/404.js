import React from "react";
import ErrorPage from "components/error-page";

export default function Error404(){
    return(
        <ErrorPage errorCode={404}></ErrorPage>
    )
}