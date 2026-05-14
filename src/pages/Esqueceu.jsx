import "../styles/Login.css";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Botao from "../components/Botao";
import api from "../service/api";

function Esqueceu() {
  const navigate = useNavigate()
  const inputEmail = useRef();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", {
        email: inputEmail.current.value,
      });

      setSucesso("Email enviado! Verifique sua caixa de entrada.");

    } catch (err) {
      setErro(
        err.response?.data?.message || "Erro ao enviar email"
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
          <p>compartilharem ideias,  criações e histórias</p>
        </div>
      </div>
      <div className="form-main">

        <div className="container-r">
          <img onClick={() => navigate('/login')} className='voltar-icon-e' src="/voltar.png" alt="" />

          <h1>Recuperar senha</h1>

          <form className="form" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>

            <div className="input-container">
              <input
                type="email"
                id="email"
                name="email"
                ref={inputEmail}
                required
              />
              <img src="/mail.png" alt="" className="form-icon" />
            </div>

            {erro && <p className="erro">{erro}</p>}
            {sucesso && <p className="sucesso">{sucesso}</p>}

            <Botao type="submit" variant="primary" disabled={loading}>
              {loading ? "Enviando..." : "Enviar link de recuperação"}
              <img className="btn-icon-enter" src="/enter.png" alt="" />
            </Botao>

          </form>

        </div>
      </div>
    </main>
  );
}

export default Esqueceu;