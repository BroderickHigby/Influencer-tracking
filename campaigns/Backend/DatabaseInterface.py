import PyMySQL


class DatabaseInterface:
    @staticmethod
    def write_client_to_db(client):
        db = PyMySQL.connect("localhost", "testuser", "test123", client_db_name)
        cursor = db.cursor()
        # Prepare SQL query to INSERT a record into the database.
        sql_insert = "INSERT INTO %s(CLIENT_ID, INDUSTRIES, CONTACT_EMAIL, CONTACT_PHONE) VALUES (%s, %s, %s, %s)" % (client_db_name, client.client_id, '$$'.join(client.industries), client.contact_email, client.contact_phone)
        try:
            # Execute the SQL command
            cursor.execute(sql_insert)
            # Commit your changes in the database
            db.commit()
        except:
            # Rollback in case there is any error
            db.rollback()
        # disconnect from server
        db.close()

    @staticmethod
    def write_campaign_to_db(x):