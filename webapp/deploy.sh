#!/bin/bash

( cd webapp ; ng build --prod )
gcloud app deploy webapp