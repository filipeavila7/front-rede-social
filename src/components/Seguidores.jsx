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
                        <p>{dados.nome}</p>
                    </div>

                    <div className='delete-container'>
                        <img
                            onClick={() => abrirModal(dados.userId)}
                            src="/x.png"
                            alt=""
                            className="delete-icon"
                        />
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