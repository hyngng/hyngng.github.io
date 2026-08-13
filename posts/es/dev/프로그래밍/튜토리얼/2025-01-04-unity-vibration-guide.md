---
title: "Conceder permiso de vibración en proyectos móviles de Unity"


categories: [프로그래밍, 튜토리얼]
tags: [프로그래밍, 튜토리얼]
start_with_ads: true

toc: true

date: 2025-01-31 10:18:00 +0900
last_modified_at: 2026-02-11 17:36:00 +0900

redirect_from:
    - /posts/unity-vibration-implementation/
---

:::warning
**¡Está basado en Android!**
:::

En Unity, la vibración se puede usar básicamente mediante `Handheld.Vibrate()`, pero tiene el inconveniente de que la intensidad y la duración de la vibración son fijas, por lo que se suele recurrir al siguiente método.

## **Añadir el archivo Manifest**

1. En `Edit/Project Settings/Player/Publishing Settings`, marca la opción `Custom Main Manifest`.
2. Se generará un archivo `AndroidManifest.xml` modificable en la ruta `Assets/Plugins/Android` del proyecto.
3. Dentro de la etiqueta `manifest` de ese archivo, añade la línea `<uses-permission android:name="android.permission.VIBRATE" />`.

```cs
<?xml version="1.0" encoding="utf-8"?>
<manifest
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">
    <application>
        <!--Used when Application Entry is set to Activity, otherwise remove this activity block-->
        <activity android:name="com.unity3d.player.UnityPlayerActivity"
                  android:theme="@style/UnityThemeSelector">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            <meta-data android:name="unityplayer.UnityActivity" android:value="true" />
        </activity>
        <!--Used when Application Entry is set to GameActivity, otherwise remove this activity block-->
        <activity android:name="com.unity3d.player.UnityPlayerGameActivity"
                  android:theme="@style/BaseUnityGameActivityTheme">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            <meta-data android:name="unityplayer.UnityActivity" android:value="true" />
            <meta-data android:name="android.app.lib_name" android:value="game" />
        </activity>
    </application>
    <uses-permission android:name="android.permission.VIBRATE" />
</manifest>
```

El archivo `AndroidManifest.xml` completo se muestra arriba. La aplicación compilada con este archivo solicitará permiso de vibración, y si el jugador lo concede, podrá vibrar.

## **Añadir la clase Vibration**

Añade un archivo C# en cualquier ruta del proyecto, pega el siguiente código y guárdalo. Normalmente se escribe en la ruta `Assets/Scripts`.

```cs
using System.Collections;
using UnityEngine;
 
public static class Vibration
{
#if UNITY_ANDROID && !UNITY_EDITOR
    public static AndroidJavaClass AndroidPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
    public static AndroidJavaObject AndroidcurrentActivity = AndroidPlayer.GetStatic<AndroidJavaObject>("currentActivity");
    public static AndroidJavaObject AndroidVibrator = AndroidcurrentActivity.Call<AndroidJavaObject>("getSystemService", "vibrator");
#endif
    public static void Vibrate()
    {
#if UNITY_ANDROID && !UNITY_EDITOR
        AndroidVibrator.Call("vibrate");
#else
        Handheld.Vibrate();
#endif
    }
 
    public static void Vibrate(long milliseconds)
    {
#if UNITY_ANDROID && !UNITY_EDITOR
        AndroidVibrator.Call("vibrate", milliseconds);
#else
        Handheld.Vibrate();
#endif
    }

    public static void Vibrate(long[] pattern, int repeat)
    { 
#if UNITY_ANDROID && !UNITY_EDITOR
        AndroidVibrator.Call("vibrate", pattern, repeat);
#else
        Handheld.Vibrate();
#endif
    }
 
    public static void Cancel()
    {
#if UNITY_ANDROID && !UNITY_EDITOR
            AndroidVibrator.Call("cancel");
#endif
    }
}
```

Esta clase se proporciona de forma estática, por lo que funciona correctamente sin importar dónde se escriba en el proyecto. Recibe la duración de la vibración como un parámetro de tipo `long` e invoca `AndroidVibrator.Call()`. Por ejemplo, se puede usar como `Vibration.Vibrate(long(1000))`. Personalmente, recomiendo usar un valor de `long(10)`.

## **Ejemplo de uso**

```cs
public void Vibrate()
{
    if (MainManager.ActivatedObject == gameObject)
        Vibration.Vibrate((long)10);
}
```

Lo usé de esta manera en un [proyecto anterior](https://hyngng.github.io/es/dev/armonia-second-devlog/). Cuando el jugador tocaba un objeto concreto, ese objeto se activaba y se registraba en `ActivatedObject` de `MainManager`. Funcionó de manera satisfactoria.

:::info
**¡Actualizado el 2025-07-28!**
:::

```cs
public static void Vibrate()
{
    if (PlayerPrefs.GetInt("VibrationEnabled", 1) == 1)
    {
#if UNITY_ANDROID && !UNITY_EDITOR
        AndroidVibrator.Call("vibrate");
#else
        Handheld.Vibrate();
#endif
    }
}
```

O bien, se puede añadir una línea simple como la anterior a `Vibration()` para que solo vibre cuando esté permitido. Tras probarlo directamente, considero que es mejor, tanto conceptual como prácticamente, pasar por un paso de verificación de la condición.
