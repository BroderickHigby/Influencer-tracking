DynanoDB dynamo = new DynamoDB(new AmazonDynamoDBClient());
Table table = dynamo.getTable("seo");

Item item =
	new Item()
		.withPrimaryKey()
