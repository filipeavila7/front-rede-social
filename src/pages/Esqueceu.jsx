import "../styles/Login.css";
import { useState, useRef } from "react";
import Botao from "../components/Botao";
import api from "../service/api";

function Esqueceu() {
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
      <div className="form-main">
        <div className="container">

          <h1>Esqueci minha senha</h1>

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