# Ki entwickeln

## Datensatz erstellen

## Recherche

Bevor wir begonnen haben ein Netz zu trainieren, haben wir uns zuerst umgesehen welche Netze andere Gitgub Projekte
verwendet haben. Dazu haben wir uns eine vielzahl an Projekten angesehen, haben usn aber rimär an den Folgenden
Orientiert:

- [Road-Sign-Detection/Tensorflow-Street-Sign-Recognition](https://github.com/Project-Road-Sign-Detection/Tensorflow-Street-Sign-Recognition)
- [Traffic-sign-detection](https://github.com/aarcosg/traffic-sign-detection)
- [Real-Time-Traffic-Sign-Detection](https://github.com/Mehran970/Real-Time-Traffic-Sign-Detection)

Bei allen Projekten hatten wir festegstellt, das primär schnelle Netzte verwendet werden, damit eine Live-Detection auf
dem Handy überhaupt möglich ist. Hauptsächlich wurden dabei folgende Modelle verwedet:

- Faster R-CNN
- SSD_Mobilenet_COCO

Das Faster R-CNN hat den Vorteil, dass es Objekte schnel und zuverlässig erkennen kann. Das SSD_Mobilenet_COCO ermöglich
jedoch eine noch schnellere Erkennung bei geringeren Hardwareanforderungen ist dabei aber unzuverlässiger.

Da wir in erster Linie eine möglichst schnelles Netzt entwickeln wollte, haben wir uns zu beginn für das
SSD_Mobilenet_COCO entschieden.

## Training

### Ablauf

Das Training haben wir mit einer RTX 2070 umgesetzt, welche jedoch nur 8GB Video-RAM besitzt und dadurch für das
Training mitunter Stunden braucht. Das Training kann in folgenden Schritten umgesetzt werden, vorausgesetzt ist hierbei
natürlich eine Tensorflow Installation mit einer GPU Unterstützung.
[Setting up TensorFlow (GPU) on Windows 10](https://towardsdatascience.com/setting-up-tensorflow-on-windows-gpu-492d1120414c)

1. Bilder in Test / Train aufteilen

2. Tensorflow Record Dateien erstellen

3. Detection Modell von Model Zoo herunterladen

4. Training

5. Model exportieren

6. Evaluieren / Programmeinsatz

Beim Ablauf dieser Schritte haben wir uns anhand dieser Dokumentation orieniert:
[Training Custom Object Detector](https://tensorflow-object-detection-api-tutorial.readthedocs.io/en/latest/training.html)

Ebenso werden bei den meisten Schritten Python Programme zur Hilfe gezogen, diese sind in der oben angegaben
Dokumentation enthalten und wurden dann für unsere Zwecke ggf. angepasst.

Im Ersten Schritt muss unser Datensatz in eine Trainings und Test-Ordner unterteilt werden. Dies könnte
selbstverständlich auch von Hand erledigt werden ist jedoch mit einem Programm deutlich einfacher. Dazu kann das
`partition_dataset.py` mit dem Startparametern `-x -i <OrdnerPfadZuBilder> -r 0.1`
Nach dem Ausführen dieses Skripts wurde dann ein Test sowie Train Ordner erstellt.

Bevor jetzt weiter gemacht werden kann, muss zuerst die Label Datei erstellt werden. In der label.pbtxt File werden alle
Labeld definiert die das Netz später erkennen soll. Ein Eintrag könnte so aussehen:

```js
item {
  id: 1
  name: 'zwanzig'
}
```

Dananach können dann die Tensorflow Record Datein erstellt werden, dazu wird das Skript
`generate_tfrecord.py` genutzt. Dies muss mit dem Startparameter `-x <OrdnerPfadZuBilder> -l <PfadZuLabels> -o < PfadFürDieErstellteFile>\(test/train).record` ausgeführt werden.
Dieses Sktipt muss dann einmal für den Test sowie den Train Ordner ausgeführt werden.

Nachdem nun die Tensorflow Record Dateien erstellt wurden kann im Tensorflow Modell Zoo ein Modell heruntergeladen
werden.
[TensorFlow 2 Detection Model Zoo](https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/tf2_detection_zoo.md)
Sobald die Wahl des Modells getroffen wurde und ein Modell heruntergeladen wurde muss dies noch entpackt sowie in den
Projekt Ordner verschoben werden, da wir es im nachfolgendem Schritt benötigen.

Im nächstem Schritt kommen wir nun zum eigentlichen Training des Modells. Dazu erstellen wir uns einen neuen Ordner uns
kopieren die "pipeline.config" File aus dem Modell das wir uns zuvor heruntergeladen haben, und kopieren diese in den
zuvor erstellten Ordner. Bevor wir das Training starten können, müssen noch Änderungen an der config Datei vorgenommen
werden:  
fine_tune_checkpoint: `<Hier muss der Pfad zu dem heurngeladenem Modell eingetragen werden>`  
label_map_path: `<Der Pfad zu der Label Datei>`  
tf_record_input_reader { input_path: `<Pfad zur Train oder Test Tensorflow Record Datei>` } fine_tune_checkpoint_type:
detection // Hier muss classification zu detection geändert werden

Desweiteren muss je nach Leistung der GPU noch die "batch_size" angepasst werden. Die RTX 2070 schafft beim MobileNet V2
640x640 nur eine Batch Size von 4. Außerdem kann mit "num_steps" noch angegeben werden, wie viele Schritte das Netz
trainiert werden soll, je höher diese Zahl ist desto besser wird das Netz (meistens, kann bei zu vielen auch wieder
schlechter werden) es wird aber auch länger dauern bis das Netz berechnet wurde. Neben diesesn Änderungen können auch
noch andere indivuelle anpassungen an der config Datei vorgenommen werden.

Nachdem nun die config Datei fertig angepasst wurde, kann das Trainign gestartet werden, dazu kann das "
model_main_tf2.py" Sktip genutzt werden. Dies muss mit folgendendem Startparametern aufgerufen werden:
"--model_dir=`<Pfad zu meinem Modell>` --pipeline_config_path=`<Pfad zur eben erstellten config Datei>`

Je nach gewähltem Modell und der Anzahl der Batchet dauert es jetzt ggf. mehrere Stunden bis das Programm beendet wurde
und das Netz erstellt wurde. Da im Laufe des Programms Checpoints gespeichert werden, kann das Programm zu einem
späterem Zeitpunkt erneut gestartet werden, und das Programm beginnt bei der letzten Speicherung, sodass es nicht nötig
späterem Zeitpunkt erneut gestartet werden, und das Programm beginnt bei der letzten Speicherung, sodass es nicht nötig
ist wieder von vorne zu beginnen.

Desweiteren kann während des Training der Traingsvortschritt Live verfolgt werden: `tensorboard --logdir=<Pfad zum Modell>`
Im Tensorfbord befinden sich eine Vielzahl an Grafiken die den Trainigsvortschritt darlegen.

Nachdem das Model dann fertig ist, kann es exportiert werden, dazu kann das "exporter_main_v2" genutzt werden. Auch dies
wird wieder mit Startparmatern ausgeführt:

```sh
--input_type image_tensor
--pipeline_config_path <Pfad zur eben erstellten config Datei>
--trained_checkpoint_dir <Pfad zum erstelltem Modell>
--output_directory <Ort an dem das Modell gespeichert wurde>
```

Nach dem exportierem befindet sich in dem Output directory ein Modell Graph sowie ein Chechpoint, beides kann im
nächsten Schritt verwendet werden um das Modell zu evaluieren.

Nach dem Training muss jedes erstellte Netz selbstverständlich evaluiert und mit anderen Verglichen werden. Dazu testen
wir das Netz mit neuen Bildern die bisher noch nicht genutzt wurden. Für das evaulieren haben wir uns sehr viel zeit
genommen und verschiedenen Programme geschrieben die:
einzelne Bilder evaluieren, ein Video evaluieren oder einen Score berechnen. Bilder können mit dem Programm "
plot_object_detection_model" getestet werden. Im Programm gibt es Pfade zu dem Modell, Testbildern sowie zu den Labels
die ggf. angepasst werden müssen. Video können mit dem Programm "plot_object_detection_model_video" analysiert werden,
dieses programm analysiert jeden Frame des Videos, labelt diesem mit den Wahrscheinlichekiten das ein Schild erkannt
wurde und baut zum Schluss wieder ein Video zusammen. Zusätzlich dazu haben wir auchnoch ein Programm geschrieben das
eine Reihe von Testbildern analysiert und zudem einen Score berechnet wie gut das Modell funktioniert hat. Diese
Programme sind "model_comparison.py" und "model_comparison_2.py"
Der Unterschiede von den beiden ist lediglich das im einen der erstellte Graph geladen wird und im anderem der
Checkpoint.

### Technischer Ablauf

Den Oben beschriebenen Ablauf haben wir für mehrere Netzte angewendet, welche hier nocheinmal näher erläutert werden.

## Versionen

Begonnen haben wir mit einem SSD MobileNet V2 FPNLite 640x640. Die Einstellungen haben wir hier nicht wieter angepasst,
außer das wir die Steps auf 20.000 eingestellt haben, um etwas schneller bereits eine Ergebnis zu haben. Das Ergebnis
war auch bereits einigermaßen zufriedenstellend. An der Learning-Rate konnte unter anderem festgestellt werden, dass
noch weiter trainiert werden kann.

![](../assets/images/Model1_1.png)
![](../assets/images/Model1_2.png)

Das Compare Skript kahm bereits auf folgende Werte:  
12 / 25 Bilder erkannt  
7,19 Punkte  
28,3 Sekunden Laufzeit

Hier 2 Beispiel Bilder:

![](../assets/images/Model1_3.jpg)
![](../assets/images/Model1_4.jpg)

Das Zone 30 Ende Schild wurde zwar falsch erkannt aber auch nut mit einer sehr geringen Wahrscheinlichkeit. Das
Dreißiger Schild wurde ebenfalls zwar erkannt aber auch noch relativ unsicher.

Nachdem das erste SSD MobileNet V2 FPNLite 640x640 mit 20.000 Schritten schon gut funktioniert hatte uns wir am
Traingsverlauf gesehen hatten das noch potenzial besteht, haben wir das Model erneut durchlaufen lassen. Dieses mal dann
aber mit 50.000 Steps. Auch hier wieder der Traingsverlauf im Tensorbord:

![](../assets/images/Model2_1.png)
![](../assets/images/Model2_2.png)

Das Compare Skript kahm bereits auf folgende Werte:

18 / 25 Bilder  
15,74 Punkte  
17,76 Sekunden

Auch hier wieder die zwei Beispiel Bilder:

![](../assets/images/Model2_3.jpg)
![](../assets/images/Model2_4.jpg)

Wie man erkennt werden die beiden Bilder schon deutlich sicherer erkannt wie zuvor.

Als nächstes haben wir dann ein Faster R-CNN ResNet101 V1 640x640 versucht. Hier sind wir aber leider auf das problem
gestoßen das die RTX 2070 nicht genug Video-RAM besitzt und das Trainieren dadurch nicht durchgeführt werden konnte.

![](../assets/images/Model3_1.png)

Als alternative hätten wir das Netz auch auf Google Colab brechnen lassen können, wir haben uns dann aber dafür
entschieden ein Faster R-CNN ResNet50 V1 640x640 zu nutzen. Dieses funktioniert auch mit nur 8 GB Video-RAM. Dieses Netz
hat jedoch nicht wirklich funktioniert, was mitunter auch daran liegen könnte das wir einen doch sehr kleinen Datensatz
mit nur 1000 Bilder hatten. Die Lernrate klingt zwar plausibel, ist aber längst nicht so hoch wie beim SSD MobileNet.

![](../assets/images/Model4_1.png)
![](../assets/images/Model4_2.png)

Das Compare Skript kahm bereits auf folgende Werte:

1 / 25 Bilder  
0,005 Punkte  
17,04 Sekunden

Auch hierbei stellt man fest das, dass Netz nicht wirklich funktioniert. Hier haben wir versucht das Netz nocheinmal mit
anderen Einstellungen zu starten, hat jedoch nicht funktioniert. Da wir jetzt nicht alzu viel Zeit investeieren wollten
um ein nicht funnktionierendes Netz zum Laufen zu bekommen, haben wir uns dann entschieden besser unser SSD MobileNet zu
verbessern.

Da wir in unserem Datensatz einige sehr schlechte Bilder hatten auf dennen selbst ein Mensch keine Zahl auf dem Schild
erkennen konnte, haben ir uns entschieden diese aus dem Datensatz zu entfernen. Mit diesem überarbeitetem Datensatz
haben wir dann das SSD MobileNet V2 FPNLite 640x640 noch einmal trainiert. Die resultate haben sich dadurch dann noch
einmal verbessert. Der Trainingsverlauf war identisch mit dem vorherigem SSD MobileNet. Die Resultate der Testbilder
haben sich zudem noch einmal verbessert:

![](../assets/images/Model5_1.jpg)
![](../assets/images/Model5_2.jpg)

Auch das Compare Skript hat dieses Netz nocheinmal bessert bewertet:
19 / 25 Bilder  
16,4 Punkte  
17,77 Sekunden

Da wir bisher nur Modelle mit einer Auflösung von 640x640 genutzt hatten wollten wir auch nocheinmal ein Netz mit einer
geringeren Pixelanzahl testen. Dabei haben wir uns für ein SSD MobileNet v2 320x320 entschieden. Wir waren uns aber
bereits vor dem Training unsicher ob das Netz überhaupt funktionieren kann, da bei diesen wenigen Pixeln nicht viel zu
sehen ist. Dies hat sich dann auch im Trainingsverlauf dargelegt.

![](../assets/images/Model6_1.png)
![](../assets/images/Model6_2.png)

Auch das Compare Skript hat ergeben das das Netz nicht wirklich funktioniert:
0 / 25 Bilder  
0 Punkte  
16,35 Sekunden

In der App haben wir dann, dass beste SSD MobileNet V2 FPNLite 640x640 genutzt.

## Evaluierung

Testskript erläutern
