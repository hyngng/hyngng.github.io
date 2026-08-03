---
image:
    path: /2022-08-24-lavad-devlog/lavad-working.webp
    lqip: data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADwAQCdASoQAAgAAgA0JYgCdAEO+BZG1HAA/tzAa4xcrJ5qbUA7/Dd9Xb9cYHKGznTwKrBlf85fCc9Us5QdbaLIxPYj/pyvwcdu60isAAA==
    alt: ゲームプレイ例
    
title: "Unityで簡単な装甲車シューティングゲームを作る"
authors: ["dev"]

categories: [마일스톤, 게임 개발]
tags: [마일스톤, 게임 개발, 유니티, C#, 개발, 개발일지]
start_with_ads: true

toc: true
toc_sticky: true
 
date: 2022-08-24 16:14:00 +0900
last_modified_at: 2023-11-22 19:36:00 +0900
---

## **はじめに**

子供の頃、[あるYouTuber(Tooner)](https://www.youtube.com/@tooner/videos)が実装した戦車のサスペンションやPIP(Picture-In-Picture)スコープ、閃光弾エフェクトなどを新鮮に見た記憶があります。映像自体は生のままで粗く、そのせいか再生数も概ね少なかったですが、その内容は本当に面白かったです。

時間が経ち、時間が空こうとしていた時にこのYouTuberを思い出しました。コンピュータで何か成果物を作ってみたい気持ちがあったところで、このYouTuberの動画をもう一度一つずつ見ているうちに、私もそういうものを作ってみたいと思い、このYouTuberの軌跡をロールモデルにして、2週間BlenderとUnityを使って自分なりの[最初のマイルストーン](https://hyngng.github.io/categories/%EB%A7%88%EC%9D%BC%EC%8A%A4%ED%86%A4/)を作りました。

## **Blender**

![lavad-modeling](/2022-08-24-lavad-devlog/lavad-modeling.webp){: .w-50 .left }

最初に何を作ろうかと考えた末、テーマをLAV-ADという装甲車に決めました。単純にこの車両がかっこよく見えたことと、車体が幾何学的な形状をしていて、自分でモデリングしても難しくないと思ったからです。

もちろん最初はインターネットで無料モデルを落とそうかとも思いましたが、ほとんどのモデルが有料販売中だったり、普段からBlenderをちょっと試してみたいと思っていたので、自分で作って使うことにしました。

基本ショートカットはインターネットでよくまとまった記事を探して参考にし、Blenderというツール自体にどういう感じでアプローチすればいいかは、YouTubeの海外チャンネルでスピードモデリング動画をいくつか探して見ながら真似しました。

見ていると、X、Y、Zの3軸に対する正射影画像を参考に作る例が多く見られ、私もGoogleで関連資料を集め始め、最初のモデルを作り始めました。困難はありましたが、プロセスがかなり体系化されていてすぐに適応でき、自分なりに感じのある形を作ることができました。

## **Unity**

![lavad-coding](/2022-08-24-lavad-devlog/lavad-coding.webp){: .w-50 .right }

次はコーディングでしたが、これも普段から学んでみたかったUnityを使いました。振り返ってみると、Unityは特に何をどう使えばいいのかわからず、石橋を叩いて渡る気持ちでやっとの思いで作ったようです。

オブジェクト指向やコンポーネントベース設計などの基礎知識がまったくなく、国内のブログ投稿はもちろん、インド系YouTuberの講義や古いStack OverflowのQ&Aなどを参考にしながら作りました。

特に途中で車輪を実装するにあたり、Wheel ColliderというUnityコンポーネントを使いましたが、これがいくら調べても国内に関連資料がほとんどありませんでした。初めてUnity公式ドキュメントを参考にしてみましたが、コンポーネント自体への理解が不足しており、うまく使えるまでに時間がかかりました。

それでも結局うまく適用できて、車輪がきちんと回っている様子を見ると感慨もひとしおで、この時を境にUnityに面白さが湧いたと思います。

## **バグ修正と完成**

<div class="row">
    <div class="col-md-6">
        <img src="/2022-08-24-lavad-devlog/lavad-bug1.webp" alt="lavad-bug1">
    </div>
    <div class="col-md-6">
        <img src="/2022-08-24-lavad-devlog/lavad-bug2.webp" alt="lavad-bug2">
    </div>
</div>
<div class="row">
    <div class="col-md-6">
        <img src="/2022-08-24-lavad-devlog/lavad-bug3.webp" alt="lavad-bug3">
    </div>
    <div class="col-md-6">
        <img src="/2022-08-24-lavad-devlog/lavad-bug4.webp" alt="lavad-bug4">
    </div>
</div>

こんなおかしなバグもたくさんありました。Wheel Colliderの存在を知らなかった時に車体の動きを三角関数で実装しようとして完全にデタラメに動作したり、Wheel Colliderを適用した後も車輪の軸がずれて回ってはいけない方向に回ったり、新しくモデリングした車体を適用すると質量値が問題を起こしたり、薬莢排出エフェクトを実装中に薬莢を出しすぎたりなどです。

この他にも多くのバグとともに、セミコロンや括弧の欠落などの基本的な文法エラーも頻繁に発生し、思ったより細かい困難が多くて困惑しました。特にWheel Colliderを適用する頃からはとても大変でした。

![lavad-main](/2022-08-24-lavad-devlog/lavad-main.webp)

![lavad-main2](/2022-08-24-lavad-devlog/lavad-main2.webp)

それでも合計9回のビルドを経て自己満足できるレベルまで作りました。様々な個人的な好みや希望も盛り込んで、カメラポストプロセッシングを適用して被写界深度効果を実装し、前進や後進時に後輪から方向に合わせて土埃が舞い、特に後進時にはテールランプが強く点灯するなど、細部のディテールを実装しながら楽しく仕上げました。

## **おわりに**

![lavad-working2](/2022-08-24-lavad-devlog/lavad-working2.webp)

:::tip
[GitHub](https://github.com/hyngng/unity-lavad)でより詳しくご覧いただけます！
:::

7月8日に始めて7月25日に最後のビルドを行ったので、17日間で完成した短期プロジェクトです。個人的には最後のビルドを作りながら、次はより大規模なプロジェクトを進めてみたいと思いました。特にC#に対する理解が不十分な状態で目標達成にだけ急いだコードを乱発した感が残念でもあります。

それでも直接モデリングをしてみたり、オブジェクト指向を使ってみたりできて良かったです。何より、自分が愛着を持ってプログラムを作った経験が今はあるというのがとても嬉しいです。
