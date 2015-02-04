Piece = function (obj) {
  this.name = obj && obj.name;
  this.composer = obj && obj.composer;
};

Piece.prototype = {
  constructor: Piece,

  toString: function () {
    return this.name + ', ' + this.composer;
  },

  clone: function () {
    return new Piece({name: this.name, composer: this.composer});
  },

  equals: function (other) {
    if (!(other instanceof Piece))
      return false;

     return this.name == other.name && this.composer == other.composer;
  },

  typeName: function () {
    return "Piece";
  },

  toJSONValue: function () {
    return {
      name: this.name,
      composer: this.composer
    };
  }
};

// EJSON.addType("Piece", function fromJSONValue(value) {
//   return new Piece(value);
// });

PieceHolders = new Mongo.Collection('PieceHolders', {
  transform: function (doc) {
    if (doc.piece) doc.piece = new Piece(doc.piece);
    return doc;
  }
});

if (Meteor.isServer) {
  PieceHolders.find().forEach(function (doc) {
    PieceHolders.remove({_id: doc._id});
  });

  PieceHolders.insert({
    piece: new Piece({name: 'Sample 1', composer: {'asdf': 'zxcv'}})
  });
  PieceHolders.insert({
    piece: new Piece({name: 'name1', composer: 'Tom'})
  });
  PieceHolders.insert({
    piece: new Piece({name: 'name2', composer: 'Tom'})
  });

  console.log(
    PieceHolders.find({'piece.composer': 'Tom'}).fetch()
  );
  console.log(
    PieceHolders.findOne().piece instanceof Piece
  );

  Meteor.publish('PieceHolders', function () {
    return PieceHolders.find();
  });
}

if (Meteor.isClient) {
  Meteor.subscribe('PieceHolders');
}
