import HeaderSeguidoresOther from "../components/HeaderSeguidoresOther";
import SeguidoresOther from "../components/SeguidoresOther";
import api from "../service/api";
import { useNavigate, useParams } from 'react-router-dom'

function SeguidoresPageOther() {
    const {id} = useParams()

    return (
        <main>
            <HeaderSeguidoresOther />
            <SeguidoresOther
                getSeguidoresUser={() => api.get(`/users/${id}/followers`)}
            />
        </main>
    );
}

export default SeguidoresPageOther;
