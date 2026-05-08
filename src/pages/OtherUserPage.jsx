import OtherPerfil from "../components/OtherPerfil"
import PostsOther from "../components/PostsOther"
import { useParams } from "react-router-dom"
function OtherUserPage(){
    const { userName } = useParams()
    return(
        <main className="perfil-layout">
            <OtherPerfil/>
            <PostsOther key={userName}/>
        </main>
    )
}

export default OtherUserPage
