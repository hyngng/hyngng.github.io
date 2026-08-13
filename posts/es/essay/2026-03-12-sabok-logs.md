---
image:
    path: /2026-03-12-sabok-logs/preview-image.webp
    lqip: data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAAAQAgCdASoQAAgAAUAmJQBOgMWCurp2S40AAP40cqnHH3viH6b121abUEDvfkR211iqjaVqJ+Z1BmHGv+24T0oQXGcfzUKwSSbEO5ZWf0NyJbhKbNbqqnu/aAwH/s82QAA=
    alt: "Fotos de comidas que fui tomando en mis ratos libres"

title: "Crónica de 1 año y 8 meses como servidor público social sustituto"
authors: ["essay"]

categories: [에세이]
tags: [에세이, 사회복무요원]
start_with_ads: true

toc: true

date: 2026-03-12 10:30:00 +0900
last_modified_at: 2026-06-25 15:26:00 +0900

mermaid: true
---

## **Qué debería escribir**

Excluyendo el mes de campo de entrenamiento, tuve muchas experiencias en 1 año y 8 meses. Dada la naturaleza archivística de mi blog, querría registrarlo todo con honestidad y sin reservas, pero tras consultar con la Administración de Recursos Militares y la institución, parece que podría incomodar a ambas partes.

En particular, en una entrevista con un funcionario de la Administración de Recursos Militares, la postura que me transmitieron fue que, formalmente, el sistema de servicio social sustituto está diseñado para que el servidor público sea un «ser pasivo que solo debe hacer lo que se le asigna». Las mejoras voluntarias en el trabajo o el registro de experiencias laborales no son, en principio, tareas asignadas, por lo que, aunque personalmente el funcionario pudiera considerarlo loable y deseable, a nivel institucional no podían protegerme. No sin razón, lo publico pulido, sin especificar la institución ni las tareas concretas.

Básicamente, mi experiencia no es una experiencia común de servicio social. Para poner una analogía, no es diferente de exponer sin filtro las experiencias y circunstancias internas de una empresa antes de cambiarse de trabajo. Siento que esa conducta no es ética, por lo que probablemente no pueda tratarlo en detalle. Pero mis impresiones personales son otra cosa. Sinceramente, me sentí muy desconcertado. Tanto las particularidades del sistema de servicio social como el entorno de la institución donde fui destinado eran bastante peculiares. Hubo muchos momentos de presión, y a menudo llegaba a casa reflexionando sobre cómo podría aceptar de manera constructiva la situación en la que me encontraba. También sentí la injusticia de tener que hacer semejante reflexión, pero primero busqué alternativas realistas.

Sobre todo, no quería desperdiciar 20 meses. Si me preguntan si me arrepiento de algo al mirar atrás, no es que no haya arrepentimientos, pero al menos no fue tiempo perdido. Primero, mantuve el blog activo sin pausa; en la oficina, instalé herramientas de desarrollo como Git, VS Code, Visual Studio, Obsidian y Python, y planifiqué y desarrollé pequeños programas. Aprovechando los trayectos de ida y vuelta al trabajo, las horas de comida, los fines de semana, las vacaciones de Chuseok y otros ratos libres, leí unos 18 libros, entre ellos *Por qué fracasan los países*, *El mito de Sísifo*, *Laozi*, *Meditaciones* y otros similares. Y traté de reflejar este tono productivo incluso durante mi horario en la oficina.

## **Con esmero y con dedicación**

![qr-code-and-program-structure-light](/2026-03-12-sabok-logs/qr-code-and-program-structure-light.webp){: .light .border }
![qr-code-and-program-structure-dark](/2026-03-12-sabok-logs/qr-code-and-program-structure-dark.webp){: .dark  }
*Estuve haciendo cosas como estas. Códigos QR, programas de macros, etc.*

El servicio público tiene su atmósfera particular. Falta entusiasmo por dedicarse a las tareas asignadas y no hay mucho interés en mejorar el trabajo. Desde una perspectiva externa, tanto como los prejuicios sociales, se tiende a actuar «como se ha hecho siempre» para ir sobre seguro. Era un entorno que consideraba crudamente diferente de los mensajes productivos que había experimentado en la universidad, en clubes y en muchas conferencias: «cuestiona por qué haces esto y por qué lo haces así», «todo trabajo que hagas tendrá algún problema, encuéntralo y mejóralo tú mismo».

