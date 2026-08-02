# GiveMoneyPlis

## Muro · planificador de pared

`index.html` es un planificador para colocar cuadros en una pared, a escala real en centímetros.
Es un único archivo, sin dependencias: se abre con doble clic en cualquier navegador.

Viene preparado con el caso de partida: pared de **360 × 244 cm**, **13 dibujos de 28 × 32 cm**
y **2 de 39 × 48 cm**.

### Qué hace

- **Arrastrar y soltar** cada obra sobre la pared, con las medidas siempre en cm reales.
- **Imanes de alineación**: se pega a los bordes y centros de las otras obras, al eje de la pared
  y a la cuadrícula; muestra guías mientras arrastras.
- **Composiciones automáticas**: rejilla, filas centradas, salón, foco central, grandes a los lados
  y escalonada. Todas quedan centradas y con el centro del conjunto al nivel de vista.
- **Cotas en vivo** de la obra seleccionada: distancia a cada borde, al suelo y al techo.
- **Teclado**: flechas mueven 1 cm (Shift 5 cm, Alt 0,5 cm), `R` gira 90°, `⌘/Ctrl+Z` deshace,
  `Supr` elimina, `Shift + clic` selecciona varias para alinear y distribuir.
- **Referencias reales**: nivel de vista de museo (152 cm), silueta humana de 170 cm, zócalo y
  mueble opcional para comprobar que nada queda tapado.
- **Diagnóstico**: superposiciones, obras fuera de la pared, tamaño del bloque y aire a los lados.
- **Lista de clavos**: X desde el borde izquierdo e Y desde el suelo para cada obra, con la caída
  del colgador descontada. Se puede copiar o imprimir para llevarla a la pared.
- **Exportar PNG** de la composición y guardado automático en el navegador.

Las medidas de la pared, el número de obras y sus tamaños se pueden cambiar desde el panel izquierdo.
