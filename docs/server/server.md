# Server

Der Server stellt eine Route bereit, welche POST-Requests annimmt.  
Diese Route ist unter der url "/image" zu erreichen und erwartet im `body` der Anfrage ein in base64 encodiertes Bild.

!!swagger openapi.yaml!!

# Server starten

Der Server kann mit dem Befehl `python api.py` gestartet werden. Dazu wird auch hier wieder eine lauffähige TensorFlow
Installation benötigt.
([Setting up TensorFlow (GPU) on Windows 10](https://towardsdatascience.com/setting-up-tensorflow-on-windows-gpu-492d1120414c))

Zusätzlich werden noch folgende Packages benötigt:

- [flask](https://pypi.org/project/Flask/)
- [pillow](https://pypi.org/project/Pillow/)
- [numpy](https://pypi.org/project/numpy/)
