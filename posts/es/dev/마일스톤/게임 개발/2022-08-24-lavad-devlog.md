---
image:
    path: /2022-08-24-lavad-devlog/lavad-working.webp
    lqip: data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADwAQCdASoQAAgAAgA0JYgCdAEO+BZG1HAA/tzAa4xcrJ5qbUA7/Dd9Xb9cYHKGznTwKrBlf85fCc9Us5QdbaLIxPYj/pyvwcdu60isAAA=
    alt: Gameplay de ejemplo
    
title: "Creando un juego de disparos con un vehículo blindado sencillo en Unity"
authors: ["dev"]

categories: [마일스톤, 게임 개발]
tags: [마일스톤, 게임 개발, 유니티, C#, 개발, 개발일지]
start_with_ads: true

toc: true
toc_sticky: true
 
date: 2022-08-24 16:14:00 +0900
last_modified_at: 2023-11-22 19:36:00 +0900
---

## **Introducción**

Recuerdo que cuando era niño, vi con admiración cómo un [youtuber (Tooner)](https://www.youtube.com/@tooner/videos) implementaba la suspensión de un tanque, una mira PIP (Picture-In-Picture) o efectos de granada flash. Los vídeos eran crudos y toscos, y quizás por eso solían tener pocas visitas, pero su contenido era realmente fascinante.

Con el tiempo, cuando tuve algo de tiempo libre, recordé a este youtuber. Justo cuando tenía ganas de crear algo con el ordenador, volví a ver uno a uno los vídeos de este youtuber y pensé que a mí también me gustaría hacer cosas así. Tomando como modelo su trayectoria, dediqué dos semanas a usar Blender y Unity para crear [mi primer hito](https://hyngng.github.io/categories/%EB%A7%88%EC%9D%BC%EC%8A%A4%ED%86%A4/) a mi manera.

## **Blender**

![lavad-modeling](/2022-08-24-lavad-devlog/lavad-modeling.webp){: .w-50 .left }

Al principio, cuando pensaba en qué hacer, decidí que el tema fuera un vehículo blindado llamado LAV-AD. No solo porque el vehículo me parecía impresionante, sino porque su carrocería tiene una forma geométrica que pensé que no sería difícil de modelar directamente.

Por supuesto, al principio consideré descargar un modelo gratuito de internet, pero la mayoría de los modelos se vendían, y además siempre había querido probar Blender, así que decidí crearlo yo mismo.

Para los atajos básicos, consulté artículos bien organizados en internet, y para entender cómo abordar la herramienta Blender, busqué y seguí varios vídeos de speed modeling en canales extranjeros de YouTube.

Al observarlos, vi que muchos se basaban en imágenes de proyección ortogonal de los tres ejes X, Y, Z para crear sus modelos, así que también comencé a recopilar materiales relacionados en Google y empecé a crear mi primer modelo. Aunque hubo dificultades, el proceso estaba bastante sistematizado, por lo que pude adaptarme rápidamente y crear una forma que, a mi parecer, tenía buena apariencia.

## **Unity**

![lavad-coding](/2022-08-24-lavad-devlog/lavad-coding.webp){: .w-50 .right }

Lo siguiente fue la programación, y también utilicé Unity, que siempre había querido aprender. Mirando atrás, creo que con Unity, como no sabía cómo usar las cosas, fui avanzando a duras penas, como cruzando un puente de piedra golpeándolo.

No tenía ningún conocimiento de orientación a objetos ni de diseño basado en componentes, así que consulté tanto publicaciones de blogs nacionales como tutoriales de youtubers indios y antiguos hilos de Stack Overflow.

En particular, al implementar las ruedas, usé un componente de Unity llamado Wheel Collider, y por más que buscaba, no encontraba casi ningún material relacionado en coreano. Fue la primera vez que consulté la documentación oficial de Unity, pero como mi comprensión del componente en sí era insuficiente, me llevó un tiempo usarlo correctamente.

Aun así, cuando finalmente logré que las ruedas giraran bien, la emoción fue tan nueva que a partir de ese momento creo que empecé a disfrutar de Unity.

## **Corrección de errores y finalización**

<div class="row">
    <div class="col-md-6">
        <img src="/2022-08-24-lavad-devlog/lavad-bug1.webp" alt="lavad-bug1">
    </div>
    <div class="col-md-6">
        <img src="/2022-08-24-lavad-devlog/lavad-bug2.webp" alt="lavad-bug2">
    </div>
</div>
<div class="row">
    <div class="col-md-6">
        <img src="/2022-08-24-lavad-devlog/lavad-bug3.webp" alt="lavad-bug3">
    </div>
    <div class="col-md-6">
        <img src="/2022-08-24-lavad-devlog/lavad-bug4.webp" alt="lavad-bug4">
    </div>
</div>

Hubo muchos errores divertidos como estos. Cuando no sabía de la existencia del Wheel Collider, intenté implementar el movimiento de la carrocería con funciones trigonométricas y funcionaba de forma completamente errática; después de aplicar el Wheel Collider, el eje de las ruedas estaba desalineado y rodaban en direcciones incorrectas; al aplicar una carrocería recién modelada, el valor de la masa causaba problemas; mientras implementaba el efecto de expulsión de casquillos, estos salían en exceso, etc.

Además de estos, junto con muchos otros errores, también ocurrían con frecuencia errores gramaticales básicos como la omisión de puntos y comas o paréntesis, lo que me desconcertó porque había más dificultades de las que imaginaba. En particular, a partir del momento de aplicar el Wheel Collider, se volvió muy difícil.

![lavad-main](/2022-08-24-lavad-devlog/lavad-main.webp)

![lavad-main2](/2022-08-24-lavad-devlog/lavad-main2.webp)

Aun así, tras un total de 9 compilaciones, logré un nivel que me resultaba satisfactorio. También incorporé varios gustos y deseos personales: apliqué postprocesado de cámara para lograr un efecto de profundidad de campo, y al avanzar o retroceder, las ruedas traseras levantaban polvo en la dirección correspondiente; especialmente al retroceder, las luces traseras se encendían con intensidad, implementando detalles que hicieron el proceso divertido de finalizar.

## **Para concluir**

![lavad-working2](/2022-08-24-lavad-devlog/lavad-working2.webp)

:::tip
¡Puede explorar más detalles en [GitHub](https://github.com/hyngng/unity-lavad)!
:::

Empezó el 8 de julio y la última compilación fue el 25 de julio, así que es un proyecto a corto plazo completado en 17 días. Personalmente, al hacer la última compilación, pensé que la próxima vez me gustaría emprender un proyecto de mayor envergadura. En particular, lamento haber escrito código con prisas por alcanzar el objetivo, sin una comprensión suficiente de C#.

Aun así, fue bueno poder modelar por mi cuenta y usar la orientación a objetos. Sobre todo, me alegra mucho tener ahora la experiencia de haber creado un programa al que le tengo cariño.
