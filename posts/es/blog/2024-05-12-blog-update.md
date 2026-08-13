---
title: "Actualizando el tema de un blog de GitHub"
authors: ["blog"]

categories: [블로그]
tags: [깃허브, 업데이트, Chirpy]
start_with_ads: true

toc: true

date: 2024-05-12 11:32:00 +0900
last_modified_at: 2025-10-20 13:55:00 +0900
---

:::info
Este artículo fue escrito cuando usaba el framework Jekyll. ¡Ahora he migrado a Astro!
:::

## **Introducción**

El tema Chirpy que estoy usando se mantiene y actualiza periódicamente. De vez en cuando, cuando estoy aburrido, miro el [historial de actualizaciones](https://github.com/cotes2020/jekyll-theme-chirpy/blob/master/docs/CHANGELOG.md), y esta vez, al comprobarlo, vi que justo ayer la versión había subido a `7.0.0` con varias mejoras y nuevas funciones.

Con esta versión, se ha hecho posible insertar archivos locales de vídeo y audio, y ahora se admite oficialmente la escritura de `description` en el front matter. También destaca que se ha cambiado para poder medir las visitas a los posts usando [GoatCounter](https://www.goatcounter.com/).

## **Actualización**

:::warning
¡Se recomienda hacer una copia de seguridad de los archivos primero!
:::

Como el blog de GitHub tiene un menor grado de acoplamiento con el proveedor de servicios en comparación con otras plataformas de blogs, el proceso de actualización consiste básicamente en traer los nuevos archivos y código a la carpeta existente. Esto se debe a que todo se reduce a fusionar el código actualizado en mi repositorio. Por lo tanto, puede no ser difícil para quienes ya han pasado por un proceso de fusión con Git.

En mi caso, al [personalizar el tema](https://hyngng.github.io/es/blog/first-blog-customization/), había hecho varios trabajos menores: mejorar las traducciones al coreano en `_data/locales/ko-KR.yml`, cambiar el tipo y tamaño de los iconos de la barra lateral, y poner los títulos de vista previa de los artículos en negrita, entre otros. Como estos cambios, obviamente, no se reflejan oficialmente, cada vez que hay una actualización hay que revisar y preservar el código modificado uno por uno, como si se hiciera una cirugía. La [guía oficial de actualización](https://github.com/cotes2020/jekyll-theme-chirpy/wiki/Upgrade-Guide) también indica que se trabaje con paciencia: «Please be patient and careful to resolve these conflicts».

### **Fusión automática**

```bash
git remote add upstream https://github.com/cotes2020/jekyll-theme-chirpy.git
```
{: .nolineno }

Empecé registrando el repositorio de Git una vez más por si acaso. No es obligatorio.

```bash
git fetch upstream
git merge remotes/upstream/master
```
{: .nolineno }

A continuación, fusioné con la rama `master` de Chirpy. La versión de los archivos que se fusionan se puede comprobar en las [etiquetas](https://github.com/cotes2020/jekyll-theme-chirpy/tags) registradas aquí, que en el momento de escribir esto es, por supuesto, `v7.0.0`. Si no hubo problemas intermedios, Git realiza una fusión automática de lo que puede, y el resto de los elementos que Git no puede manejar deben continuarse manualmente.

### **Fusión manual**

![merge](/2024-05-12-blog-update/merge.webp)
*Pantalla de edición de la página de información. Se resuelve el conflicto quedándose con una de las dos opciones.*

En mi caso, continué con la fusión manual usando VS Code. Para quienes sea la primera vez que hacen una fusión de esta manera: si se quiere conservar tu código, selecciona «Accept Current Change»; si se quiere reemplazar con el código nuevo, selecciona «Accept Incoming Change». Una vez elegido, es difícil revertirlo con el tiempo, así que es mejor revisarlo con calma.

La versión que estaba usando antes era la `6.3.1`, y como había muchos cambios desde entonces y también no pocas modificaciones por mi parte, fui revisando uno por uno con calma. Por suerte, había marcado con comentarios las partes que requerían atención, como con `/* region 수정됨 */`, así que no tardé demasiado, unos 30 minutos aproximadamente.

```bash
npm run build
```
{: .nolineno }

Una vez terminada la fusión, hay que compilar los archivos CSS y JavaScript. Aunque sea tedioso, hay que hacerlo manualmente.

```bash
git add assets/js/dist _sass/vendors -f
```
{: .nolineno }

Luego se añaden los archivos generados al repositorio de Git y se hace push. Eso es todo.

Si se ha completado hasta aquí, por último hay que abrir el servidor local con el comando `bundle exec jekyll s` y comprobar que el servidor se inicia correctamente y que no hay problemas en la página. Puede que haya elementos de fusión olvidados o que la fusión se haya hecho mal y alguna parte de la página esté rota. Si hay algo así, aunque lleve tiempo, resolvámoslo con calma.

### **Verificación de la aplicación**

::video{src="/2024-05-12-blog-update/video/240410-232136.mp4"}
*Muestra de vídeo. Captura de juego en desarrollo actualmente.*

{%
  include embed/audio.html
  src='/2024-05-12-blog-update/audio/eating-chips.mp3'
  title='Muestra de audio. Sonido de comer patatas crujientes.'
%}

## **Conclusión**

¡La actualización ha terminado! Tanto el vídeo como el audio, funciones añadidas en `7.0.0`, funcionan correctamente. Sin embargo, al ver el resultado, me pregunto si para el vídeo no sería más limpio usar la inserción de YouTube; tendré que pensar con calma dónde usarlo.

En fin, tenía bastantes cambios pendientes acumulados y siempre había querido actualizar la versión del tema en algún momento. Estoy satisfecho de haberlo completado bien para ser la primera vez. No me ha parecido especialmente difícil ahora que lo he hecho, y a partir de ahora lo mantendré de vez en cuando 😊
