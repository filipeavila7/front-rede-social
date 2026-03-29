import api from '../service/api';
import '../styles/CardSeguidores.css'
import { useEffect, useState} from "react";


function UserProfileStatus() {
    const [me, setMe] = useState(null)
    async function getMyProfile() {
        const res = await api.get('/profiles/me')
        setMe(res.data)
    }

    useEffect(() => {
        getMyProfile()

    }, [])



    return (
        <>
            {me && (
                <div className="cards-content">

                    {me.messageStatus?.trim() && (
                        <div className="message-status">
                            <p>{me.messageStatus}</p>
                        </div>
                    )}

                    <div className="img-container">
                        <img className='imageCard'
                            src={me.imageUrlProfile ? me.imageUrlProfile : "/null.png"}
                            alt={me.nome}
                        />
                    </div>

                    <div className="name">
                        <p>{me.nome} (Você)</p>
                    </div>

                </div>
            )}
        </>
    );
}

export default UserProfileStatus