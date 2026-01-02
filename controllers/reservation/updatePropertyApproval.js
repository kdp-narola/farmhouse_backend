const createHttpError = require("http-errors");
const Property = require("../../models/Property");
const { PROPERTY_STATUS } = require("../../constants/common.constant");

async function updatePropertyApproval(payload, propertyId) {
    console.log('propertyId', propertyId)
    const { status } = payload;
    if (!propertyId) throw new createHttpError.BadRequest("Property ID is required");    
    if (!status || !Object.values(PROPERTY_STATUS).includes(status.toUpperCase())) throw new createHttpError.BadRequest("Invalid property status");
    const property = await Property.findById({_id: propertyId});
    if (!property) throw new createHttpError.NotFound("Property not found");
    property.status = status.toUpperCase();
    await property.save();
    return {
        message: `property status updated to ${property.status}`,
        property
    };
}

module.exports = updatePropertyApproval;
