import { useState, useEffect } from 'react'
import '../styles/Perfil.css'
import ConfirmModal from './ConfirmModal'

function Seguidores({ getSeguidoresUser, onDelete }) {
    const [userSeguidor, setUserSeguidor] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [userSelecionado, setUserSelecionado] = useState(null)

    useEffect(() => {
        getSeguidoresUser().then(res => setUserSeguidor(res.data))
    }, [getSeguidoresUser])

    const abrirModal = (userId) => {
        setUserSelecionado(userId)
        setShowModal(true)
    }

    const confirmarDelete = async () => {
        try {
            await onDelete(userSelecionado)

            setUserSeguidor(prev =>
                prev.filter(item => item.userId !== userSelecionado)
            )

            setShowModal(false)
            setUserSelecionado(null)
        } catch (error) {
            console.error("Erro ao deletar:", error)
        }
    }

    const cancelar = () => {
        setShowModal(false)
        setUserSelecionado(null)
    }

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

           
            <ConfirmModal
                isOpen={showModal}
                message="Tem certeza que deseja remover este usuário?"
                onConfirm={confirmarDelete}
                onCancel={cancelar}
            />
        </div>
    )
}

export default Seguidores
