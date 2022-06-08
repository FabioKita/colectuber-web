import ErrorPage from "components/error-page";


export default function Error500(){
    return(
        <ErrorPage errorCode={500}></ErrorPage>
    )
}