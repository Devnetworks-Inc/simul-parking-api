class BaseAPIService {
  constructor(model) {
    this._modelName = model.modelName;
    this.model = model;
  }

  async getCount(filter = {}) {
    return this.model.countDocuments(filter);
  }

  async findAndCountAll(filter = {}, options = {}) {
    const [rows, count] = await Promise.all([
      this.model.find(filter, null, options).lean(),
      this.model.countDocuments(filter)
    ]);
    return { rows, count };
  }

  async getAll(filter = {}, options = {}) {
    return this.model.find(filter, null, options).lean();
  }

  async getOne(filter = {}, options = {}) {
    return this.model.findOne(filter, null, options).lean();
  }

  async getById(id, options = {}) {
    return this.model.findById(id, null, options).lean();
  }

  async create(data) {
    const doc = await this.model.create(data);
    return this._clean(doc);
  }

  async createMany(dataArray) {
    const docs = await this.model.insertMany(dataArray);
    return docs.map(this._clean);
  }

  async update(id, data) {
    const updated = await this.model.findByIdAndUpdate(id, data, {
      new: true
    });
    return updated ? this._clean(updated) : null;
  }

  async delete(id) {
    const result = await this.model.findByIdAndUpdate(
      id,
      { isArchived: true },
      { new: true }
    );
    return !!result;
  }

  _clean(doc) {
    if (!doc) return null;
    if (typeof doc.toJSON === 'function') {
      return doc.toJSON();
    }
    const obj = doc.toObject?.() || doc;
    delete obj.password;
    delete obj.__v;
    return obj;
  }
}

module.exports = BaseAPIService;
