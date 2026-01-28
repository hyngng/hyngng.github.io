---
title: "유니티 모바일 프로젝트에 진동 권한 부여하기"

categories: [프로그래밍, 튜토리얼]
tags: [프로그래밍, 튜토리얼]
start_with_ads: true

toc: true
toc_sticky: true

date: 2025-01-31 10:18:00 +0900
last_modified_at: 2026-01-02 20:39:00 +0900
---

> **안드로이드 기준입니다!**
{: .prompt-warning }

유니티에서 진동은 기본적으로 `Handheld.Vibrate()`의 형태로 사용할 수 있지만, 진동의 강도나 지속 시간이 고정된다는 단점이 있어 주로 다음의 방법을 이용합니다.

## **Manifest 파일 추가하기**

1. `Edit / Project Settings / Player / Publishing Settings`{: .filepath }에서  `Custom Main Manifest`{: .filepath } 항목을 체크합니다.
2. 프로젝트의 `Assets/Plugins/Android`{: .filepath } 경로에 수정 가능한 `AndroidManifest.xml`{: .filepath } 파일이 생성됩니다.
3. 해당 파일의 `manifest` 태그 안에 `<uses-permission android:name="android.permission.VIBRATE" />` 코드 한 줄을 추가하면 됩니다.

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
{: file="AndroidManifest.xml" }

완성된 `AndroidManifest.xml`{: .filepath } 파일은 위와 같이 나타납니다. 이 파일에 기반해 빌드된 어플은 진동 권한을 요구하게 되고, 플레이어가 허용하면 진동이 울릴 수 있게 됩니다.

## **Vibration 클래스 추가하기**

프로젝트 경로 아무곳에서 C# 파일을 추가한 다음, 아래의 코드를 붙여넣고 저장합니다. 주로 `Assets/Scripts`{: .filepath } 경로 내에 작성합니다.

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
{: file="Vibration.cs"}

이 클래스는 정적으로 제공되므로 프로젝트 어느 곳에 작성하더라도 잘 작동합니다. 진동이 울리는 시간을 `long` 자료형 매개변수로 받아 `AndroidVibrator.Call()`을 호출하며, 예를 들어 `Vibration.Vibrate(long(1000));`와 같이 사용할 수 있습니다. 개인적으로는 `long(10)` 정도로 사용하는 것이 좋았습니다.

## **사용 예시**

```cs
public void Vibrate()
{
    if (MainManager.ActivatedObject == gameObject)
        Vibration.Vibrate((long)10);
}
```

[이전 프로젝트](https://hyngng.github.io/posts/armonia-second-devlog/)에서 위와 같이 사용한 적이 있습니다. 플레이어가 특정 오브젝트를 터치하면 해당 오브젝트가 활성화되며 `MainManager`의 `ActivatedObject` 자리에 등록되는 방식인데, 만족스럽게 잘 작동했습니다.

> **2025-07-28 수정!**
{: .prompt-info }

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

혹은, `Vibration()`에 간단한 한 줄 코드를 위와 같이 추가해서 진동이 허용되어 있는 경우에만 울리도록 만들 수도 있습니다. 직접 사용해보니 조건 확인 절차를 한 번 거치는 것이 개념적으로도, 실용적으로도 낫습니다.