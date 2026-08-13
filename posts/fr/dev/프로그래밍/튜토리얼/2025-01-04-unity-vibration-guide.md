---
title: "Accorder la permission de vibration dans un projet Unity mobile"


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
**Basé sur Android !**
:::

Dans Unity, la vibration s'utilise par défaut avec `Handheld.Vibrate()`, mais l'intensité et la durée de la vibration étant fixes, on utilise généralement la méthode suivante.

## **Ajouter le fichier Manifest**

1. Dans `Edit/Project Settings/Player/Publishing Settings`, cochez l'option `Custom Main Manifest`.
2. Un fichier `AndroidManifest.xml` modifiable est créé dans le dossier `Assets/Plugins/Android` du projet.
3. Ajoutez la ligne `<uses-permission android:name="android.permission.VIBRATE" />` à l'intérieur de la balise `manifest` du fichier.

```cs
<?xml version="1.0" encoding="utf-8"?>
<manifest
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">
    <application>
        <!--Utilisé lorsque l'entrée de l'application est réglée sur Activity, sinon supprimer ce bloc activity-->
        <activity android:name="com.unity3d.player.UnityPlayerActivity"
                  android:theme="@style/UnityThemeSelector">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            <meta-data android:name="unityplayer.UnityActivity" android:value="true" />
        </activity>
        <!--Utilisé lorsque l'entrée de l'application est réglée sur GameActivity, sinon supprimer ce bloc activity-->
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

Le fichier `AndroidManifest.xml` final ressemble à ce qui précède. Les applications buildées à partir de ce fichier demanderont la permission de vibration, et celle-ci pourra être activée si le joueur l'autorise.

## **Ajouter la classe Vibration**

Ajoutez un fichier C# à n'importe quel emplacement du projet, collez le code ci-dessous et enregistrez-le. Il est généralement placé dans le dossier `Assets/Scripts`.

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

Cette classe étant statique, elle fonctionne correctement quel que soit l'endroit où on l'écrit dans le projet. Elle reçoit la durée de vibration sous forme de paramètre `long` et appelle `AndroidVibrator.Call()`. Par exemple, on peut l'utiliser comme `Vibration.Vibrate(long(1000));`. Personnellement, j'ai trouvé que `long(10)` donnait un bon résultat.

## **Exemple d'utilisation**

```cs
public void Vibrate()
{
    if (MainManager.ActivatedObject == gameObject)
        Vibration.Vibrate((long)10);
}
```

Je l'ai utilisé ainsi dans un [projet précédent](https://hyngng.github.io/fr/dev/armonia-second-devlog/). Lorsque le joueur touche un objet spécifique, cet objet est activé et enregistré dans `ActivatedObject` du `MainManager`. Cela a bien fonctionné, à ma satisfaction.

:::info
**Mis à jour le 2025-07-28 !**
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

Ou encore, on peut ajouter une simple ligne de code à `Vibration()` comme ci-dessus pour que la vibration ne se déclenche que si elle est autorisée. Après l'avoir utilisé moi-même, il m'a semblé que passer par une étape de vérification de condition était meilleur, tant conceptuellement que pratiquement.
