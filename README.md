# Predictive Maintenance for Water Utilities

## Deploying to App Engine

```sh
# Deploy the servr with the BigQuery integration.
bash server/deploy.sh

# Deploy the Angular web application.
bash webapp/deploy.sh
```

## Running locally

You will need to run the server and the web application on different terminals.

```sh
#===--- Terminal A ---===#

# Create and activate a virtual environment.
python3 -m virtualenv env
source env/bin/activate

# Install dependencies.
pip install -U -r requirements.txt

# Run the server locally.
python server/main.py
```

Now that the server is running, you can now run the web application.

```sh
#===--- Terminal B ---===#

# Serve the web application.
cd webapp
ng serve
```

Once everything is running, you can browse to the app at localhost.

```sh
http://localhost:5000
```