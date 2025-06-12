import { useState } from 'react';

export default function Prueba() {
  const [nombre, setNombre] = useState<string>(''); // 👈 bien tipado

  return (
    <div>
      <h1>Prueba de estado</h1>
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Escribí tu nombre"
      />
    </div>
  );
}
