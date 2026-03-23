import '../styles/Login.css'
import { Link } from "react-router-dom";
import Fundo from '../components/Fundo';
import Botao from '../components/Botao';
function Cadastro() {
    return (
        <main className="layout">
            <Fundo />
            <div className='form-main'>
                <div className='container'>
                    <h1>Cadastro</h1>
                    <form className='form' action="" method="post">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" />
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" />
                        <label htmlFor="senha">Senha</label>
                        <input type="password" id="senha" name="senha" />
                        <Botao type="submit" variant='primary'>Enviar</Botao> 
                        <Link className='link' to="/login">Voltar</Link>
                    </form>
                </div>
            </div>
        </main>
    );
}

export default Cadastro;
