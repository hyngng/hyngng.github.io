---
title: "Sobre el diseño orientado a objetos y los principios SRP y DIP"
authors: ["dev", "essay"]

categories: [프로그래밍, 아키텍처]
tags: [프로그래밍, 아키텍처]
start_with_ads: false

toc: true
toc_sticky: true

date: 2026-06-01 13:54:00 +0900
last_modified_at: 2026-06-29 23:23:00 +0900

mermaid: true
---

No sé exactamente en qué punto me encuentro, pero si lo comparara con las cuatro etapas del conocimiento, diría que estoy en la fase de competencia consciente. Todavía no creo tener el criterio para discernir qué es un buen diseño, pero en medio de todo eso, van surgiendo pequeñas cosas que creo entender, y algunas de ellas me parecen bastante interesantes.

## **Breve comentario sobre la orientación a objetos**

Los antecedentes de la orientación a objetos y aquello en lo que destaca son bien conocidos: superar las limitaciones del paradigma procedimental tradicional; de forma más específica, preservar el pensamiento abstracto y diseñar lógicas de negocio complejas de una manera natural y comprensible para los humanos. Sin embargo, se habla relativamente menos de por qué esta metodología tuvo una acogida tan amplia. Al respecto, he encontrado dos perspectivas: la empresarial y la filosófica.

Uno. A quien dirige un negocio, un ambicioso, no le gusta la incertidumbre. Una de las razones por las que los imperios nórdicos fronterizos invadían constantemente a los estados de la península coreana era para estabilizar la retaguardia antes de llevar a cabo la empresa de conquistar el continente. Roma unificó primero la península itálica antes de atacar Cartago, y Alemania firmó un pacto de no agresión con la Unión Soviética antes de invadir Francia. Los casos y la motivación no son muy diferentes. Cuanto mayor es la escala del negocio y más sincera la obsesión del responsable, más indispensable es bloquear los cisnes negros.

Dos. El que un físico moderno anhele una teoría del gran unificación, el que un lingüista asuma que existe una gramática universal subyacente a todos los idiomas del mundo, el que un economista intente explicar el comportamiento de millones de personas con un único gráfico de oferta y demanda — todo ello nace de la intención de controlar el desorden. ¿Por qué ese esfuerzo ha acompañado históricamente a la humanidad? Detrás de ello puede haber una razón práctica de reducir el coste cognitivo, pero prefiero la perspectiva de Albert Camus: «El hombre no soporta la incertidumbre y la ambigüedad, y tiende a anhelar una visión cognitiva clara».

Es solo una especulación, pero como intuición, no parece descabellado entender la orientación a objetos como una naturaleza humana, como la gestión de riesgos. La orientación a objetos divide el código procedimental tradicional, lo organiza donde corresponde y deja más hitos en su estructura y nomenclatura. Como resultado, la complejidad y la incertidumbre se controlan, ofreciendo estabilidad al desarrollador.

## **SRP: Principio de Responsabilidad Única**

> Cada objeto debe tener una única responsabilidad.

De manera similar, en la escritura existe el principio «un artículo, un asunto» (一文一事), que dice que una sola oración debe tratar un solo tema. Por eso, la intención del principio de responsabilidad única no nos resulta ajena y es fácil malinterpretarlo. «Eliminar intereses para lograr claridad semántica» es un punto principal del SRP, pero no es el núcleo. El verdadero objetivo del SRP es eliminar las ramificaciones semánticas menores y, con ello, lograr la previsibilidad del cambio.

Los principios SOLID están concebidos para programas que están vivos y en evolución. Las situaciones cambian constantemente y el programa debe cambiar con ellas. Lo que se necesita aquí es la actitud de *El arte de la guerra* de Sun Tzu: el cálculo de gestionar el riesgo y lograr la eficiencia mediante un planeamiento minucioso. Como dice el pasaje «un general competente no recluta soldados dos veces ni transporta provisiones tres veces» (役不再籍, 糧不三載), es importante eliminar los costes recurrentes.

Por la misma razón, en la fase de desarrollo, hay una gran diferencia de coste entre reconocer claramente el objetivo del trabajo y minimizar el volumen de trabajo, y entre poder ejecutar con decisión sin efectos secundarios o no. En este contexto, que las relaciones semánticas sean claras significa que el impacto de una acción es predecible, lo que a su vez permite calcular el riesgo de la acción. Es por eso que el SRP se considera un estándar, una habilidad básica.

## **DIP: Principio de Inversión de Dependencias**

> Lo abstracto no debe depender de los detalles; los detalles deben depender de lo abstracto.

Mientras cumplía el servicio social como alternativa al servicio militar, observé hasta dónde llega la capacidad de autocorrección de una empresa y, curiosamente, durante ese proceso no dejaba de recordar el principio DIP. La idea es la siguiente: en la estructura típica de una empresa, con una división de tareas entre departamentos y sus miembros, según el DIP la empresa solo debería depender de conceptos socialmente acordados de antemano — la división de tareas — y no de las habilidades o destrezas particulares del empleado que realiza ese trabajo.

Esto es de sentido común. El día a día de una empresa parece fijo, y da la impresión de que ese empleado va a seguir haciendo el mismo trabajo en el mismo puesto ayer, hoy y mañana. Pero en la realidad, los empleados se cambian inevitablemente: por traslados periódicos, reasignaciones repentinas de personal, renuncias o, en casos extremos, por la terrible hipótesis del factor autobús (Bus Factor), en la que el responsable fallece. Si la organización dependiera no solo de la división de tareas sino también de las capacidades individuales, se produciría un caos cuando esa persona, por cualquier motivo, dejara de estar presente.

Desde esta perspectiva, la razón por la que se debe evitar delegar a una persona tareas que van más allá de lo acordado no es solo porque sea un acto inmoral que se aprovecha de la buena voluntad de alguien, sino porque amenaza la sostenibilidad de la organización. Puede que una vez funcione, pero no varias. Si la carga de trabajo requerida por la organización aumenta, no se debe sobrecargar a los individuos, sino reestructurar la distribución de responsabilidades, aunque sea ajustando la división de tareas. Y si se traduce esta lógica en términos técnicos, obtenemos la frase original: «Lo abstracto no debe depender de los detalles; los detalles deben depender de lo abstracto».

## **Erosión en formalismo vacío**

A veces, un concepto presentado de forma pragmática, al establecerse como norma, pierde su significado y se convierte en una mera formalidad. En realidad, no es que «a veces» ocurra; la mayoría de las cosas que conocemos se asientan así y se convierten en cultura y tradición. La POO también comenzó como una metodología centrada en lo práctico, pero hoy en día, en los planes de estudio de programación, tiende a tratarse como un rito de iniciación.

Por eso me asalta la duda. Ya existe un enfoque excelente en cuanto a rendimiento, como DOD, y una alternativa en cuanto a la complejidad de la gestión del estado, como el paradigma funcional. Por supuesto, podría seguir vigente mucho más tiempo. Pero las tendencias recientes, desde la codificación *vibe coding* hasta la ingeniería *harness*, avanzan hacia no tener que inspeccionar el diseño del código directamente por un humano, y cada vez se cuestiona más si el código debe escribirse necesariamente con objetos. Espero que ningún paradigma se convierta en una tradición rígida que perdure para siempre.
