import { useState, useEffect } from 'react'
import '../styles/Perfil.css'


function SeguidoresOther({ getSeguidoresUser, onDelete }) {
    const [userSeguidor, setUserSeguidor] = useState([])
    const [userSelecionado, setUserSelecionado] = useState(null)

    useEffect(() => {
        getSeguidoresUser().then(res => setUserSeguidor(res.data))
    }, [getSeguidoresUser])


    return (
        <div className='seguidor-layout'>
            {userSeguidor.map((dados) => (
                <div className='seguidor-container' key={dados.userId}>
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

                    <div className='delete-container'>
                        <button
                            type="button"
                            className="delete-button"
                            onClick={() => abrirModal(dados.userId)}
                        >
                            <img
                                src="/close.png"
                                alt="Remover usuario"
                                className="delete-icon"
                            />
                        </button>
                    </div>
                </div>
            ))}

           
            
        </div>
    )
}

export default SeguidoresOther
