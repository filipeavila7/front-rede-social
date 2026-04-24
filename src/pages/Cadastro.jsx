import '../styles/Login.css'
import { Link, useNavigate } from "react-router-dom";
import Fundo from '../components/Fundo';
import Botao from '../components/Botao';
import { useState, useRef, useEffect } from 'react';
import api from '../service/api';

function Cadastro() {
    const [loading, setLoading] = useState(false)
    const [sucesso, setSucesso] = useState("")
    const [erro, setErro] = useState("")
    const navigate = useNavigate();


    const imputNome = useRef()
    const imputEmail = useRef()
    const imputSenha = useRef()
    const imputUserName = useRef()

    async function cadastroUser(e) {
        e.preventDefault()
        setLoading(true)
        setErro("")
        setSucesso("")
        try {
            await api.post('/users', {
                nome: imputNome.current.value,
                email: imputEmail.current.value,
                senha: imputSenha.current.value,
                userName: imputUserName.current.value
            })
            setSucesso("Usuario cadastrado com sucesso!")
            navigate("/login");

        } catch (error) {
            console.error("Erro ao cadastrar:", error);
            setErro("Erro ao cadastrar")
        } finally {
            setLoading(false)
        }

    }




    return (
        <main className="layout">
            <img className="midia-logo" src="/logo.png" alt="" />
            <div className="texto-social">
                <div className="titulo">
                    <h1 className="titulos">Compartilhe.</h1>
                    <h1 className="titulo-a">Inspire-se.</h1>
                    <h1 className="titulos">Conecte-se.</h1>
                </div>
                <div className="midia-p">
                    <p>Uma plataforma para artistas e fãs</p>
                    <p>compartilharem ideias,  criações e histórias</p>
                </div>
            </div>
            <div className='form-main'>
                <div className='container-c'>
                    <h1>Cadastro</h1>
                    <img onClick={() => navigate('/login')} className='voltar-icon-c' src="/voltar.png" alt="" />
                    <form onSubmit={cadastroUser} className='form' action="" method="post">
                        <label htmlFor="nome">Nome de usuário </label>
                        <div className="input-container">
                            <input required type="text" id="nome" name="nome" ref={imputUserName} />
                            <img src="/user.png" alt="" className="form-icon" />
                        </div>

                        <label htmlFor="nome">Apelido</label>
                        <div className="input-container">
                            <input required type="text" id="nome" name="nome" ref={imputNome} />
                            <img src="/user.png" alt="" className="form-icon" />
                        </div>

                        <label htmlFor="email">Email</label>
                        <div className="input-container">
                            <input required type="email" id="email" name="email" ref={imputEmail} />
                            <img src="/mail.png" alt="" className="form-icon" />
                        </div>

                        <label htmlFor="senha">Senha</label>

                        <div className="input-container">
                            <input required type="password" id="senha" name="senha" ref={imputSenha} />
                            <img src="/lock.png" alt="" className="form-icon" />
                        </div>
                        {erro && <p className='erro'> {erro} </p>}
                        {sucesso && <p className='sucesso'> {erro} </p>}
                        <Botao type="submit" variant='primary'>{loading ? "carregando..." : "cadastrar"}</Botao>
                        
                    </form>
                </div>
            </div>
        </main>
    );
}

export default Cadastro;
