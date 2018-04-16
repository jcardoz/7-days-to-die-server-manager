module.exports = {


    friendlyName: 'Deduct from player',


    description: 'Take a certain amount of currency to a player',


    inputs: {

        playerId: {
            type: 'number',
            description: 'Id of the server',
            required: true
        },

        amountToDeduct: {
            type: 'number',
            required: true
        },

        message: {
            type: 'string',
            maxLength: 500
        },

    },


    exits: {
        success: {
            outputFriendlyName: 'Success',
        }
    },

    fn: async function (inputs, exits) {
        try {
            let playerToDeductFrom = await Player.findOne(inputs.playerId);
            let currentBalance = playerToDeductFrom.currency;
            let newBalance = currentBalance - inputs.amountToDeduct;
            await Player.update({id: playerToDeductFrom.id}, {currency: newBalance});
            await HistoricalInfo.create({
                server: playerToDeductFrom.server,
                type: 'economy',
                message: inputs.message ? inputs.message : `Deducted currency from player`,
                player: inputs.playerId,
                amount: inputs.amountToDeduct,
                economyAction: 'deduct'
            })
        } catch (error) {
            sails.log.error(`HELPER economy:deduct-from-player - ${error}`);
            return exits.error(error);
        }
    }
};

