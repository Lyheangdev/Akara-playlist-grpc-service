const { PlaylistPodcastModel } = require("../schema");

module.exports = {
  AddPodcastToPlaylistService: async function (Request, Response) {
    const { user_id, playlist_id, podcast_id } = Request?.request;

    if (!Boolean(user_id && playlist_id && podcast_id)) {
      return Response(null, {
        error: true,
        status: 4,
        message: "Missed required fields.",
      });
    }

    const podcastExistInPlaylist = await PlaylistPodcastModel.findOne({
      $and: [
        {
          userId: user_id,
        },
        {
          podcastId: podcast_id,
        },
        {
          playlistId: playlist_id,
        },
      ],
    });

    if (Boolean(podcastExistInPlaylist)) {
      return Response(null, {
        error: false,
        message: "Podcast has already in this playlist",
        status: 0,
      });
    }

    await PlaylistPodcastModel.create({
      userId: user_id,
      podcastId: podcast_id,
      playlistId: playlist_id,
    });

    return Response(null, {
      error: false,
      message: "This podcast is added this the playlist.",
      status: 1,
    });
  },
  RemovePodcastFromPlaylistService: async function (Request, Response) {
    const { user_id, playlist_id, podcast_id } = Request?.request;

    const podcastExistInPlaylist = await PlaylistPodcastModel.findOne({
      $and: [
        {
          userId: user_id,
        },
        {
          podcastId: podcast_id,
        },
        {
          playlistId: playlist_id,
        },
      ],
    });

    if (!Boolean(podcastExistInPlaylist)) {
      return Response(null, {
        error: false,
        message: "There is no podcast to be deleted.",
        status: 2,
      });
    }

    await PlaylistPodcastModel.deleteOne({
      $and: [
        {
          userId: { $eq: user_id },
        },
        {
          playlistId: { $eq: playlist_id },
        },
        {
          podcastId: { $eq: podcast_id },
        },
      ],
    });

    return Response(null, {
      error: false,
      message: "This podcast is removed",
      status: 1,
    });
  },
  RemovePodcastFromPlayListByPlaylistService: async function (
    Request,
    Response
  ) {
    const { playlist_id } = Request?.request;

    if (!Boolean(playlist_id)) {
      return Response(null, {
        error: true,
        status: 4,
        message: "Missed required fields.",
      });
    }

    const podcastExistInPlaylist = await PlaylistPodcastModel.findOne({
      playlistId: playlist_id,
    });

    if (!Boolean(podcastExistInPlaylist)) {
      return Response(null, {
        error: false,
        message: "There is no podcast to be deleted.",
        status: 2,
      });
    }

    await PlaylistPodcastModel.deleteMany({ playlistId: playlist_id });

    return Response(null, {
      error: false,
      message: "Podcasts are removed",
      status: 1,
    });
  },
  RetrievePodcastsFromPlaylistsService: async function (Request, Response) {
    const { user_id, playlist_id } = Request?.request;

    if (!Boolean(user_id && playlist_id)) {
      return Response(null, {
        error: true,
        status: 4,
        message: "Missing required fields.",
      });
    }

    const data = (
      await PlaylistPodcastModel.find({
        $and: [
          {
            userId: user_id,
          },
          {
            playlistId: playlist_id,
          },
        ],
      })
    ).map((x) => ({
      user_id: x.userId,
      playlist_id: x.playlistId,
      podcast_id: x.podcastId,
      created_at: x.createdAt.toISOString(),
      updated_at: x.updatedAt.toISOString(),
    }));

    return Response(null, {
      error: false,
      message: "Request Accept",
      status: 1,
      data,
    });
  },
};
