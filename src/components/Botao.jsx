import '../styles/Botao.css'

//botao
function Botao({ variant = "primary", children, ...props }) {
  return (
    <button className={`btn btn-${variant}`} {...props}>
      {children}
    </button>
  );
}


export default Botao