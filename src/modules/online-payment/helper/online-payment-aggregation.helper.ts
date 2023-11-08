export const getNotficationsQuery = [
    {
        $match:
        {
            notifications: {
                $exists: true,
            },
        },
    },
    {
        $unwind:
        {
            path: "$notifications",
            preserveNullAndEmptyArrays: true,
        },
    },
    {
        $group:
        {
            _id: null,
            notifications: {
                $push: "$notifications",
            },
        },
    },

    {
        $project: {
            _id: 0,
            notifications: 1
        }
    },

]