Sentí una disonancia. Es famoso el dicho de que «en la función pública es difícil que ocurra la innovación», pero no imaginaba que fuera hasta este punto. Sin embargo, tampoco me parecía bien dejarme arrastrar por la atmósfera, así que me centré en mejorar el trabajo: acorté mis propias tareas y ayudé a los funcionarios. Aunque mejorar la ineficiencia era una conducta que destacaba en la oficina, seguía mereciendo la pena intentarlo, y además tenía la pequeña satisfacción de obtener buenos resultados.

### **Crear y gestionar códigos QR**

Había situaciones en las que había que transferir archivos de aplicaciones con frecuencia desde teléfonos móviles. Los funcionarios de la oficina usaban varios teléfonos con los archivos guardados como almacenamiento, y cada vez encendían uno y seguían el proceso de «Mis archivos > Carpeta de descargas > Compartir > Quick Share > Transferir archivo». Era incómodo. Yo mismo tuve que hacerlo varias veces, y aparte de la lentitud del teléfono nada más encenderse, a menudo la batería estaba agotada, así que había que buscar un cargador, conectarlo y esperar unos minutos: una dificultad pequeña pero repetitiva.

Por la naturaleza del servicio público, había un vacío estructural en el que mejorar pequeñas ineficiencias no formaba parte de las funciones de nadie, así que decidí llenar ese vacío con códigos QR. Creé una cuenta de Google vacía, la conecté a Dropbox y subí los archivos. Cambié el parámetro `0` al final de la URL `https://www.dropbox.com/s/identifier/filename?dl=0` a `1` para que la descarga comenzara automáticamente al acceder a la URL. Luego, a través de «Chrome > Enviar, guardar, compartir > Crear código QR», generé el código QR, lo diseñé en Figma, lo imprimí en papel y lo plastifiqué.

En resumen, creé una estructura más intuitiva en la que bastaba con abrir la aplicación de la cámara para recibir el archivo. Era algo liviano que no suponía un problema incluso si se filtraba, y todo el mundo había sentido la incomodidad en la práctica, por lo que la respuesta fue buena. Más tarde, los funcionarios me pidieron varias veces que hiciera códigos QR cuando había nuevos archivos de aplicaciones, y los hice a menudo, probando diversas cosas como agrandar el código QR o crear plantillas en archivos Hangul (한글) más familiares.

### **Crear macros web y de Excel**

En el lugar donde estaba, había que hacer mucho trabajo de conectarse a la web, descargar archivos y organizarlos en Excel. Incluso hubo una tarea que requería modificar cerca de 30 000 filas de datos durante casi medio día. Como cuando llegué a la oficina ya sabía algo de Python, empecé a investigar y a escribir código para resolver esta situación. Para las tareas repetitivas diarias, creé macros con `selenium`; para el trabajo con Excel, redactaba primero una especificación de desarrollo y, según las necesidades de otros funcionarios o servidores públicos sustitutos, creaba una estructura para depurar datos matriciales y guardar archivos con `openpyxl`, `pandas` o `xlwings`.

Para que otros servidores públicos sustitutos menos familiarizados con la informática pudieran usarlo, hice que los valores de las variables pudieran modificarse desde un archivo externo `config.yaml`. Considerando su poca familiaridad con la informática, empaqueté el programa en formato `.bat` o `.exe` ejecutable con un solo clic en lugar de `.py`. También incluí un `README.md` para posibles servidores públicos sustitutos que supieran programar, y redacté un manual de usuario en Obsidian y Markdown para que pudiera perdurar, lo convertí a PDF y lo entregué como un paquete completo.

