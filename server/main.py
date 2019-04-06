import flask
import json
from flask_cors import CORS
from google.cloud import bigquery

app = flask.Flask(__name__)
CORS(app)

bigquery_client = bigquery.Client()


@app.route('/')
def app_root():
  return ':)'


@app.route('/list-pipes')
def app_pipes_list():
  query_job = bigquery_client.query("""
    SELECT
      pipe_id AS id,
      material,
      diameter_in_inches AS diameter,
      length_in_miles AS length,
      installation_date AS installationDate,
      last_repair_date AS lastRepairDate,
      last_repair_date + predicted_lifespan*60*60*24*365 AS predictedBreakDate,
      repair_cost AS repairCost
    FROM
      ML.PREDICT(
        MODEL `water_utilities.pipe_lifespan`,
        (SELECT * FROM `water_utilities.pipes`)
      )
  """)
  rows = [
      {name: value for name, value in row.items()}
      for row in query_job.result()
  ]
  print(f"{len(rows)} rows")
  return json.dumps(rows, separators=(',', ':'))


if __name__ == '__main__':
    app.run(host='127.0.0.1', debug=True)
