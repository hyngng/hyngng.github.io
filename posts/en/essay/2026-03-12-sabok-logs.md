---
image:
    path: /2026-03-12-sabok-logs/preview-image.webp
    lqip: data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAAAQAgCdASoQAAgAAUAmJQBOgMWCurp2S40AAP40cqnHH3viH6b121abUEDvfkR211iqjaVqJ+Z1BmHGv+24T0oQXGcfzUKwSSbEO5ZWf0NyJbhKbNbqqnu/aAwH/s82QAA=
    alt: "Lunch photos taken here and there"

title: "Review of 1 Year 8 Months as a Social Service Agent"
authors: ["essay"]

categories: [에세이]
tags: [에세이, 사회복무요원]
start_with_ads: true

toc: true

date: 2026-03-12 10:30:00 +0900
last_modified_at: 2026-06-25 15:26:00 +0900

mermaid: true
---

## **What Should I Write**

Excluding the one month of training camp, I had many experiences over 1 year and 8 months. Given my blog's archival nature, I want to record everything honestly and without reservation, but after inquiring with both the Military Manpower Administration and the institution, I found that it could put both parties in a difficult position.

In particular, through a meeting with a Military Manpower Administration official, the official conveyed the position that the MMA designed social service agents, even formally, as "passive beings who only do what they're told." Autonomous work improvement or recording work experience are fundamentally non-directed matters, so while that official personally found it commendable and desirable, they said the MMA cannot protect it at an organizational level. That's not an unreasonable stance, so I'm posting this polished to the point where the institution and specific duties cannot be identified.

Fundamentally, my experience wasn't an ordinary social service experience. By analogy, it feels no different from exposing the experiences and internal affairs of a previous company before switching jobs without any filter. There's a part that feels morally questionable, so I likely won't be able to cover it in detail going forward. But personal impressions are separate. Honestly, I was very flustered. Both the peculiarity of the social service system and the environment of my assigned institution were unusual. There were many moments that pressured me, and after returning home, I often worried about how to accept this situation in a desirable way. I felt a sense of injustice at why I had to worry about this, but I sought practical alternatives first.

Above all, I didn't want to waste 20 months of time. When asked if I have no regrets looking back at the past, that's not true, but it wasn't time wasted either. First, I consistently managed my blog without break, and in the office I installed git, VS Code, Visual Studio, Obsidian, Python, and other development tools to plan and develop small programs. Using spare time during commutes, lunch breaks, holidays, and the Chuseok holiday, I read roughly 18 books including *Why Nations Fail*, *The Myth of Sisyphus*, *Laozi*, *Meditations*, and similar works. And I tried to reflect this productive attitude during office work hours as well.

## **Sincerely, and Earnestly**

![qr-code-and-program-structure-light](/2026-03-12-sabok-logs/qr-code-and-program-structure-light.webp){: .light .border }
![qr-code-and-program-structure-dark](/2026-03-12-sabok-logs/qr-code-and-program-structure-dark.webp){: .dark  }
*Kept making things like these. QR codes, macro programs, etc.*

There's an atmosphere unique to public service. There's a lack of enthusiasm for devoting oneself to work assignments, and not much interest in work improvement either. From a third-party perspective, they try to do things safely "the way they've always been done" just as much as social prejudice. It was an environment blatantly different from the productive messages I'd experienced in university and clubs, and heard in many lectures: "Question why you're doing this job and why you're doing it this way," "There's definitely some problem in the work you do, so find and improve it yourself."

A sense of dissonance arose. The conventional wisdom that "innovation is difficult in public service" is famous, but I didn't expect it to be this much. But I didn't think getting swept up in the atmosphere looked good either, so I focused on work improvement, shortened my own tasks, and then helped the staff. Trying to improve inefficiency was also an action that stood out in the office, but it was still worth attempting, and there was a small sense of reward when it produced good results.

### **Creating and Managing QR Codes**

There were situations where app files had to be moved frequently on smartphones. Office staff were using a few smartphones where the files were stored as repositories, and each time they'd turn on the power and go through `My Files > Move to Downloads folder > Share > Quick Share > File transfer`. It was inconvenient. I had to follow it a few times myself, and besides the lag right after the smartphone booted, the battery was often dead, so there was the minor but recurring hassle of finding a charger, connecting it, and waiting a few minutes.

