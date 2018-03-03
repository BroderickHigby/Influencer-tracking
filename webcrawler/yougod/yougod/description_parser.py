import boto3

class DescriptionParser:
    def __init__(self, description):
        self.description = description
    def comprehend_entities(self):
        comprehend = boto3.client(service_name='comprehend', region_name='us-west-2')
        if len(self.description) > 0:
            print('Calling DetectEntities')
            entity_json = comprehend.detect_entities(Text=self.description, LanguageCode='en')
            return entity_json
        else:
            return {}

    def parse_entities_for_sm(self, entity_json):
        current_sm = ''
        sms = {}
        for entity in entity_json['Entities']:
            if current_sm != '' and entity['Text'].lower() != 'instagram' and entity['Text'].lower() != 'ig' and entity['Text'].lower() != 'facebook' and entity['Text'].lower() != 'fb' and entity['Text'].lower() != 'snapchat' and entity['Text'].lower() != 'sc' and entity['Text'].lower() != 'email' and entity['Text'].lower() != 'twitter':
                sms[current_sm] = entity['Text']
                ee = current_sm.split(" ")
                if len(ee) > 1:
                    ee.pop(0)
                    current_sm = ''
                    iii = 0
                    for e in ee:
                        if iii == 0:
                            current_sm == e
                        else:
                            current_sm += (' ' + e)
                        iii += 1
                else:
                    current_sm = ''

            else:
                if entity['Text'].lower() == 'instagram' or entity['Text'].lower() == 'ig':
                    if current_sm == '':
                        current_sm = 'ig'
                    else:
                        current_sm += ' ig'
                elif entity['Text'].lower() == 'facebook' or entity['Text'].lower() == 'fb':
                    if current_sm == '':
                        current_sm = 'fb'
                    else:
                        current_sm += ' fb'
                elif entity['Text'].lower() == 'snapchat' or entity['Text'].lower() == 'sc':
                    if current_sm == '':
                        current_sm = 'sc'
                    else:
                        current_sm += ' sc'
                elif entity['Text'].lower() == 'twitter':
                    if current_sm == '':
                        current_sm = 'twitter'
                    else:
                        current_sm += ' twitter'
                elif entity['Type'] == 'OTHER' and '@' in entity['Text']:
                    sms['email'] = entity['Text']
                elif entity['Type'] == 'OTHER' and 'facebook.com' in entity['Text']:
                    sms['fb'] = entity['Text']
                elif entity['Type'] == 'OTHER' and 'instagram.com' in entity['Text']:
                    sms['ig'] = entity['Text']
                elif entity['Type'] == 'OTHER' and 'twitter.com' in entity['Text']:
                    sms['twitter'] = entity['Text']
        return sms
