---
title: "'Waybound', el desarrollo termina aquí"
authors: ["dev"]

categories: [마일스톤, 게임 개발]
tags: [마일스톤, 게임 개발, 유니티, C#, 행선지, 개발, 개발일지]
start_with_ads: true

toc: true
toc_sticky: true

date: 2024-10-23 21:32:00 +0900
last_modified_at: 2024-11-02 20:41:00 +0900

mermaid: true
---

## **Qué ha ocurrido**

![gameplay](/2024-10-23-armonia-devlog-cancelled/gameplay.webp)
*Gameplay de la versión más reciente*

Habría sido mejor habérselo contado un poco antes, pero ahora que tengo la certeza, lo escribo. Waybound (행선지) era un proyecto que empecé con la ambición de probar nuevos patrones de programación y una puesta en escena novedosa. Le tuve tanto cariño que llegué a escribir [tres crónicas de desarrollo](https://hyngng.github.io/tags/armonia/), y aunque hubo cierto progreso en el desarrollo, al final he decidido detenerlo.

## **Una reflexión sincera**

Lo último que sentí al desarrollar fue deber y aburrimiento. A pesar de ser algo que yo mismo había iniciado, hacia el final teclear se me hacía un poco pesado.

Si analizo por qué ocurrió esto, la primera razón no fue tanto mi falta de capacidad como que ya no sentía ganas de seguir creando esto. Al fin y al cabo, era un ejercicio. Tras alcanzar cierto objetivo, al considerar el coste de oportunidad, me pregunté si cerrar esto adecuadamente era lo mejor, y no encontré respuesta.

La segunda razón que me frenó fue una dirección equivocada y la falta de un plan a largo plazo. Como no me lo tomé con seriedad y entrega, no había plazos ni objetivos de logro concretos, y seguía siendo frecuente resolver los problemas sobre la marcha. Cuando me enfrentaba a una situación problemática, tampoco solía esforzarme en definir la situación y buscar la mejor solución.

La tercera razón fue la falta de una rutina o mecanismo de desarrollo concreto. Este problema se daba con frecuencia en el proceso de creación de activos de imagen y animación, más que en la programación. El objetivo principal era crear escenas naturales como las de una película, pero cada una de las tareas necesarias para dibujar requería mucho más esfuerzo del que había imaginado, y sentí una sincera perplejidad.

Como resultado, la motivación disminuyó, y pensé que era mejor dejar de lado la necesidad de una capacidad inteligente de resolución de problemas y la reflexión sobre la mejora de la ineficiencia del trabajo, y poner un final breve al periodo de desarrollo, en lugar de alargarlo con un apego que no era tal.

## **Hasta dónde se llegó**

:::tip
**¡Puedes consultar los detalles en [GitHub](https://github.com/hyngng/unity-armonia)!**
:::

Comparando el GDD simplificado [escrito en la fase de planificación](https://hyngng.github.io/posts/armonia-planning/) con lo que se desarrolló realmente, esto es lo que hay. Los elementos no implementados están tachados.

- Descripción básica
	- [X] Nombre: 행선지 (en inglés: waybound)
	- [X] Género: Aventura de scroll lateral
	- [X] Formato: Móvil 2.5D
- Jugabilidad
	- [X] El jugador se convierte en un ser vivo que compone el entorno —como una persona, ~~un perro, un gato, una hormiga~~— en un entorno de las afueras de una ciudad, y realiza las interacciones propias de ese ser vivo. Por ejemplo, una persona saca una bebida de una máquina expendedora y la bebe; ~~un perro huele un banco en la calle.~~
	- [x] Incluso si el jugador no controla específicamente a los seres vivos, estos interactúan entre sí y componen el ambiente de las afueras de la ciudad, y cada ser vivo tiene una personalidad visual dentro de un rango determinado.
- Características principales
	- [x] Interacciones ~~diversas~~ entre objetos
	- [x] Imágenes dibujadas a mano y animaciones de corte
	- [ ] ~~Experiencia que varía según el clima, como lluvia o nieve~~

Se implementaron interacciones para personas y palomas, pero los perros, gatos, etc., que están tachados, no se implementaron. No se puede decir que las interacciones creadas sean diversas. El clima también quería implementarlo mediante un sistema de partículas, pero no se hizo.

Aun así, considero que fueron pequeños logros el haber intentado el 2.5D, que no es ni 2D ni 3D, y haber llegado a la fase de producción de resultados, y el haber usado parcialmente tanto imágenes dibujadas a mano como animaciones de corte tradicionales.

## **La próxima vez tengo que hacerlo bien**

De todas formas, el proceso de desarrollo no fue satisfactorio y es un proyecto fallido. La causa principal fue un proceso de resolución de problemas sin dedicación y el abandono de la mejora de la ineficiencia del trabajo. Primero, creo que sería buena idea buscar cómo otras personas han resuelto problemas similares.

Al principio quería crear una obra realmente magnífica, y me da rabia terminarlo aquí. Sinceramente, me fastidia un poco. Voy a repasar incluso las pequeñas partes que no he incluido en esta entrada para prepararme bien y poder completar el próximo proyecto hasta el final.
