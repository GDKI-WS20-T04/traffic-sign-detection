# Installation

## Development

Um die App im Development mode zu starten sind folgende schritte notwendig:

1. Git Repo clonen: `git clone git@github.com:GDKI-WS20-T04/traffic-sign-detection.git`
2. In den App-Ordner wechseln: `cd app`
3. Dependencies installieren: `npm i`
4. Dev Server Starten: `npm run start`
5. QR-Code in der Weboberfläche mit
   der [Expo Go App](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=de&gl=de) scannen.

## Produktion

Da die App mit Expo entwickelt wurde, kann diese auch hiermit einfache verwendet werden. Hierfür wird
die [Expo Go App](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=de&gl=de) benötigt. Hierbei
empfehlen wir die Verwendung eines Android Smartphones, da zwar theoretisch auch die Verwendung eines IOS gerätes
möglich wäre allerdings konnten wir nicht testen, ob dort alles korrekt Funktioniert, da wir kein IOS Gerät besitzen.

Hat man die App installiert ist die Verwendung der App ganz einfach, hierfür muss entweder dieser
link `exp://exp.host/@timonpllkrn/app` kopiert werden und die ExpoApp geöffnet werden (Die App überprüft selbstständig,
ob sich ein valider Link in der Zwischenablage befindet) oder der unten stehenden QR-Code gescannt werden.

![](../assets/images/app/qr-code.png){: style="height:150px;width:150px"}

!!! tip Damit die App korrekt funktioniert, muss auch der Server gestartet sein (Die Anleitung hierfür befindet
sich [hier](./client.md))
