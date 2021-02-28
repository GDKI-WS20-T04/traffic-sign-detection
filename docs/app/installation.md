# Installation

## Development

Um die App im Development mode zu starten sind folgende schritte notwendig:

1. Git Repo clonen: `git clone git@github.com:GDKI-WS20-T04/traffic-sign-detection.git`
2. In den App ordner wechseln: `cd app`
3. Dependencies installieren: `npm i`
4. Dev Server Starten: `npm run start`
5. QR-Code in der Web Oberfläche mit der [Expo Go App](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=de&gl=de) Scannen.

## Produktion

Da die App mit Expo entwickelt wurde kann diese auch hiermit einfache Verwendet werden. Hierfür benötigt man die [Expo Go App](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=de&gl=de). Hierbei empfehlen wir die Verwendung eines Android Smartphones, da zwar theoretisch auch die Verwendung eines IOS gerätes möglich wäre allerdings konnten wir nicht testen ob dort alles korrekt Funktioniert.

Hat man die App installiert ist die Verwendung der App ganz einfach, hierführ muss man entweder diesen link `exp://exp.host/@timonpllkrn/app` kopieren und die Expo app Öffnen oder den unten stehenden QR-Code scannen.

![](../assets/images/app/qr-code.png){: style="height:150px;width:150px"}

!!! tip
    Damit die App korrekt Funktioniert muss auch der Server gestartet sein (Die Anleitung hierfür befindet sich [hier](./client.md))
