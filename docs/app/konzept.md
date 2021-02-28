## Konzept

### Features

- Anzeige des zuletzt erkannten Schildes, welches das Tempolimit beeinflusst
- Anzeige des aktuellen Standortes
- Anzeige der aktuellen Geschwingigkeit
- Warnhinweis bei Überschreitung des aktuellen Tempolimits

### Mock-Up

Um die genannten Features sinnvoll in einer App zu verpacken, wurde zuerst ein Mach-up mit Hilfe von [Figma](https://www.figma.com)

Die App soll nur im Querformat nutzbar sein, damit die Fotos welche das HAndy macht ebenfalls im Querformat entstehen und somit mit höherer Wahrscheinlichkeit ein Straßenschild einfangen.

**Startscreen**


<img src="../images/startscreen.png" width="60%" style="border: 1px solid black;"/>

Damit der Benutzer nicht direkt beim Öffnen der App mit dem Tracking der Umgebung beginnt, sollt es zuerst einen Startbldschirm geben, auf welchem der BEnutzer bewusstr die Anwendung starten kann.

**Detectionscreen**

<img src="../images/detectionscreen.png" width="60%" style="border: 1px solid black;"/>

Wird dann die App durch das Drücken auf den *Start-Button* gestarten, so wird der Benutzer auf dem *detectionscreen* geleitet. Dort soll dem Benutzer auf der linken Seite das zuletzt erkannte Schild als Bild angezeigt werden, sowie auch die aktuelle Geschwindigkeit angezeigt werden.  
Auf der rechten Seite soll dem Benutzer der aktuelle Standort angezeigt werden.

Wird das aktuelle Tempolimit überschritten, so soll sich die linke Seite der App rot färben, um den Benutzer auf die Überschreitung hinzuweisen.

![Warningscreen](../images/warningscreen.png) {: style="height:400px;width:600px; border: 1px solid black;"}

## Labels

Damit die App das passende Bild sowie die richtige Geschwindigkeit anzeigt, werden für jede Klasse, welche die KI zurück gibt ein Objekt vom Typ `Label` in einem Record gespeichert.

### Interface Label

```ts
export interface Label {
  value: number;
  name: string;
  image: any;
  baseSpeed?: number;
}
```

**value**  
Schild mit Tempolimit:
In `value` wird das Tempolimit zum erkannten Schild gespeichert.

Schild mit Auflösung eines Tempolimits:
In `value` wird der Wert `-1` gespeichert.

**name**  
Speichert den Namen des Labels zu der zugehörigen Klasse.

**image**  
speichert den Pfad zum Bild, welches bei dem erkennen des Labels in der App angezeigt werden soll.

**baseSpeed**  
Speichert die Grundgeschwindigkeit ab.  
Ort = 50, außerorts = 100, Autobahn = Number.MAX_SAFE_INTEGER (unbegrenzt)



## Umsetzung

### Detectionscreen

**Geschwindigkeitsanzeige**

Damit die aktuelle Geschwindigkeit des Smartphones anzuzeigen nutzen wir die Bibliothek des *expo-location* Expo-Frameworks. 

Dazu wird beim Laden des Screens die Methoden `watchPositionAsync` aufgerufen. Dieser Methode wird ein Objekt übergeben in welchem man die Genauigkeit *(accuracy)* und das Zeitinterval *(timeInterval in ms)* festlegen kann.

```ts
  await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 500,
    }
  );
```

Ebenso kann man der Methode eine Funktion übergeben, welche nach jedem Positionsupdate aufgerufen wird.

```ts
  await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 500,
    },
    async (loc) => {
      setLocation(loc);
      const address = await Location.reverseGeocodeAsync(loc.coords);
      setGeo(address);
    }
  );
```

In unserem Fall nutzen wir dies um die neuste Position in einer Vatiablen zu speichern, `setLocation(loc);`, sowie mit Hilfe der Methode `reverseGeocodeAsync(loc.coords)`, welcher wir die Position übergeben, die genaue Adresse herauszubekommen.

Da wie im Mock-up beschrieben, sich die Oberfläche in zwei Teile aufteilt, gibt es in React Native dafür zwei Komponenten.

### SpeedPaper

Diesem Komponent wird das Positionsobjekt übergeben, welches in der Callback-Methode gesetzt wurde.

Der Komponent beinhaltet mehrere Variablen:

**tolerance**

Die Variable `tolerance` beinhaltet eine Nummer, welche den Toleranzbereich beschreibt, welcher beim Überschreiten des Tempolimit für die Warnung gilt. Dieser beträgt 5. 

**sign**

In der Variablen `sign` wird die Klasse des aktuell erkannten Bild gespeichert. Mit Hilfe dieser Variable, kann das auf das passende Label Objekt im abgespeicherten Record zugegriffen werden, um somit auf den Bildpfad, das Tempolimit oder den baseSpeed zugreifen zu können.

**memSpeedLimit**

Hier wird der zuletzt erkannt baseSpeed eines Labels gespeichtert.

**speedLimit**

Die variable speedLimit wir bei jeder Veränderung der Variablen `sign` gesetzt. Hierzu nutzen wir die von React definierte Hook `useMemo`.

```ts
  const speedLimit = useMemo(() => {
    if (labels[sign].value === -1) {
      return memSpeedLimit;
    } else {
      const baseSpeed: number | undefined = labels[sign].baseSpeed;
      if (baseSpeed) setMemSpeedLimit(baseSpeed);
      return labels[sign].value;
    }
  }, [sign]);
```

Zuerst wird überprüft, ob das erkannte Schild eines ist, welches ein Tempolimit-Schild auflöst.

```ts
if (labels[sign].value === -1) {
  return memSpeedLimit;
}
```

ist dies der Fall, so wird das Tempolimit auf den zuletzt gespeicherten baseSpeed zurückgegeben.

Sollte dies nicht der Fall sein, wird überprüft, ob bei das erkannte Schild ein baseSpeed enthält, das heißt, ob diese Variable definiert ist.

```ts
if (baseSpeed) setMemSpeedLimit(baseSpeed);
```

Ist dies der Fall, wird die Variable `memSpeedLimit` auf den baseSpeed gesetzt.

Danach wird der value vom Label zurückgegeben. Dieser ist dann das aktuelle Speedlimit.

```ts
return labels[sign].value;
```

**speed**

Auch die Variable Speed wird mit Hilfe der Hook `useMemo` gesetzt.
Hierbei wird diese jedesmal neu gesetzt, wenn sich die dem Komponenten übergebene Position verändert.

```ts
const speed = useMemo(
  () =>
    location?.coords.speed
      ? (Math.round(location?.coords.speed * 3.6 + Number.EPSILON) * 100) /
        100
      : 0,
  [location?.coords.speed]
);
```