Sin embargo, esta parte no tuvo buena acogida. Los funcionarios y los servidores públicos sustitutos no mostraban gran interés por el programa en sí ni por la eficiencia laboral, y además el programa no era lo suficientemente intuitivo. El manejo de excepciones era deficiente, por lo que en algunas situaciones había que cerrarlo y empezar de nuevo, o se cerraba forzosamente, y esta experiencia parece haber dejado una mala primera impresión. El proceso de reconfigurar los valores mediante `config.yaml` también resultó, contra lo esperado, poco familiar para la mayoría. Fue una ocasión para reflexionar sobre la utilidad del programa y los estándares mínimos de calidad.

### **Manejar Excel en sí mismo**

> Fulano, haz una hoja de Excel y ordéname todos los datos aquí.

El trabajo con Excel fue precisamente la primera tarea de mi primer día. Pero el primer día no sabía nada de Excel, y recuerdo haber pensado para mis adentros: «¿Qué será una hoja?». Ese día lo resolví como pude con la ayuda de ChatGPT, pero después me siguieron encargando trabajos similares, y poco a poco fui cogiendo soltura con Excel. No es una expresión hecha: funciones como `IFERROR`, `COUNTIF`, `SUMIF`, `VLOOKUP`, `INDIRECT`, tablas dinámicas, formato condicional, formato de celdas, inmovilizar paneles, vista previa de impresión... pude dominar muchos fundamentos. Si hubiera empezado a aprender Excel para sacarme un certificado de competencia ofimática, probablemente no me habría interesado tanto.

La experiencia en programación me fue de gran ayuda. Por ejemplo, la función `IF` de Excel no es diferente de un operador ternario, y `VBA` es abiertamente un lenguaje de programación. Más allá de la mera familiaridad con la herramienta, también hubo diferencias en el enfoque de resolución de problemas. Dejaba el trabajo manual como último recurso e intentaba resolverlo todo con las funciones que ofrece Excel. Fui acumulando pequeños logros en silencio, y al cabo de unos seis meses, los demás, incluidos los funcionarios, empezaron a preguntarme sobre Excel.

### **Tareas auxiliares eventuales**

Además, tuve experiencias relacionadas con tareas irregulares según las circunstancias. Entre ellas, recuerdo especialmente las siguientes:

1. A finales de 2024, mientras extraía datos de un disco duro, toqué sin querer un adaptador conectado flojo a un puerto USB-B y los archivos se perdieron. Por suerte no eran datos importantes, pero al pensar que había causado un daño por mi error, busqué métodos de recuperación de particiones como TestDisk y rescaté los archivos. Sin embargo, cuando se lo comenté al funcionario, me dijo: «Ahora ya no lo necesito, pero lo tendré en cuenta, gracias». No fue una contribución importante, pero fue una experiencia instructiva.

2. «Eres de informática, ¿verdad? El ordenador no funciona bien, ¿puedes echarle un vistazo?» — esto lo oí de verdad, y bastante a menudo. En la mayoría de los casos, bastaba con limpiar el polvo de los contactos de la RAM y volver a insertarla; en raras ocasiones, había que limpiar el interior o incluso reemplazar el equipo con stock sobrante. Tenía el problema de que nunca había manipulado hardware de ordenadores, pero con la ayuda de otro servidor público sustituto fui aprendiendo una cosa y otra, y ahora estoy bastante familiarizado con el montaje y desmontaje.

3. Una vez, un funcionario me pidió que comprimiera el tamaño de un archivo PDF. Como los datos laborales no podían subirse a Internet, lo resolví localmente descargando un programa externo, y entonces el funcionario me advirtió: «Gracias, pero somos una institución pública, no podemos usar programas externos sin más». Busqué la licencia y, como era gratuito incluso para uso comercial, no parecía haber mayor problema, pero pensé: «Entonces, si lo hago yo mismo, no hay problema», y creé un programa en Python que realizaba la misma tarea y lo usé.

Además de esto, también resuelvo mediante vibecoding la conversión masiva de archivos `heif` a `jpg` en local; o creé un programa de sorteo de personas con la función `RAND()` de Excel, con toda la estructura de funciones visible. Son cosas que recuerdo.

## **El rey tiene orejas de burro**

![reading-clips](/2026-03-12-sabok-logs/reading-clips.webp)
*Leer libros ayudó mucho a recomponerme y a confirmar principios*

