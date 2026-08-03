---
title: "Добавление разрешения на вибрацию в мобильный проект Unity"


categories: [프로그래밍, 튜토리얼]
tags: [프로그래밍, 튜토리얼]
start_with_ads: true

toc: true
toc_sticky: true

date: 2025-01-31 10:18:00 +0900
last_modified_at: 2026-02-11 17:36:00 +0900

redirect_from:
    - /posts/unity-vibration-implementation/
---

:::warning
**Для Android!**
:::

В Unity вибрацию можно использовать по умолчанию через `Handheld.Vibrate()`, но сила и длительность вибрации фиксированы, поэтому обычно используют следующий метод.

## **Добавление файла Manifest**

1. В меню `Edit/Project Settings/Player/Publishing Settings` установите флажок `Custom Main Manifest`.
2. В пути `Assets/Plugins/Android` проекта будет создан редактируемый файл `AndroidManifest.xml`.
3. Внутри тега `manifest` добавьте одну строку кода: `<uses-permission android:name="android.permission.VIBRATE" />`.

```cs
<?xml version="1.0" encoding="utf-8"?>
<manifest
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">
    <application>
        <!--Используется, если входным приложением (Application Entry) является Activity; в противном случае удалите этот блок activity-->
        <activity android:name="com.unity3d.player.UnityPlayerActivity"
                  android:theme="@style/UnityThemeSelector">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            <meta-data android:name="unityplayer.UnityActivity" android:value="true" />
        </activity>
        <!--Используется, если входным приложением (Application Entry) является GameActivity; в противном случае удалите этот блок activity-->
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

Готовый файл `AndroidManifest.xml` выглядит, как показано выше. Приложение, собранное на основе этого файла, будет запрашивать разрешение на вибрацию, и после его предоставления пользователем вибрация станет возможна.

## **Добавление класса Vibration**

Добавьте C#-файл в любом месте проекта, вставьте и сохраните приведённый ниже код. Обычно его пишут в папке `Assets/Scripts`.

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

Этот класс предоставляется статически, поэтому он будет работать независимо от того, где в проекте он написан. Он принимает время вибрации в виде параметра типа `long` и вызывает `AndroidVibrator.Call()`. Например, можно использовать так: `Vibration.Vibrate(long(1000));`. Лично мне показалось удобным использовать `long(10)`.

## **Пример использования**

```cs
public void Vibrate()
{
    if (MainManager.ActivatedObject == gameObject)
        Vibration.Vibrate((long)10);
}
```

[В предыдущем проекте](https://hyngng.github.io/posts/armonia-second-devlog/) я использовал эту функцию, как показано выше. Когда игрок касается определённого объекта, этот объект активируется и регистрируется в `ActivatedObject` у `MainManager`. Всё работало удовлетворительно.

:::info
**Обновлено 2025-07-28!**
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

Или можно добавить такую простую строку кода в `Vibration()`, чтобы вибрация срабатывала только тогда, когда она разрешена. На практике я убедился, что дополнительная проверка условия лучше как концептуально, так и практически.
