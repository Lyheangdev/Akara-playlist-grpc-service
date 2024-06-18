const { PlaylistModel } = require("../schema");

module.exports = {
  CreatePlaylistService: async function (Request, Response) {
    const requestPayload = Request.request;
    if (!Boolean(requestPayload?.playlist_name && requestPayload?.user_id)) {
      Response(null, {
        error: true,
        status: 4,
        message: "Missed required field.",
      });
      return;
    }

    const playlistExist = await PlaylistModel.findOne({
      playlistName: requestPayload?.playlist_name,
    });

    if (Boolean(playlistExist)) {
      Response(null, {
        error: false,
        status: 0,
        message: `${requestPayload?.playlist_name} is already existed.`,
      });

      return;
    }

    //--- if no playlist
    const newPlaylist = await PlaylistModel.create({
      userId: requestPayload?.user_id,
      playlistName: requestPayload?.playlist_name,
    });

    const { _id, userId, playlistName, createdAt, updatedAt } = newPlaylist;

    Response(null, {
      error: false,
      status: 1,
      message: `created successfully.`,
      data: {
        playlist_id: _id,
        user_id: userId,
        playlist_name: playlistName,
        created_at: createdAt.toISOString(),
        updated_at: updatedAt.toISOString(),
      },
    });

    return;
  },
  UpdatePlaylistService: async function (Request, Response) {
    const requestPayload = Request.request;

    if (
      !Boolean(requestPayload?.playlist_id && requestPayload?.playlist_name)
    ) {
      Response(null, {
        error: true,
        status: 4,
        message: "Missed required fields.",
      });
      return;
    }

    const findPlaylist = await PlaylistModel.findOne({
      _id: requestPayload?.playlist_id,
    });

    if (!Boolean(findPlaylist)) {
      Response(null, {
        error: false,
        status: 2,
        message: "Not found this playlist.",
      });
      return;
    }

    await PlaylistModel.updateOne(
      { _id: { $eq: requestPayload?.playlist_id } },
      { $set: { playlistName: requestPayload?.playlist_name } }
    );

    Response(null, {
      error: false,
      status: 1,
      message: `${requestPayload?.playlist_name} is updated successfully.`,
    });

    return;
  },
  DeletePlaylistService: async function (Request, Response) {
    const requestPayload = Request.request;

    if (!Boolean(requestPayload?.playlist_id)) {
      Response(null, {
        error: true,
        status: 4,
        message: "Missed required field.",
      });
      return;
    }

    const findPlaylist = await PlaylistModel.findOne({
      _id: { $eq: requestPayload?.playlist_id },
    });

    if (!Boolean(findPlaylist)) {
      Response(null, {
        error: false,
        status: 2,
        message: "Not found this playlist.",
      });
      return;
    }

    await PlaylistModel.deleteOne({
      _id: { $eq: requestPayload?.playlist_id },
    });

    Response(null, {
      error: false,
      status: 1,
      message: `Playlist is deleted successfully.`,
    });
  },
  RetrievePlaylistService: async function (__, Response) {
    const data = (await PlaylistModel.find({})).map((x) => ({
      playlist_id: x._id,
      playlist_name: x.playlistName,
      user_id: x.userId,
      updated_at: x.updatedAt.toISOString(),
      created_at: x.createdAt.toISOString(),
    }));

    return Response(null, {
      error: false,
      status: 1,
      message: "Request Accept",
      data,
    });
  },
  RetrievePlaylistByUserService: async function (Request, Response) {
    if (!Boolean(Request?.request?.user_id)) {
      return Response(null, {
        error: true,
        status: 4,
        message: "Missed required field.",
      });
    }

    const data = (
      await PlaylistModel.find({ userId: Request?.request?.user_id })
    ).map((x) => ({
      playlist_id: x._id,
      playlist_name: x.playlistName,
      user_id: x.userId,
      updated_at: x.updatedAt.toISOString(),
      created_at: x.createdAt.toISOString(),
    }));

    return Response(null, {
      error: false,
      status: 1,
      message: "Request Accept",
      data,
    });
  },
};
