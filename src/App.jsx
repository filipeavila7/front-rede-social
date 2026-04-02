import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Feed from "./pages/Feed";
import Perfil from "./pages/Perfil";
import Contatos from "./pages/Contatos";
import Posts from "./pages/Posts";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Messages from "./pages/Messages";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
       <Route path="contatos/:conversationId" element={<Messages />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="feed" element={<Feed />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="contatos" element={<Contatos />} />
        <Route path="posts" element={<Posts />} />
       
      </Route>
    </Routes>
  );
}

export default App;