Due to the nature of public service, there was a structural gap where improving minor inefficiencies wasn't included in anyone's work assignment, and I decided to fill that gap with QR codes. I created an empty Google account, connected Dropbox, and uploaded files. Here, I changed the `dl=0` parameter at the end of the `https://www.dropbox.com/s/identifier/filename?dl=0` URL to `1` so downloads would start immediately upon accessing the URL, created a QR code from that URL via `Chrome > Share, Save, Share > Create QR Code`, designed it in Figma, printed the paper, laminated it, and handed it over.

I created a more intuitive structure where everyone just opens their camera app to receive files. It was something light where leaks wouldn't be a problem, and since everyone had felt the practical inconvenience, the reaction was good. Later, staff asked me several times to make QR codes when there were new application files, and I often made them while trying various things like enlarging the QR code size or making templates with more familiar Hangul files.

### **Creating Web and Excel Macros**

At my workplace, there was a lot of work accessing the web, receiving files, and organizing them in Excel. There was even work modifying nearly 30,000 rows of data taking nearly half a day. Since I knew a bit of Python when I first came to the office, I started preliminary research to resolve this situation and wrote code. For tasks that had to be repeated daily, I made macros with `selenium`, and for Excel work, I first wrote development specifications and created structures that refined row-column data using `openpyxl`, `pandas`, or `xlwings` depending on requests from other staff or social service agents, then saved files.

I made variable values changeable from an external `config.yaml` file so even other social service agents unfamiliar with computers could use it. Considering the environment unfamiliar with computers, I packaged it as clickable `.bat` or `.exe` forms rather than `.py`, and of course included a `README.md` for any future social service agent who might know programming, plus wrote a user manual in Obsidian and Markdown, converted to PDF, and packaged it all together like a single package.

However, this part got poor response. Neither staff nor social service agents had much interest in the program itself or work efficiency, and the program wasn't friendly enough either. There were cases where insufficient exception handling meant the program had to be turned off and restarted from the beginning or force-closed in certain situations, and this experience seems to have led to a worse first impression than expected. The process of resetting values via `config.yaml` also remained unfamiliar to most people contrary to my intent. It was an opportunity to think about the minimum standards of a program's utility and completeness.

### **Handling Excel Itself**

> "Hey, make an Excel sheet and organize all this data here."

Excel work was literally the first task on my first day of work. But on that first day, I didn't know Excel at all, so I remember panicking internally thinking "What does 'sheet' mean?" That day I managed somehow with ChatGPT's help, but similar tasks were requested afterward, and Excel gradually became familiar. Not as a cliché — functions like `IFERROR`, `COUNTIF`, `SUMIF`, `VLOOKUP`, `INDIRECT`, pivot tables, conditional formatting, cell formatting, freeze panes, print preview, and other fundamentals were solidly built up. If I had started learning Excel to get a Computer Literacy certificate, I wouldn't have been this interested.

Programming experience helped a lot here. For example, Excel's `IF` function is no different from a ternary operator, and `vba` is explicitly a programming language. Beyond just tool familiarity, there was a difference in problem-solving approach. I put manual work as a last resort and tried to solve things with Excel's provided features as much as possible. I quietly accumulated small successes, and after about half a year, other people including staff started asking me about Excel.

### **Event-Based Assist Tasks**

Besides that, there were irregular duty-related experiences. Memorable ones include:

1. **Late 2024**, while extracting data from a hard drive, I accidentally bumped a loosely connected gender changer on a USB-B port and lost files. Fortunately it wasn't important data, but thinking I caused damage due to my mistake, I looked up partition recovery methods like TestDisk and recovered the files. When I told the staff, they said "That's not needed now, but I'll keep it in mind, thanks." It didn't remain as a major contribution, but it was a useful memory.

2. "You're a CS major, right? The computer here isn't working, can you check it?" — I actually heard this quite a lot. Most were solved by dusting off RAM contacts and reseating, rarely requiring internal cleaning or replacing the entire unit with spare inventory. I had never dealt with computer hardware, but with help from a fellow social service agent, I learned one by one, and from that experience I'm now quite familiar with disassembly and assembly.

3. Once, a staff member asked me to compress a PDF file. Since work materials couldn't be uploaded to the internet, I solved it locally with an external program, but they warned me "Thanks, but we're a public institution so we can't use external programs carelessly." Checking the license, it was free for commercial use too, so it didn't seem like a big problem, but I thought "Then if I make and use it myself there's no problem" and created a Python program that performs the same task.

Besides these, there were things like creating an impromptu program via vibe coding to convert large batches of `heif` files to `jpg` locally, and making a personnel selection program using Excel's `RAND()` function with all function structures visible — these remain memorable.

