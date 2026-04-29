import CriarPost from "../components/CriarPost";
import '../styles/NewPost.css'
function CriarPostPage() {
  return (
    <main className="new-main" >
      <h1>Criar novo post</h1>
      <p className="sub">Compartilhe a sua arte com o mundo</p>
      <CriarPost/>
    </main>
  );
}

export default CriarPostPage;
