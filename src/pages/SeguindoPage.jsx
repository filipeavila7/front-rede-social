import HeaderSeguidores from "../components/HeaderSeguidores";
import Seguidores from "../components/Seguidores";
import api from "../service/api";

function SeguindoPage() {
    return (
        <main>
            <HeaderSeguidores />
            <Seguidores
                onDelete={(userId) => api.delete(`/users/${userId}/follow`)}
                getSeguidoresUser={() => api.get("/profiles/following")}
            />
        </main>
    );
}

export default SeguindoPage;
