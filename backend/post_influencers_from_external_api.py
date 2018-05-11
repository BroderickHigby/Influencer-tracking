from flask import Flask
from flask import request
import json
import influencer

app = Flask(__name__)

@app.route('/post_influencer', methods = ['POST'])
def post_influencer():
    #print("FUCK U")
    #print(request)
    #print(request.data)
    #print(request.get_json())
    json_input = json.loads(request.data)
    print(json_input)
    influencer.Influencer.create(json_input['item'], json_input['screen_name'])
    return 1

app.run(host='0.0.0.0', port= 5441)

