import '../styles/Botao.css'


function Botao({ variant = "primary", children, ...props }) {
  return (
    <button className={`btn btn-${variant}`} {...props}>
      {children}
    </button>
  );
}


export default Botao