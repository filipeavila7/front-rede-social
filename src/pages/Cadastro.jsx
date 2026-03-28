import '../styles/Login.css'
import { Link, useNavigate } from "react-router-dom";
import Fundo from '../components/Fundo';
import Botao from '../components/Botao';
import { useState, useRef, useEffect } from 'react';
import api from '../api';

function Cadastro() {
    const [loading, setLoading] = useState(false)
    const [sucesso, setSucesso] = useState("")
    const [erro, setErro] = useState("")
    const navigate = useNavigate();


    const imputNome = useRef()
    const imputEmail = useRef()
    const imputSenha = useRef()

    async function cadastroUser(e) {
        e.preventDefault()
        setLoading(true)
        setErro("")
        setSucesso("")
        try {
             await api.post('/users', {
                nome : imputNome.current.value,
                email : imputEmail.current.value,
                senha : imputSenha.current.value
            })
            setSucesso("Usuario cadastrado com sucesso!")
            navigate("/login");

        } catch (error) {
            console.error("Erro ao cadastrar:", error);
            setErro("Erro ao cadastrar")
        }finally{
            setLoading(false)
        }
       
    }




    return (
        <main className="layout">
            <Fundo />
            <div className='form-main'>
                <div className='container'>
                    <h1>Cadastro</h1>
                    <form onSubmit={cadastroUser} className='form' action="" method="post">
                        <label htmlFor="nome">nome</label>
                        <input required type="text" id="nome" name="nome" ref={imputNome}/>

                        <label htmlFor="email">Email</label>
                        <input required type="email" id="email" name="email" ref={imputEmail} />

                        <label htmlFor="senha">Senha</label>
                        <input required type="password" id="senha" name="senha" ref={imputSenha} />
                        {erro && <p className='erro'> {erro} </p>}
                        {sucesso && <p className='sucesso'> {erro} </p>}
                        <Botao type="submit" variant='primary'>{loading? "carregando..." : "cadastrar"}</Botao> 
                        <Link className='link' to="/login">Voltar</Link>
                    </form>
                </div>
            </div>
        </main>
    );
}

export default Cadastro;
