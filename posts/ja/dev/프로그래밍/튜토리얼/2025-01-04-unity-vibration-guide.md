---
title: "Unityモバイルプロジェクトにバイブレーション権限を付与する"


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
**Android基準です！**
:::

Unityでバイブレーションは基本的に`Handheld.Vibrate()`の形で使用できますが、バイブレーションの強度や持続時間が固定されるという欠点があるため、主に以下の方法を用います。

## **Manifestファイルの追加**

1. `Edit/Project Settings/Player/Publishing Settings`で`Custom Main Manifest`項目をチェックします。
2. プロジェクトの`Assets/Plugins/Android`パスに修正可能な`AndroidManifest.xml`ファイルが生成されます。
3. 該当ファイルの`manifest`タグ内に`<uses-permission android:name="android.permission.VIBRATE" />`のコード一行を追加すれば完了です。

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

完成した`AndroidManifest.xml`ファイルは上記のように表示されます。このファイルに基づいてビルドされたアプリはバイブレーション権限を要求し、プレイヤーが許可するとバイブレーションが鳴るようになります。

## **Vibrationクラスの追加**

プロジェクトパスの任意の場所にC#ファイルを追加し、以下のコードを貼り付けて保存します。主に`Assets/Scripts`パス内に作成します。

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

このクラスは静的に提供されるので、プロジェクトのどこに書いても正常に動作します。バイブレーションが鳴る時間を`long`データ型のパラメータで受け取り、`AndroidVibrator.Call()`を呼び出します。例えば`Vibration.Vibrate(long(1000));`のように使用できます。個人的には`long(10)`程度で使うのが良かったです。

## **使用例**

```cs
public void Vibrate()
{
    if (MainManager.ActivatedObject == gameObject)
        Vibration.Vibrate((long)10);
}
```

[以前のプロジェクト](https://hyngng.github.io/posts/armonia-second-devlog/)で上記のように使用したことがあります。プレイヤーが特定オブジェクトをタッチすると、該当オブジェクトがアクティブ化され`MainManager`の`ActivatedObject`の位置に登録される方式ですが、満足のいく動作でした。

:::info
**2025-07-28 更新！**
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

あるいは、`Vibration()`に簡単な一行コードを上記のように追加して、バイブレーションが許可されている場合にのみ鳴るようにすることもできます。実際に使ってみると、条件確認の手順を一度経る方が概念的にも、実用的にも優れています。
