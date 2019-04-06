#!/bin/bash

cp $GOOGLE_APPLICATION_CREDENTIALS server/credentials.json

gcloud app deploy server
