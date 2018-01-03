import random
import uuid
from database import es
from faker import Faker


if __name__ == '__main__':
    print("Creating sample fake documents...")
    faker = Faker()
    for i in range(100):
        id_ = uuid.uuid4().hex
        body = faker.profile()
        body.update(
            id=id_,
            socialauthority=random.randint(1, 10),
        )
        es.index(
            index='sapie',
            doc_type='influencer',
            body=body,
            id=id_,
        )
    print("Done!")
