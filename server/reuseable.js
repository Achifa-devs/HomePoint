NeonDB.then((pool) => {

})
.catch((err) => {
    console.log('Error from seller registration function: ', err)
    return({error: err.message, bool: false, data: null})
})