## **The King's Ears Are Donkey Ears**

![reading-clips](/2026-03-12-sabok-logs/reading-clips.webp)
*Reading helped a lot in steadying my mind and verifying principles*

However, the unique atmosphere of public service became a problem. Because, when I put effort into work, they liked it, but that was the end. Contrary to my initial expectation of some degree of active response, there were cases where the situation degenerated into "Since you know it well, you just handle it from now on," which was baffling. For example, the QR codes I started as a favor became formally handed over as my official duty when a staff member was transferred: "Apps download when you scan the QR code, and for versions not here, tell that person and they'll make it." And this is just one example — there were a few more confusing experiences.

### **Mutual Hierarchy Perception**

> A: What's your current assignment, B?  
> B: I do ○○.  
> A: Nothing else?  
> B: Oh, I'm also doing the newbie tasks and △△.  
> A: No, that's not □□, anything else besides that?  
> B: Nothing else if you exclude that.  
> A: Then you're not busy, so why don't you do □□?  
> B: ??

My workplace had a "class culture" (seniority-based hierarchy), and conversations like the above happened matter-of-factly among social service agents. I don't care what they do among themselves, but it was a problem when they came at me and other social service agents who didn't think that way with "You're the newbie so you do all the chores alone." Especially seeing them act arrogant without realizing they're inventing and using a non-existent concept was embarrassing. I've never heard of such culture from my training camp peers or acquaintances, and it's pathetic for mere social service agents to try to create hierarchy among themselves saying "I came first so I'm better, you came later so you're worse."

> Q. Do you have experience resolving conflicts in group life?

This item appears frequently in many companies' cover letter prompts and interview questions. And experiencing it firsthand, I came to understand why. Conflict becomes significant pressure and stress for the parties involved, making wise resolution difficult. Most model answers cite quietly telling a superior, creating a logical compromise, or making new rules and agreeing to keep them — but in my case, using such frontal methods was difficult. The *gap-eul* (갑을, master-servant relationship) dynamic where obedience within regulations is mandatory was a problem, and the biggest problem was that the perceptions of stakeholders — staff and social service agents — were fundamentally different from mine. So in my case, unfortunately, it took the form of accepting disadvantages.

### **Notification Disguised as Persuasion**

> "Seems like you haven't experienced social life, but I actually think that's right. Why do you think that ○○ staff does all the miscellaneous work? And ○○ staff does the least, right? Why do they do that? People keep saying '*gundaenori* (playing army, a dismissive term for rigid hierarchy), *gundaenori*' — but actually seniors know a lot, and when ordered, they do it quickly and well. So the current structure actually has a reason. The fact that we tolerate them giving you work is also because of that.
>
> You want an equal society, and me and them think this is right. Your words have reason, and there's no answer. But me and them have thought this was right all along. They suffered as newbies too, and now they're expecting it to get comfortable, so if you force your thoughts, they'll be dissatisfied and problems will explode.
>
> Nobody says it in the office, but everyone thinks you're better than ○○ social service agent — you have thoughts and handle yourself well. Everyone. That's why I'm saying this to you.
>
> When a new social service agent comes, they'll stick to you too. In a way, an ○○ faction gets created. We're worried about that."

This is transcribed from memory so the exact wording isn't precise, but the gist was as above. A certain staff member advocated for, or at least condoned, such absurdity. I have a lot to say about this part, but I'll summarize with just brief impressions. The smell of stagnant water's rot came from the language. "Suffer when young, play immortal when old." In public service society, this culture seems to be considered not just standard but outright natural. Up to that point, it's the realm of job category and corporate culture, and there would be context for how that thinking settled, so I'll somehow understand. But trying to apply that unwritten rule to outsider social service agents is the problem. Moreover, what I heard was couched as persuasion but was actually a notification/ultimatum, and it was a bad sophistry that was unpleasant to hear. Intuitively, that opinion isn't mature. Even cooling my head and thinking more deeply, it's not attractive at all.

### **Thoughts on Authority**

Even if the way authority operates in the office is unpleasant, the necessity of authority cannot be denied. I want to organize my thoughts on this issue here. As I understand it, the first reason anti-authority is persuasive is that systems and value judgments fundamentally don't exist; the second is that there's always inefficiency where meaning disappears and only form remains, and such things must be discovered and improved. And the one reason authority is persuasive is that the imaginary order has the potential to enable efficient large-scale cooperation.

