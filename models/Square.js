var mongoose = require('mongoose');

var squareSchema = new mongoose.Schema({
    content: String
});

squareSchema.pre('save', function save(next){
    var square = this;
    next();
})
var Square = mongoose.model('Square', squareSchema);

module.exports = Square;