Sin embargo, la atmósfera característica del servicio público resultó problemática. Porque, aunque se alegraban de que me esforzara en el trabajo, eso era todo. Contrariamente a mi intención inicial, que presuponía cierto grado de acogida activa, la situación degeneró en un «como tú sabes hacerlo, a partir de ahora encárgate tú de todo», lo cual fue desconcertante. Por ejemplo, en el caso del código QR, que empezó como un favor, cuando un funcionario fue trasladado, se transfirió como si fuera parte de mis tareas oficiales: «La aplicación se descarga escaneando el código QR; las versiones que no están aquí, dile a esa persona que te las haga». Y esto es solo un ejemplo; hubo varias experiencias más que fueron confusas.

### **Percepción jerárquica mutua**

> A: Señor B, ¿qué trabajo tiene ahora?  
> B: Estoy haciendo tal cosa.  
> A: ¿Nada más que eso?  
> B: Ah, y también estoy haciendo el trabajo del más nuevo y tal otra cosa.  
> B: También estoy haciendo equis cosa.  
> A: No, eso no es tal cosa. ¿No hay nada más?  
> B: Fuera de eso, no.  
> A: Entonces, si no está ocupado, ¿por qué no hace tal cosa mientras holgazanea?  
> B: ¿?

En el lugar donde estaba, existía una cultura de cohortes, y entre los servidores públicos sustitutos se daban conversaciones como la anterior con total naturalidad. No me importa lo que acuerden entre ellos, pero el problema era que a mí y a otros servidores públicos sustitutos que no pensábamos así nos decían cosas como «tú eres el más nuevo, así que todo el trabajo pesado te toca a ti solo». Era especialmente vergonzoso ver cómo presumían sin ser conscientes de que estaban creando un concepto inexistente. Entre mis compañeros del campo de entrenamiento y conocidos indirectos, nunca había oído hablar de esta cultura, y resulta lamentable que unos simples servidores públicos sustitutos intenten establecer una jerarquía del tipo «yo entré antes que tú, por tanto soy superior; tú entraste después que yo, por tanto eres inferior».

> P. ¿Tiene experiencia resolviendo conflictos en la vida en grupo?

En muchos formularios de solicitud y entrevistas de empresas aparece con frecuencia esta pregunta. Y al experimentarlo en carne propia, pude entender por qué. El conflicto, en la medida en que supone una gran presión y estrés para las partes implicadas, difícilmente se resuelve con sabiduría. La mayoría señala como ejemplos modélicos informar discretamente a un superior, llegar a un acuerdo lógico o crear nuevas reglas de mutuo acuerdo, pero en mi caso fue difícil usar este enfoque directo. La relación vertical obligatoria por normativa (gap-eul) era un problema, pero la condición más difícil era que la percepción de los implicados —funcionarios y servidores públicos sustitutos— era diferente de la mía. Así que, en mi caso, lamentablemente, tuve que asumir las consecuencias adversas.

### **Notificación disfrazada de persuasión**

> Parece que como no has tenido vida social, te diré que yo creo que es así. ¿Por qué crees que aquel funcionario hace todos los trabajos diversos? Y aquel otro funcionario es el que menos hace, ¿no? ¿Por qué crees que es así? Hablan de juegos militares, pero los veteranos saben muchas cosas y cuando les pides algo, lo hacen rápido. Así que la estructura actual tiene su razón de ser. Por eso nosotros consentimos que te manden hacer cosas.

> Tú quieres una sociedad igualitaria, pero ellos y yo creemos que esto es lo correcto. Lo que dices tiene algo de razón y no hay una respuesta única. Pero ellos han creído siempre que eso es lo correcto. También ellos sufrieron cuando eran los más nuevos, y ahora estarán esperando poder estar más cómodos. Si les impones tu forma de pensar, se quejarán y estallará el problema.

> En la oficina nadie lo dice, pero creemos que tú tienes más criterio y te manejas mejor que el otro servidor público sustituto. Todos lo piensan. Por eso te digo esto.

> Cuando llegue el nuevo servidor público, creo que también se unirá a ti. En cierto modo, se está formando un bando. Eso es lo que nos preocupa.

