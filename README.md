# Predictive Maintenance for Water Utilities

## Running locally

### Running the server

It is recommended to run in a virtual environment.
```sh
python3 -m virtualenv env
source env/bin/activate
```

Install the dependencies.
```sh
pip install -U -r server/requirements.txt
```

Run a local server in `localhost:8080`.
```sh
python server/main.py
```

To deactivate the virtual environment.
```sh
deactivate
```

### Running the web application

This will have to be run in a different terminal than the server.
Make sure the server is running too, otherwise no data will be displayed.
```sh
( cd webapp ; ng serve )
```

## Running in Google Cloud

### Deploying the server

```sh
gcloud app deploy server
```

### Deploying the web application