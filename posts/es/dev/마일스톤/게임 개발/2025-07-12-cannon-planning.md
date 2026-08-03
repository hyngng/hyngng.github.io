---
image:
    path: /2025-07-12-canon-planning/preview-image.webp
    lqip: data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAACwAQCdASoQAAgAAUAmJaQAAtrhz8SAAP7+iKQXo5XPAFYHsGXQIf86Ki+SWy2NwKTSw4qdpXZuAAAA
    alt: "¡Cuánto tiempo!"

title: "Planificación conceptual de un tower defense para móvil centrada en la experiencia de preparación"
authors: ["dev"]

categories: [마일스톤, 게임 개발]
tags: [마일스톤, 게임 개발, 유니티, C#, 기획, 개발일지]
start_with_ads: true

toc: true
toc_sticky: true

date: 2025-07-28 21:56:00 +0900
last_modified_at: 2026-01-23 09:05:00 +0900
---

## **Introducción**

:::warning
**¡Este artículo es un borrador de concepto!**
:::

Una de las cosas que aprendí de [la experiencia del proyecto anterior](https://hyngng.github.io/posts/armonia-devlog-cancelled/) es que desarrollar algo durante un largo periodo de tiempo implica, por un lado, involucrarse en un contexto enorme. Si no se tiene cuidado, el proceso de desarrollo puede convertirse en una experiencia agotadora y dolorosa, por lo que es necesario meditar bien el tema y elegirlo con cuidado.

Este diseño conceptual es, en ese contexto, un pequeño experimento. Primero, durante uno o dos meses, quiero concretar ideas para acortar el proceso de desarrollo mediante la creación de un borrador de diseño, la redacción de documentos y el diseño de clases, y luego, considerando diversos costes de oportunidad, desarrollar realmente el juego o dejar constancia por escrito de los pensamientos durante el proceso.

## **Por qué el género tower defense**

![gameplay-scene](/2025-07-12-canon-planning/gameplay-scene.webp){: .w-75 }
*Ejemplo de gameplay y controles*

La primera razón para que el tema sea tower defense es que, como he disfrutado de este género, no me resulta desconocido. La segunda razón es que, por un principio similar, creo que podré mantener el desarrollo con un interés personal continuado. Además, hay muchos juegos de tower defense ya publicados, por lo que hay abundantes casos de referencia.

Sin embargo, también tiene desventajas, como que la competencia es feroz, que da una impresión algo anticuada y estática en los últimos tiempos, y que es difícil presentar de forma impactante las condiciones de finalización del juego con una estructura tradicional de tower defense. También parece difícil llevar el juego de forma creativa.

La cuestión más importante al concretar esta idea es cómo se pueden compensar estos problemas. Considerar ciertas rondas como una partida cuyo límite máximo de recompensa está fijado, y ofrecer al jugador la opción de finalizar la partida actual y pasar a una nueva, podría ser una posible solución.

## **Lenguaje de diseño minimalista**

El lenguaje de diseño de este juego conceptual tiene dos principios: minimalismo y pragmatismo. Se priorizó el minimalismo por la unificación del código de diseño y la reducción de costes de desarrollo, pero no por ello se pretendía ignorar el pragmatismo. Sin embargo, surgió el problema de que, al reducir funciones entre ambos, a menudo dejaban de ser prácticas, y, por el contrario, al mostrar varios tipos de información juntos, la vista se volvía desordenada y entraban en conflicto con frecuencia. En la mayoría de los casos, hubo un esfuerzo por conciliar alternativas.

![info-panel-design-process](/2025-07-12-canon-planning/info-panel-design-process.webp)
*El diseño del panel de información de la torreta, que fue el que más quebraderos de cabeza dio. Cada uno tiene sus pequeños problemas*

En la ventana que muestra las especificaciones de la torreta, si se muestran los valores en detalle, la densidad de información se vuelve excesiva, como un recibo; por el contrario, si se presentan de forma resumida, la intuición se reduce drásticamente. La causa fundamental de este problema es que los propios datos de la torreta que deben mostrarse son muchos y complejos, y surgió un problema similar al diseñar muchas otras UI. Como no se puede reducir el sistema del juego para lograr una presentación ordenada de la información, se estableció la siguiente mejor opción basada en principios propios:

1. Tanto la densidad de información visual como la densidad de información temporal deben mantenerse constantes. Desde ambas perspectivas, la información no debe ser ni demasiada ni demasiado escasa.
2. La elección del jugador debe poder percibirse de forma intuitiva. La UI debe reaccionar de forma dinámica, con múltiples capas de animaciones y efectos, incluso para acciones pequeñas.
3. Debe evitarse el aburrimiento junto con el fomento del interés. Aunque no se puede hacer que todo sea dinámico, para evitar en la medida de lo posible las situaciones estáticas que provocan aburrimiento, el mapa o el sistema del juego deben funcionar de forma flexible dentro de los límites permitidos.

![notification-system](/2025-07-12-canon-planning/notification-system.webp){: .w-75 }
*4 tipos de notificaciones que se muestran durante la partida*

![design-examples](/2025-07-12-canon-planning/design-examples.webp){: .w-75 }
*Menú principal y ventana de configuración. Los iconos se obtuvieron de Fontawesome*

La mayoría de las funciones de la UI y su disposición en pantalla se determinaron según los principios pragmáticos anteriores. El hecho de que la atmósfera del juego sea en tonos monocromáticos (blanco y negro) y que la mayor parte del diseño de la UI esté colocada de forma estática son desventajas que deben mejorarse mediante efectos visuales como animaciones.

## **Aspectos técnicos necesarios para el desarrollo**

![notion-dark](/2025-07-12-canon-planning/notion-dark.webp){: .dark }
![notion-light](/2025-07-12-canon-planning/notion-light.webp){: .light .border }
*Estoy pensando si hacer pública la página de Notion cuando esté más o menos organizada*

Los objetivos técnicos que se pueden alcanzar con este proyecto no son ambiciosos. Estrategias para una gestión fluida del proyecto, como las convenciones de nomenclatura o los principios SOLID, patrones de diseño como el singleton o la programación dirigida por eventos, y conceptos familiares como los [criterios de calidad esencial para aplicaciones Android](https://developer.android.com/docs/quality-guidelines/core-app-quality?hl=ko) se implementarán refinándolos, y cuando haya margen, podría probar a usar alguno de los siguientes:

- [GPGS](https://developer.android.com/games/pgs/unity/overview?hl=ko)
- Object pooling
- Multithreading
- Unity Analytics
- Notificaciones Toast de Android
- [Características de calidad ISO/IEC 25010](https://www.iso.org/standard/78176.html)

Durante la redacción del documento, descubrí por casualidad [Awesome Lists](https://github.com/sindresorhus/awesome), y entre ellos, encontré elementos relacionados con Unity y, en particular, un proyecto open source digno de consulta: [Nodulus](https://github.com/Hyperparticle/nodulus/). Tenía dificultades porque me faltaba sensación de cómo se gestiona realmente un proyecto, pero creo que podré tomar buena nota de la estructura de scripts, la gestión de activos, etc.
