import Seguidores from "../components/Seguidores"
import api from "../service/api"

function SeguidoresPage(){
    return(
        <main>
            <Seguidores onDelete={(userId) => api.delete(`/users/followers/${userId}`)} getSeguidoresUser={() => api.get("/profiles/followers")}/>
        </main>
       
    )
}

export default SeguidoresPage