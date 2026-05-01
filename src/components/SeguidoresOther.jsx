import { useState, useEffect } from 'react'
import '../styles/Perfil.css'
import { useLocation, useNavigate } from 'react-router-dom'

function SeguidoresOther({ getSeguidoresUser}) {
    const [userSeguidor, setUserSeguidor] = useState([])
    const navigate = useNavigate()
    const location = useLocation()
    const currentProfilePath = location.state?.profilePath ?? null
    const backStack = location.state?.backStack ?? []
    useEffect(() => {
        getSeguidoresUser().then(res => setUserSeguidor(res.data))
    }, [getSeguidoresUser])


    return (
        <div className='seguidor-layout'>
            {userSeguidor.map((dados) => (
                
                <div
                    onClick={() => navigate(`/profile/${dados.userId}/${dados.UserName}`, {
                        state: {
                            backStack: [
                                ...backStack,
                                {
                                    path: location.pathname,
                                    profilePath: currentProfilePath
                                }
                            ]
                        }
                    })}
                    className='seguidor-container' key={dados.userId}>
                    <div className="img-seguidor-container">
                        <img
                            className='seguidor-img'
                            src={dados?.imageUrlProfile || "/null.png"}
                            alt=""
                        />
                    </div>

                    <div className='dados-seguidor'>
                        <p className="seguidor-nome">{dados.nome}</p>
                        <span className="seguidor-legenda">Perfil conectado com voce</span>
                    </div>

         
                </div>
            ))}

           
            
        </div>
    )
}

export default SeguidoresOther
