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

  async getAllWithPagination(filter, skip, limit) {
    const results = await this.model.find(filter).skip(skip).limit(limit);
    const total = await this.model.countDocuments(filter);

    return {
      data: results,
      total,
      page: Math.ceil(skip / limit) + 1,
      pageSize: limit
    };
  }

  async create(data) {
    const doc = await this.model.create(data);
    return this._clean(doc);
  }

  async update(id, data) {
    const updated = await this.model.findByIdAndUpdate(id, data, {
      new: true
    });
    return updated ? this._clean(updated) : null;
  }

  async delete(id) {
    const result = await this.model.delete(id);
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
