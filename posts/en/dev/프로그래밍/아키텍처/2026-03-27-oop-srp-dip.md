---
title: "On Object-Oriented Design and the SRP and DIP Principles"
authors: ["dev", "essay"]

categories: [프로그래밍, 아키텍처]
tags: [프로그래밍, 아키텍처]
start_with_ads: false

toc: true

date: 2026-06-01 13:54:00 +0900
last_modified_at: 2026-06-29 23:23:00 +0900

mermaid: true
---

I'm not sure exactly where I am on the path, but if I were to use the Four Stages of Competence as an analogy, I'd guess I'm somewhere around conscious competence. I don't think I yet have the eye to see what constitutes good design, but amidst that uncertainty, a few things are gradually coming into focus, and some of them are quite interesting to think about.

## **A Brief Take on Object-Oriented Programming**

The background behind the invention of OOP and what it excels at are well known. It was designed to overcome the limitations of the traditional procedural paradigm — specifically, to preserve abstract thinking and to naturally design complex business logic in a way that's easier for humans to understand. But why this methodology received such a warm reception is discussed relatively less. On this point, I've found two perspectives: business and philosophy.

One. Businesspeople and ambitious leaders who are responsible for something hate uncertainty. One reason northern empires bordering the Korean Peninsula constantly invaded Koreanic states was to secure their rear before achieving the enterprise of continental conquest. Rome unified the Italian peninsula before attacking Carthage, and Germany signed a non-aggression pact with the Soviet Union before invading France. The cases and motivations are not much different. The larger the scale of the enterprise, and the more serious the leader's obsession, the more essential it is to block black swans.

Two. Modern physicists yearning for a grand unified theory, linguists assuming a universal grammar across all the world's languages, economists trying to explain the behavior of millions through a single graph of supply and demand — all of these stem from an intent to control messiness. Why has such effort historically accompanied us? There may be practical reasons like reducing cognitive costs, but I prefer Albert Camus's perspective: for instance, "Human beings cannot endure uncertainty and ambiguity; they inevitably crave a clear framework of understanding."

This is just a bit of speculation on my part, but intuitively, there seems to be nothing discordant about understanding OOP as rooted in a human nature like risk management instinct. OOP divides traditional procedural code, organizes it into the right places, and leaves more signposts through its structure and naming. The result is that complexity and uncertainty are controlled, giving developers a sense of stability.

## **SRP: Single Responsibility Principle**

> An object should have only one responsibility.

Similarly, in writing, there is the principle of *one document, one subject* <sup>一文一事</sup>. So the intent behind the Single Responsibility Principle is not unfamiliar, and it's easy to misunderstand. 'Separating concerns to achieve semantic clarity' — this is a main point of SRP, but it is not the core. The true destination SRP aims for is to prune away trivial semantic branches, thereby achieving predictability of change.

The SOLID principles were created assuming a living, breathing program. Situations will keep changing, and the program must keep changing too. What is needed here is the attitude of *The Art of War* — a calculus for managing risk and achieving efficiency through thorough calculation. As the saying goes, "A skilled commander does not conscript troops twice nor transport provisions three times"<sup>役不再籍, 糧不三載</sup> — eliminating repetitive costs is important.

For the same reason, there is a significant cost difference between clearly recognizing task objectives during development, minimizing workload, and being able to execute boldly without side effects versus not being able to. In this context, clear semantic relationships mean predictable impact of actions, which in turn means calculable risk. This is why SRP is considered a standard, a fundamental skill.

## **DIP: Dependency Inversion Principle**

> Abstractions should not depend on details; details should depend on abstractions.

While performing alternative civilian service, I observed how far a company's self-correcting capacity could go, and interestingly, I kept thinking of the DIP principle throughout that process. Here's the idea. In a typical company structure with departmental divisions and assigned roles, according to DIP, the company should depend only on socially agreed-upon concepts — the role assignments — not on individual employees' personal skills or talents.

This is common sense. A company's daily operations may seem fixed, and it's easy to feel as though a given employee will be in the same position performing the same tasks yesterday, today, and tomorrow. But realistically, personnel changes are inevitable — due to regular rotations, sudden restructuring, resignations, or, in extreme cases like the terrifying assumption of the Bus Factor, an employee's death. If the organization depended not just on role assignments but on individual capabilities, there would be chaos when that person is absent for any reason.

From this perspective, the reason tasks beyond an agreed-upon scope should not be delegated to a single person is not just because it's an unethical exploitation of someone's goodwill — it's because it threatens the organization's sustainability. Once might be fine, but not repeatedly. If the workload demanded of the organization increases, the responsibility distribution structure should be reorganized, even if it means revising role assignments, rather than overburdening individuals. And translating this logic into technical terms yields the original principle: 'Abstractions should not depend on details; details should depend on abstractions.'

## **Petrification**

Sometimes, a concept presented pragmatically becomes a norm, loses its meaning, and degenerates into mere form. Actually, it's not just 'sometimes' — most things we know settle that way, becoming culture and tradition. OOP also started as a pragmatically valuable methodology, but today it seems to have a tendency to be treated as a rite of passage in programming curricula.

This makes me wonder. In terms of performance, there's already DOD as an excellent approach, and for managing state complexity, there's the functional paradigm as an alternative. Of course, OOP could survive all of these and endure for a long time. But recent trends — from vibe coding to harness engineering — are evolving in a direction where humans don't directly look at code design, and question marks are being raised about whether code must be written in objects at all. I hope no paradigm remains a rigid tradition for too long.
