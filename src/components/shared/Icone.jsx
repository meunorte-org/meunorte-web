const paths = {
  perfil: <><circle cx="12" cy="8" r="4" /><path d="M4 22v-3a8 8 0 0 1 16 0v3" /></>,
  areas: <><circle cx="12" cy="12" r="9" /><path d="m15 9-2 4-4 2 2-4 4-2Z" /></>,
  faculdades: <><path d="m2 8 10-5 10 5-10 5L2 8Zm4 3v7c4 3 8 3 12 0v-7M22 8v9" /></>,
  ingressos: <><path d="M3 5h18v5a2 2 0 0 0 0 4v5H3v-5a2 2 0 0 0 0-4V5Zm13 0v3m0 3v2m0 3v3" /></>,
  ajustes: <><path d="M4 6h16M4 12h16M4 18h16" /><circle cx="8" cy="6" r="2" fill="currentColor" /><circle cx="16" cy="12" r="2" fill="currentColor" /><circle cx="10" cy="18" r="2" fill="currentColor" /></>,
  editar: <><path d="m4 16 12-12 4 4L8 20l-5 1 1-5ZM14 6l4 4" /></>,
  objetivos: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><path d="m12 12 7-7m-1-3v4h4" /></>,
  sair: <><path d="M10 4H4v16h6m4-12 5 4-5 4m-6-4h11" /></>,
  voltar: <path d="m14 5-7 7 7 7" />,
  fechar: <path d="m6 6 12 12M6 18 18 6" />,
  foto: <><path d="M3 6h5l2-3h4l2 3h5v15H3V6Z" /><circle cx="12" cy="13" r="4" /></>,
  mais: <path d="M12 5v14M5 12h14" />,
  coracao: <path d="M12 21 3 12C-3 4 7 0 12 7c5-7 15-3 9 5l-9 9Z" />,
}
export default function Icone({ nome, tamanho = 24, ...props }) {
  return <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[nome] ?? paths.areas}</svg>
}
