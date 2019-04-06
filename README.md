# Predictive Maintenance for Water Utilities

## Setup

First, make sure you have [installed the Google Cloud SDK](https://cloud.google.com/sdk/install).

Then, you will need to [create a new Google Cloud project](https://cloud.google.com/resource-manager/docs/creating-managing-projects).
```sh
PROJECT_ID=your-project-id
gcloud projects create $PROJECT_ID
```

Once you have a project, you will also need to [create a Cloud Storage bucket](https://cloud.google.com/storage/docs/creating-buckets).
```sh
BUCKET_NAME=your-bucket-name
gsutil mb gs://$BUCKET_NAME
```

## Generating data

Please follow the [data-generator.ipynb](https://colab.research.google.com/github/davidcavazos/predictive-maintenance/blob/master/data-generator.ipynb) interactive notebook.
This notebook will go through all the steps and explanations on how to create the datasets, upload them to BigQuery, and train the BigQuery ML model.

## Running the app

Once you have the data, you can now run the applications

To run the app, you have two options: to run it on Google Cloud, or to run it locally.

Running locally is only recommended for development and testing.
It won't be available to anyone outside your own local computer, and it won't run very fast.

It is recommended to run on Google Cloud once you are happy with your results.
It will run globally and accessible to anyone on the Internet.

### Option A: Deploying to App Engine

Deploying will take a couple minutes, but after that the application will autoscale to match the current load of the application.

```sh
# Deploy the servr with the BigQuery integration.
bash server/deploy.sh

# Deploy the Angular web application.
bash webapp/deploy.sh
```

### Option B: Running locally

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

Now that the server is running, you can now run the web application on another terminal.

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