Lo he transcrito de memoria, así que no será exacto, pero la intención era la anterior. Algunos funcionarios defendían —o al menos toleraban— ese tipo de injusticia. Tengo mucho que decir sobre esto, pero lo resumiré brevemente. El lenguaje olía a agua estancada y podrida. «Sufrir de joven, disfrutar como un inmortal en la vejez». En el ámbito de la función pública, esta cultura parece considerarse no solo canónica, sino completamente natural. Hasta ahí, es el ámbito del tipo de empleo y la cultura interna de la empresa, y entiendo que haya un contexto que ha dado lugar a esa mentalidad. Pero el problema es pretender aplicar esa ley no escrita también a los servidores públicos sustitutos, que son externos. Además, lo que me dijeron tomaba prestada la retórica de la persuasión, pero el contenido era una notificación, una falacia difícil de escuchar. Intuitivamente, esa opinión no es madura. Incluso después de calmarme y pensarlo con más seriedad, no me parece en absoluto atractiva.

### **Pensamientos sobre la autoridad**

Aunque me desagrade la forma en que funciona la autoridad en la oficina, no puedo negar su necesidad. Quiero dejar aquí una reflexión al respecto. Según mi entendimiento, la razón por la que la anti-autoridad tiene fuerza persuasiva es, primero, que los sistemas y los juicios de valor no existen en esencia; y segundo, que siempre hay ineficiencias en las que el significado ha desaparecido y solo queda la forma, y esas ineficiencias deben ser descubiertas y corregidas. Y la razón por la que la autoridad tiene fuerza persuasiva es que ese orden imaginario tiene el potencial de permitir una cooperación a gran escala eficiente.

Esta relación se resume claramente como: «primero la autoridad, luego la anti-autoridad. La reducción de la autoridad se hace según el beneficio práctico». Y esta lógica se puede aplicar de manera universal. Por ejemplo, supongamos un entorno donde la configuración del destino de la impresora o el orden de la lista de contactos debe ordenarse según el rango: eso es para el protocolo y la política, no para mejorar el entorno laboral o fomentar una vida laboral feliz. Esa autoridad necesita una explicación.

La experiencia y los conocimientos de quienes llevan 5, 10 o 20 años en una organización merecen respeto. Pero existen sin duda quienes han ido afrontando el día a día sin suficiente reflexión ni revisión, y el liderazgo de esas personas es peligroso. En mi caso, entre los servidores públicos sustitutos —todos en el mismo barco— existía la mala costumbre de dividirse entre veteranos y novatos y distribuir los beneficios de manera estructuralmente desigual, y esta mala costumbre se mantenía por intereses difíciles de expresar con palabras. Y el primer principio que lo hacía posible era, sin duda, una autoridad meramente nominal.

La alternativa que tomé como referencia era la siguiente: los principios son para las grandes cosas; para las pequeñas, basta la misericordia<sup>«Il faut mettre ses principes dans les grandes choses, aux petites la miséricorde suffit»</sup>. No pretendo decir que este principio deba aplicarse estrictamente en toda situación, pero tanto entre los servidores públicos sustitutos como entre los funcionarios, algunos daban claramente la impresión de estar excesivamente atados al rango y a la política interna. Ese problema se habría visto mucho mejor si hubieran aflojado un poco.

## **Extra: el día de la licenciatura**

A medida que se acercaba el día de la licenciatura, sentía que se intensificaban emociones complejas y sutiles. Era algo inesperado y casi la primera vez que experimentaba algo así. En particular, al final, a diferencia de mi expectativa de poder expresar mis pensamientos con más soltura, me encontré conteniendo a duras penas una emoción que me embargaba. Al salir por la puerta de la oficina, la tensión se relajó por completo, y tuve que dar un paseo para recomponerme.

