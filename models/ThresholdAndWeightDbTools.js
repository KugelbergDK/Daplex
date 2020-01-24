
/*
 *  Database functions for setting Weight for amount of State cases pr. square meter
 *  for each State category.
 *
 *  - Team Cyclone
 */

const headerName = "ThresholdAndWeightDbTools.js: ";



createThresholdsAndWeights = async function(superCategoryId, propertyId, categoryId, thresholdYellow, thresholdRed, weight, sequelize, Sequelize){

    let debugMessage = headerName + "createThresholdAndWeight: ";

    console.log(debugMessage + "Starting... \n" +
        "SuperCategoryId     = " + superCategoryId + "\n" +
        "CategoryId = " + categoryId + "\n" +
        "propertyId = " + propertyId + "\n" +
        "ThresholdYellow     = " + thresholdYellow + "\n" +
        "ThresholdRed     = " + thresholdRed + "\n" +
        "weight     = " + weight);


    try{
        console.log(debugMessage + "Getting ThresholdAndWeightDbTools.")
        let weightTable = getThresholdsAndWeightsTable(sequelize, Sequelize);

        let result = await weightTable.create({
            super_category_id: superCategoryId,
            property_type_id: propertyId,
            category_id: categoryId,
            threshold_yellow: thresholdYellow,
            threshold_red: thresholdRed,
            weight: weight
        });

        console.log(debugMessage + "ID inserted = " + result.dataValues.id);

    } catch(e){
        console.log(debugMessage + "\n"  + e);
    }

}

/**
 * READ method State Weight
 */
readThresholdsAndWeights = async function(superCategoryId, property_type_id, categoryId, sequelize, Sequelize){

    let debugMessage = headerName + 'readStateWeightTable: ';

    console.log(debugMessage + 'Read initialized...');

    try {
        let thresholdsAndWeights = getThresholdsAndWeightsTable(sequelize, Sequelize);
        let result = await thresholdsAndWeights.findAll((property_type_id ? {where: {
            super_category_id: superCategoryId,
            property_type_id: property_type_id,
            category_id: categoryId}} : {}));

        let answer = result.length === 0 ? result : 'nothing was found with the specified id';

        result.forEach(element => {
            console.log(debugMessage + " Weight " + element.weight +
                " property type id: " +  element.property_type_id + " State category id = " + element.state_category_id);
        });

        return result.length === 0 ? console.log("nothing in db")
            : result;
    } catch(e){
        throw e;
    }

}



//Not sure if works
updateThresholdsAndWeights = async function(superCategoryId, propertyId, categoryId, thresholdYellow, thresholdRed, weight, sequelize, Sequelize){

    let debugMessage = headerName + 'updateThresholdandWeightTable: ';

    console.log(debugMessage + 'Update initialized...');

    try {
        console.log(debugMessage + 'Getting Table...');
        let thresholdsAndWeights = getThresholdsAndWeightsTable(sequelize, Sequelize);

        console.log(debugMessage + 'Updating Table...');
        let result = await thresholdsAndWeights.update({
            super_category_id: superCategoryId,
            property_type_id: propertyId,
            category_id: categoryId,
            threshold_yellow: thresholdYellow,
            threshold_red: thresholdRed,
            weight: weight
        }, {returning: true, where: {super_category_id: superCategoryId, property_type_id: propertyId, category_id: categoryId}});
        console.log(debugMessage + "Result = " + result);

        return result[0]; // Return an array containing all inserted IDs


    } catch (e) {
        console.log(debugMessage + "database error occurred.");
        throw e;
    }

}

deleteThresholdsAndWeights = async function(superCategoryId, propertyId, category_id, sequelize, Sequelize){

    let debugMessage = headerName + 'deleteStateWeightTable: ';


    try {
        let ThresholdsAndWeights = getThresholdsAndWeightsTable(sequelize, Sequelize);

        console.log(debugMessage + 'deleting id from Table...');
        let result = weightTable.destroy({ //removed await
            where: {super_category_id: superCategoryId, property_type_id: propertyId, category_id: category_id}
        }, {returning: true, where: {property_type_id: propertyid}});

        console.log(debugMessage + "Deleted ID = " + result.propertyid);

        return result; // Return an array containing all inserted IDs


    } catch (e) {
        console.log(debugMessage + "database error occurred.");
        throw e;
    }

}



/**
 * Method returning the Weight limits table (layout).
 * @param sequelize: from DB tools
 * @param Sequelize: from DB tools
 * @returns table setup for Weight in daplex db
 */
getThresholdsAndWeightsTable = (sequelize, Sequelize) => {
    return sequelize.define('state_weight', {
        super_category: {
            type: Sequelize.INTEGER,
            allowNull: false
        } ,
        property_type_id: {
            type: Sequelize.INTEGER,
            refrences: {model: 'property_types', key: 'type_id'}
            // refrencesKey: 'property_type_id'
        },
        category: {
            type: Sequelize.INTEGER,
        },
        threshold_yellow: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        threshold_red: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        weight: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });
}


exports.getThresholdsAndWeightsTable = getThresholdsAndWeightsTable;
exports.createThresholdsAndWeights = createThresholdsAndWeights;
exports.readThresholdsAndWeights = readThresholdsAndWeights;
exports.updateThresholdsAndWeights = updateThresholdsAndWeights;
exports.deleteThresholdsAndWeights = deleteThresholdsAndWeights;


