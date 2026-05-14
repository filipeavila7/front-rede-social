import "../styles/Login.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Fundo from "../components/Fundo";
import Botao from "../components/Botao";
import api from "../service/api";
import {
  consumeSessionExpiredMessage,
  resetSessionStores,
} from "../utils/session";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const sessionMessage =
      location.state?.sessionMessage || consumeSessionExpiredMessage();

    if (sessionMessage) {
      setErro(sessionMessage);
    }
  }, [location.state]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      // ✅ Axios request (substitui fetch)
      const res = await api.post("/auth/login", {
        email,
        senha,
      });

      const data = res.data;

      resetSessionStores();
      localStorage.setItem("token", data.token);

      navigate("/feed");

    } catch (err) {
      setErro(
        err.response?.data?.message || "Login inválido"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="layout">
      <div className="midia-logo-div">
      <img className="midia-logo" src="/logoA.png" alt="" />
      </div>

      <div className="texto-social">
        <div className="titulo">
          <h1 className="titulos">Compartilhe.</h1>
          <h1 className="titulo-a">Inspire-se.</h1>
          <h1 className="titulos">Conecte-se.</h1>
        </div>

        <div className="midia-p">
          <p>Uma plataforma para artistas e fãs</p>
          <p>compartilharem ideias, criações e histórias</p>
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
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <img src="/lock.png" alt="" className="form-icon" />
            </div>

            <div className="acao">
              <div className="radio">
                <input className="lembrar" id="lembrar" type="checkbox" />
              </div>
              <div className="lembrar-div">
              <p className="acao-texto">Lembrar de mim</p>
              </div>

              <div className="esqueceu">
                <p onClick={()=> navigate('/esqueceu')} className="acao-texto-e">
                  Esqueci minha senha
                </p>
              </div>
            </div>

            {erro && <p className="erro">{erro}</p>}
            
            <Botao type="submit" variant="primary" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
              <img className="btn-icon-enter" src="/enter.png" alt="" />
            </Botao>

            <div className="linha"></div>

            <Link className="link" to="/cadastro">
              Não tem conta? <span> Cadastre-se</span>
            </Link>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Login;