En el tren de vuelta a casa, fui anotando lentamente lo que sentía, y creo que puedo resumirlo así: la desilusión de que mi antiguo afán por mejorar lo que me resultaba frustrante hubiera terminado sin un resultado significativo; la presión debida a la coerción estructural del reglamento de servicio y la peculiar atmósfera de la oficina; la sensación de liberación y alivio por haberme desprendido de todo eso; la emoción y la expectativa de volver por fin a mi ser original; la sensación de destino de que un capítulo de la vida llegaba a su fin; la mezcla de alivio y nostalgia porque una de las palabras clave que me definían había desaparecido; la inesperada tristeza de que esa palabra clave realmente estuviera desapareciendo; [los recuerdos del antiguo campo de entrenamiento](https://hyngng.github.io/es/essay/training-camp-logs/). Y parece que también se mezclaban otras emociones menores.

Una cosa más: al salir por última vez por la puerta de la oficina, pensé que a partir de ahora las comidas iban a ser menos entretenidas. Lo que más honestamente podía aceptar en la oficina era el ambiente de la hora de comer. La hora del almuerzo era para mí y para mis compañeros servidores públicos sustitutos un momento para tomar un respiro, para compartir preocupaciones o intercambiar ideas, y sentí que era una lástima que la pequeña alegría de deliberar sobre el menú de la comida y el café terminara aquí. Habrá situaciones similares en el futuro, en la escuela o en otros trabajos, pero la sensación será sin duda diferente.

En realidad, que a través de un sistema de servicio social sin mayor importancia tenga estas reflexiones se debe probablemente al apego que siento por la vida.

## **Archivo**

![background-images](/2026-03-12-sabok-logs/background-images.webp)
*El primer entorno con doble monitor que usé. Decidí poner una imagen gratuita en el izquierdo y un dibujo mío en el derecho, separando lo público de lo personal.*

![obsidian-notes-light](/2026-03-12-sabok-logs/obsidian-notes-light.webp){: .light .border }
![obsidian-notes-dark](/2026-03-12-sabok-logs/obsidian-notes-dark.webp){: .dark  }
*Seguí usando Obsidian personalmente en situaciones como la primera inducción o la planificación del programa de macros.*

```python
# Escribir un programa que recibe múltiples enteros con una sola línea de código e imprime su suma.
# Lo encontramos rápidamente con otro servidor público sustituto, sin IA. Me gustaban esas pequeñas cosas.

print(sum(map(int, input().split())))
```

- Cosas que no se reflejaron en el texto
    - Un compañero servidor público que me advirtió que podría llegar a odiar a la gente. Y yo no acepté la situación de esa manera.
    - Otro compañero servidor público que, ante un funcionario que siempre hablaba de «vida social», replicó que era porque no había tenido un buen trabajo.
    - Gente corriente que hacía peticiones excesivas, como ajustar los horarios de tren a sus horas de entrada y salida.
    - Tazones de fideos vacíos, envases de comida a domicilio, botellas de bebida de cortesía que habían perdido a su dueño sin haberse vaciado.
    - Bolsas de basura general a punto de reventar, con cadáveres de arañas secos y posos de café pegados.
    - Escritorios llenos de polvo, teléfonos sonando cada 10 minutos, insultos y gritos, ese olor rancio característico.
    - Señores de 50 o 60 años que, después de ir al baño, me tendían la mano para saludar sin lavársela.
    - El fuerte olor a tabaco que desprendían los fumadores de toda condición.
    - Y otros etcéteras.txt (215 GB)

## **Para terminar**

![alarm-light](/2026-03-12-sabok-logs/alarm-light.webp){: .light .w-75 }
![alarm-dark](/2026-03-12-sabok-logs/alarm-dark.webp){: .dark .w-75 }
*La alarma que usé durante 1 año y 8 meses. Lo que «había que hacer por ahora» ha terminado, y ahora puedo apagar esta alarma para siempre.*

Una hora y cuarenta minutos de ida y vuelta al trabajo. Recuerdo que hacia el octavo mes deseaba intensamente dejarlo. Al pensar en aquel entonces, me siento muy afortunado de poder dejarlo ahora. Aunque las experiencias desagradables fueron frecuentes en los últimos 1 año y 8 meses, no fue tiempo perdido, y con eso me basta. Ahora «lo que había que hacer por ahora» ha terminado, y es hora de hacer lo que tengo que hacer a partir de ahora.
