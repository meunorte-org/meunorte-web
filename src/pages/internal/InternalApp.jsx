import { useCallback, useState } from 'react'
import InternalLayout from '../../layouts/InternalLayout.jsx'
import Perfil from './Perfil/Perfil.jsx'
import SecaoInicial from './SecaoInicial.jsx'
export default function InternalApp({ rota, navegar, onSair }) {
  const [modalAberto, setModalAberto] = useState(false)
  const alterarModal = useCallback(valor => setModalAberto(valor), [])
  return <InternalLayout secao={rota.secao} navegar={navegar} modalAberto={modalAberto}>
    {rota.secao === 'perfil' ? <Perfil navegar={navegar} onSair={onSair} onModalChange={alterarModal} /> : <SecaoInicial secao={rota.secao} item={rota.item} navegar={navegar} />}
  </InternalLayout>
}
