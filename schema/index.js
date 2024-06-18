const schema = require("mongoose");
const uuid = require("node-uuid");

//=====================
//--- PLAYLIST SCHEMA
//--
const playlistSchema = new schema.Schema(
  {
    _id: {
      type: String,
      default: function getUUID() {
        return uuid.v1();
      },
    },
    playlistName: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    versionKey: false,
  }
);

//--- Override the value of updatedAt
playlistSchema.pre("updateOne", function (next) {
  this._update.updatedAt = Date.now();
  next();
});

//============================
//--- PLAYLIST-PODCAST SCHEMA
//--
const PlaylistPodcastSchema = new schema.Schema(
  {
    _id: {
      type: String,
      default: function getUUID() {
        return uuid.v1();
      },
    },
    userId: {
      type: String,
      required: true,
    },
    playlistId: {
      type: String,
      required: true,
    },
    podcastId: {
      type: String,
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    versionKey: false,
  }
);

//--  Override the value of updatedAt
PlaylistPodcastSchema.pre("updateOne", function (next) {
  this.updatedAt = Date.now();
  next();
});

//==== Models
const PlaylistModel = schema.model("PlaylistModel", playlistSchema);
const PlaylistPodcastModel = schema.model(
  "PlaylistPodcastModel",
  PlaylistPodcastSchema
);

//===  Export
module.exports = {
  PlaylistModel,
  PlaylistPodcastModel,
};
