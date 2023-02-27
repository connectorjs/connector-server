module.exports = function (dbModel) {
	let collectionName = path.basename(__filename, '.collection.js')
	let schema = mongoose.Schema({
		clientId: { type: String, required: true, unique: true },
		clientPass: { type: String, default: '', index: true },
		lastUuid: { type: String, default: '', index: true },
		lastOnline: { type: Date, default: Date.now, index: true },
		lastIP: { type: String, default: '', index: true },
		createdDate: { type: Date, default: Date.now, index: true },
		createdIP: { type: String, default: '', index: true },
		osInfo: { type: Object, default: null }
	}, { versionKey: false })

	schema.pre('save', next => next())
	schema.pre('remove', next => next())
	schema.pre('remove', true, (next, done) => next())
	schema.on('init', model => { })
	schema.plugin(mongoosePaginate)

	let model = dbModel.conn.model(collectionName, schema, collectionName)

	model.removeOne = (member, filter) => sendToTrash(dbModel, collectionName, member, filter)
	return model
}