import { useCallback, useState } from 'react'
import InternalLayout from '../../layouts/InternalLayout.jsx'
import Perfil from './Perfil/Perfil.jsx'
import Areas from './Areas/Areas.jsx'
import TesteVocacional from './TesteVocacional/TesteVocacional.jsx'
import Faculdades from './Faculdades/Faculdades.jsx'
import Ingressos from './Ingressos/Ingressos.jsx'
import AssistenteIA from './AssistenteIA/AssistenteIA.jsx'
import '../../styles/exploracao.css'
export default function InternalApp({ rota, navegar, onSair, abrirAssistente, fecharAssistente, serviceIA }) {
  const [modalAberto, setModalAberto] = useState(false)
  const [teste, setTeste] = useState({ fase: 'intro', indice: 0, respostas: [], resultado: null })
  const [chatMontado, setChatMontado] = useState(Boolean(rota.assistente))
  if (rota.assistente && !chatMontado) setChatMontado(true)
  const concluirChat = useCallback(() => setChatMontado(false), [])
  const alterarModal = useCallback(valor => setModalAberto(valor), [])
  return <><InternalLayout secao={rota.secao} pagina={rota.item} navegar={navegar} modalAberto={modalAberto} bloqueado={chatMontado} comAssistente>
    {rota.secao === 'perfil' && <Perfil navegar={navegar} onSair={onSair} onModalChange={alterarModal} />}
    {rota.secao === 'areas' && (rota.item === 'teste' ? <TesteVocacional navegar={navegar} estado={teste} setEstado={setTeste} /> : <Areas item={rota.item} navegar={navegar} />)}
    {rota.secao === 'faculdades' && <Faculdades rota={rota} navegar={navegar} />}
    {rota.secao === 'ingressos' && <Ingressos item={rota.item} navegar={navegar} />}
  </InternalLayout><AssistenteIA rota={rota} abrir={abrirAssistente} fechar={fecharAssistente} presente={chatMontado} onFechado={concluirChat} bloqueado={modalAberto} service={serviceIA} /></>
}
