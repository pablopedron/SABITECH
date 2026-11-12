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
