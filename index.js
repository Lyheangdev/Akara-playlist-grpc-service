require("dotenv").config();
const grpc = require("@grpc/grpc-js");
const grpcLoader = require("@grpc/proto-loader");
const path = require("path");
const { databaseConnector } = require("./conf/db.conf");
const {
  CreatePlaylistService,
  UpdatePlaylistService,
  DeletePlaylistService,
  RetrievePlaylistService,
  RetrievePlaylistByUserService,
} = require("./service/playlist.service");
const {
  AddPodcastToPlaylistService,
  RemovePodcastFromPlaylistService,
  RetrievePodcastsFromPlaylistsService,
  RemovePodcastFromPlayListByPlaylistService,
} = require("./service/playlist.podcast.service");

const protoPath = path.join(__dirname, "./playlist.proto");

//=== Load credentials
const HOST = process.env.HOST;
const PORT = process.env.PORT;

databaseConnector();

//=== define protoLoader object
const loaderOption = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

//=== Create playlist package definition
const PlaylistPackageDefinition = grpcLoader.loadSync(protoPath, loaderOption);

//=== Create grpc Object
const definition = grpc.loadPackageDefinition(PlaylistPackageDefinition);

//=== Create grpc listen SERVER
const grpcServer = new grpc.Server();

//=== Playlist Service
grpcServer.addService(definition.PlaylistService.service, {
  CreatePlaylist: CreatePlaylistService,
  UpdatePlaylist: UpdatePlaylistService,
  DeletePlaylist: DeletePlaylistService,
  RetrievePlaylist: RetrievePlaylistService,
  RetrievePlaylistByUser: RetrievePlaylistByUserService,
});

//=== Playlist Podcast Service
grpcServer.addService(definition.PlaylistPodcastService.service, {
  RemovePodcastFromPlayListByPlaylist:
    RemovePodcastFromPlayListByPlaylistService,
  AddPodcastToPlaylist: AddPodcastToPlaylistService,
  RemovePodcastFromPlaylist: RemovePodcastFromPlaylistService,
  RetrievePodcastsFromPlaylist: RetrievePodcastsFromPlaylistsService,
});

//=== Binding Port for grpc server
function callback(Error, __) {
  Error && console.log(Error.message);
  console.log(`GRPC server is being start at : 0.0.0.0:${PORT}`);
}

grpcServer.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  callback
);
