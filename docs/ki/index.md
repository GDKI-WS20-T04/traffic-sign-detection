# Ki entwickeln

## Datensatz erstellen

## Recherche

Bevor wir begonnen haben ein Netz zu trainieren, haben wir uns zuerst umgesehen welche Netze andere Gitgub Projekte
verwendet haben. Dazu haben wir uns eine vielzahl an Projekten angesehen, haben usn aber rimär an den Folgenden
Orientiert:
[Road-Sign-Detection/Tensorflow-Street-Sign-Recognition]: https://github.com/Project-Road-Sign-Detection/Tensorflow-Street-Sign-Recognition
[Traffic-sign-detection]: https://github.com/aarcosg/traffic-sign-detection
[Real-Time-Traffic-Sign-Detection]: https://github.com/Mehran970/Real-Time-Traffic-Sign-Detection

Bei allen Projekten hatten wir festegstellt, das primär schnelle Netzte verwendet werden, damit eine Live-Detection auf
dem Handy überhaupt möglich ist. Hauptsächlich wurden dabei folgende Modelle verwedet:

Faster R-CNN

SSD_Mobilenet_COCO

Das Faster R-CNN hat den Vorteil, dass es Objekte schnel und zuverlässig erkennen kann. Das SSD_Mobilenet_COCO ermöglich
jedoch eine noch schnellere Erkennung bei geringeren Hardwareanforderungen ist dabei aber unzuverlässiger.

Da wir in erster Linie eine möglichst schnelles Netzt entwickeln wollte, haben wir uns zu beginn für das
SSD_Mobilenet_COCO entschieden.

## Training

### Ablauf

Das Training haben wir mit einer RTX 2070 umgesetzt, welche jedoch nur 8GB Video-RAM besitzt und dadurch für das
Training mitunter Stunden braucht. Das Training kann in folgenden Schritten umgesetzt werden, vorausgesetzt ist hierbei
natürlich eine Tensorflow Installation mit einer GPU Unterstützung.
[Setting up TensorFlow (GPU) on Windows 10]: https://towardsdatascience.com/setting-up-tensorflow-on-windows-gpu-492d1120414c

1. Bilder in Test / Train aufteilen

2. Tensorflow Record Dateien erstellen

3. Detection Modell von Model Zoo herunterladen

4. Training

5. Model exportieren

6. Evaluieren / Programmeinsatz

Beim Ablauf dieser Schritte haben wir uns anhand dieser Dokumentation orieniert:
[Training Custom Object Detector]: https://tensorflow-object-detection-api-tutorial.readthedocs.io/en/latest/training.html

Ebenso werden bei den meisten Schritten Python Programme zur Hilfe gezogen, diese sind in der oben angegaben
Dokumentation enthalten und wurden dann für unsere Zwecke ggf. angepasst.

Im Ersten Schritt muss unser Datensatz in eine Trainings und Test-Ordner unterteilt werden. Dies könnte
selbstverständlich auch von Hand erledigt werden ist jedoch mit einem Programm deutlich einfacher. Dazu kann das
"partition_dataset.py" mit dem Startparametern "-x -i <OrdnerPfadZuBilder> -r 0.1"
Nach dem Ausführen dieses Skripts wurde dann ein Test sowie Train Ordner erstellt.

Bevor jetzt weiter gemacht werden kann, muss zuerst die Label Datei erstellt werden. In der label.pbtxt File werden alle
Labeld definiert die das Netz später erkennen soll. Ein Eintrag könnte so aussehen:
item { id: 1 name: 'zwanzig' } Dananach können dann die Tensorflow Record Datein erstellt werden, dazu wird das Skript
"generate_tfrecord.py" genutzt. Dies muss mit dem Startparameter "-x <OrdnerPfadZuBilder> -l <PfadZuLabels> -o <
PfadFürDieErstellteFile>\(test/train).record"
Dieses Sktipt muss dann einmal für den Test sowie den Train Ordner ausgeführt werden.

