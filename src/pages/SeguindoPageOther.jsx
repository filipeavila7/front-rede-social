import HeaderSeguidoresOther from "../components/HeaderSeguidoresOther";
import Seguidores from "../components/Seguidores";
import SeguidoresOther from "../components/SeguidoresOther";
import api from "../service/api";
import { useNavigate, useParams } from 'react-router-dom'

function SeguindoPageOther() {
    const {id} = useParams()
    return (
        <main>
            <HeaderSeguidoresOther />
            <SeguidoresOther
                getSeguidoresUser={() => api.get(`/users/${id}/following`)}
            />
        </main>
    );
}

export default SeguindoPageOther;
