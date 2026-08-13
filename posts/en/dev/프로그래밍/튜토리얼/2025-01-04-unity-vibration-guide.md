---
title: "Granting Vibration Permission in Unity Mobile Projects"

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
**Based on Android!**
:::

In Unity, vibration can be used by default via `Handheld.Vibrate()`, but since the intensity and duration are fixed, the following method is typically used instead.

## **Adding a Manifest File**

1. In `Edit/Project Settings/Player/Publishing Settings`, check the `Custom Main Manifest` option.
2. An editable `AndroidManifest.xml` file will be created at the project path `Assets/Plugins/Android`.
3. Add the line `<uses-permission android:name="android.permission.VIBRATE" />` inside the `manifest` tag of that file.

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

The completed `AndroidManifest.xml` file will appear as shown above. Apps built based on this file will request vibration permission, and vibration will work once the player grants it.

## **Adding a Vibration Class**

Create a C# file anywhere in the project path, paste the code below, and save. It's typically written under the `Assets/Scripts` path.

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

This class is provided statically, so it works fine regardless of where it's written in the project. It receives vibration duration as a `long` parameter and calls `AndroidVibrator.Call()`, for example `Vibration.Vibrate(long(1000));`. Personally, I found using around `long(10)` to work well.

## **Usage Example**

```cs
public void Vibrate()
{
    if (MainManager.ActivatedObject == gameObject)
        Vibration.Vibrate((long)10);
}
```

I used it as shown above in a [previous project](https://hyngng.github.io/en/dev/armonia-second-devlog/). When the player touches a specific object, that object becomes active and registers itself in `MainManager`'s `ActivatedObject` slot — it worked quite well.

:::info
**Updated on 2025-07-28!**
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

Alternatively, you can add a simple conditional check to `Vibration()` as shown above, so that vibration only fires when it's enabled. From my own use, going through a condition check once is better both conceptually and practically.