Nachdem nun die Tensorflow Record Dateien erstellt wurden kann im Tensorflow Modell Zoo ein Modell heruntergeladen
werden.
[TensorFlow 2 Detection Model Zoo]: https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/tf2_detection_zoo.md
Sobald die Wahl des Modells getroffen wurde und ein Modell heruntergeladen wurde muss dies noch entpackt sowie in den
Projekt Ordner verschoben werden, da wir es im nachfolgendem Schritt benötigen.

Im nächstem Schritt kommen wir nun zum eigentlichen Training des Modells. Dazu erstellen wir uns einen neuen Ordner uns
kopieren die "pipeline.config" File aus dem Modell das wir uns zuvor heruntergeladen haben, und kopieren diese in den
zuvor erstellten Ordner. Bevor wir das Training starten können, müssen noch Änderungen an der config Datei vorgenommen
werden:
fine_tune_checkpoint: <Hier muss der Pfad zu dem heurngeladenem Modell eingetragen werden>
label_map_path: <Der Pfad zu der Label Datei>
tf_record_input_reader { input_path: <Pfad zur Train oder Test Tensorflow Record Datei> } fine_tune_checkpoint_type:
detection // Hier muss classification zu detection geändert werden

Desweiteren muss je nach Leistung der GPU noch die "batch_size" angepasst werden. Die RTX 2070 schafft beim MobileNet V2
640x640 nur eine Batch Size von 4. Außerdem kann mit "num_steps" noch angegeben werden, wie viele Schritte das Netz
trainiert werden soll, je höher diese Zahl ist desto besser wird das Netz (meistens, kann bei zu vielen auch wieder
schlechter werden) es wird aber auch länger dauern bis das Netz berechnet wurde. Neben diesesn Änderungen können auch
noch andere indivuelle anpassungen an der config Datei vorgenommen werden.

Nachdem nun die config Datei fertig angepasst wurde, kann das Trainign gestartet werden, dazu kann das "
model_main_tf2.py" Sktip genutzt werden. Dies muss mit folgendendem Startparametern aufgerufen werden:
"--model_dir=<Pfad zu meinem Modell> --pipeline_config_path=<Pfad zur eben erstellten config Datei>

Je nach gewähltem Modell und der Anzahl der Batchet dauert es jetzt ggf. mehrere Stunden bis das Programm beendet wurde
und das Netz erstellt wurde. Da im Laufe des Programms Checpoints gespeichert werden, kann das Programm zu einem
späterem Zeitpunkt erneut gestartet werden, und das Programm beginnt bei der letzten Speicherung, sodass es nicht nötig
späterem Zeitpunkt erneut gestartet werden, und das Programm beginnt bei der letzten Speicherung, sodass es nicht nötig
ist wieder von vorne zu beginnen.

Desweiteren kann während des Training der Traingsvortschritt Live verfolgt werden: "tensorboard
--logdir=<Pfad zum Modell>"
Im Tensorfbord befinden sich eine Vielzahl an Grafiken die den Trainigsvortschritt darlegen.

Nachdem das Model dann fertig ist, kann es exportiert werden, dazu kann das "exporter_main_v2" genutzt werden. Auch dies
wird wieder mit Startparmatern ausgeführt "--input_type image_tensor
--pipeline_config_path <Pfad zur eben erstellten config Datei> --trained_checkpoint_dir <Pfad zum erstelltem Modell>
--output_directory <Ort an dem das Modell gespeichert wurde>"
Nach dem exportierem befindet sich in dem Output directory ein Modell Graph sowie ein Chechpoint, beides kann im
nächsten Schritt verwendet werden um das Modell zu evaluieren.

### Technischer Ablauf

## Versionen

SSD MobileNet V2 FPNLite 640x640

Standardeinstellungen

20.000 Steps

SSD MobileNet V2 FPNLite 640x640

50.000 Steps

Faster R-CNN ResNet101 V1 640x640

Faster R-CNN ResNet50 V1 640x640

SSD MobileNet V2 FPNLite 640x640

Schlechte Testbilder entfernt

SSD MobileNet v2 320x320

## Evaluierung

Testskript erläutern

