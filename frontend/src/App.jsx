import { useEffect, useState } from 'react'

export default function App() {
  const [estado, setEstado] = useState('Comprobando API...')

  useEffect(() => {
    fetch('/api/')
      .then((r) => r.json())
      .then((d) => setEstado(`API: ${d.status} · BD: ${d.database}`))
      .catch(() => setEstado('No se pudo conectar con la API'))
  }, [])

  return (
    <main>
      <h1>SABITECH WEB</h1>
      <p>{estado}</p>
    </main>
  )
}
