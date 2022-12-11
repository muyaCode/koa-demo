const { MongoClient, ObjectID } = require("mongodb");
const Config = require("./config.js");

const client = new MongoClient(Config.dbUri);

class Db {
	// 单例：多次实例化不共享的问题(只实例化一次，其他实例化便共享那个实例)
	static getInstance() {
		if (!Db.instance) {
			Db.instance = new Db();
		}
		return Db.instance;
	}

	constructor() {
		/*属性 放db对象*/
		this.dbClient = '';
		/*实例化的时候就连接数据库*/
		this.connect();
	}

	// 连接数据库
	connect() {
		let _that = this;
		return new Promise((resolve, reject) => {
			if (!_that.dbClient) {
				client.connect((err, client) => {
					if (err) {
						// console.log('连接错误');
						reject(err);
					} else {
						_that.dbClient = client.db(Config.dbName);
						console.log('DB连接成功');
						// console.log('DB连接成功', _that.dbClient);
						resolve(_that.dbClient);
					}
				});
			} else {
				resolve(_that.dbClient);
			}
		});
	}

	/**
	 * 封装增删改查方法
	 */
	find(collectionName, json) {
		return new Promise((resolve, reject) => {
			this.connect().then((db) => {
				var result = db.collection(collectionName).find(json);

				result.toArray(function (err, docs) {
					if (err) {
						reject(err);
						return;
					}
					resolve(docs);
				});
			});
		});
	}
	update(collectionName, json1, json2) {
		return new Promise((resolve, reject) => {
			this.connect().then((db) => {
				//db.user.update({},{$set:{}})
				db.collection(collectionName).updateOne(
					json1,
					{
						$set: json2,
					},
					(err, result) => {
						if (err) {
							reject(err);
						} else {
							resolve(result);
						}
					}
				);
			});
		});
	}
	insert(collectionName, json) {
		return new Promise((resolve, reject) => {
			this.connect().then((db) => {
				db.collection(collectionName).insertOne(json, function (err, result) {
					if (err) {
						reject(err);
					} else {
						resolve(result);
					}
				});
			});
		});
	}

	remove(collectionName, json) {
		return new Promise((resolve, reject) => {
			this.connect().then((db) => {
				db.collection(collectionName).removeOne(json, function (err, result) {
					if (err) {
						reject(err);
					} else {
						resolve(result);
					}
				});
			});
		});
	}
	// mongodb里面查询 _id 把字符串转换成对象
	getObjectId(id) {
		return new ObjectID(id);
	}
}

module.exports = Db.getInstance();