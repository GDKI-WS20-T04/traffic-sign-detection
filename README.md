# Grundlagen der KI WS 20-21 Projekt

Dieses Projekt wurde im Rahmen des
Moduls [Grundlagen der Künstlichen Intelligenz](https://www.thm.de/organizer/modulhandbuecher/fb-06-mni/modulhandbuch-inf-bs-2010.html?view=subject_item&languageTag=de&id=2802)
durchgeführt.

## Team Mitglieder

- [Timon Pellekoorne](https://github.com/TimonPllkrn)
- [Max Stephan](https://github.com/mxsph)
- [Jannik Lapp](https://github.com/JannikLapp)

## Ziel

Das Ziel war es eine App zu entwickeln, welche mithilfe der Kamera alle Verkehrsschilder, welche Einfluss auf die
Geschwindigkeitsbegrenzung haben, erkennt und somit dem Fahrer immer das aktuelle Tempolimit anzeigt. Außerdem soll die
App den Benutzer warnen, sobald dieser das Tempolimit überschreitet.

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

## Starten

### Development

Um die App im Development mode zu starten sind folgende schritte notwendig:

1. Git Repo clonen: `git clone git@github.com:GDKI-WS20-T04/traffic-sign-detection.git`
2. In den App-Ordner wechseln: `cd app`
3. Dependencies installieren: `npm i`
4. Dev Server Starten: `npm run start`
5. QR-Code in der Weboberfläche mit
   der [Expo Go App](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=de&gl=de) scannen.

### Produktion

Da die App mit Expo entwickelt wurde, kann diese auch hiermit einfache verwendet werden. Hierfür wird
die [Expo Go App](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=de&gl=de) benötigt. Hierbei
empfehlen wir die Verwendung eines Android Smartphones, da zwar theoretisch auch die Verwendung eines IOS gerätes
möglich wäre allerdings konnten wir nicht testen, ob dort alles korrekt Funktioniert, da wir kein IOS Gerät besitzen.

Hat man die App installiert ist die Verwendung der App ganz einfach, hierfür muss entweder dieser
link `exp://exp.host/@timonpllkrn/app` kopiert werden und die ExpoApp geöffnet werden (Die App überprüft selbstständig,
ob sich ein valider Link in der Zwischenablage befindet) oder der unten stehenden QR-Code gescannt werden.

<img src="docs/assets/images/app/qr-code.png" alt="qr-code" width="200" />

> Damit die App korrekt funktioniert, muss auch der Server gestartet sein (Die Anleitung hierfür befindet
> sich [hier](docs/server/server.md#server-starten))

## Dokumenation Starten

### Unter Linux

1. requirements installieren: `sudo pip3 install -r docs/requirements.txt`
2. mkdocs-material starten: `mkdocs serve`

### Unter Windows

1. requirements installieren: `pip install -r docs/requirements.txt`
2. mkdocs-material starten: `mkdocs serve`
