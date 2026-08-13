---
title: "为Unity移动项目授予振动权限"


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
**基于Android！**
:::

在Unity中，振动通常可以使用 `Handheld.Vibrate()` 的形式，但缺点是振动强度和持续时间固定，因此主要使用以下方法。

## **添加Manifest文件**

1. 在 `Edit/Project Settings/Player/Publishing Settings` 中勾选 `Custom Main Manifest` 项。
2. 项目路径 `Assets/Plugins/Android` 下会生成可编辑的 `AndroidManifest.xml` 文件。
3. 在该文件的 `manifest` 标签内添加一行 `<uses-permission android:name="android.permission.VIBRATE" />` 即可。

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

完成的 `AndroidManifest.xml` 文件如上所示。基于该文件构建的应用将请求振动权限，玩家允许后即可振动。

## **添加Vibration类**

在项目路径任意处添加C#文件，粘贴以下代码并保存。通常写在 `Assets/Scripts` 路径下。

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

该类以静态方式提供，因此写在项目任何位置都能正常工作。通过 `long` 类型参数接收振动时间，调用 `AndroidVibrator.Call()`，例如可以像 `Vibration.Vibrate(long(1000));` 这样使用。个人觉得 `long(10)` 左右效果不错。

## **使用示例**

```cs
public void Vibrate()
{
    if (MainManager.ActivatedObject == gameObject)
        Vibration.Vibrate((long)10);
}
```

在[之前的项目](https://hyngng.github.io/zh/dev/armonia-second-devlog/)中曾如上使用。玩家触摸特定对象时，该对象被激活并注册到 `MainManager` 的 `ActivatedObject` 位置，效果令人满意。

:::info
**2025-07-28 已更新！**
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

或者，可以在 `Vibration()` 中按上述方式添加一行简单代码，使其仅在允许振动时才振动。亲自使用后发现，经过条件检查步骤无论从概念上还是实用上都更好。
