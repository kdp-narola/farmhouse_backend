function cretaSlug(label) {
    return label.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
}

module.exports = cretaSlug;