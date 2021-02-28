# GDKI - Projekt

## Einleitung

Dieses Projekt wurde im Rahmen des Moduls [Grundlagen der Künstlichen Intelligenz](https://www.thm.de/organizer/modulhandbuecher/fb-06-mni/modulhandbuch-inf-bs-2010.html?view=subject_item&languageTag=de&id=2802) durchgeführt.

## Team Mitglieder


- Timon Pellekoorne
- Max Stephan
- Jannik Lapp

## Ziel

Das Ziel war es eine App zu entwickeln, welche mit Hilfe der Kamera alle Verkehrsschilder, welche Einfluss auf die Geschwindigkeitsbegrenzung haben, erkennt und somit dem Fahrer immer das aktuelle Tempolimit anzeigt. Außerdem soll die App den Benutzer warnen, sobald dieser das Tempolimit überschreitet.

Dazu wurde eine KI implementiert, sowie eine Native Android-App.

## Technologien

- **Tensorflow**  
Zum Trainieren der KI benutzt
- **TensorflowJS**  
Für die Ausführung der KI auf einem Smartphone
- **Flask**  
Für den Server, welcher die Anfragen den Clients entgegen nimmt
- **React Native**  
Für die Entwicklung der App
- **Expo**  
Als Plattform und Framework für die App-Entwicklung

!!! info
    Expo vereinfacht die Konfiguration des Projektes, indem es dem Entwickler die Einrichtung, sowie Installation der apks abnimmt.
    Über die *Expo Go* App, kann man so direkt auf auf seine Lokal gestartete App über das Netzwerk zugreifen. Alle Änderungen werden beim speichern direkt in der App geladen.

## Fazit  
Die App erfüllt alle Funktionen, jedoch gibt es für den tatsächlichen Einsatz ein paar Probleme.

**Performance**  
Läuft die KI direkt auf dem Smartphone, dauert die Analyse eines Bildes ca. 14 Sekunden. Dies ist für den tatsächlichen Ensatz jedoch viel zu langsam.  
Auch die Lösung, die Berechnung auf einem Server auszulagern bringt Probleme mit sich. Hier dauert allein das Fotografieren ca. 500ms. Zusätzlich benötigt auch die Anfrage und die Berechnung auf dem Server Zeit, sodass auch dieser Vorgang am Ende ca 2 Sekunden beansprucht.  Also ist auch diese Lösung für den tatsächlichen Gebrauch im Straßenverkehr schlecht geeignet.

**Kamerawinkel**  
Des Weiteren ist der Kamerawinkel ein Problem. Befestigt man das Smartphone an der Windschutzscheibe, so bekommt es nur Schilder, welche sich im Kamerawinkel befinden mit. Häufig sind aber Schilder, gerade beim Rechtsabbiegen, außerhalb dieses Winkels, so dass die App keine Chance hat diese zu erkennen.

Alles in allem funktioniert die App gut, um Schilder bei niedriger Geschwindigkeit  zu erkennen. Sie eignet sich aber nicht als verlässliche Quelle bei einer Autofahrt und noch weniger als Hilfe für das Autonome fahren.

Wir sind mit dem Ergebnis sehr zufrieden, da die Ziel-Funktionalität für dieses Projekt mit der App umgesetzt wurde.