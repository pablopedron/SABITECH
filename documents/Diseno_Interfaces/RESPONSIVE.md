# Comprobaciones de diseño responsive y accesibilidad

Comprobado el 10/11/2026 con Chrome automatizado sobre `develop/frontendV2` más la rama `feature/accesibilidad`, con una API simulada. Pantallas revisadas: inicio, charlas, detalle, reserva, login, registro y cuenta. Tamaños: 320, 375, 768 y 1280 px, en esquema de color claro y oscuro.

| Comprobación | Resultado |
|---|---|
| Diseño adaptable a móviles (320 y 375 px) | Correcto: sin desbordamiento horizontal en ninguna pantalla |
| Diseño adaptable a tablets (768 px) | Correcto |
| Diseño adaptable a ordenadores (1280 px) | Correcto |
| Tarjetas con cuadrícula adaptable | Implementado |
| Menú adaptable a móviles | Implementado |
| Ausencia de desbordamiento horizontal | Correcto (el pie de página con las redes se parte en varias líneas) |
| Navegación mediante teclado (Tab) | Correcto: se llega al logo, al menú, a los botones de las tarjetas y a los enlaces de redes |
| Indicador de foco visible | Implementado (contorno de 3 px) |
| Contraste de colores | Correcto: texto de 4,5:1 o más en las pantallas revisadas (el logo y los textos de Inicio se corrigieron) |
| Idioma de la página | `lang="es"` |
| Enlaces con nombre accesible | Correcto: el icono y el nombre de cada red están dentro del mismo enlace |

Cambios de esta revisión: el logo es ahora un botón alcanzable con teclado y en blanco sobre el morado; el texto de Inicio usa un fondo más claro y el botón vuelve a ser oscuro; la aplicación usa siempre el tema claro (con el tema oscuro del sistema el texto negro quedaba sobre fondo oscuro).

Pendiente: probar en dispositivos reales (móvil y tableta) y con un lector de pantalla.

---

## Revisión del 12/11/2026 · nueva estética y logos

Comprobado con Chrome automatizado (Playwright) sobre la rama `feature/estetica-prototipo`, contra la **API real** con los datos del seeder. Pantallas: inicio, charlas, detalle, login, Mi cuenta (asistente) y panel de organización.

| Comprobación | Cómo | Resultado |
|---|---|---|
| Sin desbordamiento horizontal | Se mide en cada pantalla si el contenido es más ancho que la ventana, a 320, 390, 768, 1024 y 1280 px | Correcto en todas (0 desbordes). En la primera prueba la tabla del panel de organización ensanchaba la página en móvil; se corrigió con `min-width: 0` en las columnas y scroll propio en la tabla |
| Menú adaptable | A 390 px | Se pliega en «☰ Menú» y se abre como un panel; `aria-expanded` cambia a `true` |
| Navegación por teclado | Tab desde el inicio | El primer Tab muestra «Saltar al contenido»; el menú se abre con Enter |
| Recorrido completo en móvil | Login → Charlas → Pedir cita → Confirmar → Darse de baja | Aviso «¡Tu reserva se ha realizado correctamente! Referencia: SBT-…» y, al cancelar, «Reserva cancelada. La plaza ha quedado libre.» |
| Charlas ya celebradas | Charla del 20/10 en el catálogo y en Mi cuenta | Botón desactivado con el texto «Ya celebrada»; antes estaba activo y el servidor devolvía error |
| Logos | Cabecera blanca, pie morado y favicon | Se leen bien; el pie usa la versión con el texto en blanco |

Pendiente: probar en dispositivos reales (móvil y tableta), con un lector de pantalla y con usuarios distintos del equipo (prueba de usabilidad del enunciado).
