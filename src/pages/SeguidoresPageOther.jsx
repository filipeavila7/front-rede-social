import HeaderSeguidores from "../components/HeaderSeguidores";
import SeguidoresOther from "../components/SeguidoresOther";
import api from "../service/api";
import { useNavigate, useParams } from 'react-router-dom'

function SeguidoresPageOther() {
    const {id} = useParams()

    return (
        <main>
            <HeaderSeguidores />
            <SeguidoresOther
                getSeguidoresUser={() => api.get(`/users/${id}/followers`)}
            />
        </main>
    );
}

export default SeguidoresPageOther;