This relationship can be neatly summarized as "Authority first, then anti-authority. Removing authority according to practicality." And this logic can be applied universally. For example, suppose there's an environment where printer destination settings or contact network order must be sorted by rank — that's for protocol and politics, not for improving work environment or promoting happy workplace life. Such authority requires explanation.

The experience and know-how of those who've been in an organization for 5, 10, 20 years must be respected. But those who've faced each day without sufficient reflection and review definitely exist, and their leadership is dangerous. Especially in my case, there was a corrupt practice among social service agents — who were all much of a muchness — of dividing senior/junior and structurally distributing benefits differently, and that corrupt practice was maintained by indescribable vested interests. And the first principle that made that possible was clearly authority in name only.

The alternative I used as a standard is this: Principles suit big matters, but compassion is enough for small ones<sup>Il faut mettre ses principes dans les grandes choses, aux petites la miséricorde suffit</sup>. This doesn't mean this principle must be strictly applied to all situations, but there was a clear impression that some staff were also excessively bound by rank and office politics. That problem would have looked much better if they'd just let go of a little force.

## **Extra: On Discharge Day**

As discharge day approached, I felt complex and subtle emotions intensifying. This was unexpected and almost a first-time feeling. Especially at the end, contrary to my expectation of being able to vent my thoughts more refreshingly, I ended up barely holding back surging emotions. Leaving the office door, tension completely released, and I steadied my mind taking a walk around the area.

On the train home, I slowly noted the feelings coming now, and reorganized them into the following. Emptiness from the past enthusiasm to somehow improve stifling things ending without meaningful results, burden from structural external pressure by service regulations and the unique office atmosphere, and then liberation and relaxation from shaking those off, emotion and anticipation of finally returning to my true self, a sense of destiny that a chapter of life has concluded, refreshing bitterness that a keyword defining me has disappeared, unexpected sorrow that the keyword really is disappearing, [old training camp memories](https://hyngng.github.io/en/essay/training-camp-logs/). And other trivial emotions seem to have been mixed in.

One more thing: walking out the office door for the last time, I thought lunch would become boring. What I could most honestly accept in the office was the atmosphere during meals. Lunchtime was a brief moment for me and fellow social service agents to catch our breath, vent worries, or share thoughts, and it was sad that the small joy of pondering lunch menus and coffee menus would end here. There will be similar situations in future schools or workplaces, but the feeling will definitely be different.

Perhaps feeling such sentiments through something as trivial as the social service system is due to attachment to life.

## **Archive**

![background-images](/2026-03-12-sabok-logs/background-images.webp)
*First dual monitor environment I used here. I put free images on the left, my drawings on the right as wallpapers, and decided to use them separately for work and personal*

![obsidian-notes-light](/2026-03-12-sabok-logs/obsidian-notes-light.webp){: .light .border }
![obsidian-notes-dark](/2026-03-12-sabok-logs/obsidian-notes-dark.webp){: .dark  }
*Obsidian was personally used continuously in situations like first handover, macro program planning*

```python
# Write a program that takes multiple integers in a single line of code and outputs their sum.
# Found quickly with fellow social service agent without AI. Such trivial things were nice.

print(sum(map(int, input().split())))
```

- Not reflected in main text
	- Fellow social service agent who warned I might come to hate people later. And I didn't accept the situation that way.
	- Another fellow social service agent who retorted about the staff talking about social life: "They must not have worked at a good company."
	- Ordinary people making unreasonable demands like adjusting train schedules to their commute times.
	- Finished cup ramen, delivery lunch containers, unclaimed hospitality drink bottles not even empty.
	- Dried spider corpses and stale coffee residue on general waste bags about to burst.
	- Dusty desks, phone ringing every 10 minutes, curses and shouting, distinctive musty smell.
	- 50-60 year old men offering handshakes with unwashed hands after using the restroom.
	- Thick cigarette smoke from various smokers.
	- Etc, etc, etc.txt (215GB)

## **Closing**

![alarm-light](/2026-03-12-sabok-logs/alarm-light.webp){: .light .w-75 }
![alarm-dark](/2026-03-12-sabok-logs/alarm-dark.webp){: .dark .w-75 }
*Alarm used for 1 year 8 months. The 'things to do for now' are over, and now I can turn this alarm off forever*

Round-trip commute of 1 hour 40 minutes. Around the 8-month mark, I remember desperately wanting to quit. Thinking back to that time, being able to quit even now feels incredibly fortunate. Still, the past 1 year 8 months had frequent unpleasant experiences, but it wasn't time wasted, and that's enough for me. The 'things to do for now' are over, and now it's time to do the things I need to do going forward.























