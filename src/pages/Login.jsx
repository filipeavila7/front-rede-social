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
      <Fundo />
      <div className="form-main">
        <div className="container">
          <h1>Login</h1>
          <form className="form" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />

            {erro && <p className="erro">{erro}</p>}

            <Botao type="submit" variant="primary" disabled={loading}>
              {loading ? "Entrando..." : "Enviar"}
            </Botao>

            <Link className="link" to="/cadastro">
              Não tem conta? Cadastre-se
            </Link>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Login;
