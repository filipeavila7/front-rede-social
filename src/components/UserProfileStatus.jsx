import api from '../service/api';
import '../styles/CardSeguidores.css'
import { useEffect, useState } from "react";

function UserProfileStatus() {
    const [me, setMe] = useState(null)
    const [statusText, setStatusText] = useState("")

    async function sendStatus() {
        try {
            await api.put('/profiles/me', {
                bio: me?.bio || "",
                imageUrlProfile: me?.imageUrlProfile || null,
                messageStatus: statusText
            })

            getMyProfile()
        } catch (error) {
            console.log(error)
        }
    }

    async function getMyProfile() {
        try {
            const res = await api.get('/profiles/me')
            setMe(res.data)
            setStatusText(res.data.messageStatus || "")
        } catch (error) {
            console.log(error)
        }
    }

    

    function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        sendStatus()
    }
}

    useEffect(() => {
        getMyProfile()
    }, [])

    return (
        <>
            {me && (
                <div className="cards-content">

                    {me.messageStatus?.trim() ? (
                        <div className="message-status">
                            <textarea
                                type="text"
                                className='message-status-input-ativa'
                                value={statusText}
                                onChange={(e) => setStatusText(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                    ) : (
                        <input
                            type="text"
                            className='message-status-input'
                            placeholder='Uma opinião?'
                            value={statusText}
                            onChange={(e) => setStatusText(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    )}

                    <div className="img-container">
                        <img
                            className='imageCard'
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

export default UserProfileStatus;
