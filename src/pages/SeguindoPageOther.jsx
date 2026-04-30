import HeaderSeguidores from "../components/HeaderSeguidores";
import Seguidores from "../components/Seguidores";
import SeguidoresOther from "../components/SeguidoresOther";
import api from "../service/api";
import { useNavigate, useParams } from 'react-router-dom'

function SeguindoPageOther() {
    const {id} = useParams()
    return (
        <main>
            <HeaderSeguidores />
            <SeguidoresOther
                getSeguidoresUser={() => api.get(`/users/${id}/following`)}
            />
        </main>
    );
}

export default SeguindoPageOther;
