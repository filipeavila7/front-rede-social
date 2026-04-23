import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Fundo from "../components/Fundo";
import Botao from "../components/Botao";

function Login() {
  const navigate = useNavigate(); // trocar de pagina
  const [email, setEmail] = useState(""); // gurdar o email que o user digitou
  const [senha, setSenha] = useState(""); // gurdar a sebha
  const [loading, setLoading] = useState(false); // loading
  const [erro, setErro] = useState(""); // msg de erro

  async function handleSubmit(e) {
    e.preventDefault(); // impede a pagina de atualizar
    setErro(""); //tira o erro se tiver
    setLoading(true); // loading

    try {
      // fazer requisição na api
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST", // metodo
        headers: { "Content-Type": "application/json" }, // json
        body: JSON.stringify({ email, senha }), // oque vai vim no corpo da requisição
      });

      if (!res.ok) {
        throw new Error("Login inválido");
      } // mostra o erro se der na resposta

      const data = await res.json(); // pegar resposta do json
      localStorage.setItem("token", data.token); // armazenar o bearer token que a api retronou

      navigate("/feed"); // ir para o feed
    } catch (err) {
      setErro(err.message || "Erro no login");
    } finally {
      setLoading(false); // indepedente se der certo ou não, o loading some
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
      <div className="form-main">
        <div className="container">
          <h1>Login</h1>
          <form className="form" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <div className="input-container">
            <input
              
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <img src="/mail.png" alt="" className="form-icon" />
            </div>

            <label htmlFor="senha">Senha</label>
            <div className="input-container">
              <input
                type="password"
                id="senha"
                name="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <img src="/lock.png" alt="" className="form-icon" />
            </div>

            <div className="acao">
              <div className="radio">
                <input className="lembrar" id="lembrar" type="checkbox"/>
              </div>
              <p className="acao-texto" >Lembrar de mim</p>
              <div className="esqueceu">
                <p className="acao-texto-e">Esqueci minha senha</p>
              </div>
            </div>

            {erro && <p className="erro">{erro}</p>}

            <Botao type="submit" variant="primary" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
              <img className="btn-icon-enter" src="/enter.png" alt="" />
            </Botao>

            <div className="linha"></div>

            <Link className="link" to="/cadastro">
              Não tem conta?  <span> Cadastre-se</span> 
            </Link>
            
           
          </form>
        </div>
      </div>
    </main>
  );
}

export default Login;
