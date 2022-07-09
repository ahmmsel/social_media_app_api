function normalizeDate() {
  return {
    createdAt: (parent) => new Date(parent.createdAt).toISOString(),
    updatedAt: (parent) => new Date(parent.updatedAt).toISOString(),
  };
}

module.exports = normalizeDate;
