# Verwendung

Wenn man die App öffnet, landet man auf dem Startbildschirm der App.

![startscreen](../assets/images/app/app_screen_home.jpg){: style="width:60%; border: 1px solid black;"}

Mit dem Klick auf Start wird die App gestartet, hierbei wird die Kamera aktiviert und dauerhaft ein Bild an den
Backendserver gesendet.

![app_screen_ort](../assets/images/app/app_screen_ort.jpg){: style="width:60%; border: 1px solid black;"}

Erkennt die App jetzt ein Bild wird dieses in der Mitte angezeigt, des Weiteren steht unten Rechts die Aktuell erlaubte
Geschwindigkeit. Als weitere Informationen befindet sich unten links die aktuelle Geschwindigkeit und rechts
Informationen über den aktuellen Standort.

!!! bug 
        Da die aktuelle Geschwindigkeit über GPS bestimmt wird kann es sein das diese bei geringer Geschwindigkeit oder
        in Gebäuden nicht immer akkurat ist.

Falls die aktuelle Geschwindigkeit die erlaubte Geschwindigkeit (mit einer Toleranz von 5 Km/h) überschreitet, wird dies
Audiovisuell angezeigt.

![app_screen_to_fast](../assets/images/app/app_screen_to_fast.jpg){: style="width:60%; border: 1px solid black;"}

Um die App jetzt bei der Autofahrt zu verwenden, wird die Verwendung einer Handyhalterung empfohlen. Diese sollte das
Smartphone so ausrichten das dieses einen Möglichst guten Überblick über die Straße besitzt.

![smartphone_bracket](../assets/images/app/smartphone_bracket.png){: style="width:60%; border: 1px solid black;"}

!!! note 
        Beispiel Videos von der Verwendung können
        auch [hier](https://jannikcloud.dnshome.de/owncloud/index.php/s/kVLr4FrCosjk80z) heruntergeladen werden.

## Development mode

Um eine Geschwindigkeitsänderung zu simulieren, kann auch der Debug-Modus aktiviert werden. Dies geht mit einem Langem
Klick auf das Kamerasymbol oben rechts. Nun können über die erschienenen Knöpfe verschiedenen Geschwindigkeiten
eingestellt werden.

![debug_mode](../assets/images/app/app_screen_debug.jpg){: style="width:60%; border: 1px solid black;"}
