Wdrożenie obejmuje proces budowy obrazów Docker, ich publikację na DockerHub, a następnie wdrożenie na Azure Container Instances za pomocą GitHub Actions i Docker Compose. Wdrażany projekt obejmuje dwie usługi - serwerową aplikację Node.js i bazę danych MongoDB, które są uruchamiane i konfigurowane zgodnie z zależnościami między nimi. Wykorzystano zmienne środowiskowe oraz sekrety repozytorium GitHub do przekazania wymaganych elementów konfiguracji. 
  
Poniżej znajduje się opis każdego z użytych plików związanych z wdrożeniem

1.  Dockerfile:
        Cele:
            - Utworzenie izolowanego środowiska dla aplikacji Node.js i MongoDB.
            - Skonfigurowanie niezbędnych zależności i skopiowanie kodu aplikacji.
        Kroki:
            - Wybór obrazu bazowego dla aplikacji Node.js i MongoDB.
            - Ustawienie katalogu roboczego i skopiowanie plików konfiguracyjnych.
            - Instalacja zależności aplikacji.
            - Skopiowanie kodu źródłowego aplikacji.
            - Ustalenie zmiennych środowiskowych, takich jak port aplikacji.

 2. GitHub Actions Workflow (main.yml):
        Cele:
            - Automatyzacja procesu budowy, testowania i wdrażania aplikacji.
        Kroki:
            Build and Push:
                - Pobranie kodu źródłowego z repozytorium.
                - Skonfigurowanie środowiska Node.js.
                - Zainstalowanie zależności.
                - Zbudowanie i opublikowanie obrazów Docker na DockerHub.
            Deploy to Azure Container Instances:
                - Uruchomienie kontenerów zdefiniowanych w pliku docker-compose.yml na Azure Container Instances.

3.  Docker Compose (docker-compose.yml):
        Cele:
            - Zdefiniowanie wielokontenerowej konfiguracji aplikacji.
            - Ustalenie zależności między usługami.
        Usługi:
            video-rental-service:
                - Obraz aplikacji Node.js.
                - Zdefiniowanie zmiennych środowiskowych, takich jak URI bazy danych MongoDB.
                - Ustalenie zależności od usługi video-rental-database.
            video-rental-database:
                - Obraz MongoDB.
                - Oczekiwanie na połączenia od usługi video-rental-service.

 4. GitHub Actions Workflow (aci_database.yml i aci_service.yml):
        Cele:
            - Automatyczne wdrożenie kontenerów na Azure Container Instances.
        Kroki:
            - Konfiguracja i wdrożenie kontenera MongoDB (aci_database.yml).
            - Konfiguracja i wdrożenie kontenera aplikacji Node.js (aci_service.yml).
