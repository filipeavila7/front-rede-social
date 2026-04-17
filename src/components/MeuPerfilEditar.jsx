import '../styles/Perfil.css'
import api from '../service/api'
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function MeuPerfilEditar() {
    const [myProfile, setMyprofile] = useState(null)
    const navigate = useNavigate()
    const [novaImagem, setNovaImagem] = useState(null)

    const imputNovaImg = useRef()
    const imputNovoNome = useRef()
    const imputNovaBio = useRef()

    async function getMyProfile() {
        try {
            const res = await api.get('/profiles/me')
            setMyprofile(res.data)
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    function handleImageChange(e) {
        const file = e.target.files[0]

        if (file) {
            const imageUrl = URL.createObjectURL(file)
            setNovaImagem(imageUrl)
        }
    }

    useEffect(() => {
        getMyProfile()

    }, [])



    return (
        <>
            {myProfile && (
                <div className='edit-container'>
                    <div className="img-edit-container">
                        <img className='img-edit' src={ novaImagem || myProfile.imageUrlProfile} alt="" ref={imputNovaImg} />
                        <input  onChange={handleImageChange} type="file" name="" id="" />
                    </div>
                    <div className='profile-edit'>
                        <p>Nome:</p>
                        <input className='profile-edit-input' type="text" placeholder={myProfile.nome} ref={imputNovoNome} />
                    </div>
                    <div className='profile-edit'>
                        <p>Bio:</p>
                        <textarea className='profile-edit-input' type="text" placeholder={myProfile.bio} ref={imputNovaBio} />
                    </div>
                    <div className='buttons-container'>
                        <button onClick={() => navigate('/perfil')} className='cancelar'>Cancelar</button>
                        <button className='salvar'>Salvar</button>

                    </div>
                </div>
            )}

        </>
    )
}

export default MeuPerfilEditar